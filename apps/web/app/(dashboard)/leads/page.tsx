'use client';

import { useEffect, useMemo, useState } from 'react';
import { getValidAccessToken } from '@/hooks/useAuth';
import { leadService } from '@/services/leadService';
import { pageService } from '@/services/pageService';
import { Lead, LeadStatus, Page } from '@/types';

const statuses: Array<LeadStatus | 'ALL'> = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

export default function LeadsDashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'ALL'>('ALL');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getValidAccessToken();
      if (!token) return;
      pageService.list(token).then((items) => {
        setPages(items);
        if (items[0]) setSelectedPage(items[0].id);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getValidAccessToken();
      if (!token || !selectedPage) return;

      leadService
        .listByPage(token, selectedPage, selectedStatus)
        .then(setLeads)
        .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar leads'));
    })();
  }, [selectedPage, selectedStatus]);

  const summary = useMemo(
    () => ({
      total: leads.length,
      won: leads.filter((lead) => lead.status === 'WON').length,
      qualified: leads.filter((lead) => lead.status === 'QUALIFIED').length,
    }),
    [leads],
  );

  async function updateStatus(leadId: string, status: LeadStatus) {
    const token = await getValidAccessToken();
    if (!token) return;

    const updated = await leadService.updateStatus(token, leadId, status);
    setLeads((current) => current.map((lead) => (lead.id === leadId ? updated : lead)));
  }

  return (
    <section className="panel space-y-5 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-300">Total</p><strong className="text-2xl text-white">{summary.total}</strong></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-300">Qualificados</p><strong className="text-2xl text-white">{summary.qualified}</strong></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-300">Ganhos</p><strong className="text-2xl text-white">{summary.won}</strong></div>
      </div>

      <div>
        <h1 className="text-xl font-bold text-white">Leads</h1>
        <p className="text-sm text-slate-300">Filtre por página e acompanhe a evolução do pipeline.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)}>
          <option value="">Selecione uma página</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title}
            </option>
          ))}
        </select>
        <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as LeadStatus | 'ALL')}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'Todos os status' : status}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      <div className="space-y-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-white">{lead.name}</h2>
                  <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200">{lead.status}</span>
                </div>
                <p className="text-sm text-slate-300">{lead.phone}</p>
                <p className="text-sm text-slate-400">{lead.message}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <a
                  className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
                  href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no WhatsApp
                </a>
                <select value={lead.status} onChange={(event) => void updateStatus(lead.id, event.target.value as LeadStatus)}>
                  {statuses
                    .filter((status) => status !== 'ALL')
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </article>
        ))}

        {!leads.length && <p className="text-sm text-slate-300">Nenhum lead encontrado para o filtro selecionado.</p>}
      </div>
    </section>
  );
}
