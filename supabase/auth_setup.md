# Supabase Authentication and Storage Setup

This guide explains how to configure the project for a production Supabase deployment that remains compatible with Cloudflare Pages and GitHub.

## 1. Create the admin user

In the Supabase Dashboard:

1. Open Authentication > Users.
2. Click Add user.
3. Create the admin account using the email you want to use for the site admin.
4. Set a secure password.
5. Confirm the user is enabled.

Recommended production admin email:

- sojirin.solomon@yahoo.com

Do not commit the password into the repository.

## 2. Assign the admin role

After the admin user exists:

1. Open SQL Editor.
2. Run the following SQL to link the user to the profiles table and mark them as an admin:

```sql
insert into public.profiles (id, role, full_name, is_admin)
select id, 'admin', 'Dott.ssa Felaco Admin', true
from auth.users
where email = 'sojirin.solomon@yahoo.com'
on conflict (id) do update
set role = 'admin', full_name = 'Dott.ssa Felaco Admin', is_admin = true;
```

If the user already exists in profiles, update the row instead of inserting.

## 3. Configure Authentication

In Supabase Dashboard > Authentication > Providers:

- Enable Email provider.
- Keep Email Auth enabled for password sign-in.
- Set redirect URLs for local development and production as needed.
- Use the built-in Supabase email/password flow with the frontend anon key.

Recommended auth settings:

- Email/password enabled
- Session persistence enabled
- Auto refresh enabled
- No service role key exposed to the frontend

## 4. Configure Storage

In Supabase Dashboard > Storage:

1. Create the public buckets:
   - media
   - gallery
   - logos
   - banners
   - documents
2. Set each bucket to public if the asset should be viewable without authentication.
3. Apply the policies from `supabase/storage.sql`.

Important:

- Use the public/anon key in the frontend only.
- Keep the service_role key in the server-side environment only.
- Never expose service_role in any client-side environment variable.

## 5. Configure Environment Variables

Set these variables in the frontend environment for local development, Cloudflare Pages, and GitHub deployment:

```env
REACT_APP_SUPABASE_URL=https://<project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon-public-key>
REACT_APP_SUPABASE_STORAGE_BUCKET=media
```

For production deployment:

- Add these variables in Cloudflare Pages environment settings.
- Add them to the GitHub actions or deployment environment as needed.
- Do not add the service_role key to the frontend or any public variables.

## 6. Recommended security rules

- Use `profiles.is_admin` to gate admin-only tables and storage operations.
- Keep all CMS writes behind RLS policies.
- Allow anonymous inserts only for public forms such as appointments, consultations, contacts, and newsletter subscriptions.
- Keep public content readable and admin-only content protected.

## 7. Post-setup verification checklist

- Admin user can sign in with Email/Password.
- `profiles.is_admin = true` is recognized by RLS policies.
- Public content can be read without login.
- Appointment, consultation, contact, and newsletter submissions succeed from the frontend.
- Uploads succeed to the `media` bucket and generate public URLs.
- Cloudflare Pages build uses only the public env variables.
