import { useEffect, useState } from 'react';
import { supabase, auth } from '../lib/supabaseClient';

// Lightweight auth hook that wraps Supabase auth. Does not replace existing login UI.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      setLoading(false);
    }

    init();

    const { data: listener } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      if (listener && listener.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    const res = await auth.signInWithEmail(email, password);
    setLoading(false);
    if (res.error) throw res.error;
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    const res = await auth.signOut();
    setUser(null);
    setLoading(false);
    return res;
  };

  return { user, loading, signIn, signOut };
}
