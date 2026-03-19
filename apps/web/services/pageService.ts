import { Page } from '@/types';
import { apiFetch } from './api';

export const pageService = {
  list: (token: string) => apiFetch<Page[]>('/pages', undefined, token),
  create: (
    token: string,
    input: { title?: string; description: string; businessType: string; whatsapp: string },
  ) =>
    apiFetch<Page>('/pages', {
      method: 'POST',
      body: JSON.stringify(input),
    }, token),
  getPublic: (slug: string) => apiFetch<Page>(`/pages/${slug}`),
};
