-- =============================================================
-- supabase/storage.sql
-- Storage buckets used by the website and admin dashboard
-- =============================================================

-- Create buckets explicitly so the frontend can upload media to the expected bucket names
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('logos', 'logos', true, 1048576, array['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp']),
  ('banners', 'banners', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Enable public reads for the public bucket family.
create policy "Public read media bucket objects"
on storage.objects
for select
using (bucket_id in ('media', 'gallery', 'logos', 'banners', 'documents'));

-- Admins can upload, overwrite, and delete files in any bucket.
create policy "Admin upload media bucket objects"
on storage.objects
for insert
with check (
  bucket_id in ('media', 'gallery', 'logos', 'banners', 'documents')
  and auth.role() = 'authenticated'
  and public.is_admin()
);

create policy "Admin update media bucket objects"
on storage.objects
for update
using (
  bucket_id in ('media', 'gallery', 'logos', 'banners', 'documents')
  and auth.role() = 'authenticated'
  and public.is_admin()
)
with check (
  bucket_id in ('media', 'gallery', 'logos', 'banners', 'documents')
  and auth.role() = 'authenticated'
  and public.is_admin()
);

create policy "Admin delete media bucket objects"
on storage.objects
for delete
using (
  bucket_id in ('media', 'gallery', 'logos', 'banners', 'documents')
  and auth.role() = 'authenticated'
  and public.is_admin()
);

-- Optional: keep media metadata in sync via app code. The metadata table is defined in the migration.
