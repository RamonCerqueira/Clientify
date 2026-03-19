'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthResponse } from '@/types';

const STORAGE_KEY = 'clientify.auth';

export function saveAuthSession(data: AuthResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  document.cookie = `clientify-token=${data.accessToken}; path=/; max-age=86400; samesite=lax`;
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

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<AuthResponse | null>(null);

  useEffect(() => {
    setSession(getAuthSession());
  }, []);

  const logout = () => {
    clearAuthSession();
    setSession(null);
    router.push('/login');
  };

  return { session, logout };
}
