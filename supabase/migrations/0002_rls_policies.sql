alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.dama_regions enable row level security;
alter table public.sources enable row level security;
alter table public.source_snapshots enable row level security;
alter table public.occupations enable row level security;
alter table public.occupation_aliases enable row level security;
alter table public.dama_occupation_rules enable row level security;
alter table public.dama_visa_availability_rules enable row level security;
alter table public.dama_concession_rules enable row level security;
alter table public.candidate_extraction_records enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.has_workspace_role(target_workspace_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role = any(allowed_roles)
  );
$$;

create or replace function public.can_approve_production_rule(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_workspace_role(
    target_workspace_id,
    array['lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]
  );
$$;

create policy "Profiles are self readable"
on public.profiles for select
using (id = auth.uid());

create policy "Workspace members can read workspaces"
on public.workspaces for select
using (public.is_workspace_member(id));

create policy "Owners can update workspaces"
on public.workspaces for update
using (public.has_workspace_role(id, array['owner']::public.app_role[]))
with check (public.has_workspace_role(id, array['owner']::public.app_role[]));

create policy "Members can read memberships"
on public.workspace_members for select
using (public.is_workspace_member(workspace_id));

create policy "Owners manage memberships"
on public.workspace_members for all
using (public.has_workspace_role(workspace_id, array['owner']::public.app_role[]))
with check (public.has_workspace_role(workspace_id, array['owner']::public.app_role[]));

create policy "Members read DAMA regions"
on public.dama_regions for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff manage DAMA regions"
on public.dama_regions for all
using (public.has_workspace_role(workspace_id, array['owner', 'admin_reviewer']::public.app_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin_reviewer']::public.app_role[]));

create policy "Members read sources"
on public.sources for select
using (public.is_workspace_member(workspace_id));

create policy "Researchers create candidate sources"
on public.sources for insert
with check (
  status in ('candidate', 'verified', 'approved_for_extraction')
  and public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[])
);

create policy "Professional reviewers approve production sources"
on public.sources for update
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]))
with check (
  status <> 'approved_for_production_rules'
  or public.can_approve_production_rule(workspace_id)
);

create policy "Members read snapshots"
on public.source_snapshots for select
using (public.is_workspace_member(workspace_id));

create policy "Researchers create immutable snapshots"
on public.source_snapshots for insert
with check (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]));

create policy "Members read occupations and aliases"
on public.occupations for select
using (public.is_workspace_member(workspace_id));

create policy "Members read aliases"
on public.occupation_aliases for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff manage occupations"
on public.occupations for all
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]));

create policy "Review staff manage aliases"
on public.occupation_aliases for all
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[]));

create policy "Members read occupation rules"
on public.dama_occupation_rules for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create draft occupation rules"
on public.dama_occupation_rules for insert
with check (
  review_status <> 'approved'
  and public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[])
);

create policy "Professional reviewers approve occupation rules"
on public.dama_occupation_rules for update
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]))
with check (
  review_status <> 'approved'
  or public.can_approve_production_rule(workspace_id)
);

create policy "Members read visa rules"
on public.dama_visa_availability_rules for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create draft visa rules"
on public.dama_visa_availability_rules for insert
with check (
  review_status <> 'approved'
  and public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[])
);

create policy "Professional reviewers approve visa rules"
on public.dama_visa_availability_rules for update
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]))
with check (
  review_status <> 'approved'
  or public.can_approve_production_rule(workspace_id)
);

create policy "Members read concession rules"
on public.dama_concession_rules for select
using (public.is_workspace_member(workspace_id));

create policy "Review staff create draft concession rules"
on public.dama_concession_rules for insert
with check (
  review_status <> 'approved'
  and public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[])
);

create policy "Professional reviewers approve concession rules"
on public.dama_concession_rules for update
using (public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]))
with check (
  review_status <> 'approved'
  or public.can_approve_production_rule(workspace_id)
);

create policy "Members read candidate queue"
on public.candidate_extraction_records for select
using (public.is_workspace_member(workspace_id));

create policy "Researchers create candidate records only"
on public.candidate_extraction_records for insert
with check (
  status in ('candidate', 'needs_review')
  and public.has_workspace_role(workspace_id, array['owner', 'researcher', 'admin_reviewer']::public.app_role[])
);

create policy "Reviewers update candidate records without production approval"
on public.candidate_extraction_records for update
using (public.has_workspace_role(workspace_id, array['owner', 'admin_reviewer', 'lawyer_reviewer', 'authorised_professional_reviewer']::public.app_role[]))
with check (status in ('candidate', 'needs_review', 'rejected', 'promoted_to_structured_record'));

create policy "Members read audit events"
on public.audit_events for select
using (public.is_workspace_member(workspace_id));

create policy "Members append audit events"
on public.audit_events for insert
with check (public.is_workspace_member(workspace_id));
