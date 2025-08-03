// hooks/useUserSession.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

export interface UserSession {
  id: string;
  email: string | null;
  role: string | null;
}

export function useUserSession() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        if (mounted) setError(sessionError.message);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        if (mounted) {
          setUserSession(null);
          setLoading(false);
        }
        return;
      }

      const authUser = session.user;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('auth_id', authUser.id)
        .single();

      if (userError) {
        if (mounted) {
          setError(userError.message);
          setUserSession({ id: authUser.id, email: authUser.email, role: null });
        }
      } else {
        if (mounted) {
          setUserSession({ id: authUser.id, email: authUser.email, role: userData?.role ?? null });
        }
      }

      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { userSession, loading, error };
}
