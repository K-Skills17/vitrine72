export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { EditRequestForm } from "@/components/edits/EditRequestForm";
import { MAINTENANCE } from "@vitrine72/core";

export const metadata: Metadata = {
  title: "Solicitar edição | Vitrine72",
  robots: { index: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function EditPage({ params }: Props) {
  const { token } = await params;
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, status, maintenance_active, edit_token")
    .eq("edit_token", token)
    .maybeSingle();

  if (!project) notFound();

  if (!project.maintenance_active) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <p className="text-gray-400">
            Edições estão disponíveis apenas para clientes com plano de
            manutenção ativo.
          </p>
        </div>
      </main>
    );
  }

  // Count free edits used this cycle
  const cycleStart = new Date();
  cycleStart.setDate(cycleStart.getDate() - MAINTENANCE.cycleWeeks * 7);

  const { count: usedThisCycle } = await supabase
    .from("edit_tickets")
    .select("id", { count: "exact" })
    .eq("project_id", project.id)
    .eq("is_free", true)
    .gte("created_at", cycleStart.toISOString());

  const freeRemaining = Math.max(0, MAINTENANCE.editsPerCycle - (usedThisCycle ?? 0));

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Solicitar edição
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {freeRemaining > 0
            ? `Você tem ${freeRemaining} edição(ões) gratuita(s) neste ciclo. SLA: 2 dias úteis.`
            : `Edições gratuitas esgotadas neste ciclo. Edições avulsas: R$ 97 (outras) / R$ 197 (nova página).`}
        </p>
        <EditRequestForm
          projectId={project.id}
          token={token}
          freeRemaining={freeRemaining}
        />
      </div>
    </main>
  );
}
