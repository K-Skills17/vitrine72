export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { IntakeForm } from "@/components/intake/IntakeForm";

export const metadata: Metadata = {
  title: "Formulário de briefing | Vitrine72",
  robots: { index: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function IntakePage({ params }: Props) {
  const { token } = await params;

  const supabase = createServiceClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id, status, intake_token, sku")
    .eq("intake_token", token)
    .maybeSingle();

  if (!project) notFound();

  // If already completed, show confirmation
  if (project.status === "intake_complete") {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <div className="text-5xl" aria-hidden>✅</div>
          <h1 className="text-2xl font-display font-bold text-white">
            Briefing enviado!
          </h1>
          <p className="text-gray-400">
            Recebemos tudo. Sua prévia será enviada em até 3 dias úteis.
          </p>
        </div>
      </main>
    );
  }

  // Load existing draft if any
  const { data: existingSubmission } = await supabase
    .from("intake_submissions")
    .select("id, data")
    .eq("project_id", project.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            Formulário de briefing
          </h1>
          <p className="text-gray-400 text-sm">
            Preencha com calma. O prazo de 72h começa quando você enviar.
            O formulário salva automaticamente.
          </p>
        </div>
        <IntakeForm
          projectId={project.id}
          token={token}
          sku={project.sku}
          existingData={
            (existingSubmission?.data as Record<string, unknown>) ?? {}
          }
          submissionId={existingSubmission?.id ?? null}
        />
      </div>
    </main>
  );
}
