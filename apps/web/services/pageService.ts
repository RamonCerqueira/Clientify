import { Page } from '@/types';
import { apiFetch } from './api';

export const pageService = {
  list: (token: string) => apiFetch<Page[]>('/pages', undefined, token),
  getById: (token: string, id: string) => apiFetch<Page>(`/pages/id/${id}`, undefined, token),
  create: (
    token: string,
    input: { title?: string; description: string; businessType: string; whatsapp: string; isPublished?: boolean },
  ) =>
    apiFetch<Page>('/pages', {
      method: 'POST',
      body: JSON.stringify(input),
    }, token),
  update: (
    token: string,
    id: string,
    input: Partial<{ title: string; description: string; businessType: string; whatsapp: string; isPublished: boolean }>,
  ) =>
    apiFetch<Page>(`/pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }, token),
  remove: (token: string, id: string) => apiFetch<Page>(`/pages/${id}`, { method: 'DELETE' }, token),
  getPublic: (slug: string) => apiFetch<Page>(`/pages/${slug}`),
};
