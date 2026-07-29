alter table public.dama_visa_availability_rules
  add column source_snapshot_id uuid references public.source_snapshots(id),
  add column data_confidence public.data_confidence not null default 'unknown',
  add column review_required_reason public.review_required_reason,
  add column superseded_date date,
  add column conflict_flag boolean not null default false,
  add column internal_reviewer_note text;

alter table public.dama_concession_rules
  add column source_snapshot_id uuid references public.source_snapshots(id),
  add column data_confidence public.data_confidence not null default 'unknown',
  add column review_required_reason public.review_required_reason,
  add column superseded_date date,
  add column conflict_flag boolean not null default false,
  add column internal_reviewer_note text;

alter table public.dama_visa_availability_rules
  add constraint dama_visa_rules_workspace_source_fk
    foreign key (workspace_id, source_id)
    references public.sources (workspace_id, id),
  add constraint dama_visa_rules_workspace_snapshot_fk
    foreign key (workspace_id, source_snapshot_id)
    references public.source_snapshots (workspace_id, id);

alter table public.dama_concession_rules
  add constraint dama_concession_rules_workspace_source_fk
    foreign key (workspace_id, source_id)
    references public.sources (workspace_id, id),
  add constraint dama_concession_rules_workspace_snapshot_fk
    foreign key (workspace_id, source_snapshot_id)
    references public.source_snapshots (workspace_id, id);

create index idx_dama_visa_rules_comparison_gate
on public.dama_visa_availability_rules (workspace_id, dama_occupation_rule_id, subclass, review_status, source_id, source_snapshot_id);

create index idx_dama_concession_rules_comparison_gate
on public.dama_concession_rules (workspace_id, dama_occupation_rule_id, concession_type, review_status, source_id, source_snapshot_id);

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
join public.dama_regions dr on dr.id = dor.dama_region_id and dr.workspace_id = dor.workspace_id
join public.occupations o on o.id = dor.occupation_id and o.workspace_id = dor.workspace_id
join public.sources s on s.id = dor.source_id and s.workspace_id = dor.workspace_id
join lateral (
  select ec.citation_id, c.citation_label
  from public.entity_citations ec
  join public.citations c on c.id = ec.citation_id and c.workspace_id = ec.workspace_id
  where ec.workspace_id = dor.workspace_id
    and ec.entity_type = 'dama_occupation_rule'
    and ec.entity_id = dor.id
    and ec.citation_role = 'primary_support'
    and c.source_id = dor.source_id
    and c.source_snapshot_id = dor.source_snapshot_id
  order by ec.created_at asc
  limit 1
) pc on true
left join lateral (
  select v.availability_status
  from public.dama_visa_availability_rules v
  join public.sources vs on vs.id = v.source_id and vs.workspace_id = v.workspace_id
  join public.entity_citations vec on vec.workspace_id = v.workspace_id
    and vec.entity_type = 'dama_visa_availability_rule'
    and vec.entity_id = v.id
    and vec.citation_role = 'primary_support'
  join public.citations vc on vc.id = vec.citation_id
    and vc.workspace_id = vec.workspace_id
    and vc.source_id = v.source_id
    and vc.source_snapshot_id = v.source_snapshot_id
  where v.workspace_id = dor.workspace_id
    and v.dama_occupation_rule_id = dor.id
    and v.subclass = '482'
    and v.review_status = 'approved'
    and vs.status = 'approved_for_production_rules'
    and v.source_snapshot_id is not null
    and v.superseded_date is null
    and v.conflict_flag = false
    and v.review_required_reason is null
    and v.data_confidence not in ('low', 'conflicting')
  order by vec.created_at asc
  limit 1
) v482 on true
left join lateral (
  select v.availability_status
  from public.dama_visa_availability_rules v
  join public.sources vs on vs.id = v.source_id and vs.workspace_id = v.workspace_id
  join public.entity_citations vec on vec.workspace_id = v.workspace_id
    and vec.entity_type = 'dama_visa_availability_rule'
    and vec.entity_id = v.id
    and vec.citation_role = 'primary_support'
  join public.citations vc on vc.id = vec.citation_id
    and vc.workspace_id = vec.workspace_id
    and vc.source_id = v.source_id
    and vc.source_snapshot_id = v.source_snapshot_id
  where v.workspace_id = dor.workspace_id
    and v.dama_occupation_rule_id = dor.id
    and v.subclass = '186'
    and v.review_status = 'approved'
    and vs.status = 'approved_for_production_rules'
    and v.source_snapshot_id is not null
    and v.superseded_date is null
    and v.conflict_flag = false
    and v.review_required_reason is null
    and v.data_confidence not in ('low', 'conflicting')
  order by vec.created_at asc
  limit 1
) v186 on true
left join lateral (
  select v.availability_status
  from public.dama_visa_availability_rules v
  join public.sources vs on vs.id = v.source_id and vs.workspace_id = v.workspace_id
  join public.entity_citations vec on vec.workspace_id = v.workspace_id
    and vec.entity_type = 'dama_visa_availability_rule'
    and vec.entity_id = v.id
    and vec.citation_role = 'primary_support'
  join public.citations vc on vc.id = vec.citation_id
    and vc.workspace_id = vec.workspace_id
    and vc.source_id = v.source_id
    and vc.source_snapshot_id = v.source_snapshot_id
  where v.workspace_id = dor.workspace_id
    and v.dama_occupation_rule_id = dor.id
    and v.subclass = '494'
    and v.review_status = 'approved'
    and vs.status = 'approved_for_production_rules'
    and v.source_snapshot_id is not null
    and v.superseded_date is null
    and v.conflict_flag = false
    and v.review_required_reason is null
    and v.data_confidence not in ('low', 'conflicting')
  order by vec.created_at asc
  limit 1
) v494 on true
left join lateral (
  select ccr.availability_status
  from public.dama_concession_rules ccr
  join public.sources cs on cs.id = ccr.source_id and cs.workspace_id = ccr.workspace_id
  join public.entity_citations cec on cec.workspace_id = ccr.workspace_id
    and cec.entity_type = 'dama_concession_rule'
    and cec.entity_id = ccr.id
    and cec.citation_role = 'primary_support'
  join public.citations cc on cc.id = cec.citation_id
    and cc.workspace_id = cec.workspace_id
    and cc.source_id = ccr.source_id
    and cc.source_snapshot_id = ccr.source_snapshot_id
  where ccr.workspace_id = dor.workspace_id
    and ccr.dama_occupation_rule_id = dor.id
    and ccr.concession_type = 'salary'
    and ccr.review_status = 'approved'
    and cs.status = 'approved_for_production_rules'
    and ccr.source_snapshot_id is not null
    and ccr.superseded_date is null
    and ccr.conflict_flag = false
    and ccr.review_required_reason is null
    and ccr.data_confidence not in ('low', 'conflicting')
  order by cec.created_at asc
  limit 1
) salary on true
left join lateral (
  select ccr.availability_status
  from public.dama_concession_rules ccr
  join public.sources cs on cs.id = ccr.source_id and cs.workspace_id = ccr.workspace_id
  join public.entity_citations cec on cec.workspace_id = ccr.workspace_id
    and cec.entity_type = 'dama_concession_rule'
    and cec.entity_id = ccr.id
    and cec.citation_role = 'primary_support'
  join public.citations cc on cc.id = cec.citation_id
    and cc.workspace_id = cec.workspace_id
    and cc.source_id = ccr.source_id
    and cc.source_snapshot_id = ccr.source_snapshot_id
  where ccr.workspace_id = dor.workspace_id
    and ccr.dama_occupation_rule_id = dor.id
    and ccr.concession_type = 'english'
    and ccr.review_status = 'approved'
    and cs.status = 'approved_for_production_rules'
    and ccr.source_snapshot_id is not null
    and ccr.superseded_date is null
    and ccr.conflict_flag = false
    and ccr.review_required_reason is null
    and ccr.data_confidence not in ('low', 'conflicting')
  order by cec.created_at asc
  limit 1
) english on true
left join lateral (
  select ccr.availability_status
  from public.dama_concession_rules ccr
  join public.sources cs on cs.id = ccr.source_id and cs.workspace_id = ccr.workspace_id
  join public.entity_citations cec on cec.workspace_id = ccr.workspace_id
    and cec.entity_type = 'dama_concession_rule'
    and cec.entity_id = ccr.id
    and cec.citation_role = 'primary_support'
  join public.citations cc on cc.id = cec.citation_id
    and cc.workspace_id = cec.workspace_id
    and cc.source_id = ccr.source_id
    and cc.source_snapshot_id = ccr.source_snapshot_id
  where ccr.workspace_id = dor.workspace_id
    and ccr.dama_occupation_rule_id = dor.id
    and ccr.concession_type = 'age'
    and ccr.review_status = 'approved'
    and cs.status = 'approved_for_production_rules'
    and ccr.source_snapshot_id is not null
    and ccr.superseded_date is null
    and ccr.conflict_flag = false
    and ccr.review_required_reason is null
    and ccr.data_confidence not in ('low', 'conflicting')
  order by cec.created_at asc
  limit 1
) age on true
left join lateral (
  select ccr.availability_status
  from public.dama_concession_rules ccr
  join public.sources cs on cs.id = ccr.source_id and cs.workspace_id = ccr.workspace_id
  join public.entity_citations cec on cec.workspace_id = ccr.workspace_id
    and cec.entity_type = 'dama_concession_rule'
    and cec.entity_id = ccr.id
    and cec.citation_role = 'primary_support'
  join public.citations cc on cc.id = cec.citation_id
    and cc.workspace_id = cec.workspace_id
    and cc.source_id = ccr.source_id
    and cc.source_snapshot_id = ccr.source_snapshot_id
  where ccr.workspace_id = dor.workspace_id
    and ccr.dama_occupation_rule_id = dor.id
    and ccr.concession_type = 'skills'
    and ccr.review_status = 'approved'
    and cs.status = 'approved_for_production_rules'
    and ccr.source_snapshot_id is not null
    and ccr.superseded_date is null
    and ccr.conflict_flag = false
    and ccr.review_required_reason is null
    and ccr.data_confidence not in ('low', 'conflicting')
  order by cec.created_at asc
  limit 1
) skills on true
where dor.review_status = 'approved'
  and s.status = 'approved_for_production_rules'
  and dor.source_id is not null
  and dor.source_snapshot_id is not null
  and dor.superseded_date is null
  and dor.conflict_flag = false
  and dor.review_required_reason is null
  and dor.data_confidence not in ('low', 'conflicting');
