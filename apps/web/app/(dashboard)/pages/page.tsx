'use client';

import { useEffect, useState } from 'react';
import { PageForm } from '@/components/forms/page-form';
import { getValidAccessToken } from '@/hooks/useAuth';
import { pageService } from '@/services/pageService';
import { Page } from '@/types';

export default function PagesDashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  async function loadPages() {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoading(true);
    pageService
      .list(token)
      .then(setPages)
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar páginas'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void loadPages();
  }, []);

  async function handleDelete(id: string) {
    const token = await getValidAccessToken();
    if (!token) return;
    if (!window.confirm('Deseja realmente remover esta página?')) return;

    await pageService.remove(token, id);
    setPages((current) => current.filter((page) => page.id !== id));
    if (editingPage?.id === id) setEditingPage(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <PageForm
        editingPage={editingPage}
        onCancelEdit={() => setEditingPage(null)}
        onCreated={(page) => setPages((current) => [page, ...current])}
        onUpdated={(updated) => {
          setPages((current) => current.map((page) => (page.id === updated.id ? updated : page)));
          setEditingPage(null);
        }}
      />
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Minhas páginas</h1>
            <p className="text-sm text-slate-500">Gerencie suas landing pages, publique ou edite em poucos cliques.</p>
          </div>
        </div>
        {loading && <p className="text-sm text-slate-500">Carregando páginas...</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <div className="space-y-4">
          {pages.map((page) => (
            <article key={page.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-ink">{page.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {page.isPublished ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{page.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">/{page.slug}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">{page._count?.leads ?? 0} leads</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => setEditingPage(page)} type="button">Editar</button>
                <a className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700" href={`/p/${page.slug}`} target="_blank" rel="noreferrer">Abrir página</a>
                <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600" onClick={() => void handleDelete(page.id)} type="button">Excluir</button>
              </div>
            </article>
          ))}
          {!loading && !pages.length && <p className="text-sm text-slate-500">Nenhuma página criada ainda.</p>}
        </div>
      </section>
    </div>
  );
}
