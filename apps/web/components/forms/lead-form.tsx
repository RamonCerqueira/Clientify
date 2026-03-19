'use client';

import { useState } from 'react';
import { leadService } from '@/services/leadService';
import { Button } from '../ui/button';

export function LeadForm({ pageId }: { pageId: string }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setLoading(true);
    setFeedback('');
    setError('');

    try {
      await leadService.create({
        pageId,
        name: String(formData.get('name')),
        phone: String(formData.get('phone')),
        message: String(formData.get('message')),
      });
      setFeedback('Recebemos seus dados! Em breve entraremos em contato.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar seus dados');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-xl font-bold text-ink">Quero atendimento</h2>
      <input name="name" placeholder="Seu nome" required />
      <input name="phone" placeholder="Seu telefone" required />
      <textarea name="message" rows={4} placeholder="Conte rapidamente o que você precisa" required />
      {feedback && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{feedback}</p>}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <Button disabled={loading} className="w-full text-base">{loading ? 'Enviando...' : 'Enviar agora'}</Button>
    </form>
  );
}
