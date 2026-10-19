import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { calcPreviewDue } from "@vitrine72/core";

export const runtime = "nodejs";

const REQUIRED_FIELDS = [
  "businessName",
  "document",
  "responsibleName",
  "whatsapp",
  "email",
  "vertical",
  "exactAddress",
  "hours",
  "service1Name",
  "service2Name",
  "service3Name",
  "idealCustomer",
  "faq1",
  "faq2",
  "faq3",
  "primaryAction",
  "updateFrequency",
  "colorChoice",
  "domainHas",
];

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

  // Verify token and get project
  const { data: project } = await supabase
    .from("projects")
    .select("id, status")
    .eq("intake_token", token)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (project.status === "intake_complete") {
    return NextResponse.json({ error: "already_submitted" }, { status: 409 });
  }

  // Validate required fields
  const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Campos obrigatórios faltando: ${missing.join(", ")}`,
        missing,
      },
      { status: 400 }
    );
  }

  // Validate minimum photos
  const photos = (data.uploadedPhotos as string[]) ?? [];
  if (photos.length < 8) {
    return NextResponse.json(
      { error: "Mínimo de 8 fotos necessário" },
      { status: 400 }
    );
  }

  const now = new Date();
  const previewDue = calcPreviewDue(now);
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // Get current contract version (latest)
  const { data: contract } = await supabase
    .from("contract_versions")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Update submission
  const submissionData = {
    project_id: project.id,
    completed_at: now.toISOString(),
    data,
    contract_version_id: contract?.id ?? null,
    contract_accepted_at: now.toISOString(),
    contract_ip: ip,
    contract_ua: ua,
  };

  if (submissionId) {
    await supabase
      .from("intake_submissions")
      .update(submissionData)
      .eq("id", submissionId);
  } else {
    await supabase.from("intake_submissions").insert(submissionData);
  }

  // Update project status + deadline
  await supabase
    .from("projects")
    .update({
      status: "intake_complete",
      clock_started_at: now.toISOString(),
      preview_due_at: previewDue.toISOString(),
      vertical: data.vertical as string,
    })
    .eq("id", project.id);

  // Audit log
  await supabase.from("audit_log").insert({
    project_id: project.id,
    actor: "client",
    action: "intake_submitted",
    from_status: "intake_pending",
    to_status: "intake_complete",
    metadata: { ip, previewDue: previewDue.toISOString() },
  });

  return NextResponse.json({ ok: true });
}
