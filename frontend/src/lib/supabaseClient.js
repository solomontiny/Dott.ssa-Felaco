// Supabase client wrapper for the frontend
// Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY from environment

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Do not throw here to avoid breaking dev builds; log a warning so developers know to set env vars.
  // The app will continue to use existing backend calls until integration is completed.
  // Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in frontend/.env for local dev.
  // Example values are in frontend/.env.example
  // eslint-disable-next-line no-console
  console.warn('Supabase client not fully configured: REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY is missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Small helper utilities scoped for application needs (articles, media, appointments, newsletter)
export const auth = {
  async signInWithEmail(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  getUser() {
    return supabase.auth.getUser();
  },
  onAuthStateChange(cb) {
    return supabase.auth.onAuthStateChange(cb);
  }
};

export const storage = {
  // bucketName is expected to be created in Supabase (e.g., 'media')
  uploadFile: async (bucketName, path, file, opts = {}) => {
    return supabase.storage.from(bucketName).upload(path, file, opts);
  },
  getPublicUrl: (bucketName, path) => {
    return supabase.storage.from(bucketName).getPublicUrl(path);
  },
  remove: async (bucketName, path) => {
    return supabase.storage.from(bucketName).remove([path]);
  }
};

export const db = {
  // Articles table operations - assumes a table named 'articles' exists in Supabase
  articles: {
    async list({ limit = 20, offset = 0, language = 'it', published_only = true } = {}) {
      let q = supabase.from('articles').select('*').order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      if (published_only) q = q.eq('published', true);
      if (language) q = q.eq('language', language);
      return q;
    },
    async get(id) {
      return supabase.from('articles').select('*').eq('id', id).single();
    },
    async create(payload) {
      return supabase.from('articles').insert(payload).select();
    },
    async update(id, payload) {
      return supabase.from('articles').update(payload).eq('id', id).select();
    },
    async remove(id) {
      return supabase.from('articles').delete().eq('id', id).select();
    }
  },

  // Additional collections can be added similarly: categories, appointments, newsletter_subscribers, settings...
};

export default supabase;
