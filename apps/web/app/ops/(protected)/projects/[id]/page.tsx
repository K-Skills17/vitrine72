export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { OpsProjectDetail } from "@/components/ops/OpsProjectDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Projeto ${id.slice(0, 8)} | Ops` };
}

export default async function OpsProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [
    { data: project },
    { data: intake },
    { data: qaReport },
    { data: revisions },
    { data: editTickets },
    { data: payments },
    { data: auditLog },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("intake_submissions").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("qa_reports").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("revisions").select("*").eq("project_id", id).order("created_at"),
    supabase.from("edit_tickets").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("payments").select("*").eq("project_id", id),
    supabase.from("audit_log").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(50),
  ]);

  if (!project) notFound();

  return (
    <OpsProjectDetail
      project={project}
      intake={intake}
      qaReport={qaReport}
      revisions={revisions ?? []}
      editTickets={editTickets ?? []}
      payments={payments ?? []}
      auditLog={auditLog ?? []}
    />
  );
}
