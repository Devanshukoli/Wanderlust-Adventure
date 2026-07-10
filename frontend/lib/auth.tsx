'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: { id?: string; email?: string };
};

type AuthContextValue = {
  session: AuthSession | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (redirectTo: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'wanderlust_auth_session';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function assertBackendConfig() {
  if (!backendUrl) {
    throw new Error('Backend auth is not configured. Set NEXT_PUBLIC_BACKEND_URL.');
  }
}

function normalizeSession(payload: any): AuthSession {
  if (!payload.access_token) {
    throw new Error('Authentication succeeded, but no session was returned. Please confirm your email if required, then sign in.');
  }

  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_at: payload.expires_at ?? (payload.expires_in ? Math.floor(Date.now() / 1000) + payload.expires_in : undefined),
    user: payload.user,
  };
}

function readStoredSession() {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (session.expires_at && session.expires_at * 1000 <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function storeSession(session: AuthSession | null) {
  if (typeof window === 'undefined') return;

  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

async function authRequest(path: string, body: Record<string, string>) {
  assertBackendConfig();

  const response = await fetch(`${backendUrl}/api/auth/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || 'Authentication failed.');
  }

  return normalizeSession(data);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token');

    if (accessToken) {
      const nextSession = normalizeSession({
        access_token: accessToken,
        refresh_token: hash.get('refresh_token') ?? undefined,
        expires_in: Number(hash.get('expires_in')) || undefined,
      });
      storeSession(nextSession);
      setSession(nextSession);
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } else {
      setSession(readStoredSession());
    }

    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isLoading,
    signInWithEmail: async (email, password) => {
      const nextSession = await authRequest('sign-in', { email, password });
      storeSession(nextSession);
      setSession(nextSession);
    },
    signUpWithEmail: async (email, password) => {
      const nextSession = await authRequest('sign-up', { email, password });
      storeSession(nextSession);
      setSession(nextSession);
    },
    signInWithGoogle: (redirectTo) => {
      assertBackendConfig();
      const url = new URL(`${backendUrl}/api/auth/google`);
      url.searchParams.set('redirect', redirectTo);
      window.location.assign(url.toString());
    },
    signOut: () => {
      storeSession(null);
      setSession(null);
    },
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
