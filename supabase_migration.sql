-- Supabase SQL Migration for Dott.ssa Felaco
-- Paste this whole script into the Supabase SQL editor and run it using the service_role key (or via the Supabase SQL Editor).

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- =====================================================
-- Profiles table (link to auth.users) to mark admins
-- =====================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- =====================================================
-- Articles
-- =====================================================
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  excerpt text,
  content text,
  language text default 'it',
  tags text[] default array[]::text[],
  categories text[] default array[]::text[],
  featured_image text,
  gallery text[] default array[]::text[],
  featured boolean default false,
  published boolean default false,
  seo_title text,
  seo_description text,
  author text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create unique index if not exists articles_slug_idx on articles(slug);
create index if not exists articles_created_at_idx on articles(created_at desc);

-- Enable RLS
alter table articles enable row level security;

-- Allow public read for published content
create policy "Public select for published articles" on articles
  for select using (published = true);

-- Allow admins to select all
create policy "Admins select articles" on articles
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Allow admins to insert
create policy "Admins insert articles" on articles
  for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Allow admins to update
create policy "Admins update articles" on articles
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Allow admins to delete (soft-delete pattern: prefer update deleted_at rather than true delete)
create policy "Admins delete articles" on articles
  for delete using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Categories (optional)
-- =====================================================
create table if not exists article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  created_at timestamptz default now()
);

alter table article_categories enable row level security;
create policy "Public select categories" on article_categories
  for select using (true);
create policy "Admins manage categories" on article_categories
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Appointments (visitors can submit; admins view/manage)
-- =====================================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  date date,
  time text,
  type text,
  notes text,
  status text default 'pending',
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table appointments enable row level security;
-- Allow anyone (including anonymous via anon key) to insert appointments
create policy "Public insert appointments" on appointments
  for insert with check (true);
-- Allow admins to select and manage appointments
create policy "Admins select appointments" on appointments
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Admins update appointments" on appointments
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Admins delete appointments" on appointments
  for delete using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Consultations (visitors submit; admins view)
-- =====================================================
create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text,
  consent boolean default false,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table consultations enable row level security;
create policy "Public insert consultations" on consultations
  for insert with check (true);
create policy "Admins select consultations" on consultations
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Admins manage consultations" on consultations
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Contacts (visitor messages)
-- =====================================================
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table contacts enable row level security;
create policy "Public insert contacts" on contacts
  for insert with check (true);
create policy "Admins select contacts" on contacts
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Admins manage contacts" on contacts
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Newsletter subscribers
-- =====================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  created_at timestamptz default now(),
  confirmed boolean default false
);

alter table newsletter_subscribers enable row level security;
create unique index if not exists newsletter_email_idx on newsletter_subscribers(lower(email));
create policy "Public insert newsletter" on newsletter_subscribers
  for insert with check (true);
create policy "Admins select newsletter" on newsletter_subscribers
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Admins manage newsletter" on newsletter_subscribers
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Gallery
-- =====================================================
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  images text[] default array[]::text[], -- hold storage object paths or public URLs
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

alter table gallery enable row level security;
create policy "Public select gallery" on gallery
  for select using (true);
create policy "Admins manage gallery" on gallery
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Settings (single key-value JSON row)
-- =====================================================
create table if not exists settings (
  id text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

alter table settings enable row level security;
create policy "Admins manage settings" on settings
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Homepage content, About, Services, FAQ
-- =====================================================
create table if not exists homepage_content (
  id text primary key,
  content jsonb,
  updated_at timestamptz default now()
);
alter table homepage_content enable row level security;
create policy "Admins manage homepage" on homepage_content
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

create table if not exists about_content (
  id text primary key,
  content jsonb,
  updated_at timestamptz default now()
);
alter table about_content enable row level security;
create policy "Admins manage about" on about_content
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text,
  excerpt text,
  content jsonb,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
alter table services enable row level security;
create policy "Public select services" on services
  for select using (true);
create policy "Admins manage services" on services
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  question text,
  answer text,
  order_idx int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
alter table faq enable row level security;
create policy "Public select faq" on faq
  for select using (true);
create policy "Admins manage faq" on faq
  for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- =====================================================
-- Utility: ensure admin profile exists (seed step is optional)
-- Use the SQL editor or Supabase dashboard to mark the admin user as is_admin = true in profiles
-- Example: (run as service_role)
-- insert into profiles (id, full_name, is_admin) values ('<ADMIN_USER_UUID>', 'Dott.ssa Felaco', true);
-- =====================================================

-- Indexes for performance
create index if not exists idx_articles_published_lang_created on articles(published, language, created_at desc);
create index if not exists idx_services_slug on services(slug);

-- Done

