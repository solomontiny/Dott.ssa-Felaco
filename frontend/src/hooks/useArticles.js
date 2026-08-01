import { useState } from 'react';
import { db } from '../lib/supabaseClient';

// Hook providing article CRUD operations via Supabase. These are opinionated helpers
// meant to be used by the admin pages once migration is performed.
export function useArticles() {
  const [loading, setLoading] = useState(false);

  const list = async ({ limit = 20, offset = 0, language = 'en', published_only = true } = {}) => {
    setLoading(true);
    const res = await db.articles.list({ limit, offset, language, published_only });
    setLoading(false);
    if (res.error) throw res.error;
    return res.data;
  };

  const get = async (id) => {
    setLoading(true);
    const res = await db.articles.get(id);
    setLoading(false);
    if (res.error) throw res.error;
    return res.data;
  };

  const create = async (payload) => {
    setLoading(true);
    const res = await db.articles.create(payload);
    setLoading(false);
    if (res.error) throw res.error;
    return res.data;
  };

  const update = async (id, payload) => {
    setLoading(true);
    const res = await db.articles.update(id, payload);
    setLoading(false);
    if (res.error) throw res.error;
    return res.data;
  };

  const remove = async (id) => {
    setLoading(true);
    const res = await db.articles.remove(id);
    setLoading(false);
    if (res.error) throw res.error;
    return res.data;
  };

  return { loading, list, get, create, update, remove };
}
