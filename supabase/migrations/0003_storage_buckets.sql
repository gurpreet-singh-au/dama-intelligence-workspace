insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'source-snapshots',
  'source-snapshots',
  false,
  52428800,
  array['application/pdf', 'text/html', 'text/plain', 'image/png', 'image/jpeg']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Workspace members can read source snapshots"
on storage.objects for select
using (
  bucket_id = 'source-snapshots'
  and exists (
    select 1
    from public.source_snapshots ss
    where ss.storage_bucket = storage.objects.bucket_id
      and ss.storage_path = storage.objects.name
      and public.is_workspace_member(ss.workspace_id)
  )
);

create policy "Researchers can upload source snapshots"
on storage.objects for insert
with check (
  bucket_id = 'source-snapshots'
  and exists (
    select 1
    from public.workspace_members wm
    where wm.user_id = auth.uid()
      and wm.role in ('owner', 'researcher', 'admin_reviewer')
      and storage.objects.name like wm.workspace_id::text || '/%'
  )
);

-- No update/delete policies are provided for snapshots in Phase 1.
-- New captures create new immutable snapshot objects and source_snapshots records.
