import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { OPS_COOKIE, verifyOpsToken } from "@/lib/ops-auth";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OPS_COOKIE)?.value;
  const valid = verifyOpsToken(token);
  return NextResponse.json({
    cookie: token ? `${token.slice(0, 8)}…` : null,
    valid,
    hasPassword: !!process.env.OPS_PASSWORD,
  });
}
