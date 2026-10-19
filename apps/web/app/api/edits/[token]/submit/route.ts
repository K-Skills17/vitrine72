import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { MAINTENANCE, addBusinessDays } from "@vitrine72/core";

export const runtime = "nodejs";

const EDIT_PRICES = {
  nova_pagina: 197,
  outro: 97,
} as const;

const ASAAS_BASE = process.env.ASAAS_BASE_URL ?? "https://api.asaas.com/v3";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;
  const body = await req.json();
  const {
    description,
    editType,
  } = body as { description: string; editType: "nova_pagina" | "outro" };

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, maintenance_active")
    .eq("edit_token", token)
    .maybeSingle();

  if (!project || !project.maintenance_active) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Count free edits this cycle
  const cycleStart = new Date();
  cycleStart.setDate(cycleStart.getDate() - MAINTENANCE.cycleWeeks * 7);

  const { count: usedCount } = await supabase
    .from("edit_tickets")
    .select("id", { count: "exact" })
    .eq("project_id", project.id)
    .eq("is_free", true)
    .gte("created_at", cycleStart.toISOString());

  const isFree = (usedCount ?? 0) < MAINTENANCE.editsPerCycle;
  const price = isFree ? 0 : EDIT_PRICES[editType];

  // Calculate SLA due date: 2 business days (São Paulo timezone)
  const dueAt = addBusinessDays(new Date(), 2);

  if (isFree) {
    await supabase.from("edit_tickets").insert({
      project_id: project.id,
      description,
      is_free: true,
      price: 0,
      status: "pending",
      due_at: dueAt.toISOString().slice(0, 10),
      cycle_start: cycleStart.toISOString().slice(0, 10),
    });
    return NextResponse.json({ ok: true });
  }

  // Paid edit — create Asaas payment link
  let paymentLink: string | null = null;
  const asaasKey = process.env.ASAAS_API_KEY;

  if (asaasKey && !asaasKey.startsWith("PLACEHOLDER")) {
    try {
      const res = await fetch(`${ASAAS_BASE}/paymentLinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: asaasKey,
        },
        body: JSON.stringify({
          name: `Edição ${editType} — Vitrine72`,
          value: price,
          description: description.slice(0, 200),
          externalReference: `EDIT:${project.id}`,
        }),
      });
      const data = await res.json();
      paymentLink = data.url ?? null;
    } catch {
      // fallback: create ticket without payment link
    }
  }

  const { data: ticket } = await supabase
    .from("edit_tickets")
    .insert({
      project_id: project.id,
      description,
      is_free: false,
      price,
      payment_link: paymentLink,
      status: "pending",
      due_at: dueAt.toISOString().slice(0, 10),
      cycle_start: cycleStart.toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  return NextResponse.json({ ok: true, paymentLink, ticketId: ticket?.id });
}
