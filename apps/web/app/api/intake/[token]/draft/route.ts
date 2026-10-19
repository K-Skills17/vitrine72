import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;
  const body = await req.json();
  const { data, submissionId } = body as {
    data: Record<string, unknown>;
    submissionId: string | null;
  };

  const supabase = createServiceClient();

  // Verify token
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("intake_token", token)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (submissionId) {
    await supabase
      .from("intake_submissions")
      .update({ data })
      .eq("id", submissionId);
  } else {
    await supabase.from("intake_submissions").insert({
      project_id: project.id,
      data,
    });
  }

  return NextResponse.json({ ok: true });
}
