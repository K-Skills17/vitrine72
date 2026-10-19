"use client";

import { useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import { canTransition } from "@vitrine72/core";
import type { ProjectStatus } from "@vitrine72/core";
import type {
  Project,
  IntakeSubmission,
  QAReport,
  Revision,
  EditTicket,
  Payment,
  AuditEntry,
} from "@/lib/supabase/types";

interface Props {
  project: Project;
  intake: IntakeSubmission | null;
  qaReport: QAReport | null;
  revisions: Revision[];
  editTickets: EditTicket[];
  payments: Payment[];
  auditLog: AuditEntry[];
}

const NEXT_STATUS_MAP: Record<ProjectStatus, ProjectStatus[]> = {
  paid: ["intake_pending"],
  intake_pending: ["intake_complete", "paused"],
  intake_complete: ["in_production", "paused"],
  in_production: ["qa", "paused"],
  qa: ["preview_sent", "in_production"],
  preview_sent: ["revision_requested", "approved"],
  revision_requested: ["revision_done"],
  revision_done: ["approved"],
  approved: ["live"],
  live: ["maintenance"],
  maintenance: ["live"],
  paused: ["intake_pending", "intake_complete"],
  refunded: [],
};

export function OpsProjectDetail({
  project,
  intake,
  qaReport,
  payments,
  auditLog,
}: Props) {
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStatuses = NEXT_STATUS_MAP[project.status] ?? [];

  async function handleTransition(target: ProjectStatus) {
    const guard = canTransition(project.status, target, {
      qaReportPassed: qaReport?.passed,
      revisionCount: project.revision_count,
      goLiveEarliestAt: project.golive_earliest_at
        ? new Date(project.golive_earliest_at)
        : undefined,
      now: new Date(),
    });

    if (!guard.ok) {
      setError(guard.reason);
      return;
    }

    setTransitioning(true);
    setError(null);
    try {
      const res = await fetch(`/api/ops/projects/${project.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Erro");
        return;
      }
      window.location.reload();
    } finally {
      setTransitioning(false);
    }
  }

  const intakeData = intake?.data as Record<string, unknown> | null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            {(intakeData?.businessName as string) ?? "Projeto sem nome"}
          </h1>
          <p className="text-gray-500 font-mono text-sm">{project.id}</p>
        </div>
        <span className="bg-brand-gold text-brand-dark font-semibold text-sm px-3 py-1 rounded-full">
          {project.status.replace(/_/g, " ")}
        </span>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Status transitions */}
      {nextStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-gray-500 text-sm self-center">Mover para:</span>
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => handleTransition(s)}
              disabled={transitioning}
              className="text-sm border border-brand-gold text-brand-gold px-3 py-1.5 rounded-lg hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-40"
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Key dates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Stat label="Pagamento" value={project.payment_date ?? "–"} />
        <Stat label="Prévia até" value={project.preview_due_at?.slice(0, 10) ?? "–"} />
        <Stat label="Go-live a partir de" value={project.golive_earliest_at?.slice(0, 10) ?? "–"} />
        <Stat label="Revisões" value={`${project.revision_count}/1`} />
      </div>

      {/* Intake data */}
      {intakeData && (
        <Section title="Briefing">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(intakeData).map(([k, v]) => {
              if (k === "uploadedPhotos") return null;
              return (
                <div key={k}>
                  <span className="text-gray-500">{k}: </span>
                  <span className="text-white">
                    {Array.isArray(v) ? v.join(", ") : String(v ?? "–")}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* QA report */}
      {qaReport && (
        <Section title="Relatório QA">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 ${qaReport.passed ? "text-green-400" : "text-red-400"}`}>
              {qaReport.passed
                ? <><CircleCheck className="w-4 h-4" aria-hidden /> Passou</>
                : <><CircleX className="w-4 h-4" aria-hidden /> Falhou</>}
            </span>
            <span className="text-gray-500 text-sm">
              Performance: {qaReport.lighthouse_performance ?? "–"} |
              Acessibilidade: {qaReport.lighthouse_accessibility ?? "–"} |
              SEO: {qaReport.lighthouse_seo ?? "–"}
            </span>
          </div>
          {qaReport.blocking_issues?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {qaReport.blocking_issues.map((issue, i) => (
                <li key={i} className="text-red-400 text-sm">
                  • {issue}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* Payments */}
      <Section title="Pagamentos">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs">
              <th className="text-left pb-1">Ref</th>
              <th className="text-left pb-1">Valor</th>
              <th className="text-left pb-1">Método</th>
              <th className="text-left pb-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="py-1 text-gray-500 font-mono text-xs pr-4">{p.provider_ref?.slice(0, 12)}</td>
                <td className="py-1 text-white pr-4">
                  R$ {p.amount.toLocaleString("pt-BR")}
                </td>
                <td className="py-1 text-gray-400 pr-4">{p.method}</td>
                <td className="py-1">
                  <span
                    className={
                      p.status === "approved"
                        ? "text-green-400"
                        : p.status === "refunded"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Audit log */}
      <Section title="Histórico">
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {auditLog.map((e) => (
            <div key={e.id} className="text-xs text-gray-500 flex gap-3">
              <span className="text-gray-600">
                {new Date(e.created_at).toLocaleString("pt-BR")}
              </span>
              <span className="text-gray-400">{e.actor}</span>
              <span className="text-white">{e.action}</span>
              {e.from_status && (
                <span className="text-gray-500">
                  {e.from_status} → {e.to_status}
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-dark-2 rounded-lg p-3">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-dark-2 rounded-xl p-5 space-y-3">
      <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}
