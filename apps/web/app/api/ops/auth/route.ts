import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COOKIE = "ops_token";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function makeToken(secret: string): string {
  return createHmac("sha256", secret).update("ops_session").digest("hex");
}

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  const opsPassword = process.env.OPS_PASSWORD;
  const opsSecret = process.env.OPS_SECRET ?? process.env.DISCOUNT_SECRET ?? "";

  if (!opsPassword) {
    return NextResponse.json({ error: "OPS_PASSWORD not configured" }, { status: 500 });
  }

  let valid = false;
  try {
    valid = timingSafeEqual(Buffer.from(password ?? ""), Buffer.from(opsPassword));
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = makeToken(opsSecret);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
  return NextResponse.json({ ok: true });
}

export function verifyOpsToken(token: string | undefined): boolean {
  const secret = process.env.OPS_SECRET ?? process.env.DISCOUNT_SECRET ?? "";
  if (!token || !secret) return false;
  try {
    const expected = makeToken(secret);
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
