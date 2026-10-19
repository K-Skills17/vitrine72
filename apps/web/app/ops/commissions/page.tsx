export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import type { CommissionEntry, Seller, Partner } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Comissões | Ops" };

export default async function CommissionsPage() {
  const supabase = createServiceClient();

  type EntryWithJoins = CommissionEntry & {
    sellers: Pick<Seller, "name"> | null;
    partners: Pick<Partner, "name"> | null;
  };
  const { data: rawEntries } = await supabase
    .from("commission_entries")
    .select("*, sellers(name), partners(name)")
    .order("due_at", { ascending: false })
    .limit(200);
  const entries = rawEntries as EntryWithJoins[] | null;

  const unpaid = (entries ?? []).filter((e) => !e.paid_at);
  const totalUnpaid = unpaid.reduce((s, e) => s + e.commission_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">
          Comissões
        </h1>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Total a pagar</p>
          <p className="text-brand-gold font-bold text-xl">
            R$ {totalUnpaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-white/10">
              <th className="text-left pb-2 pr-3">Projeto</th>
              <th className="text-left pb-2 pr-3">Tipo</th>
              <th className="text-left pb-2 pr-3">Vendedor/Parceiro</th>
              <th className="text-left pb-2 pr-3">Valor</th>
              <th className="text-left pb-2 pr-3">Vence</th>
              <th className="text-left pb-2 pr-3">Pago?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(entries ?? []).map((e) => (
              <tr key={e.id}>
                <td className="py-2 pr-3 font-mono text-xs text-gray-500">
                  {e.project_id?.slice(0, 8)}
                </td>
                <td className="py-2 pr-3 text-gray-300">{e.kind}</td>
                <td className="py-2 pr-3 text-gray-400">
                  {e.sellers?.name ?? e.partners?.name ?? "–"}
                </td>
                <td
                  className={`py-2 pr-3 font-semibold ${
                    e.commission_amount < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  R${" "}
                  {e.commission_amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 pr-3 text-gray-400">{e.due_at}</td>
                <td className="py-2 pr-3">
                  {e.paid_at ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-yellow-400">Pendente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
