import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '../lib/supabaseClient';

// Hook providing article CRUD operations via Supabase. These are opinionated helpers
// meant to be used by the admin pages once migration is performed.
export function useArticles() {
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const list = useCallback(async ({ limit = 20, offset = 0, language = 'en', published_only = true } = {}) => {
    if (mountedRef.current) setLoading(true);

    try {
      const res = await db.articles.list({ limit, offset, language, published_only });
      if (res.error) throw res.error;
      return res.data;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const get = useCallback(async (id) => {
    if (mountedRef.current) setLoading(true);

    try {
      const res = await db.articles.get(id);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    if (mountedRef.current) setLoading(true);

    try {
      const res = await db.articles.create(payload);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, payload) => {
    if (mountedRef.current) setLoading(true);

    try {
      const res = await db.articles.update(id, payload);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    if (mountedRef.current) setLoading(true);

    try {
      const res = await db.articles.remove(id);
      if (res.error) throw res.error;
      return res.data;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  return { loading, list, get, create, update, remove };
}
