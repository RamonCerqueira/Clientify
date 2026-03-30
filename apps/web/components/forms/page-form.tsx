'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { pageService } from '@/services/pageService';
import { getValidAccessToken } from '@/hooks/useAuth';
import { Page } from '@/types';

const emptyState = {
  title: '',
  description: '',
  businessType: '',
  whatsapp: '',
  isPublished: true,
};

export function PageForm({
  onCreated,
  editingPage,
  onUpdated,
  onCancelEdit,
}: {
  onCreated: (page: Page) => void;
  editingPage?: Page | null;
  onUpdated?: (page: Page) => void;
  onCancelEdit?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState('');
  const [formState, setFormState] = useState(editingPage ?? emptyState);

  useEffect(() => {
    setFormState(editingPage ?? emptyState);
  }, [editingPage]);

  const baseUrl = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), []);

  async function submit() {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formState.title,
        description: formState.description,
        businessType: formState.businessType,
        whatsapp: formState.whatsapp,
        isPublished: formState.isPublished,
      };

      if (editingPage) {
        const page = await pageService.update(token, editingPage.id, payload);
        onUpdated?.(page);
        setCreatedLink(`${baseUrl}/p/${page.slug}`);
      } else {
        const page = await pageService.create(token, payload);
        setCreatedLink(`${baseUrl}/p/${page.slug}`);
        onCreated(page);
        setFormState(emptyState);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar página');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">{editingPage ? 'Editar página' : 'Nova página'}</h3>
        {editingPage && onCancelEdit && (
          <button className="text-sm font-medium text-slate-300" onClick={onCancelEdit} type="button">
            Cancelar
          </button>
        )}
      </div>

      <input value={formState.title} onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))} placeholder="Título (opcional)" />
      <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} placeholder="Descreva sua oferta" rows={4} required />
      <input value={formState.businessType} onChange={(e) => setFormState((s) => ({ ...s, businessType: e.target.value }))} placeholder="Ex.: Clínica odontológica" required />
      <input value={formState.whatsapp} onChange={(e) => setFormState((s) => ({ ...s, whatsapp: e.target.value }))} placeholder="WhatsApp com DDI" required />

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
        <input className="h-4 w-4" checked={formState.isPublished} onChange={(e) => setFormState((s) => ({ ...s, isPublished: e.target.checked }))} type="checkbox" />
        Página publicada e disponível no link público
      </label>

      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {createdLink && (
        <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          Link gerado:{' '}
          <a className="font-semibold underline" href={createdLink} target="_blank" rel="noreferrer">
            {createdLink}
          </a>
        </p>
      )}

      <Button type="button" disabled={loading} onClick={submit}>
        {loading ? 'Salvando...' : editingPage ? 'Salvar alterações' : 'Criar página'}
      </Button>
    </section>
  );
}
