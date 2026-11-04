import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(url, key);

export type IntakeData = {
  name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  address?: string;
  city?: string;
  neighborhoods?: string[];
  services?: Array<{ name: string; description?: string; price?: string }>;
  hours?: string;
  hours_array?: string[];
  faqs?: Array<{ q: string; a: string }>;
  gbp_link?: string;
  instagram_link?: string;
  whatsapp?: string;
  vertical?: string;
  primary_action?: "whatsapp" | "phone" | "form";
};

export type Project = {
  id: string;
  status: string;
  sku: string;
  vertical: string | null;
};

export type IntakeSubmission = {
  id: string;
  project_id: string;
  data: IntakeData;
};

export type Research = {
  id: string;
  project_id: string;
  gbp_place_id: string | null;
  rating: number | null;
  review_count: number | null;
  reviews: Array<{ author: string; rating: number; text: string; date: string }> | null;
  competitors: Array<{ name: string; rating: number; reviewCount: number; hasWebsite: boolean }> | null;
  customer_phrases: string[] | null;
};

/** Fetch up to `limit` projects in intake_complete status */
export async function fetchIntakeCompleteProjects(limit = 5): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, status, sku, vertical")
    .eq("status", "intake_complete")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`fetchIntakeCompleteProjects: ${error.message}`);
  return (data ?? []) as Project[];
}

/** Claim a project by moving it to in_production. Returns false if already claimed. */
export async function claimProject(projectId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("projects")
    .update({ status: "in_production" })
    .eq("id", projectId)
    .eq("status", "intake_complete") // only claim if still intake_complete
    .select("id")
    .maybeSingle();

  if (error) throw new Error(`claimProject: ${error.message}`);
  return !!data;
}

export async function getIntakeSubmission(projectId: string): Promise<IntakeSubmission | null> {
  const { data } = await supabase
    .from("intake_submissions")
    .select("id, project_id, data")
    .eq("project_id", projectId)
    .maybeSingle();
  return data as IntakeSubmission | null;
}

export async function getResearch(projectId: string): Promise<Research | null> {
  const { data } = await supabase
    .from("research")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();
  return data as Research | null;
}

export async function getUploads(projectId: string): Promise<string[]> {
  const { data } = await supabase
    .from("uploads")
    .select("storage_path, role")
    .eq("project_id", projectId)
    .order("created_at");
  if (!data) return [];
  // Photos first, then other uploads
  return data
    .filter((u) => u.role === "photo")
    .map((u) => u.storage_path);
}

export async function getLogoPath(projectId: string): Promise<string | null> {
  const { data } = await supabase
    .from("uploads")
    .select("storage_path")
    .eq("project_id", projectId)
    .eq("role", "logo")
    .maybeSingle();
  return data?.storage_path ?? null;
}

export async function insertAuditLog(params: {
  projectId: string;
  actor: string;
  action: string;
  fromStatus: string;
  toStatus: string;
  metadata?: Record<string, unknown>;
}) {
  await supabase.from("audit_log").insert({
    project_id: params.projectId,
    actor: params.actor,
    action: params.action,
    from_status: params.fromStatus,
    to_status: params.toStatus,
    metadata: params.metadata ?? null,
  });
}
