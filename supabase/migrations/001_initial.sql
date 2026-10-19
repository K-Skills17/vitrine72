-- Vitrine72 initial schema migration
-- All tables have RLS enabled.
-- Service role bypasses RLS. Ops users are granted via Supabase Auth.

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── contract_versions ───────────────────────────────────────────────────────
create table contract_versions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  version text not null unique,
  content_hash text not null
);
alter table contract_versions enable row level security;
create policy "service role only" on contract_versions using (false);

-- ─── sellers ─────────────────────────────────────────────────────────────────
create table sellers (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  asaas_links jsonb not null default '{}',
  active boolean not null default true
);
alter table sellers enable row level security;
create policy "service role only" on sellers using (false);

-- ─── partners ────────────────────────────────────────────────────────────────
create table partners (
  id text primary key,
  created_at timestamptz not null default now(),
  handle text not null unique,
  name text not null,
  kiwify_affiliate_id text not null default '',
  active boolean not null default true
);
alter table partners enable row level security;
create policy "service role only" on partners using (false);

-- ─── projects ────────────────────────────────────────────────────────────────
create table projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'paid',
  sku text not null,
  intake_token text not null unique,
  edit_token text unique,
  seller_id text references sellers(id),
  partner_id text references partners(id),
  source text,
  payment_provider text not null,
  payment_provider_ref text not null unique,
  gross_amount numeric(10,2) not null,
  payment_method text not null,
  payment_date date,
  clock_started_at timestamptz,
  preview_due_at timestamptz,
  golive_earliest_at timestamptz,
  preview_url text,
  live_domain text,
  revision_count int not null default 0,
  maintenance_active boolean not null default false,
  has_partner_bonus boolean not null default false,
  notes text,
  vertical text
);
alter table projects enable row level security;
create policy "service role only" on projects using (false);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

-- ─── payments ────────────────────────────────────────────────────────────────
create table payments (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  provider text not null,
  provider_ref text not null,
  amount numeric(10,2) not null,
  method text not null,
  status text not null,
  event_type text not null,
  raw jsonb not null default '{}'
);
alter table payments enable row level security;
create policy "service role only" on payments using (false);

-- ─── intake_submissions ───────────────────────────────────────────────────────
create table intake_submissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  completed_at timestamptz,
  data jsonb not null default '{}',
  contract_version_id uuid references contract_versions(id),
  contract_accepted_at timestamptz,
  contract_ip text,
  contract_ua text
);
alter table intake_submissions enable row level security;
create policy "service role only" on intake_submissions using (false);

-- ─── uploads ────────────────────────────────────────────────────────────────
create table uploads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  intake_submission_id uuid references intake_submissions(id),
  storage_path text not null,
  filename text not null,
  content_type text not null,
  size_bytes int not null,
  role text not null default 'photo'
);
alter table uploads enable row level security;
create policy "service role only" on uploads using (false);

-- ─── research ────────────────────────────────────────────────────────────────
create table research (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  gbp_place_id text,
  rating numeric(3,1),
  review_count int,
  reviews jsonb,
  competitors jsonb,
  customer_phrases jsonb,
  raw jsonb not null default '{}'
);
alter table research enable row level security;
create policy "service role only" on research using (false);

-- ─── generated_sites ────────────────────────────────────────────────────────
create table generated_sites (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  slug text not null unique,
  vertical text not null,
  layout_variant int not null default 1,
  preview_url text,
  production_url text,
  vercel_deployment_id text,
  build_path text not null
);
alter table generated_sites enable row level security;
create policy "service role only" on generated_sites using (false);

-- ─── qa_reports ─────────────────────────────────────────────────────────────
create table qa_reports (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  generated_site_id uuid not null references generated_sites(id),
  passed boolean not null default false,
  lighthouse_performance numeric(5,1),
  lighthouse_accessibility numeric(5,1),
  lighthouse_seo numeric(5,1),
  checks jsonb not null default '{}',
  blocking_issues jsonb not null default '[]'
);
alter table qa_reports enable row level security;
create policy "service role only" on qa_reports using (false);

-- ─── revisions ───────────────────────────────────────────────────────────────
create table revisions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  round_number int not null default 1,
  requested_at timestamptz not null default now(),
  notes text,
  completed_at timestamptz
);
alter table revisions enable row level security;
create policy "service role only" on revisions using (false);

-- ─── edit_tickets ────────────────────────────────────────────────────────────
create table edit_tickets (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  description text not null,
  file_path text,
  is_free boolean not null default true,
  price numeric(10,2),
  payment_link text,
  status text not null default 'pending',
  due_at date,
  completed_at timestamptz,
  cycle_start date
);
alter table edit_tickets enable row level security;
create policy "service role only" on edit_tickets using (false);

-- ─── commission_entries ───────────────────────────────────────────────────────
create table commission_entries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id text not null,
  seller_id text references sellers(id),
  partner_id text references partners(id),
  kind text not null,
  gross_amount numeric(10,2) not null default 0,
  commission_amount numeric(10,2) not null,
  due_at date not null,
  paid_at timestamptz,
  note text
);
alter table commission_entries enable row level security;
create policy "service role only" on commission_entries using (false);

-- ─── draws ───────────────────────────────────────────────────────────────────
create table draws (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  seller_id text not null references sellers(id),
  week text not null,
  week_number int not null,
  amount numeric(10,2) not null,
  repaid_at timestamptz
);
alter table draws enable row level security;
create policy "service role only" on draws using (false);

-- ─── webhook_events ───────────────────────────────────────────────────────────
create table webhook_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  processed boolean not null default false,
  project_id uuid references projects(id),
  raw jsonb not null default '{}',
  unique(provider, event_id)
);
alter table webhook_events enable row level security;
create policy "service role only" on webhook_events using (false);

-- ─── audit_log ───────────────────────────────────────────────────────────────
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  project_id uuid not null references projects(id),
  actor text not null,
  action text not null,
  from_status text,
  to_status text,
  metadata jsonb
);
alter table audit_log enable row level security;
create policy "service role only" on audit_log using (false);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index projects_status_idx on projects(status);
create index projects_intake_token_idx on projects(intake_token);
create index projects_payment_provider_ref_idx on projects(payment_provider_ref);
create index projects_edit_token_idx on projects(edit_token);
create index intake_submissions_project_id_idx on intake_submissions(project_id);
create index commission_entries_seller_id_idx on commission_entries(seller_id);
create index commission_entries_due_at_idx on commission_entries(due_at);
create index audit_log_project_id_idx on audit_log(project_id);
create index webhook_events_event_id_idx on webhook_events(event_id);
