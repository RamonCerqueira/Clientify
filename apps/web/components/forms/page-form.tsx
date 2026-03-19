'use client';

import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { pageService } from '@/services/pageService';
import { getAuthSession } from '@/hooks/useAuth';
import { Page } from '@/types';

export function PageForm({ onCreated }: { onCreated: (page: Page) => void }) {
  // O link público é exibido imediatamente para acelerar a ativação do usuário leigo.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState('');
  const baseUrl = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), []);

  async function handleCreate(formData: FormData) {
    const session = getAuthSession();
    if (!session) return;

    setLoading(true);
    setError('');

    try {
      const page = await pageService.create(session.accessToken, {
        title: String(formData.get('title') || ''),
        description: String(formData.get('description')),
        businessType: String(formData.get('businessType')),
        whatsapp: String(formData.get('whatsapp')),
      });
      setCreatedLink(`${baseUrl}/p/${page.slug}`);
      onCreated(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar página');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleCreate} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-ink">Criar nova página</h3>
      <input name="title" placeholder="Título (opcional)" />
      <textarea name="description" placeholder="Descreva sua oferta" rows={4} required />
      <input name="businessType" placeholder="Ex.: Clínica odontológica" required />
      <input name="whatsapp" placeholder="WhatsApp com DDI" required />
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      {createdLink && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Link gerado: <a className="font-semibold underline" href={createdLink}>{createdLink}</a></p>}
      <Button disabled={loading}>{loading ? 'Criando...' : 'Criar página'}</Button>
    </form>
  );
}
