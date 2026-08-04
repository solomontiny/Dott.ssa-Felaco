-- Keep legacy publication fields consistent and make all published content
-- readable by the public client.

update public.articles
set
  status = case when status = 'published' or published = true then 'published' else 'draft' end,
  published = (status = 'published') or published = true
where status = 'published' or published = true;

drop policy if exists "Public read published articles" on public.articles;

create policy "Public read published articles"
on public.articles
for select
using (
  (published = true or status = 'published')
  and deleted_at is null
);

create index if not exists idx_articles_publication_created
on public.articles (created_at desc)
where deleted_at is null and (published = true or status = 'published');
