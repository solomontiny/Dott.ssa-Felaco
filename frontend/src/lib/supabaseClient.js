// Supabase client wrapper for the frontend
// Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY from environment

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();
const STORAGE_BUCKET = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'media';

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const hasLikelyBrokenKey = Boolean(
  SUPABASE_ANON_KEY &&
    (
      SUPABASE_ANON_KEY.length < 40 ||
      (!SUPABASE_ANON_KEY.startsWith('sb_') && !SUPABASE_ANON_KEY.startsWith('sbp_'))
    )
);

if (!hasSupabaseConfig || hasLikelyBrokenKey) {
  // Do not throw here to avoid breaking dev builds; log a warning so developers know to set env vars.
  // The app will continue to use existing backend calls until integration is completed.
  // Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in frontend/.env for local dev.
  // Example values are in frontend/.env.example
  // eslint-disable-next-line no-console
  console.warn('Supabase client not fully configured: REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY is missing or malformed.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

function ensureSupabaseClient() {
  if (!hasSupabaseConfig || hasLikelyBrokenKey) {
    throw new Error('Supabase is not correctly configured. Replace the malformed REACT_APP_SUPABASE_ANON_KEY in frontend/.env with the project anon key from the Supabase dashboard.');
  }

  return supabase;
}

function toSlug(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function sanitizeArticlePayload(payload = {}) {
  const cleaned = { ...payload };

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined || cleaned[key] === null) {
      delete cleaned[key];
    }
  });

  if (typeof cleaned.tags === 'string') {
    cleaned.tags = cleaned.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(cleaned.tags)) {
    cleaned.tags = [];
  }

  if (!Array.isArray(cleaned.gallery_images)) {
    cleaned.gallery_images = [];
  }

  if (!cleaned.slug && cleaned.title) {
    cleaned.slug = `${toSlug(cleaned.title)}-${Date.now()}`;
  }

  if (!cleaned.status) {
    cleaned.status = cleaned.published ? 'published' : 'draft';
  }

  if (cleaned.featured_image === undefined && cleaned.image_url) {
    cleaned.featured_image = cleaned.image_url;
  }

  if (cleaned.image_url === undefined && cleaned.featured_image) {
    cleaned.image_url = cleaned.featured_image;
  }

  if (cleaned.published === undefined) {
    cleaned.published = cleaned.status === 'published';
  }

  return cleaned;
}

// Small helper utilities scoped for application needs (articles, media, appointments, newsletter)
export const auth = {
  async signInWithEmail(email, password) {
    const client = ensureSupabaseClient();
    return client.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    const client = ensureSupabaseClient();
    return client.auth.signOut();
  },
  getUser() {
    const client = ensureSupabaseClient();
    return client.auth.getUser();
  },
  getSession() {
    const client = ensureSupabaseClient();
    return client.auth.getSession();
  },
  onAuthStateChange(cb) {
    const client = ensureSupabaseClient();
    return client.auth.onAuthStateChange(cb);
  }
};

export const storage = {
  bucketName: STORAGE_BUCKET,
  uploadFile: async (bucketName = STORAGE_BUCKET, path, file, opts = {}) => {
    return supabase.storage.from(bucketName).upload(path, file, opts);
  },
  getPublicUrl: (bucketName = STORAGE_BUCKET, path) => {
    return supabase.storage.from(bucketName).getPublicUrl(path);
  },
  remove: async (bucketName = STORAGE_BUCKET, path) => {
    return supabase.storage.from(bucketName).remove([path]);
  }
};

export const db = {
  // Articles table operations - assumes a table named 'articles' exists in Supabase
  articles: {
    async list({ limit = 20, offset = 0, language = 'en', published_only = true } = {}) {
      let q = supabase.from('articles').select('*').order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      if (published_only) q = q.eq('published', true);
      if (language) q = q.eq('language', language);
      return q;
    },
    async get(id) {
      return supabase.from('articles').select('*').eq('id', id).single();
    },
    async create(payload) {
      const normalizedPayload = sanitizeArticlePayload(payload);
      return supabase.from('articles').insert(normalizedPayload).select();
    },
    async update(id, payload) {
      const normalizedPayload = sanitizeArticlePayload(payload);
      return supabase.from('articles').update(normalizedPayload).eq('id', id).select();
    },
    async remove(id) {
      return supabase.from('articles').delete().eq('id', id).select();
    }
  },

  // Additional collections can be added similarly: categories, appointments, newsletter_subscribers, settings...
};

export default supabase;
