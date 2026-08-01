-- =============================================================
-- supabase/migrations/001_initial.sql
-- Production-ready initial schema for Dott.ssa Felaco
-- =============================================================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select p.is_admin
    from public.profiles p
    where p.id = auth.uid()
  ), false);
$$;

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  category text,
  category_id uuid references public.article_categories(id) on delete set null,
  image_url text,
  tags text[] not null default '{}',
  featured_image text,
  gallery_images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  seo_title text,
  seo_description text,
  author text,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  content jsonb,
  image_url text,
  order_index integer not null default 0,
  featured boolean not null default false,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  images text[] not null default '{}',
  media_ids uuid[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.homepage_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.website_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  date date,
  appointment_date date,
  appointment_time text,
  type text,
  appointment_type text,
  notes text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'reviewed', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  consent boolean not null default false,
  confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null,
  object_path text not null,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  caption text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  order_index integer not null default 0,
  language text not null default 'it' check (language in ('it', 'en', 'fr', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_articles_slug on public.articles (slug);
create index if not exists idx_articles_language_published_created on public.articles (language, published, created_at desc);
create index if not exists idx_articles_category on public.articles (category_id);
create index if not exists idx_services_slug on public.services (slug);
create index if not exists idx_services_language on public.services (language);
create index if not exists idx_gallery_published on public.gallery (published);
create index if not exists idx_appointments_status_created on public.appointments (status, created_at desc);
create index if not exists idx_consultations_status_created on public.consultations (status, created_at desc);
create index if not exists idx_newsletter_email on public.newsletter_subscribers (email);
create index if not exists idx_media_files_bucket_path on public.media_files (bucket_name, object_path);
create index if not exists idx_faq_language_order on public.faq (language, order_index);

create or replace trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace trigger trg_article_categories_updated_at
before update on public.article_categories
for each row execute function public.set_updated_at();

create or replace trigger trg_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace trigger trg_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create or replace trigger trg_gallery_updated_at
before update on public.gallery
for each row execute function public.set_updated_at();

create or replace trigger trg_homepage_content_updated_at
before update on public.homepage_content
for each row execute function public.set_updated_at();

create or replace trigger trg_about_content_updated_at
before update on public.about_content
for each row execute function public.set_updated_at();

create or replace trigger trg_website_settings_updated_at
before update on public.website_settings
for each row execute function public.set_updated_at();

create or replace trigger trg_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create or replace trigger trg_consultations_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

create or replace trigger trg_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

create or replace trigger trg_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create or replace trigger trg_media_files_updated_at
before update on public.media_files
for each row execute function public.set_updated_at();

create or replace trigger trg_faq_updated_at
before update on public.faq
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;
alter table public.services enable row level security;
alter table public.gallery enable row level security;
alter table public.homepage_content enable row level security;
alter table public.about_content enable row level security;
alter table public.website_settings enable row level security;
alter table public.appointments enable row level security;
alter table public.consultations enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contacts enable row level security;
alter table public.media_files enable row level security;
alter table public.faq enable row level security;

create policy "Public read article categories" on public.article_categories
for select using (true);

create policy "Public read published articles" on public.articles
for select using (published = true and deleted_at is null);

create policy "Public read services" on public.services
for select using (deleted_at is null);

create policy "Public read gallery" on public.gallery
for select using (published = true and deleted_at is null);

create policy "Public read homepage_content" on public.homepage_content
for select using (true);

create policy "Public read about_content" on public.about_content
for select using (true);

create policy "Public read website_settings" on public.website_settings
for select using (true);

create policy "Public read faq" on public.faq
for select using (deleted_at is null);

create policy "Admin can manage profiles" on public.profiles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage article_categories" on public.article_categories
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage articles" on public.articles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage services" on public.services
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage gallery" on public.gallery
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage homepage_content" on public.homepage_content
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage about_content" on public.about_content
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage website_settings" on public.website_settings
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage media metadata" on public.media_files
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin can manage faq" on public.faq
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can submit appointments" on public.appointments
for insert with check (true);

create policy "Admin can view appointments" on public.appointments
for select using (public.is_admin());

create policy "Admin can update appointments" on public.appointments
for update using (public.is_admin()) with check (public.is_admin());

create policy "Admin can delete appointments" on public.appointments
for delete using (public.is_admin());

create policy "Public can submit consultations" on public.consultations
for insert with check (true);

create policy "Admin can view consultations" on public.consultations
for select using (public.is_admin());

create policy "Admin can update consultations" on public.consultations
for update using (public.is_admin()) with check (public.is_admin());

create policy "Admin can delete consultations" on public.consultations
for delete using (public.is_admin());

create policy "Public can subscribe to newsletter" on public.newsletter_subscribers
for insert with check (true);

create policy "Admin can view newsletter subscribers" on public.newsletter_subscribers
for select using (public.is_admin());

create policy "Admin can update newsletter subscribers" on public.newsletter_subscribers
for update using (public.is_admin()) with check (public.is_admin());

create policy "Admin can delete newsletter subscribers" on public.newsletter_subscribers
for delete using (public.is_admin());

create policy "Public can submit contacts" on public.contacts
for insert with check (true);

create policy "Admin can view contacts" on public.contacts
for select using (public.is_admin());

create policy "Admin can update contacts" on public.contacts
for update using (public.is_admin()) with check (public.is_admin());

create policy "Admin can delete contacts" on public.contacts
for delete using (public.is_admin());

create policy "Public read media metadata" on public.media_files
for select using (true);

-- note: bucket creation happens in supabase/storage.sql
