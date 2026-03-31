import { AuthResponse, AuthUser } from '@/types';
import { apiFetch } from './api';

export const authService = {
  login: (input: { email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  register: (input: { name: string; email: string; password: string; tenantName: string }) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  refresh: (refreshToken: string) =>
    apiFetch<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  me: (token: string) => apiFetch<AuthUser>('/auth/me', undefined, token),
  logout: (token: string) => apiFetch<{ success: boolean }>('/auth/logout', { method: 'POST' }, token),
};
