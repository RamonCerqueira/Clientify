'use client';

import { useEffect, useState } from 'react';
import { PageForm } from '@/components/forms/page-form';
import { getAuthSession } from '@/hooks/useAuth';
import { pageService } from '@/services/pageService';
import { Page } from '@/types';

export default function PagesDashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;

    pageService
      .list(session.accessToken)
      .then(setPages)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar páginas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <PageForm onCreated={(page) => setPages((current) => [page, ...current])} />
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Minhas páginas</h1>
            <p className="text-sm text-slate-500">Gerencie suas landing pages de captura.</p>
          </div>
        </div>
        {loading && <p className="text-sm text-slate-500">Carregando páginas...</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          {pages.map((page) => (
            <article key={page.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold text-ink">{page.title}</h2>
                  <p className="text-sm text-slate-600">{page.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">/{page.slug}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">{page._count?.leads ?? 0} leads</span>
              </div>
            </article>
          ))}
          {!loading && !pages.length && <p className="text-sm text-slate-500">Nenhuma página criada ainda.</p>}
        </div>
      </section>
    </div>
  );
}
