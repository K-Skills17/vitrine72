import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { handleApprovedPayment, handleRefund } from "@/lib/webhooks/project-creation";
import { createServiceClient } from "@/lib/supabase/server";

// MP sends a GET request to validate the webhook URL
export function GET() {
  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";

/**
 * Verify MP webhook signature.
 * Docs: https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks
 *
 * x-signature header format: "ts=<timestamp>,v1=<hmac>"
 * Signed string: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 */
function verifyMPSignature(
  dataId: string,
  requestId: string,
  xSignature: string,
  secret: string
): boolean {
  const parts: Record<string, string> = {};
  for (const part of xSignature.split(",")) {
    const [k, v] = part.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(template).digest("hex");
  return expected === v1;
}

/** Fetch full payment object from MP API */
async function fetchMPPayment(paymentId: string): Promise<Record<string, unknown>> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN not set");

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`MP API error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();

  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MERCADOPAGO_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  let notification: Record<string, unknown>;
  try {
    notification = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // MP notification payload: { action, api_version, data: { id }, ... }
  const action = notification["action"] as string | undefined;
  const dataObj = notification["data"] as Record<string, unknown> | undefined;
  const dataId = dataObj?.["id"] as string | undefined;

  if (!dataId) {
    return NextResponse.json({ ok: true }); // not a payment notification
  }

  const xSignature = req.headers.get("x-signature") ?? "";
  const xRequestId = req.headers.get("x-request-id") ?? "";

  if (xSignature && !verifyMPSignature(dataId, xRequestId, xSignature, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  await supabase.from("webhook_events").upsert({
    provider: "mercadopago",
    event_id: dataId,
    event_type: action ?? "unknown",
    processed: false,
    project_id: null,
    raw: notification,
  });

  if (action !== "payment.created" && action !== "payment.updated") {
    return NextResponse.json({ ok: true });
  }

  let payment: Record<string, unknown>;
  try {
    payment = await fetchMPPayment(dataId);
  } catch (err) {
    console.error("Failed to fetch MP payment:", err);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  const status = payment["status"] as string | undefined;

  try {
    if (status === "approved") {
      const externalRef = payment["external_reference"] as string | undefined;
      const description = payment["description"] as string | undefined;
      const source = parseMPSource(externalRef);
      const { sellerId, partnerId } = resolveSourceIds(source);

      const payer = payment["payer"] as Record<string, unknown> | undefined;
      const payerEmail = (payer?.["email"] as string | undefined) ?? "";
      const payerName = [
        (payer?.["first_name"] as string | undefined) ?? "",
        (payer?.["last_name"] as string | undefined) ?? "",
      ].join(" ").trim();

      await handleApprovedPayment({
        providerRef: dataId,
        provider: "mercadopago",
        eventId: dataId,
        sku: resolveMPSku(description, externalRef),
        grossAmount: parseFloat((payment["transaction_amount"] as number | undefined)?.toString() ?? "0"),
        method: detectMPMethod(payment),
        clientEmail: payerEmail,
        clientName: payerName || payerEmail,
        source,
        sellerId,
        partnerId,
        paymentDate: new Date((payment["date_approved"] as string | undefined) ?? Date.now()),
      });
    } else if (status === "refunded" || status === "charged_back") {
      await handleRefund({
        eventId: dataId,
        provider: "mercadopago",
        providerRef: dataId,
        eventType: status === "charged_back" ? "chargeback" : "refund",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MercadoPago webhook error:", err);
    return NextResponse.json({ error: "processing_error" }, { status: 500 });
  }
}

function parseMPSource(externalRef: string | undefined): string | null {
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

function resolveMPSku(
  description: string | undefined,
  externalRef: string | undefined
): string {
  const text = (description ?? externalRef ?? "").toUpperCase();
  if (text.includes("ANCHOR") || text.includes("COMPLETO")) return "ANCHOR_SITE_GBP_BOT";
  if (text.includes("LANDING") || text.includes("1P")) return "LANDING_1P";
  return "SITE_5P";
}

function detectMPMethod(payment: Record<string, unknown>): "pix" | "card" {
  const paymentTypeId = payment["payment_type_id"] as string | undefined;
  return paymentTypeId === "bank_transfer" ? "pix" : "card";
}
