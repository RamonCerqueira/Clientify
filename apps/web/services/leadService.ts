import { Lead } from '@/types';
import { apiFetch } from './api';

export const leadService = {
  create: (input: { name: string; phone: string; message: string; pageId: string }) =>
    apiFetch<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  listByPage: (token: string, pageId: string) => apiFetch<Lead[]>(`/leads/page/${pageId}`, undefined, token),
};
