import { NextRequest, NextResponse } from "next/server";
import { getPrice } from "@vitrine72/core";
import type { Sku } from "@vitrine72/core";

export const runtime = "nodejs";

const SKU_LABELS: Partial<Record<Sku, string>> = {
  SITE_5P: "Site até 5 páginas — Vitrine72",
  ANCHOR_SITE_GBP_BOT: "Site + Google Meu Negócio + Agente IA — Vitrine72",
  LANDING_1P: "Landing page 1 página — Vitrine72",
  MANUT: "Manutenção + hospedagem — Vitrine72",
};

const VALID_SKUS: Sku[] = ["SITE_5P", "ANCHOR_SITE_GBP_BOT", "LANDING_1P", "MANUT"];

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    console.error("MERCADOPAGO_ACCESS_TOKEN not set");
    return NextResponse.redirect(new URL("/#preco", req.url));
  }

  const { searchParams } = new URL(req.url);
  const rawSku = searchParams.get("sku") ?? "SITE_5P";
  const sku = VALID_SKUS.includes(rawSku as Sku) ? (rawSku as Sku) : "SITE_5P";

  // Read attribution from cookie (set by partner/seller pages)
  const source = req.cookies.get("v72_source")?.value ?? null;

  const price = getPrice(sku, "pix"); // pix price is the base; card payers pay installment interest
  if (!price) {
    return NextResponse.redirect(new URL("/#preco", req.url));
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrine72.com.br";

  const body = {
    items: [
      {
        id: sku,
        title: SKU_LABELS[sku] ?? `Vitrine72 — ${sku}`,
        quantity: 1,
        currency_id: "BRL",
        unit_price: price,
      },
    ],
    external_reference: source ?? "inbound",
    back_urls: {
      success: `${siteUrl}/obrigado`,
      failure: `${siteUrl}`,
      pending: `${siteUrl}/obrigado`,
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    statement_descriptor: "Vitrine72",
  };

  let initPoint: string;
  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("MP preference error:", await res.text());
      return NextResponse.redirect(new URL("/#preco", req.url));
    }

    const data = (await res.json()) as { init_point: string };
    initPoint = data.init_point;
  } catch (err) {
    console.error("MP checkout error:", err);
    return NextResponse.redirect(new URL("/#preco", req.url));
  }

  return NextResponse.redirect(initPoint);
}
