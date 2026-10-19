import { NextRequest, NextResponse } from "next/server";
import { handleApprovedPayment, handleRefund } from "@/lib/webhooks/project-creation";
import { createServiceClient } from "@/lib/supabase/server";
import { MAINTENANCE } from "@vitrine72/core";

export const runtime = "nodejs";

function verifyAsaasSignature(body: string, token: string, secret: string): boolean {
  // Asaas uses a static token in the Authorization header
  return token === secret;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const authToken = req.headers.get("asaas-access-token") ?? "";

  const secret = process.env.ASAAS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("ASAAS_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  if (!verifyAsaasSignature(body, authToken, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = payload["event"] as string;
  const paymentObj = payload["payment"] as Record<string, unknown> | undefined;
  const paymentId = paymentObj?.["id"] as string | undefined;

  if (!paymentId) {
    return NextResponse.json({ ok: true }); // ignore non-payment events
  }

  const supabase = createServiceClient();
  await supabase.from("webhook_events").upsert({
    provider: "asaas",
    event_id: paymentId,
    event_type: eventType,
    processed: false,
    project_id: null,
    raw: payload,
  });

  try {
    if (eventType === "PAYMENT_RECEIVED" || eventType === "PAYMENT_CONFIRMED") {
      const externalRef = paymentObj?.["externalReference"] as string | undefined;
      const description = paymentObj?.["description"] as string | undefined;

      // Detect if this is a maintenance payment
      const isMaintenance =
        description?.toLowerCase().includes("manut") ||
        externalRef?.startsWith("MANUT:");

      if (isMaintenance) {
        await handleMaintenancePayment(paymentId, externalRef, supabase);
      } else {
        const source = parseAsaasSource(externalRef);
        const { sellerId, partnerId } = resolveSourceIds(source);

        await handleApprovedPayment({
          providerRef: paymentId,
          provider: "asaas",
          eventId: paymentId,
          sku: resolveAsaasSku(description, paymentObj),
          grossAmount: parseFloat((paymentObj?.["value"] as string | number)?.toString() ?? "0"),
          method: detectAsaasMethod(paymentObj),
          clientEmail: (paymentObj?.["customer"] as Record<string, string>)?.["email"] ?? "",
          clientName: (paymentObj?.["customer"] as Record<string, string>)?.["name"] ?? "",
          source,
          sellerId,
          partnerId,
          paymentDate: new Date(),
        });
      }
    } else if (
      eventType === "PAYMENT_REFUNDED" ||
      eventType === "PAYMENT_CHARGEBACK_REQUESTED"
    ) {
      await handleRefund({
        eventId: paymentId,
        provider: "asaas",
        providerRef: paymentId,
        eventType:
          eventType === "PAYMENT_CHARGEBACK_REQUESTED"
            ? "chargeback"
            : "refund",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Asaas webhook error:", err);
    return NextResponse.json({ error: "processing_error" }, { status: 500 });
  }
}

async function handleMaintenancePayment(
  paymentId: string,
  externalRef: string | undefined,
  supabase: ReturnType<typeof createServiceClient>
) {
  // externalRef format: "MANUT:{projectId}"
  const projectId = externalRef?.split(":")?.[1];
  if (!projectId) return;

  await supabase
    .from("projects")
    .update({ maintenance_active: true })
    .eq("id", projectId);

  await supabase.from("payments").insert({
    project_id: projectId,
    provider: "asaas",
    provider_ref: paymentId,
    amount: MAINTENANCE.pricePerCycle,
    method: "pix", // maintenance typically via Pix
    status: "approved",
    event_type: "maintenance_payment",
    raw: {},
  });

  await supabase.from("audit_log").insert({
    project_id: projectId,
    actor: "webhook",
    action: "maintenance_payment_received",
    from_status: null,
    to_status: null,
    metadata: { paymentId },
  });

  await supabase.from("webhook_events").upsert({
    provider: "asaas",
    event_id: paymentId,
    event_type: "maintenance_payment",
    processed: true,
    project_id: projectId,
    raw: {},
  });
}

function parseAsaasSource(externalRef: string | undefined): string | null {
  if (!externalRef) return null;
  if (externalRef.startsWith("seller:") || externalRef.startsWith("partner:")) {
    return externalRef;
  }
  return null;
}

function resolveSourceIds(source: string | null): {
  sellerId: string | null;
  partnerId: string | null;
} {
  if (!source) return { sellerId: null, partnerId: null };
  if (source.startsWith("seller:")) return { sellerId: source.slice(7), partnerId: null };
  if (source.startsWith("partner:")) return { sellerId: null, partnerId: source.slice(8) };
  return { sellerId: null, partnerId: null };
}

function resolveAsaasSku(
  description: string | undefined,
  _payment: Record<string, unknown> | undefined
): string {
  if (!description) return "SITE_5P";
  const d = description.toUpperCase();
  if (d.includes("ANCHOR") || d.includes("COMPLETO")) return "ANCHOR_SITE_GBP_BOT";
  if (d.includes("LANDING") || d.includes("1 P")) return "LANDING_1P";
  return "SITE_5P";
}

function detectAsaasMethod(
  payment: Record<string, unknown> | undefined
): "pix" | "card" {
  const billingType = payment?.["billingType"] as string | undefined;
  return billingType === "PIX" ? "pix" : "card";
}
