# Final Deployment Guide

This repository is now prepared for a Supabase-backed frontend deployment. The UI stays unchanged and the project remains compatible with Cloudflare Pages and GitHub.

## 1. Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run the contents of `supabase/migrations/001_initial.sql`.
4. Run the contents of `supabase/storage.sql`.
5. Run the contents of `supabase/seed.sql`.
6. Open Storage and verify the buckets exist:
   - media
   - gallery
   - logos
   - banners
   - documents

## 2. Authentication setup

1. Open Authentication > Users.
2. Create or confirm the admin user.
3. Use the admin email you want for login.
4. In SQL Editor, assign the admin profile row:

```sql
insert into public.profiles (id, role, full_name, is_admin)
select id, 'admin', 'Dott.ssa Felaco Admin', true
from auth.users
where email = 'sojirin.solomon@yahoo.com'
on conflict (id) do update
set role = 'admin', full_name = 'Dott.ssa Felaco Admin', is_admin = true;
```

5. Confirm Email/Password authentication is enabled in Authentication > Providers.

## 3. Storage setup

1. Open Storage.
2. Create the public buckets listed above.
3. Apply the object policies from `supabase/storage.sql`.
4. Upload the site logo, banners, gallery media, and any required documents.

## 4. Environment variables

Set these in the frontend environment for local development, Cloudflare Pages, and GitHub deployment:

```env
REACT_APP_SUPABASE_URL=https://<project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon-public-key>
REACT_APP_SUPABASE_STORAGE_BUCKET=media
```

Do not expose the Supabase service role key in the frontend.

## 5. Cloudflare Pages deployment

1. Sign in to Cloudflare Pages.
2. Import the GitHub repository.
3. Use the existing frontend build configuration.
4. Add the environment variables above under Pages environment variables.
5. Trigger a production deployment.
6. Verify the public site and admin login route work.

## 6. GitHub deployment

1. Push the repository to GitHub.
2. Confirm the workflow/build uses the frontend output only.
3. Ensure the environment variables above are present in the deployment environment.
4. Deploy or verify the production branch.

## 7. Admin login instructions

1. Open the admin login route.
2. Sign in with the admin email/password configured in Supabase Auth.
3. The frontend should redirect to the admin dashboard after authentication.
4. The admin role is granted through the `profiles.is_admin` row.

## 8. Troubleshooting

### Login fails
- Confirm Email/Password provider is enabled.
- Confirm the user exists in `auth.users`.
- Confirm `public.profiles.is_admin = true` for the admin user.

### Uploads fail
- Confirm the `media` bucket exists and is public.
- Confirm the upload policy is enabled.
- Confirm `REACT_APP_SUPABASE_STORAGE_BUCKET=media` is set.

### Dashboard shows no data
- Confirm the migration ran successfully.
- Confirm the `articles` table has rows.
- Confirm `profiles.is_admin` is set correctly for the signed-in admin.

### Public pages are blank
- Confirm `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are correct.
- Confirm the public read policies are enabled.
- Confirm sample content was seeded.

## 9. Production readiness checklist

- Supabase project created
- SQL migration applied
- Storage buckets created
- Seed data applied
- Auth admin user created
- Admin profile row assigned
- Frontend environment variables configured
- Cloudflare Pages build configured
- GitHub deployment configured
