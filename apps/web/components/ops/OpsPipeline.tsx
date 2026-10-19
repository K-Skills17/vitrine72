"use client";

import Link from "next/link";
import type { Project } from "@/lib/supabase/types";
const STATUS_COLORS: Record<string, string> = {
  paid: "bg-gray-700",
  intake_pending: "bg-yellow-900/40 border border-yellow-700",
  intake_complete: "bg-blue-900/40 border border-blue-700",
  in_production: "bg-purple-900/40 border border-purple-700",
  qa: "bg-purple-900/40",
  preview_sent: "bg-orange-900/40 border border-orange-700",
  revision_requested: "bg-red-900/40 border border-red-700",
  revision_done: "bg-orange-900/40",
  approved: "bg-green-900/40 border border-green-700",
  live: "bg-green-800/60 border border-green-500",
  maintenance: "bg-green-900/30",
  paused: "bg-gray-800",
  refunded: "bg-gray-900 opacity-50",
};

interface Props {
  projects: Partial<Project>[];
}

export function OpsPipeline({ projects }: Props) {
  const now = new Date();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Pipeline</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-gray-500">
              <th className="pb-2 pr-4">ID</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">SKU</th>
              <th className="pb-2 pr-4">Vertical</th>
              <th className="pb-2 pr-4">Prévia em</th>
              <th className="pb-2 pr-4">Go-live</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p) => {
              const previewDue = p.preview_due_at ? new Date(p.preview_due_at) : null;
              const goLive = p.golive_earliest_at ? new Date(p.golive_earliest_at) : null;
              const previewUrgent =
                previewDue && previewDue.getTime() - now.getTime() < 12 * 60 * 60 * 1000;

              return (
                <tr key={p.id} className="hover:bg-brand-dark-2 transition">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/ops/projects/${p.id}`}
                      className="text-brand-gold hover:underline font-mono text-xs"
                    >
                      {p.id?.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${
                        STATUS_COLORS[p.status ?? ""] ?? "bg-gray-700"
                      }`}
                    >
                      {p.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-400">{p.sku}</td>
                  <td className="py-2 pr-4 text-gray-400">{p.vertical ?? "–"}</td>
                  <td
                    className={`py-2 pr-4 ${
                      previewUrgent ? "text-red-400 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {previewDue
                      ? previewDue.toLocaleDateString("pt-BR")
                      : "–"}
                    {previewUrgent && " ⚠"}
                  </td>
                  <td className="py-2 pr-4 text-gray-400">
                    {goLive ? goLive.toLocaleDateString("pt-BR") : "–"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
