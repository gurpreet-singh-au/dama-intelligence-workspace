-- Phase 1 seed data is intentionally limited to non-legal reference/setup data.
-- No occupation availability, subclass availability or concession facts are seeded.

insert into public.workspaces (id, name)
values ('00000000-0000-0000-0000-000000000001', 'DAMA Phase 1 Internal Workspace')
on conflict do nothing;

insert into public.dama_regions (workspace_id, name, slug, jurisdiction, status, notes)
values
  ('00000000-0000-0000-0000-000000000001', 'South Australia DAMA', 'south-australia-dama', 'South Australia', 'draft', 'Confirmed pilot region placeholder only. No source-backed facts seeded.'),
  ('00000000-0000-0000-0000-000000000001', 'Orana DAMA', 'orana-dama', 'New South Wales', 'draft', 'Confirmed pilot region placeholder only. No source-backed facts seeded.'),
  ('00000000-0000-0000-0000-000000000001', 'Northern Territory DAMA', 'northern-territory-dama', 'Northern Territory', 'draft', 'Confirmed pilot region placeholder only. No source-backed facts seeded.')
on conflict do nothing;
