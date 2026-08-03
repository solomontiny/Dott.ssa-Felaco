import { useEffect, useState } from 'react';
import { auth } from '../lib/supabaseClient';

// Lightweight auth hook that wraps Supabase auth. Does not replace existing login UI.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = null;

    async function init() {
      try {
        const { data, error } = await auth.getUser();
        if (!mounted) return;

        if (error) {
          console.warn('Supabase session initialization warning:', error.message);
        }

        setUser(data?.user ?? null);
      } catch (error) {
        if (mounted) {
          console.warn('Unable to initialize Supabase auth:', error);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    init();

    const { data: listener } = auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    unsubscribe = listener?.subscription;

    return () => {
      mounted = false;
      unsubscribe?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);

    try {
      const res = await auth.signInWithEmail(email, password);

      if (res.error) {
        throw res.error;
      }

      const { data } = await auth.getUser();
      setUser(data?.user ?? null);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);

    try {
      const res = await auth.signOut();
      setUser(null);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn, signOut };
}
