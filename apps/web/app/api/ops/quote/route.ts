import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getPrice, ALL_SKUS } from "@vitrine72/core";
import { verifyOpsToken } from "@/app/api/ops/auth/route";
import type { Sku } from "@vitrine72/core";

export const runtime = "nodejs";

function signDiscount(sku: string, discount: number, expires: number, secret: string): string {
  const payload = `${sku}:${discount}:${expires}`;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!verifyOpsToken(cookieStore.get("ops_token")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.DISCOUNT_SECRET;
  if (!secret) return NextResponse.json({ error: "DISCOUNT_SECRET not configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const sku = (searchParams.get("sku") ?? "SITE_5P") as Sku;
  const discount = Math.min(50, Math.max(0, Number(searchParams.get("discount") ?? 0)));
  const expireDays = Math.min(30, Math.max(1, Number(searchParams.get("expireDays") ?? 7)));

  if (!ALL_SKUS.includes(sku)) {
    return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
  }

  const expires = Date.now() + expireDays * 24 * 60 * 60 * 1000;
  const sig = signDiscount(sku, discount, expires, secret);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitrini72.com.br";
  const checkoutUrl = `${siteUrl}/api/checkout?sku=${sku}&discount=${discount}&expires=${expires}&sig=${sig}`;

  const originalPix = getPrice(sku, "pix") ?? 0;
  const originalCard = getPrice(sku, "card") ?? 0;
  const discountedPix = Math.round(originalPix * (1 - discount / 100));
  const discountedCard = Math.round(originalCard * (1 - discount / 100));

  return NextResponse.json({
    url: checkoutUrl,
    sku,
    discount,
    expires,
    expireDays,
    originalPix,
    originalCard,
    discountedPix,
    discountedCard,
  });
}
