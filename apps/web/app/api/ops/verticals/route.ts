import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyOpsToken, OPS_COOKIE } from "@/lib/ops-auth";

export const runtime = "nodejs";

function slugify(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function auth(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyOpsToken(cookieStore.get(OPS_COOKIE)?.value);
}

export async function GET(): Promise<NextResponse> {
  if (!(await auth())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("verticals")
    .select("value, label, active")
    .order("label");
  return NextResponse.json({ verticals: data ?? [] });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await auth())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { label } = await req.json() as { label: string };
  if (!label?.trim()) return NextResponse.json({ error: "label required" }, { status: 400 });

  const value = slugify(label.trim());
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("verticals")
    .insert({ value, label: label.trim(), active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vertical: data });
}
