'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { pageService } from '@/services/pageService';
import { getValidAccessToken } from '@/hooks/useAuth';
import { Page } from '@/types';

const emptyState = {
  title: '',
  description: '',
  heroHeadline: '',
  heroSubheadline: '',
  ctaText: 'Quero atendimento',
  layoutStyle: 'MODERN' as const,
  primaryColor: '#22d3ee',
  businessType: '',
  whatsapp: '',
  isPublished: true,
};

const pagePresets = [
  {
    id: 'servicos-premium',
    label: 'Serviços premium',
    description: 'Landing page para clínicas, consultorias e agências com CTA forte.',
    values: {
      title: 'Diagnóstico estratégico gratuito',
      description: 'Preencha o formulário para receber uma análise personalizada e plano de ação em até 24h.',
      heroHeadline: 'Atraia clientes mais qualificados sem desperdiçar orçamento',
      heroSubheadline: 'Estratégia orientada por dados para acelerar vendas e aumentar previsibilidade comercial.',
      ctaText: 'Quero minha análise',
      layoutStyle: 'MODERN' as const,
      primaryColor: '#22d3ee',
    },
  },
  {
    id: 'saas-b2b',
    label: 'SaaS B2B',
    description: 'Estrutura inspirada em software B2B com prova de valor e contato rápido.',
    values: {
      title: 'Solicite uma demonstração guiada',
      description: 'Conheça como automatizar seu funil de ponta a ponta com relatórios e CRM unificados.',
      heroHeadline: 'Converta leads em receita com um funil inteligente',
      heroSubheadline: 'Do primeiro clique ao fechamento: operação comercial centralizada e escalável.',
      ctaText: 'Agendar demonstração',
      layoutStyle: 'TECH' as const,
      primaryColor: '#38bdf8',
    },
  },
  {
    id: 'campanha-ppc',
    label: 'Campanha PPC',
    description: 'Página minimalista para mídia paga e foco total na taxa de conversão.',
    values: {
      title: 'Fale com um especialista agora',
      description: 'Equipe pronta para montar sua campanha e gerar oportunidades qualificadas.',
      heroHeadline: 'Transforme cliques em reuniões comerciais',
      heroSubheadline: 'Mensagem direta, formulários curtos e acompanhamento completo no WhatsApp.',
      ctaText: 'Receber proposta',
      layoutStyle: 'MINIMALIST' as const,
      primaryColor: '#0ea5e9',
    },
  },
];

function toFormState(page?: Page | null) {
  if (!page) return emptyState;
  return {
    title: page.title ?? '',
    description: page.description ?? '',
    heroHeadline: page.heroHeadline ?? '',
    heroSubheadline: page.heroSubheadline ?? '',
    ctaText: page.ctaText ?? 'Quero atendimento',
    layoutStyle: page.layoutStyle ?? 'MODERN',
    primaryColor: page.primaryColor ?? '#22d3ee',
    businessType: page.businessType ?? '',
    whatsapp: page.whatsapp ?? '',
    isPublished: page.isPublished ?? true,
  };
}

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
  const [formState, setFormState] = useState(toFormState(editingPage));

  useEffect(() => {
    setFormState(toFormState(editingPage));
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
        heroHeadline: formState.heroHeadline,
        heroSubheadline: formState.heroSubheadline,
        ctaText: formState.ctaText,
        layoutStyle: formState.layoutStyle,
        primaryColor: formState.primaryColor,
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
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Modelos prontos</p>
        <div className="grid gap-3">
          {pagePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() =>
                setFormState((state) => ({
                  ...state,
                  ...preset.values,
                }))
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              <p className="font-semibold text-white">{preset.label}</p>
              <p className="mt-1 text-sm text-slate-300">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <input value={formState.title} onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))} placeholder="Título (opcional)" />
      <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} placeholder="Descreva sua oferta" rows={4} required />
      <input value={formState.heroHeadline} onChange={(e) => setFormState((s) => ({ ...s, heroHeadline: e.target.value }))} placeholder="Headline principal (hero)" />
      <input
        value={formState.heroSubheadline}
        onChange={(e) => setFormState((s) => ({ ...s, heroSubheadline: e.target.value }))}
        placeholder="Subheadline com proposta de valor"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={formState.layoutStyle} onChange={(e) => setFormState((s) => ({ ...s, layoutStyle: e.target.value as 'MODERN' | 'MINIMALIST' | 'TECH' }))}>
          <option value="MODERN">Layout moderno</option>
          <option value="MINIMALIST">Layout minimalista</option>
          <option value="TECH">Layout tech</option>
        </select>
        <input value={formState.ctaText} onChange={(e) => setFormState((s) => ({ ...s, ctaText: e.target.value }))} placeholder="Texto do botão CTA" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
        <input value={formState.primaryColor} onChange={(e) => setFormState((s) => ({ ...s, primaryColor: e.target.value }))} placeholder="#22d3ee" />
        <input type="color" value={formState.primaryColor} onChange={(e) => setFormState((s) => ({ ...s, primaryColor: e.target.value }))} aria-label="Cor principal" />
      </div>
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
