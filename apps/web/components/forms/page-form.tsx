'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Layers3, Sparkles } from 'lucide-react';
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
    description: 'Para consultorias, clínicas e agências com oferta de diagnóstico.',
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
    description: 'Página com tom executivo para demonstração e prova de valor.',
    values: {
      title: 'Solicite uma demonstração guiada',
      description: 'Conheça como automatizar seu funil de ponta a ponta com relatórios e CRM unificados.',
      heroHeadline: 'Converta leads em receita com um funil inteligente',
      heroSubheadline: 'Do primeiro clique ao fechamento: operação comercial centralizada e escalável.',
      ctaText: 'Agendar demonstração',
      layoutStyle: 'TECH' as const,
      primaryColor: '#6366f1',
    },
  },
  {
    id: 'campanha-ppc',
    label: 'Campanha PPC',
    description: 'Mensagem direta e formulário curto para tráfego pago.',
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

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </label>
  );
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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <section className="panel space-y-5 p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Page Builder</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{editingPage ? 'Editar landing page' : 'Criar landing page'}</h3>
          <p className="mt-1 text-sm text-slate-300">Defina oferta, mensagem e canal de contato para captar leads qualificados.</p>
        </div>
        {editingPage && onCancelEdit && (
          <button className="text-sm font-medium text-slate-300 hover:text-white" onClick={onCancelEdit} type="button">
            Cancelar
          </button>
        )}
      </div>

      <div className="grid gap-2">
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
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300/40 hover:bg-indigo-500/10"
          >
            <p className="flex items-center gap-2 font-medium text-white">
              <Sparkles size={14} className="text-indigo-200" />
              {preset.label}
            </p>
            <p className="mt-1 text-sm text-slate-300">{preset.description}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-white">
            <Layers3 size={16} className="text-cyan-200" />
            Informações essenciais
          </p>
          <button type="button" onClick={() => setShowAdvanced((state) => !state)} className="text-xs font-medium text-cyan-200 hover:text-cyan-100">
            {showAdvanced ? 'Ocultar avançado' : 'Mostrar avançado'}
          </button>
        </div>

        <div className="space-y-3">
          <FormField label="Título">
            <input value={formState.title} onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))} placeholder="Ex: Diagnóstico comercial gratuito" />
          </FormField>
          <FormField label="Descrição" hint="até 500 caracteres">
            <textarea value={formState.description} onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))} placeholder="Descreva o benefício principal da oferta" rows={3} required />
          </FormField>

          {showAdvanced && (
            <>
              <FormField label="Headline hero">
                <input value={formState.heroHeadline} onChange={(e) => setFormState((s) => ({ ...s, heroHeadline: e.target.value }))} placeholder="A frase principal da seção hero" />
              </FormField>
              <FormField label="Subheadline hero">
                <input value={formState.heroSubheadline} onChange={(e) => setFormState((s) => ({ ...s, heroSubheadline: e.target.value }))} placeholder="Complemento com proposta de valor" />
              </FormField>
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Tipo de negócio">
              <input value={formState.businessType} onChange={(e) => setFormState((s) => ({ ...s, businessType: e.target.value }))} placeholder="Ex.: Clínica odontológica" required />
            </FormField>
            <FormField label="WhatsApp comercial">
              <input value={formState.whatsapp} onChange={(e) => setFormState((s) => ({ ...s, whatsapp: e.target.value }))} placeholder="+5511999998888" required />
            </FormField>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-medium text-white">Aparência e conversão</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Layout">
            <select value={formState.layoutStyle} onChange={(e) => setFormState((s) => ({ ...s, layoutStyle: e.target.value as 'MODERN' | 'MINIMALIST' | 'TECH' }))}>
              <option value="MODERN">Modern</option>
              <option value="MINIMALIST">Minimalist</option>
              <option value="TECH">Tech</option>
            </select>
          </FormField>
          <FormField label="Texto do CTA">
            <input value={formState.ctaText} onChange={(e) => setFormState((s) => ({ ...s, ctaText: e.target.value }))} placeholder="Ex: Quero receber proposta" />
          </FormField>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_64px]">
          <FormField label="Cor principal (hex)">
            <input value={formState.primaryColor} onChange={(e) => setFormState((s) => ({ ...s, primaryColor: e.target.value }))} placeholder="#22d3ee" />
          </FormField>
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Cor</span>
            <input type="color" value={formState.primaryColor} onChange={(e) => setFormState((s) => ({ ...s, primaryColor: e.target.value }))} aria-label="Cor principal" className="h-[46px] p-1" />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
        <input className="h-4 w-4" checked={formState.isPublished} onChange={(e) => setFormState((s) => ({ ...s, isPublished: e.target.checked }))} type="checkbox" />
        Publicar página automaticamente após salvar
      </label>

      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {createdLink && (
        <p className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 size={14} />
            Link gerado:{' '}
          </span>
          <a className="ml-1 font-semibold underline" href={createdLink} target="_blank" rel="noreferrer">
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
