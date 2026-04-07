'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Copy, LayoutTemplate, Plus, WandSparkles } from 'lucide-react';
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

  async function handleCopyLink(slug: string) {
    const link = `${window.location.origin}/p/${slug}`;
    await navigator.clipboard.writeText(link);
  }

  const summary = useMemo(
    () => ({
      totalPages: pagination.total,
      published: pages.filter((page) => page.isPublished).length,
      leads: pages.reduce((acc, page) => acc + (page._count?.leads ?? 0), 0),
    }),
    [pages, pagination.total],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
      <PageForm
        editingPage={editingPage}
        onCancelEdit={() => setEditingPage(null)}
        onCreated={() => void loadPages(1)}
        onUpdated={(updated) => {
          setPages((current) => current.map((page) => (page.id === updated.id ? updated : page)));
          setEditingPage(null);
        }}
      />

      <section className="panel p-6 md:p-7">
        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Páginas</p>
            <p className="mt-2 text-2xl font-semibold text-white">{summary.totalPages}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Publicadas</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{summary.published}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Leads captados</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">{summary.leads}</p>
          </article>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white">Biblioteca de landing pages</h1>
            <p className="text-sm text-slate-300">Estrutura otimizada para criação, publicação e iteração com foco em conversão.</p>
          </div>
          <button
            type="button"
            onClick={() => setEditingPage(null)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-100 hover:-translate-y-0.5 hover:bg-indigo-500/20"
          >
            <Plus size={16} />
            Nova página
          </button>
        </div>

        {error && <p className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="mt-2 h-3 w-full rounded bg-white/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
                <div className="mt-5 h-9 w-full rounded-xl bg-white/10" />
              </div>
            ))}

          {!loading &&
            pages.map((page) => (
              <article
                key={page.id}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_16px_45px_rgba(34,211,238,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-white">{page.title}</h2>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${page.isPublished ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-200'}`}>
                        {page.isPublished ? 'Publicada' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">{page.description}</p>
                  </div>
                  <span className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">{page._count?.leads ?? 0} leads</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <LayoutTemplate size={14} />
                  <span>/{page.slug}</span>
                  <span>•</span>
                  <span>{page.layoutStyle}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10" onClick={() => setEditingPage(page)} type="button">
                    Editar
                  </button>
                  <a className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10" href={`/p/${page.slug}`} target="_blank" rel="noreferrer">
                    Abrir <ArrowUpRight size={14} />
                  </a>
                  <button className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10" onClick={() => void handleCopyLink(page.slug)} type="button">
                    <Copy size={14} /> Copiar link
                  </button>
                  <button className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20" onClick={() => void handleDelete(page.id)} type="button">
                    Excluir
                  </button>
                </div>
              </article>
            ))}
        </div>

        {!loading && !pages.length && (
          <div className="mt-5 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
            <WandSparkles className="mx-auto text-cyan-200" />
            <p className="mt-3 text-white">Nenhuma landing page criada ainda.</p>
            <p className="mt-1 text-sm text-slate-300">Use os modelos prontos ao lado para publicar sua primeira página em minutos.</p>
          </div>
        )}

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
