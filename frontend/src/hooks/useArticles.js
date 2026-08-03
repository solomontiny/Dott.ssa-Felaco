import { useCallback, useState } from 'react';
import { db } from '../lib/supabaseClient';

// Hook providing article CRUD operations via Supabase. These are opinionated helpers
// meant to be used by the admin pages once migration is performed.
export function useArticles() {
  const [loading, setLoading] = useState(false);

  const list = useCallback(async ({ limit = 20, offset = 0, language = 'en', published_only = true } = {}) => {
    setLoading(true);

    try {
      const res = await db.articles.list({ limit, offset, language, published_only });
      if (res.error) throw res.error;
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (id) => {
    setLoading(true);

    try {
      const res = await db.articles.get(id);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    setLoading(true);

    try {
      const res = await db.articles.create(payload);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, payload) => {
    setLoading(true);

    try {
      const res = await db.articles.update(id, payload);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);

    try {
      const res = await db.articles.remove(id);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, list, get, create, update, remove };
}
