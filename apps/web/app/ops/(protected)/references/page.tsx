export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ReferencesManager } from "@/components/ops/ReferencesManager";

export const metadata: Metadata = { title: "Referências | Ops" };

export default async function ReferencesPage() {
  const supabase = createServiceClient();
  const [{ data: sites }, { data: verticals }] = await Promise.all([
    supabase.from("reference_sites").select("*").order("vertical").order("created_at", { ascending: false }),
    supabase.from("verticals").select("value, label, active").order("label"),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Referências de estilo</h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie verticais e cole URLs — a IA extrai o estilo e salva para o builder usar na geração de sites.
        </p>
      </div>
      <ReferencesManager initialSites={sites ?? []} initialVerticals={verticals ?? []} />
    </div>
  );
}
