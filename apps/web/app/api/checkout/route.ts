import { NextRequest, NextResponse } from "next/server";
import { getPrice, CORE_OFFER, ANCHOR_PACKAGE, DOWNSELL } from "@vitrine72/core";
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

  // Pix uses the discounted pix price; card uses the higher card price so margin is preserved.
  // MP Checkout Pro shows both options on its page — the buyer chooses.
  const pixPrice = getPrice(sku, "pix");
  const cardPrice = getPrice(sku, "card");
  if (!pixPrice || !cardPrice) {
    return NextResponse.redirect(new URL("/#preco", req.url));
  }

  // Max installments per SKU (buyer pays MP interest — juros do comprador)
  const installmentsMax =
    sku === "SITE_5P" ? CORE_OFFER.installmentsMax
    : sku === "ANCHOR_SITE_GBP_BOT" ? ANCHOR_PACKAGE.installmentsMax
    : sku === "LANDING_1P" ? DOWNSELL.installmentsMax
    : 1;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrini72.com.br";

  const body = {
    items: [
      {
        id: sku,
        title: SKU_LABELS[sku] ?? `Vitrine72 — ${sku}`,
        quantity: 1,
        currency_id: "BRL",
        // Card price is the base for the preference; MP will offer Pix as a
        // payment method with automatic discount configured in the MP dashboard.
        unit_price: cardPrice,
      },
    ],
    payment_methods: {
      installments: installmentsMax,
      default_installments: 1,
    },
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
