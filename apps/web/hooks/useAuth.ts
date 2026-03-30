'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { ApiError } from '@/services/api';
import { AuthResponse } from '@/types';

const STORAGE_KEY = 'clientify.auth';

export function saveAuthSession(data: AuthResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.cookie = `clientify-token=${data.accessToken}; path=/; max-age=900; samesite=lax`;
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = 'clientify-token=; path=/; max-age=0; samesite=lax';
}

export function getAuthSession(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthResponse) : null;
}

export async function getValidAccessToken(): Promise<string | null> {
  const session = getAuthSession();
  if (!session) return null;

  try {
    const me = await authService.me(session.accessToken);
    saveAuthSession({ ...session, user: { ...session.user, ...me } });
    return session.accessToken;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        const refreshed = await authService.refresh(session.refreshToken);
        saveAuthSession(refreshed);
        return refreshed.accessToken;
      } catch {
        clearAuthSession();
        return null;
      }
    }
    throw error;
  }
}

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<AuthResponse | null>(null);

  useEffect(() => {
    setSession(getAuthSession());
  }, []);

  const logout = async () => {
    const current = getAuthSession();
    if (current) {
      await authService.logout(current.accessToken).catch(() => undefined);
    }
    clearAuthSession();
    setSession(null);
    router.push('/login');
  };

  return { session, logout };
}
