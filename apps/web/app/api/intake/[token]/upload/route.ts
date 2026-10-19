import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
): Promise<NextResponse> {
  const { token } = await params;
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

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];
  const role = (formData.get("role") as string) ?? "photo";

  const paths: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Arquivo ${file.name} é muito grande (máx 10MB)` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const storagePath = `projects/${project.id}/${role}/${randomUUID()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: "upload_failed" },
        { status: 500 }
      );
    }

    // Record in uploads table
    await supabase.from("uploads").insert({
      project_id: project.id,
      storage_path: storagePath,
      filename: file.name,
      content_type: file.type,
      size_bytes: file.size,
      role: role as "photo" | "logo" | "audio" | "other",
    });

    paths.push(storagePath);

    // If audio, queue transcription (fire and forget)
    if (role === "audio") {
      queueTranscription(project.id, storagePath).catch(console.error);
    }
  }

  return NextResponse.json({ ok: true, paths });
}

async function queueTranscription(
  projectId: string,
  storagePath: string
): Promise<void> {
  const apiUrl = process.env.TRANSCRIPTION_API_URL;
  const apiKey = process.env.TRANSCRIPTION_API_KEY;

  if (!apiUrl || !apiKey || apiUrl.startsWith("PLACEHOLDER")) {
    console.warn("Transcription API not configured (NEEDS #9). Skipping.");
    return;
  }

  const supabase = createServiceClient();

  // Download file from storage
  const { data: fileData, error } = await supabase.storage
    .from("uploads")
    .download(storagePath);

  if (error || !fileData) return;

  // Call Whisper-compatible API
  const form = new FormData();
  form.append("file", fileData, storagePath.split("/").pop());
  form.append("model", "whisper-1");
  form.append("language", "pt");

  const res = await fetch(`${apiUrl}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) return;

  const result = await res.json();
  const text = result.text as string;

  // Store transcript alongside the upload record
  await supabase
    .from("uploads")
    .update({ role: "audio" })
    .eq("storage_path", storagePath);

  // Store transcript in intake_submissions data
  const { data: submission } = await supabase
    .from("intake_submissions")
    .select("id, data")
    .eq("project_id", projectId)
    .maybeSingle();

  if (submission) {
    const newData = {
      ...(submission.data as Record<string, unknown>),
      audioTranscript: text,
    };
    await supabase
      .from("intake_submissions")
      .update({ data: newData })
      .eq("id", submission.id);
  }
}
