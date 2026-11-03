import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { OPS_COOKIE, createOpsToken } from "@/lib/ops-auth";

export const runtime = "nodejs";

const MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  const opsPassword = process.env.OPS_PASSWORD;

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

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPS_COOKIE, createOpsToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(OPS_COOKIE);
  return res;
}
