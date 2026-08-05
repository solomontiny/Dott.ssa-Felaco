-- =============================================================
-- 004_homepage_management.sql
-- Enhancements for homepage content management and section reordering
-- =============================================================

-- Add management columns to homepage_content
alter table public.homepage_content 
add column if not exists is_active boolean not null default true,
add column if not exists order_index integer not null default 0,
add column if not exists description text;

-- Ensure RLS is enabled and policies are correct
alter table public.homepage_content enable row level security;

drop policy if exists "Public read homepage_content" on public.homepage_content;
create policy "Public read homepage_content"
on public.homepage_content
for select
using (is_active = true and deleted_at is null);

drop policy if exists "Admin can manage homepage_content" on public.homepage_content;
create policy "Admin can manage homepage_content"
on public.homepage_content
for all
using (public.is_admin())
with check (public.is_admin());

-- Seed initial sections based on the current website structure
-- We use a function to avoid duplicates if the migration is re-run
do $$
begin
  insert into public.homepage_content (section_key, order_index, content, language)
  values 
    ('hero', 10, '{"title": "CIBO VERO. EQUILIBRIO VERO.", "titleHighlight": "RISULTATI VERI.", "subtitle": "BIOLOGA NUTRIZIONISTA", "description": "Aiuto le persone a creare abitudini alimentari sane e sostenibili che si adattano al loro stile di vita — senza stress, sensi di colpa o diete estreme.", "cta1": "Scopri il mio metodo", "cta2": "Chi sono", "image_url": "https://customer-assets.emergentagent.com/job_80398c3c-4f8a-434b-b923-133758dd4592/artifacts/fhkv7are_43f0764f-4653-4733-9f19-e168d39d573d.jpeg"}'::jsonb, 'it'),
    ('three_focus', 20, '{"sectionTitle": "Il mio approccio", "mainTitle": "Tre focus principali"}'::jsonb, 'it'),
    ('about', 30, '{"label": "CHI SONO", "title": "Dott.ssa Felaco", "titleHighlight": "Giuseppina", "intro": "Sono la dott.ssa Felaco Giuseppina,", "text1": "biologa nutrizionista, curiosa ricercatrice in ambito alimentare e della natura.", "text2": "Insegno sostegno in una scuola secondaria di primo grado, sono un''amante spassionata per il metodo educativo didattico.", "text3": "Dono con amore e piacere strumenti metodologici ai miei studenti, al fine di poter dar loro degli input, che possano servir loro a migliorare la crescita con semplicità e serenità.", "text4": "Il mio modus operandi è quello di aiutare le persone a costruire il proprio benessere psico-fisico, ed è per questo che mi occupo di prevenzione e divulgazione rivolta al prossimo.", "quote1": "La salute vien dalla conoscenza ed il sapere viene da una guida esterna.", "quote2": "Noi siamo ciò che mangiamo, diciamo e facciamo!"}'::jsonb, 'it'),
    ('philosophy', 40, '{}'::jsonb, 'it'),
    ('what_we_do', 50, '{"label": "I NOSTRI SERVIZI", "title": "Cosa Facciamo", "subtitle": "Offriamo terapia nutrizionale medica specializzata per una vasta gamma di condizioni di salute, con un approccio personalizzato e basato sull''evidenza scientifica.", "button": "Prenota Consulenza Gratuita"}'::jsonb, 'it'),
    ('qa', 60, '{}'::jsonb, 'it'),
    ('consultation', 70, '{"title": "Consulenza Nutrizionale Gratuita Online", "subtitle": "Inizia il tuo percorso verso il benessere con una valutazione professionale gratuita"}'::jsonb, 'it'),
    ('testimonials', 80, '{"title": "Cosa dicono i miei clienti", "subtitle": "Esperienze reali di trasformazione"}'::jsonb, 'it'),
    ('appointment', 90, '{"title": "Prenota Appuntamento", "subtitle": "Scegli data, ora e tipo di consulenza"}'::jsonb, 'it'),
    ('blog', 100, '{"label": "BLOG", "title": "Ultimi articoli"}'::jsonb, 'it'),
    ('contact', 110, '{"label": "CONTATTI", "title": "Mettiti in Contatto", "subtitle": "Siamo qui per rispondere alle tue domande"}'::jsonb, 'it'),
    ('final_cta', 120, '{"label": "Non aspettare", "title": "Non esitare a sceglierti oggi", "subtitle": "Perché domani non sarà prevenzione, ma cura!", "primary": "Contattami ora", "secondary": "Scopri di più"}'::jsonb, 'it')
  on conflict (section_key) do nothing;
end $$;
