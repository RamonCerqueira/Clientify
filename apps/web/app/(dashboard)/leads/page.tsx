'use client';

import { useEffect, useState } from 'react';
import { getAuthSession } from '@/hooks/useAuth';
import { leadService } from '@/services/leadService';
import { pageService } from '@/services/pageService';
import { Lead, Page } from '@/types';

export default function LeadsDashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;

    pageService.list(session.accessToken).then((items) => {
      setPages(items);
      if (items[0]) setSelectedPage(items[0].id);
    });
  }, []);

  useEffect(() => {
    const session = getAuthSession();
    if (!session || !selectedPage) return;

    leadService
      .listByPage(session.accessToken, selectedPage)
      .then(setLeads)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar leads'));
  }, [selectedPage]);

  return (
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <h1 className="text-xl font-bold text-ink">Leads</h1>
        <p className="text-sm text-slate-500">Selecione uma página e veja quem solicitou contato.</p>
      </div>
      <select value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)}>
        <option value="">Selecione uma página</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>{page.title}</option>
        ))}
      </select>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="space-y-4">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-ink">{lead.name}</h2>
                <p className="text-sm text-slate-600">{lead.phone}</p>
                <p className="text-sm text-slate-500">{lead.message}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <a className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white" href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                Abrir no WhatsApp
              </a>
            </div>
          </article>
        ))}
        {!leads.length && <p className="text-sm text-slate-500">Nenhum lead encontrado para a página selecionada.</p>}
      </div>
    </section>
  );
}
