/**
 * POST /api/ops/projects/[id]/deploy
 *
 * Called by the build system (GitHub Actions, Railway, etc.) when a site
 * is deployed and ready for client review.
 *
 * Protected by BUILD_WEBHOOK_SECRET header (x-build-secret).
 *
 * Body:
 *   {
 *     preview_url: string,
 *     qa?: {
 *       passed: boolean,
 *       lighthouse_performance?: number,
 *       lighthouse_accessibility?: number,
 *       lighthouse_seo?: number,
 *       checks?: Record<string, unknown>,
 *       blocking_issues?: string[],
 *     }
 *   }
 *
 * On success:
 *   - Sets preview_url on the project
 *   - Inserts a qa_reports row (passed = true unless overridden)
 *   - Generates edit_token if missing
 *   - Auto-transitions: in_production → qa → preview_sent
 *   - Emails the client with the preview link + revision link
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { siteDeliveryEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

function verifySecret(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  const secret = process.env.BUILD_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "BUILD_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  if (!verifySecret(req.headers.get("x-build-secret"), secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    preview_url: string;
    generated_site_id?: string;
    qa?: {
      passed?: boolean;
      lighthouse_performance?: number;
      lighthouse_accessibility?: number;
      lighthouse_seo?: number;
      checks?: Record<string, unknown>;
      blocking_issues?: string[];
    };
  };

  if (!body.preview_url) {
    return NextResponse.json({ error: "preview_url is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, status, edit_token, preview_url")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }

  // Generate edit_token if missing
  const editToken = project.edit_token ?? randomUUID();

  // Set preview_url and edit_token on project
  await supabase
    .from("projects")
    .update({ preview_url: body.preview_url, edit_token: editToken })
    .eq("id", id);

  // Insert QA report (default: passed = true so it doesn't block preview_sent)
  const qaPassed = body.qa?.passed ?? true;
  const { data: qaReport } = await supabase
    .from("qa_reports")
    .insert({
      project_id: id,
      generated_site_id: body.generated_site_id ?? id, // fallback to project id if not provided
      passed: qaPassed,
      lighthouse_performance: body.qa?.lighthouse_performance ?? null,
      lighthouse_accessibility: body.qa?.lighthouse_accessibility ?? null,
      lighthouse_seo: body.qa?.lighthouse_seo ?? null,
      checks: body.qa?.checks ?? {},
      blocking_issues: body.qa?.blocking_issues ?? [],
    })
    .select("id")
    .single();

  // Auto-transition to preview_sent if status allows it.
  // We step through in_production → qa → preview_sent.
  let currentStatus = project.status;

  if (currentStatus === "intake_complete") {
    await supabase.from("projects").update({ status: "in_production" }).eq("id", id);
    await supabase.from("audit_log").insert({
      project_id: id, actor: "build", action: "auto_transition",
      from_status: currentStatus, to_status: "in_production", metadata: null,
    });
    currentStatus = "in_production";
  }

  if (currentStatus === "in_production") {
    await supabase.from("projects").update({ status: "qa" }).eq("id", id);
    await supabase.from("audit_log").insert({
      project_id: id, actor: "build", action: "auto_transition",
      from_status: currentStatus, to_status: "qa", metadata: null,
    });
    currentStatus = "qa";
  }

  if (currentStatus === "qa" && qaPassed) {
    await supabase.from("projects").update({ status: "preview_sent" }).eq("id", id);
    await supabase.from("audit_log").insert({
      project_id: id, actor: "build", action: "auto_transition",
      from_status: currentStatus, to_status: "preview_sent", metadata: null,
    });
    currentStatus = "preview_sent";
  }

  // Send client email if we reached preview_sent
  if (currentStatus === "preview_sent") {
    const { data: intake } = await supabase
      .from("intake_submissions")
      .select("data")
      .eq("project_id", id)
      .maybeSingle();

    const clientEmail = intake?.data?.email as string | undefined;
    const clientName = (intake?.data?.name as string | undefined) ?? "Cliente";
    const businessName = (intake?.data?.business_name as string | undefined) ?? clientName;

    if (clientEmail) {
      const editUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/edits/${editToken}`;
      await sendEmail({
        to: clientEmail,
        ...siteDeliveryEmail({ clientName, businessName, previewUrl: body.preview_url, editUrl }),
      }).catch((err) => {
        console.error("Failed to send site delivery email:", err);
      });
    }
  }

  return NextResponse.json({
    ok: true,
    status: currentStatus,
    qa_passed: qaPassed,
    edit_token: editToken,
  });
}
