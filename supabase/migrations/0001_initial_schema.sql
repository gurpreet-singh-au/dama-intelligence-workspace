create extension if not exists "pgcrypto";

create type public.source_status as enum (
  'candidate',
  'verified',
  'approved_for_extraction',
  'approved_for_production_rules',
  'superseded',
  'conflicting_source',
  'unavailable',
  'rejected'
);

create type public.availability_status as enum (
  'available',
  'not_available',
  'unknown'
);

create type public.review_status as enum (
  'draft',
  'needs_review',
  'reviewed',
  'approved',
  'do_not_send'
);

create type public.data_confidence as enum (
  'high',
  'medium',
  'low',
  'conflicting',
  'unknown'
);

create type public.match_type as enum (
  'exact_anzsco_match',
  'exact_title_match',
  'synonym_match',
  'keyword_match',
  'related_occupation_match',
  'no_match'
);

create type public.review_required_reason as enum (
  'missing_citation',
  'stale_source',
  'conflicting_source',
  'low_confidence_extraction',
  'occupation_ambiguity',
  'legal_interpretation_required',
  'source_hierarchy_conflict',
  'missing_effective_date',
  'superseded_source'
);

create type public.source_authority_tier as enum (
  'tier_1_commonwealth_government_or_formal_dama_instrument',
  'tier_2_dama_region_official_source',
  'tier_3_supporting_administrative_material',
  'tier_4_non_authoritative_reference'
);

create type public.app_role as enum (
  'owner',
  'lawyer_reviewer',
  'authorised_professional_reviewer',
  'admin_reviewer',
  'researcher',
  'viewer'
);

create type public.extraction_record_status as enum (
  'candidate',
  'needs_review',
  'rejected',
  'promoted_to_structured_record'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id, role)
);

create table public.dama_regions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  jurisdiction text,
  status public.review_status not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  url text,
  authority_tier public.source_authority_tier not null,
  status public.source_status not null default 'candidate',
  source_date date,
  effective_date date,
  accessed_at timestamptz,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  storage_bucket text not null default 'source-snapshots',
  storage_path text not null,
  content_hash text,
  captured_at timestamptz not null default now(),
  captured_by uuid references auth.users(id),
  notes text,
  unique (storage_bucket, storage_path)
);

create table public.occupations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  anzsco_code text,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.occupation_aliases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  occupation_id uuid not null references public.occupations(id) on delete cascade,
  alias text not null,
  match_type public.match_type not null,
  created_at timestamptz not null default now()
);

create table public.dama_occupation_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  dama_region_id uuid not null references public.dama_regions(id) on delete cascade,
  occupation_id uuid not null references public.occupations(id) on delete cascade,
  source_id uuid not null references public.sources(id),
  source_snapshot_id uuid references public.source_snapshots(id),
  match_type public.match_type not null default 'exact_title_match',
  review_status public.review_status not null default 'draft',
  data_confidence public.data_confidence not null default 'unknown',
  review_required_reason public.review_required_reason,
  superseded_date date,
  conflict_flag boolean not null default false,
  internal_reviewer_note text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dama_visa_availability_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  dama_occupation_rule_id uuid not null references public.dama_occupation_rules(id) on delete cascade,
  subclass text not null check (subclass in ('482', '186', '494')),
  availability_status public.availability_status not null default 'unknown',
  source_id uuid not null references public.sources(id),
  review_status public.review_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique (dama_occupation_rule_id, subclass)
);

create table public.dama_concession_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  dama_occupation_rule_id uuid not null references public.dama_occupation_rules(id) on delete cascade,
  concession_type text not null check (concession_type in ('salary', 'english', 'age', 'skills')),
  availability_status public.availability_status not null default 'unknown',
  summary text,
  source_id uuid not null references public.sources(id),
  review_status public.review_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique (dama_occupation_rule_id, concession_type)
);

create table public.candidate_extraction_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid references public.sources(id),
  extracted_payload jsonb not null default '{}'::jsonb,
  status public.extraction_record_status not null default 'candidate',
  data_confidence public.data_confidence not null default 'unknown',
  review_required_reason public.review_required_reason,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  promoted_record_id uuid,
  notes text
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create index idx_sources_workspace_status on public.sources (workspace_id, status);
create index idx_sources_authority_tier on public.sources (authority_tier, status);
create index idx_occupations_search on public.occupations (workspace_id, anzsco_code, title);
create index idx_dama_occupation_rules_gate on public.dama_occupation_rules (workspace_id, review_status, source_id);
create index idx_candidate_records_status on public.candidate_extraction_records (workspace_id, status);
create index idx_audit_events_workspace_created on public.audit_events (workspace_id, created_at desc);

create view public.approved_comparison_rows as
select
  dor.workspace_id,
  dr.name as dama_region_name,
  o.anzsco_code,
  o.title as occupation_title,
  dor.match_type,
  dor.id as rule_id,
  coalesce(v482.availability_status, 'unknown'::public.availability_status) as subclass_482_status,
  coalesce(v186.availability_status, 'unknown'::public.availability_status) as subclass_186_status,
  coalesce(v494.availability_status, 'unknown'::public.availability_status) as subclass_494_status,
  coalesce(salary.availability_status, 'unknown'::public.availability_status) as salary_concession_status,
  coalesce(english.availability_status, 'unknown'::public.availability_status) as english_concession_status,
  coalesce(age.availability_status, 'unknown'::public.availability_status) as age_concession_status,
  coalesce(skills.availability_status, 'unknown'::public.availability_status) as skills_concession_status,
  s.id as source_id,
  s.title as source_title,
  s.url as source_url,
  s.authority_tier as source_authority_tier,
  s.source_date,
  s.accessed_at,
  dor.source_snapshot_id,
  s.effective_date,
  dor.superseded_date,
  dor.review_status,
  dor.review_required_reason,
  dor.data_confidence,
  dor.conflict_flag,
  'Internal preliminary workspace only. Not client-facing legal advice.'::text as internal_warning_label
from public.dama_occupation_rules dor
join public.dama_regions dr on dr.id = dor.dama_region_id
join public.occupations o on o.id = dor.occupation_id
join public.sources s on s.id = dor.source_id
left join public.dama_visa_availability_rules v482 on v482.dama_occupation_rule_id = dor.id and v482.subclass = '482' and v482.review_status = 'approved'
left join public.dama_visa_availability_rules v186 on v186.dama_occupation_rule_id = dor.id and v186.subclass = '186' and v186.review_status = 'approved'
left join public.dama_visa_availability_rules v494 on v494.dama_occupation_rule_id = dor.id and v494.subclass = '494' and v494.review_status = 'approved'
left join public.dama_concession_rules salary on salary.dama_occupation_rule_id = dor.id and salary.concession_type = 'salary' and salary.review_status = 'approved'
left join public.dama_concession_rules english on english.dama_occupation_rule_id = dor.id and english.concession_type = 'english' and english.review_status = 'approved'
left join public.dama_concession_rules age on age.dama_occupation_rule_id = dor.id and age.concession_type = 'age' and age.review_status = 'approved'
left join public.dama_concession_rules skills on skills.dama_occupation_rule_id = dor.id and skills.concession_type = 'skills' and skills.review_status = 'approved'
where dor.review_status = 'approved'
  and s.status = 'approved_for_production_rules'
  and dor.source_id is not null
  and dor.source_snapshot_id is not null
  and dor.superseded_date is null;
