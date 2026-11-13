-- Vitrine72: verticals + reference_sites
-- These tables were created by hand in the Supabase dashboard before this
-- file existed. This migration records the live schema (as of 2026-11-13)
-- so fresh environments match production. It is idempotent: safe to run
-- on a database where the tables already exist (it will change nothing).

-- ─── verticals ───────────────────────────────────────────────────────────────
-- Niches offered in the intake form; managed from /ops/references.
create table if not exists verticals (
  value text primary key,
  label text not null,
  active boolean default true,
  created_at timestamptz default now()
);
alter table verticals enable row level security;
-- No policies on purpose: only the service role (server-side) reads/writes.

insert into verticals (value, label) values
  ('buffet-eventos',       'Buffet e eventos'),
  ('energia-solar',        'Energia solar'),
  ('estetica',             'Estética e beleza'),
  ('fisioterapia-pilates', 'Fisioterapia / Pilates'),
  ('generico',             'Genérico'),
  ('moveis-planejados',    'Móveis planejados'),
  ('outro',                'Outro'),
  ('servicos-urgentes',    'Serviços urgentes')
on conflict (value) do nothing;

-- ─── reference_sites ─────────────────────────────────────────────────────────
-- Style references used by the builder; id is supplied by the app (no default).
create table if not exists reference_sites (
  id text primary key,
  url text not null,
  vertical text not null,
  style_group text not null,
  mood text not null,
  color_scheme text not null,
  primary_color text not null,
  accent_color text not null,
  background_color text not null,
  font_personality text not null,
  layout_variant integer not null,
  style_notes text not null,
  created_at timestamptz default now(),
  screenshot_url text
);
alter table reference_sites enable row level security;
-- No policies on purpose: only the service role (server-side) reads/writes.
