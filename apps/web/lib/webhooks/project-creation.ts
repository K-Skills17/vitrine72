/**
 * Shared logic for creating/updating projects from webhook payloads.
 * Called by both Kiwify and Asaas webhook handlers.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { intakeLinkEmail } from "@/lib/email/templates";
import { calcPaymentCommissions, calcClawback, CORE_OFFER } from "@vitrine72/core";
import { calcGoLiveEarliest } from "@vitrine72/core";
import { randomUUID } from "crypto";

export interface ApprovedPaymentData {
  providerRef: string;
  provider: "kiwify" | "asaas" | "mercadopago";
  eventId: string;
  sku: string;
  grossAmount: number;
  method: "pix" | "card";
  clientEmail: string;
  clientName: string;
  source: string | null; // from cookie/param: "seller:x", "partner:y", etc.
  sellerId: string | null;
  partnerId: string | null;
  paymentDate: Date;
}

export async function handleApprovedPayment(
  data: ApprovedPaymentData
): Promise<void> {
  const supabase = createServiceClient();

  // Idempotency: check if already processed
  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id, project_id")
    .eq("event_id", data.eventId)
    .eq("processed", true)
    .maybeSingle();

  if (existing) return; // already processed

  // Determine commission source
  const source =
    data.sellerId && data.partnerId
      ? ("seller_partner" as const)
      : data.sellerId
      ? ("seller" as const)
      : data.partnerId
      ? ("partner" as const)
      : ("inbound" as const);

  const intakeToken = randomUUID();
  const paymentDateStr = data.paymentDate.toISOString().slice(0, 10);
  const goLiveEarliest = calcGoLiveEarliest(data.paymentDate);

  // Create project
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .insert({
      status: "paid",
      sku: data.sku,
      intake_token: intakeToken,
      seller_id: data.sellerId,
      partner_id: data.partnerId,
      source: data.source,
      payment_provider: data.provider,
      payment_provider_ref: data.providerRef,
      gross_amount: data.grossAmount,
      payment_method: data.method,
      payment_date: paymentDateStr,
      golive_earliest_at: goLiveEarliest.toISOString(),
      maintenance_active: false,
      has_partner_bonus: !!data.partnerId,
      revision_count: 0,
    })
    .select("id")
    .single();

  if (projectErr || !project) {
    throw new Error(`Failed to create project: ${projectErr?.message}`);
  }

  // Create payment record
  await supabase.from("payments").insert({
    project_id: project.id,
    provider: data.provider,
    provider_ref: data.providerRef,
    amount: data.grossAmount,
    method: data.method,
    status: "approved",
    event_type: "payment_approved",
    raw: {},
  });

  // Create commission entries
  const commissions = calcPaymentCommissions({
    projectId: project.id,
    grossAmount: data.grossAmount,
    method: data.method,
    source,
    sellerId: data.sellerId ?? undefined,
    partnerId: data.partnerId ?? undefined,
    paymentDate: data.paymentDate,
  });

  if (commissions.length > 0) {
    await supabase.from("commission_entries").insert(
      commissions.map((c) => ({
        project_id: c.projectId,
        seller_id: c.sellerId ?? null,
        partner_id: c.partnerId ?? null,
        kind: c.kind,
        gross_amount: c.grossAmount,
        commission_amount: c.commissionAmount,
        due_at: c.dueAt,
        note: c.note ?? null,
      }))
    );
  }

  // Audit log
  await supabase.from("audit_log").insert({
    project_id: project.id,
    actor: "webhook",
    action: "payment_approved",
    from_status: null,
    to_status: "paid",
    metadata: { provider: data.provider, ref: data.providerRef },
  });

  // Mark webhook event processed
  await supabase.from("webhook_events").upsert({
    provider: data.provider,
    event_id: data.eventId,
    event_type: "payment_approved",
    processed: true,
    project_id: project.id,
    raw: {},
  });

  // Send intake email
  const intakeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/intake/${intakeToken}`;
  await sendEmail({
    to: data.clientEmail,
    ...intakeLinkEmail({
      clientName: data.clientName,
      businessName: data.clientName,
      intakeUrl,
      previewBusinessDays: CORE_OFFER.previewBusinessDays,
    }),
  });

  // Transition to intake_pending
  await supabase
    .from("projects")
    .update({ status: "intake_pending" })
    .eq("id", project.id);

  await supabase.from("audit_log").insert({
    project_id: project.id,
    actor: "system",
    action: "auto_transition",
    from_status: "paid",
    to_status: "intake_pending",
    metadata: null,
  });
}

export async function handleRefund(params: {
  eventId: string;
  provider: "kiwify" | "asaas" | "mercadopago";
  providerRef: string;
  eventType: "refund" | "chargeback";
}): Promise<void> {
  const supabase = createServiceClient();

  // Idempotency
  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("event_id", params.eventId)
    .eq("processed", true)
    .maybeSingle();
  if (existing) return;

  // Find project
  const { data: project } = await supabase
    .from("projects")
    .select("id, status")
    .eq("payment_provider_ref", params.providerRef)
    .maybeSingle();

  if (!project) return;

  // Update project status
  await supabase
    .from("projects")
    .update({ status: "refunded" })
    .eq("id", project.id);

  // Clawback commissions
  const { data: originalEntries } = await supabase
    .from("commission_entries")
    .select("*")
    .eq("project_id", project.id)
    .neq("kind", "clawback");

  if (originalEntries && originalEntries.length > 0) {
    const clawbacks = calcClawback(
      originalEntries.map((e) => ({
        id: e.id,
        projectId: e.project_id,
        sellerId: e.seller_id ?? undefined,
        partnerId: e.partner_id ?? undefined,
        kind: e.kind as never,
        grossAmount: e.gross_amount,
        commissionAmount: e.commission_amount,
        dueAt: e.due_at,
      })),
      new Date()
    );

    if (clawbacks.length > 0) {
      await supabase.from("commission_entries").insert(
        clawbacks.map((c) => ({
          project_id: c.projectId,
          seller_id: c.sellerId ?? null,
          partner_id: c.partnerId ?? null,
          kind: c.kind,
          gross_amount: c.grossAmount,
          commission_amount: c.commissionAmount,
          due_at: c.dueAt,
          note: c.note ?? null,
        }))
      );
    }
  }

  await supabase.from("audit_log").insert({
    project_id: project.id,
    actor: "webhook",
    action: params.eventType,
    from_status: project.status,
    to_status: "refunded",
    metadata: { provider: params.provider },
  });

  await supabase.from("webhook_events").insert({
    provider: params.provider,
    event_id: params.eventId,
    event_type: params.eventType,
    processed: true,
    project_id: project.id,
    raw: {},
  });
}
