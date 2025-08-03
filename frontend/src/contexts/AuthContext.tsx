'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  accessToken: string | null;
  role: string | null;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userEmail: null,
  accessToken: null,
  role: null,
  isLoaded: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getSessionInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
      setAccessToken(session?.access_token ?? null);
      setRole(session?.user?.user_metadata?.role ?? null); // Nếu role lưu ở user_metadata
      setIsLoaded(true);
    };
    getSessionInfo();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
      setAccessToken(session?.access_token ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      setIsLoaded(true);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, userEmail, accessToken, role, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
