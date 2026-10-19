import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { handleApprovedPayment, handleRefund } from "@/lib/webhooks/project-creation";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function verifyKiwifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha1", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get("x-kiwify-event") ?? "";

  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("KIWIFY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "misconfigured" }, { status: 500 });
  }

  if (!verifyKiwifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = payload["order_status"] as string;
  const orderId = payload["order_id"] as string;

  // Store raw event for auditability
  const supabase = createServiceClient();
  await supabase.from("webhook_events").upsert({
    provider: "kiwify",
    event_id: orderId,
    event_type: eventType,
    processed: false,
    project_id: null,
    raw: payload,
  });

  try {
    if (eventType === "paid") {
      const customer = payload["Customer"] as Record<string, string> | undefined;
      const order = payload["Order"] as Record<string, unknown> | undefined;

      // Parse source from tracking pixels or custom params
      const source = extractKiwifySource(payload);
      const { sellerId, partnerId } = resolveSourceIds(source);

      await handleApprovedPayment({
        providerRef: orderId,
        provider: "kiwify",
        eventId: orderId,
        sku: resolveKiwifySku(payload),
        grossAmount: parseFloat((order?.["product_price"] as string) ?? "0"),
        method: detectKiwifyMethod(payload),
        clientEmail: customer?.["email"] ?? "",
        clientName: customer?.["full_name"] ?? customer?.["email"] ?? "",
        source,
        sellerId,
        partnerId,
        paymentDate: new Date(),
      });
    } else if (eventType === "refunded" || eventType === "chargedback") {
      await handleRefund({
        eventId: orderId,
        provider: "kiwify",
        providerRef: orderId,
        eventType: eventType === "chargedback" ? "chargeback" : "refund",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Kiwify webhook error:", err);
    return NextResponse.json({ error: "processing_error" }, { status: 500 });
  }
}

function extractKiwifySource(payload: Record<string, unknown>): string | null {
  // Kiwify passes tracking params from the affiliate URL in the payload
  const affiliate = (payload["Commissions"] as Record<string, unknown>)?.[
    "affiliate_id"
  ] as string | undefined;
  if (affiliate) return `partner:${affiliate}`;
  return null;
}

function resolveSourceIds(source: string | null): {
  sellerId: string | null;
  partnerId: string | null;
} {
  if (!source) return { sellerId: null, partnerId: null };
  if (source.startsWith("seller:")) {
    return { sellerId: source.slice(7), partnerId: null };
  }
  if (source.startsWith("partner:")) {
    return { sellerId: null, partnerId: source.slice(8) };
  }
  return { sellerId: null, partnerId: null };
}

function resolveKiwifySku(payload: Record<string, unknown>): string {
  const productId = (payload["Product"] as Record<string, string> | undefined)
    ?.["id"];
  const paymentConfig = require("../../../../../../config/payment.json") as {
    kiwify: { products: Record<string, string> };
  };
  const products = paymentConfig.kiwify.products;
  const entry = Object.entries(products).find(([, v]) => v === productId);
  return entry?.[0] ?? "SITE_5P";
}

function detectKiwifyMethod(
  payload: Record<string, unknown>
): "pix" | "card" {
  const paymentMethod = (
    payload["Order"] as Record<string, unknown> | undefined
  )?.["payment_method"] as string | undefined;
  return paymentMethod?.toLowerCase().includes("pix") ? "pix" : "card";
}
