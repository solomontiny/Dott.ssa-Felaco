import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../lib/supabaseClient';

const AuthContext = createContext(null);

// Keep one session-restoration request and one auth listener for the whole app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: listener } = auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    async function init() {
      try {
        // getSession restores the locally persisted session without making a
        // network user-validation request on every route mount.
        const { data, error } = await auth.getSession();
        if (!mounted) return;

        if (error) {
          console.warn('Supabase session initialization warning:', error.message);
        }

        setUser(data?.session?.user ?? null);
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

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);

    try {
      auth.setRememberMe(rememberMe);
      const res = await auth.signInWithEmail(email, password);

      if (res.error) {
        throw res.error;
      }

      // signInWithPassword already returns the authenticated user. Avoid a
      // second getUser() request while the auth event is being delivered.
      setUser(res.data?.user ?? res.data?.session?.user ?? null);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      const res = await auth.signOut();
      setUser(null);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
