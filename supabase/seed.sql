-- =============================================================
-- supabase/seed.sql
-- Default public website content seed data
-- =============================================================

insert into public.article_categories (id, name, slug, description, language)
values
  (gen_random_uuid(), 'Nutrizionista', 'nutrizionista', 'Articoli di nutrizione e benessere', 'it'),
  (gen_random_uuid(), 'Nutrition', 'nutrition', 'Nutrition and wellness articles', 'en'),
  (gen_random_uuid(), 'Educazione', 'educazione', 'Risorse educative', 'it')
on conflict (slug) do nothing;

insert into public.articles (
  id,
  title,
  slug,
  excerpt,
  content,
  language,
  category_id,
  tags,
  featured_image,
  gallery_images,
  featured,
  published,
  status,
  seo_title,
  seo_description,
  author,
  scheduled_at
)
values (
  gen_random_uuid(),
  'Collaborazione per prevenire e ridurre l obesità infantile',
  'collaborazione-prevenire-ridurre-obesita-infantile',
  'Uno sguardo pratico su prevenzione, famiglie e scuola.',
  '<h2>Prevenzione e collaborazione</h2><p>Per ridurre l obesità infantile occorre collaborazione tra famiglie, scuole e professionisti della salute.</p>',
  'it',
  (select id from public.article_categories where slug = 'nutrizionista' limit 1),
  array['prevenzione', 'famiglia', 'scuola'],
  'https://images.unsplash.com/photo-1566895733044-d2bdda8b6234?w=1200&h=800&fit=crop',
  array['https://images.unsplash.com/photo-1566895733044-d2bdda8b6234?w=900&h=600&fit=crop'],
  true,
  true,
  'published',
  'Collaborazione per prevenire e ridurre l obesità infantile',
  'Articolo di supporto sulla prevenzione dell obesità infantile e sulla collaborazione tra famiglie e professionisti.',
  'Dott.ssa Felaco Giuseppina',
  now()
),
(
  gen_random_uuid(),
  'Why prevention matters in everyday nutrition',
  'why-prevention-matters-in-everyday-nutrition',
  'A practical article about sustainable wellness habits.',
  '<h2>Prevention starts with daily habits</h2><p>Consistent routines, mindful eating, and education are the foundation of long-term wellness.</p>',
  'en',
  (select id from public.article_categories where slug = 'nutrition' limit 1),
  array['wellness', 'prevention', 'habits'],
  'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&h=800&fit=crop',
  array['https://images.unsplash.com/photo-1543362906-acfc16c67564?w=900&h=600&fit=crop'],
  false,
  true,
  'published',
  'Why prevention matters in everyday nutrition',
  'A concise English-language article about sustainable nutrition habits and prevention.',
  'Dott.ssa Felaco Giuseppina',
  now()
);

insert into public.services (id, title, slug, description, content, image_url, order_index, featured, language)
values
  (gen_random_uuid(), 'Training educativo alimentare', 'training-educativo-alimentare', 'Cambiare attraverso la conoscenza del cibo', '{"highlight": "Conoscenza e consapevolezza"}', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', 1, true, 'it'),
  (gen_random_uuid(), 'Emotional nutrition support', 'emotional-nutrition-support', 'Supportive guidance for mindful and sustainable change', '{"highlight": "Mindful routines"}', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', 2, false, 'en');

insert into public.gallery (id, title, description, media_ids, published)
values
  (gen_random_uuid(), 'Studio e benessere', 'Immagini del servizio di nutrizione e supporto', array[]::uuid[], true);

insert into public.homepage_content (id, section_key, content, language)
values
  (gen_random_uuid(), 'hero', '{"headline": "Benvenuti nel mio mondo", "subheadline": "Biologa nutrizionista dedicata al benessere psico-fisico", "primaryButton": "Scopri il mio metodo", "secondaryButton": "Chi sono", "backgroundImage": "https://images.unsplash.com/photo-1757332334664-83bff99e7a43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwzfHxudXRyaXRpb24lMjB2ZWdldGFibGVzfGVufDB8fHx8MTc3MDExNjk4N3ww&ixlib=rb-4.1.0&q=85"}', 'it'),
  (gen_random_uuid(), 'testimonials', '{"items": [{"name": "Cliente", "quote": "Un percorso chiaro, attento e concreto."}]}', 'it');

insert into public.about_content (id, section_key, content, language)
values
  (gen_random_uuid(), 'bio', '{"title": "Dott.ssa Felaco Giuseppina", "summary": "Biologa nutrizionista, educatrice e ricercatrice nel campo del benessere olistico.", "paragraphs": ["Sono la dott.ssa Felaco Giuseppina, biologa nutrizionista.", "Aiuto le persone a costruire un benessere psico-fisico sostenibile."], "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=800&fit=crop"}', 'it');

insert into public.website_settings (id, key, value, description)
values
  (gen_random_uuid(), 'clinic_profile', '{"clinic_name": "Dott.ssa Felaco Giuseppina", "email": "dott.giuseppinafelaco@gmail.com", "phone": "+39 345 050 3440", "address": "Italia", "google_maps_url": "https://maps.google.com", "logo_url": "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=120&fit=crop", "favicon_url": "https://images.unsplash.com/photo-1547592180-85f173990554?w=64&h=64&fit=crop"}', 'Clinic contact and branding settings'),
  (gen_random_uuid(), 'seo_defaults', '{"site_name": "Dott.ssa Felaco", "seo_title": "Dott.ssa Felaco | Biologa nutrizionista", "seo_description": "Servizi di nutrizione, benessere e consulenza personale.", "default_language": "it"}', 'Default SEO configuration');

insert into public.faq (id, question, answer, order_index, language)
values
  (gen_random_uuid(), 'Come prenotare una consulenza?', 'Puoi utilizzare il form di contatto o il modulo di prenotazione del sito.', 1, 'it'),
  (gen_random_uuid(), 'What happens during the first consultation?', 'We start with a gentle assessment of your goals and daily routines.', 1, 'en');
