create table public.source_snapshot_extracts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_snapshot_id uuid not null references public.source_snapshots(id) on delete cascade,
  page_number integer,
  section_heading text,
  extract_text text not null,
  extract_json jsonb,
  extraction_method text not null check (extraction_method in ('manual', 'pdf_text', 'ocr', 'web_scrape', 'ai_assisted')),
  confidence_score numeric check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 1)),
  created_at timestamptz not null default now()
);

create table public.citations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  source_snapshot_id uuid not null references public.source_snapshots(id) on delete cascade,
  source_snapshot_extract_id uuid references public.source_snapshot_extracts(id) on delete set null,
  citation_label text not null,
  quoted_text text,
  page_number integer,
  section_heading text,
  url_anchor text,
  source_date date,
  accessed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.entity_citations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  entity_type text not null check (entity_type in (
    'dama_occupation_rule',
    'dama_visa_availability_rule',
    'dama_concession_rule',
    'candidate_extraction_record',
    'source',
    'source_snapshot'
  )),
  entity_id uuid not null,
  citation_id uuid not null references public.citations(id) on delete cascade,
  citation_role text not null check (citation_role in (
    'primary_support',
    'secondary_support',
    'conflicting_source',
    'background_only'
  )),
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, citation_id, citation_role)
);

create table public.source_governance_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  note_type text not null check (note_type in (
    'lawyer_review_note',
    'mapping_decision',
    'data_quality_note',
    'governance_note'
  )),
  note_text text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_source_snapshot_extracts_snapshot on public.source_snapshot_extracts (workspace_id, source_snapshot_id);
create index idx_source_snapshot_extracts_search on public.source_snapshot_extracts using gin (to_tsvector('english', extract_text));
create index idx_citations_source_snapshot on public.citations (workspace_id, source_id, source_snapshot_id);
create index idx_entity_citations_entity on public.entity_citations (workspace_id, entity_type, entity_id, citation_role);
create index idx_source_governance_notes_source on public.source_governance_notes (workspace_id, source_id, created_at desc);

alter table public.source_snapshot_extracts enable row level security;
alter table public.citations enable row level security;
alter table public.entity_citations enable row level security;
alter table public.source_governance_notes enable row level security;

create policy "Members read source snapshot extracts"
on public.source_snapshot_extracts for select
using (public.is_workspace_member(workspace_id));

create policy "Researchers create source snapshot extracts"
on public.source_snapshot_extracts for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]));

create policy "Members read citations"
on public.citations for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create citations"
on public.citations for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]));

create policy "Members read entity citations"
on public.entity_citations for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create entity citations"
on public.entity_citations for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]));

create policy "Members read source governance notes"
on public.source_governance_notes for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create source governance notes"
on public.source_governance_notes for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]));

drop view public.approved_comparison_rows;

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
  pc.citation_id as primary_citation_id,
  pc.citation_label as primary_citation_label,
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
join lateral (
  select ec.citation_id, c.citation_label
  from public.entity_citations ec
  join public.citations c on c.id = ec.citation_id
  where ec.entity_type = 'dama_occupation_rule'
    and ec.entity_id = dor.id
    and ec.citation_role = 'primary_support'
    and c.source_id = dor.source_id
    and c.source_snapshot_id = dor.source_snapshot_id
  order by ec.created_at asc
  limit 1
) pc on true
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
