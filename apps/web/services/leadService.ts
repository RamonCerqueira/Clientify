import { Lead, LeadStatus, Paginated } from '@/types';
import { apiFetch } from './api';

export const leadService = {
  create: (input: { name: string; phone: string; message: string; pageId: string; source?: string }) =>
    apiFetch<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  listByPage: (token: string, pageId: string, status?: LeadStatus | 'ALL', page = 1, pageSize = 20) =>
    apiFetch<Paginated<Lead>>(
      `/leads/page/${pageId}?page=${page}&pageSize=${pageSize}${status && status !== 'ALL' ? `&status=${status}` : ''}`,
      undefined,
      token,
    ),
  updateStatus: (token: string, leadId: string, status: LeadStatus) =>
    apiFetch<Lead>(
      `/leads/${leadId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      token,
    ),
};
