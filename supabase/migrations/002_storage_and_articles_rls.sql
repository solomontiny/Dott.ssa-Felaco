-- =============================================================
-- 002_storage_and_articles_rls.sql
-- Production-safe Supabase RLS policies for admin article CRUD and media uploads
-- =============================================================

alter table storage.objects enable row level security;

-- Drop legacy policies if they already exist so this migration is idempotent.
drop policy if exists "Public read media bucket objects" on storage.objects;
drop policy if exists "Admin upload media bucket objects" on storage.objects;
drop policy if exists "Admin update media bucket objects" on storage.objects;
drop policy if exists "Admin delete media bucket objects" on storage.objects;
drop policy if exists "Admin can manage articles" on public.articles;
drop policy if exists "Public read published articles" on public.articles;

-- Public can read public media files in the media bucket.
create policy "Public read media bucket objects"
on storage.objects
for select
using (
  bucket_id = 'media'
);

-- Authenticated users can upload objects to the media bucket.
create policy "Authenticated users can upload media objects"
on storage.objects
for insert
with check (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

-- Authenticated users can update only their own uploaded files.
create policy "Authenticated users can update own media objects"
on storage.objects
for update
using (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
)
with check (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

-- Authenticated users can delete only their own uploaded files.
create policy "Authenticated users can delete own media objects"
on storage.objects
for delete
using (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

-- Public can read published articles.
create policy "Public read published articles"
on public.articles
for select
using (
  published = true
  and deleted_at is null
);

-- Authenticated admin users can read all articles for the dashboard.
create policy "Authenticated admins can manage all articles"
on public.articles
for select
using (
  auth.role() = 'authenticated'
  and public.is_admin()
);

-- Authenticated admin users can insert articles.
create policy "Authenticated admins can insert articles"
on public.articles
for insert
with check (
  auth.role() = 'authenticated'
  and public.is_admin()
);

-- Authenticated admin users can update articles.
create policy "Authenticated admins can update articles"
on public.articles
for update
using (
  auth.role() = 'authenticated'
  and public.is_admin()
)
with check (
  auth.role() = 'authenticated'
  and public.is_admin()
);

-- Authenticated admin users can delete articles.
create policy "Authenticated admins can delete articles"
on public.articles
for delete
using (
  auth.role() = 'authenticated'
  and public.is_admin()
);
