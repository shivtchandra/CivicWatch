// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, me as apiMe } from "@/lib/api";
import { getAuthToken, saveAuthToken, clearAuthToken } from "@/lib/auth";

type Profile = {
  id?: number | string;
  name?: string;
  email?: string;
  city?: string | null;
  [k: string]: any;
};

type SupabaseLikeResp<T = any> = { data: T | null; error: { message: string } | null };

type AuthContextType = {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SupabaseLikeResp<any>>;
  signUp: (email: string, password: string, name?: string) => Promise<SupabaseLikeResp<any>>;
  logout: () => void;
  refreshProfile: () => Promise<Profile | null>;
};

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  signIn: async () => ({ data: null, error: { message: "not-implemented" } }),
  signUp: async () => ({ data: null, error: { message: "not-implemented" } }),
  logout: () => {},
  refreshProfile: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Refresh profile from backend. Ensures loading true while fetching.
  const refreshProfile = async (): Promise<Profile | null> => {
    setLoading(true);
    try {
      const res = await apiMe();
      const user = res && (res as any).user ? (res as any).user : null;
      setProfile(user ? (user as Profile) : null);
      // debug log (remove in production)
      console.debug("[AuthContext] refreshProfile ->", user);
      return user ? (user as Profile) : null;
    } catch (err) {
      clearAuthToken();
      setProfile(null);
      console.error("[AuthContext] refreshProfile error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // On mount, try to load existing token -> profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = getAuthToken();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        await refreshProfile();
      } catch (e) {
        // handled in refreshProfile
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // signIn (Supabase-like return)
  const signIn = async (email: string, password: string): Promise<SupabaseLikeResp<any>> => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      if (!res || !res.token) {
        return { data: null, error: { message: "No token returned from server" } };
      }
      // store token then refresh profile
      saveAuthToken((res as any).token);
      const user = await refreshProfile();
      return { data: { user: user ?? (res as any).user ?? null, token: (res as any).token }, error: null };
    } catch (err: any) {
      console.error("[AuthContext] signIn error:", err);
      return { data: null, error: { message: err?.message ?? "Login failed" } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<SupabaseLikeResp<any>> => {
    setLoading(true);
    try {
      const res = await apiRegister({ email, password, name });
      if (!res || !res.token) {
        return { data: null, error: { message: "No token returned from server" } };
      }
      saveAuthToken((res as any).token);
      const user = await refreshProfile();
      return { data: { user: user ?? (res as any).user ?? null, token: (res as any).token }, error: null };
    } catch (err: any) {
      console.error("[AuthContext] signUp error:", err);
      return { data: null, error: { message: err?.message ?? "Registration failed" } };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setProfile(null);
    // no navigation here — UI can redirect if desired
  };

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signUp, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
