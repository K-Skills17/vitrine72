export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import type { EditTicket } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Fila de edições | Ops" };

export default async function OpsEditsPage() {
  const supabase = createServiceClient();

  const { data: rawTickets } = await supabase
    .from("edit_tickets")
    .select("*")
    .neq("status", "done")
    .order("created_at", { ascending: true });
  const tickets = rawTickets as EditTicket[] | null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">
        Fila de edições
      </h1>

      {(tickets ?? []).length === 0 ? (
        <p className="text-gray-500">Nenhuma edição pendente.</p>
      ) : (
        <div className="space-y-3">
          {(tickets ?? []).map((t) => (
            <div
              key={t.id}
              className="bg-brand-dark-2 rounded-xl p-4 space-y-2 border border-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-brand-gold font-mono text-xs">
                  {t.project_id?.slice(0, 8)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    t.status === "in_progress"
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <p className="text-white text-sm">{t.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{t.is_free ? "Gratuita" : `R$ ${t.price ?? 0}`}</span>
                {t.due_at && <span>SLA: {t.due_at.slice(0, 10)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
