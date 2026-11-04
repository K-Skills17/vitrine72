import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyOpsToken, OPS_COOKIE } from "@/lib/ops-auth";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ value: string }> }
): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!verifyOpsToken(cookieStore.get(OPS_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { value } = await params;
  const { active } = await req.json() as { active: boolean };
  const supabase = createServiceClient();
  const { error } = await supabase.from("verticals").update({ active }).eq("value", value);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ value: string }> }
): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!verifyOpsToken(cookieStore.get(OPS_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { value } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("verticals").delete().eq("value", value);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
