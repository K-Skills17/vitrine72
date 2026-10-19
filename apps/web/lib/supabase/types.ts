/**
 * Supabase database types.
 * Generated types live here; extend as migrations evolve.
 */

import type { ProjectStatus } from "@vitrine72/core";

/** Makes nullable properties optional so Insert types mirror Supabase-generated behavior. */
type NullOptional<T> = {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: NullOptional<Omit<Project, "id" | "created_at" | "updated_at">>;
        Update: Partial<Project>;
        Relationships: never[];
      };
      payments: {
        Row: Payment;
        Insert: NullOptional<Omit<Payment, "id" | "created_at">>;
        Update: Partial<Payment>;
        Relationships: never[];
      };
      intake_submissions: {
        Row: IntakeSubmission;
        Insert: NullOptional<Omit<IntakeSubmission, "id" | "created_at" | "updated_at">>;
        Update: Partial<IntakeSubmission>;
        Relationships: never[];
      };
      uploads: {
        Row: Upload;
        Insert: NullOptional<Omit<Upload, "id" | "created_at">>;
        Update: Partial<Upload>;
        Relationships: never[];
      };
      research: {
        Row: Research;
        Insert: NullOptional<Omit<Research, "id" | "created_at">>;
        Update: Partial<Research>;
        Relationships: never[];
      };
      generated_sites: {
        Row: GeneratedSite;
        Insert: NullOptional<Omit<GeneratedSite, "id" | "created_at">>;
        Update: Partial<GeneratedSite>;
        Relationships: never[];
      };
      qa_reports: {
        Row: QAReport;
        Insert: NullOptional<Omit<QAReport, "id" | "created_at">>;
        Update: Partial<QAReport>;
        Relationships: never[];
      };
      revisions: {
        Row: Revision;
        Insert: NullOptional<Omit<Revision, "id" | "created_at">>;
        Update: Partial<Revision>;
        Relationships: never[];
      };
      edit_tickets: {
        Row: EditTicket;
        Insert: NullOptional<Omit<EditTicket, "id" | "created_at" | "updated_at">>;
        Update: Partial<EditTicket>;
        Relationships: never[];
      };
      sellers: {
        Row: Seller;
        Insert: NullOptional<Omit<Seller, "id" | "created_at">>;
        Update: Partial<Seller>;
        Relationships: never[];
      };
      partners: {
        Row: Partner;
        Insert: NullOptional<Omit<Partner, "id" | "created_at">>;
        Update: Partial<Partner>;
        Relationships: never[];
      };
      commission_entries: {
        Row: CommissionEntry;
        Insert: NullOptional<Omit<CommissionEntry, "id" | "created_at">>;
        Update: Partial<CommissionEntry>;
        Relationships: never[];
      };
      draws: {
        Row: Draw;
        Insert: NullOptional<Omit<Draw, "id" | "created_at">>;
        Update: Partial<Draw>;
        Relationships: never[];
      };
      webhook_events: {
        Row: WebhookEvent;
        Insert: NullOptional<Omit<WebhookEvent, "id" | "created_at">>;
        Update: Partial<WebhookEvent>;
        Relationships: never[];
      };
      audit_log: {
        Row: AuditEntry;
        Insert: NullOptional<Omit<AuditEntry, "id" | "created_at">>;
        Update: Record<string, never>;
        Relationships: never[];
      };
      contract_versions: {
        Row: ContractVersion;
        Insert: NullOptional<Omit<ContractVersion, "id" | "created_at">>;
        Update: Record<string, never>;
        Relationships: never[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// ─── Row types ────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  status: ProjectStatus;
  sku: string;
  intake_token: string;
  edit_token: string | null;
  seller_id: string | null;
  partner_id: string | null;
  source: string | null; // "seller:x", "partner:y", "inbound", etc.
  payment_provider: "kiwify" | "asaas";
  payment_provider_ref: string;
  gross_amount: number;
  payment_method: "pix" | "card";
  payment_date: string | null;
  clock_started_at: string | null;
  preview_due_at: string | null;
  golive_earliest_at: string | null;
  preview_url: string | null;
  live_domain: string | null;
  revision_count: number;
  maintenance_active: boolean;
  has_partner_bonus: boolean;
  notes: string | null;
  vertical: string | null;
}

export type Payment = {
  id: string;
  created_at: string;
  project_id: string;
  provider: "kiwify" | "asaas";
  provider_ref: string;
  amount: number;
  method: "pix" | "card";
  status: "pending" | "approved" | "refunded" | "chargeback";
  event_type: string;
  raw: Record<string, unknown>;
}

export type IntakeSubmission = {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  completed_at: string | null;
  data: Record<string, unknown>;
  contract_version_id: string | null;
  contract_accepted_at: string | null;
  contract_ip: string | null;
  contract_ua: string | null;
}

export type Upload = {
  id: string;
  created_at: string;
  project_id: string;
  intake_submission_id: string | null;
  storage_path: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  role: "photo" | "logo" | "audio" | "other";
}

export type Research = {
  id: string;
  created_at: string;
  project_id: string;
  gbp_place_id: string | null;
  rating: number | null;
  review_count: number | null;
  reviews: Record<string, unknown>[] | null;
  competitors: Record<string, unknown>[] | null;
  customer_phrases: string[] | null;
  raw: Record<string, unknown>;
}

export type GeneratedSite = {
  id: string;
  created_at: string;
  project_id: string;
  slug: string;
  vertical: string;
  layout_variant: number;
  preview_url: string | null;
  production_url: string | null;
  vercel_deployment_id: string | null;
  build_path: string;
}

export type QAReport = {
  id: string;
  created_at: string;
  project_id: string;
  generated_site_id: string;
  passed: boolean;
  lighthouse_performance: number | null;
  lighthouse_accessibility: number | null;
  lighthouse_seo: number | null;
  checks: Record<string, unknown>;
  blocking_issues: string[];
}

export type Revision = {
  id: string;
  created_at: string;
  project_id: string;
  round_number: number;
  requested_at: string;
  notes: string | null;
  completed_at: string | null;
}

export type EditTicket = {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  description: string;
  file_path: string | null;
  is_free: boolean;
  price: number | null;
  payment_link: string | null;
  status: "pending" | "in_progress" | "done";
  due_at: string | null;
  completed_at: string | null;
  cycle_start: string | null;
}

export type Seller = {
  id: string;
  created_at: string;
  name: string;
  asaas_links: Record<string, string>;
  active: boolean;
}

export type Partner = {
  id: string;
  created_at: string;
  handle: string;
  name: string;
  kiwify_affiliate_id: string;
  active: boolean;
}

export type CommissionEntry = {
  id: string;
  created_at: string;
  project_id: string;
  seller_id: string | null;
  partner_id: string | null;
  kind: string;
  gross_amount: number;
  commission_amount: number;
  due_at: string;
  paid_at: string | null;
  note: string | null;
}

export type Draw = {
  id: string;
  created_at: string;
  seller_id: string;
  week: string;
  week_number: number;
  amount: number;
  repaid_at: string | null;
}

export type WebhookEvent = {
  id: string;
  created_at: string;
  provider: "kiwify" | "asaas";
  event_id: string;
  event_type: string;
  processed: boolean;
  project_id: string | null;
  raw: Record<string, unknown>;
}

export type AuditEntry = {
  id: string;
  created_at: string;
  project_id: string;
  actor: string;
  action: string;
  from_status: string | null;
  to_status: string | null;
  metadata: Record<string, unknown> | null;
}

export type ContractVersion = {
  id: string;
  created_at: string;
  version: string;
  content_hash: string;
}
