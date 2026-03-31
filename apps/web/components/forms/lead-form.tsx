'use client';

import { useState } from 'react';
import { leadService } from '@/services/leadService';
import { Button } from '../ui/button';

export function LeadForm({ pageId }: { pageId: string }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  async function submit() {
    setLoading(true);
    setFeedback('');
    setError('');

    try {
      await leadService.create({
        pageId,
        name: form.name,
        phone: form.phone,
        message: form.message,
        source: 'public-page',
      });
      setFeedback('Recebemos seus dados! Em breve entraremos em contato.');
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar seus dados');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel space-y-4 p-6">
      <h2 className="text-xl font-bold text-white">Quero atendimento</h2>
      <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Seu nome" required />
      <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Seu telefone" required />
      <textarea value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} rows={4} placeholder="Conte rapidamente o que você precisa" required />
      {feedback && <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{feedback}</p>}
      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <Button type="button" disabled={loading} onClick={submit} className="w-full text-base">
        {loading ? 'Enviando...' : 'Enviar agora'}
      </Button>
    </div>
  );
}
