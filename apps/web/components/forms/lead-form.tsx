'use client';

import { useState } from 'react';
import { leadService } from '@/services/leadService';
import { Button } from '../ui/button';

export function LeadForm({
  pageId,
  ctaText = 'Enviar agora',
  accentColor = '#22d3ee',
  minimalist = false,
}: {
  pageId: string;
  ctaText?: string;
  accentColor?: string;
  minimalist?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', budget: '', message: '' });

  async function submit() {
    setLoading(true);
    setFeedback('');
    setError('');

    try {
      await leadService.create({
        pageId,
        name: form.name,
        phone: form.phone,
        message: `${form.message}\n\nEmail: ${form.email || 'não informado'}\nEmpresa: ${form.company || 'não informado'}\nOrçamento: ${form.budget || 'não informado'}`,
        source: 'public-page',
      });
      setFeedback('Recebemos seus dados! Em breve entraremos em contato.');
      setForm({ name: '', phone: '', email: '', company: '', budget: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar seus dados');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`space-y-4 rounded-[32px] border p-6 shadow-2xl ${minimalist ? 'border-slate-200 bg-white text-slate-900' : 'border-white/10 bg-white/5 text-white backdrop-blur-xl'}`}>
      <h2 className="text-xl font-bold">{ctaText}</h2>
      <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Seu nome" required />
      <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Seu telefone" required />
      <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Seu melhor e-mail" />
      <input value={form.company} onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))} placeholder="Empresa (opcional)" />
      <select value={form.budget} onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}>
        <option value="">Faixa de investimento</option>
        <option value="Até R$ 2 mil">Até R$ 2 mil</option>
        <option value="R$ 2 mil a R$ 10 mil">R$ 2 mil a R$ 10 mil</option>
        <option value="Acima de R$ 10 mil">Acima de R$ 10 mil</option>
      </select>
      <textarea value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} rows={4} placeholder="Conte rapidamente o que você precisa" required />
      {feedback && <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{feedback}</p>}
      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <Button type="button" disabled={loading} onClick={submit} className="w-full text-base text-slate-950" style={{ backgroundColor: accentColor }}>
        {loading ? 'Enviando...' : ctaText}
      </Button>
    </div>
  );
}
