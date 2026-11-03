export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { OpsPipeline } from "@/components/ops/OpsPipeline";

export const metadata: Metadata = { title: "Pipeline | Ops" };

export default async function OpsHome() {
  const supabase = createServiceClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id, status, sku, payment_date, clock_started_at, preview_due_at, golive_earliest_at, vertical, seller_id, partner_id"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return <OpsPipeline projects={projects ?? []} />;
}
