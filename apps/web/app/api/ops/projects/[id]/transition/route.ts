import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, createAnonClient } from "@/lib/supabase/server";
import { canTransition, transition } from "@vitrine72/core";
import type { ProjectStatus } from "@vitrine72/core";
import { sendEmail } from "@/lib/email/send";
import { siteDeliveryEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  // Auth check
  const anonSupabase = await createAnonClient();
  const {
    data: { session },
  } = await anonSupabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const allowlist = (process.env.OPS_EMAIL_ALLOWLIST ?? "").split(",").map((e) => e.trim());
  if (!allowlist.includes(session.user.email ?? "")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { target } = body as { target: ProjectStatus };

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, status, revision_count, golive_earliest_at, preview_url, edit_token")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { data: qaReport } = await supabase
    .from("qa_reports")
    .select("passed")
    .eq("project_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const guard = canTransition(project.status as ProjectStatus, target, {
    qaReportPassed: qaReport?.passed,
    revisionCount: project.revision_count,
    goLiveEarliestAt: project.golive_earliest_at
      ? new Date(project.golive_earliest_at)
      : undefined,
    now: new Date(),
  });

  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason }, { status: 422 });
  }

  const newStatus = transition(project.status as ProjectStatus, target);

  await supabase
    .from("projects")
    .update({ status: newStatus })
    .eq("id", id);

  await supabase.from("audit_log").insert({
    project_id: id,
    actor: session.user.email ?? "ops",
    action: "manual_transition",
    from_status: project.status,
    to_status: newStatus,
    metadata: null,
  });

  // When entering preview_sent, email client with preview + edit link
  if (newStatus === "preview_sent" && project.preview_url) {
    const { data: intake } = await supabase
      .from("intake_submissions")
      .select("data")
      .eq("project_id", id)
      .maybeSingle();

    const clientEmail = intake?.data?.email as string | undefined;
    const clientName = (intake?.data?.name as string | undefined) ?? "Cliente";
    const businessName = (intake?.data?.business_name as string | undefined) ?? clientName;

    if (clientEmail) {
      const editUrl = project.edit_token
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/edits/${project.edit_token}`
        : null;

      await sendEmail({
        to: clientEmail,
        ...siteDeliveryEmail({
          clientName,
          businessName,
          previewUrl: project.preview_url,
          editUrl,
        }),
      }).catch(() => {
        // Don't fail the transition if email fails
      });
    }
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
