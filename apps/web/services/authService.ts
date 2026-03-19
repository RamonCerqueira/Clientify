import { AuthResponse } from '@/types';
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
};
