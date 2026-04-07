const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const NORMALIZED_BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const API_URL = NORMALIZED_BASE_URL.endsWith('/api') ? NORMALIZED_BASE_URL : `${NORMALIZED_BASE_URL}/api`;

export class ApiError extends Error {
  status?: number;
}

export async function apiFetch<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    credentials: 'include',
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new ApiError(payload?.message?.message || payload?.message || 'Erro inesperado');
    error.status = response.status;
    throw error;
  }

  return payload.data as T;
}
