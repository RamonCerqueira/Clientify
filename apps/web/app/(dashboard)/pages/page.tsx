'use client';

import { useEffect, useState } from 'react';
import { PageForm } from '@/components/forms/page-form';
import { getValidAccessToken } from '@/hooks/useAuth';
import { pageService } from '@/services/pageService';
import { Page, PaginationMeta } from '@/types';

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
};

export default function PagesDashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);

  async function loadPages(page = 1) {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoading(true);
    pageService
      .list(token, page)
      .then((result) => {
        setPages(result.items);
        setPagination(result.pagination);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Falha ao carregar páginas'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void loadPages(1);
  }, []);

  async function handleDelete(id: string) {
    const token = await getValidAccessToken();
    if (!token) return;
    if (!window.confirm('Deseja realmente remover esta página?')) return;

    await pageService.remove(token, id);
    await loadPages(pagination.page);
    if (editingPage?.id === id) setEditingPage(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
      <PageForm
        editingPage={editingPage}
        onCancelEdit={() => setEditingPage(null)}
        onCreated={() => void loadPages(1)}
        onUpdated={(updated) => {
          setPages((current) => current.map((page) => (page.id === updated.id ? updated : page)));
          setEditingPage(null);
        }}
      />

      <section className="panel p-6">
        <h1 className="text-xl font-bold text-white">Minhas páginas</h1>
        <p className="mb-5 text-sm text-slate-300">Crie, edite e publique experiências de captação com identidade visual premium.</p>

        {loading && <p className="text-sm text-slate-300">Carregando páginas...</p>}
        {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        <div className="space-y-4">
          {pages.map((page) => (
            <article key={page.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-white">{page.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${page.isPublished ? 'bg-emerald-400/20 text-emerald-200' : 'bg-amber-400/20 text-amber-200'}`}>
                      {page.isPublished ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{page.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">/{page.slug} · {page.layoutStyle}</p>
                </div>
                <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {page._count?.leads ?? 0} leads
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white" onClick={() => setEditingPage(page)} type="button">
                  Editar
                </button>
                <a className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white" href={`/p/${page.slug}`} target="_blank" rel="noreferrer">
                  Abrir página
                </a>
                <button className="rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200" onClick={() => void handleDelete(page.id)} type="button">
                  Excluir
                </button>
              </div>
            </article>
          ))}

          {!loading && !pages.length && <p className="text-sm text-slate-300">Nenhuma página criada ainda.</p>}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
          <p>
            Página {pagination.page} de {Math.max(pagination.totalPages, 1)} · {pagination.total} registros
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              onClick={() => void loadPages(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
            >
              Anterior
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 disabled:opacity-50"
              onClick={() => void loadPages(Math.min(Math.max(1, pagination.totalPages), pagination.page + 1))}
              disabled={pagination.page >= Math.max(1, pagination.totalPages)}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
