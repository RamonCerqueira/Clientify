import { Metadata } from 'next';
import { LeadForm } from '@/components/forms/lead-form';
import { pageService } from '@/services/pageService';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await pageService.getPublic(slug);

  return {
    title: `${page.title} | Clientify`,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
    },
  };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await pageService.getPublic(slug);
  const ctaText = page.ctaText || 'Quero atendimento';
  const headline = page.heroHeadline || page.title;
  const subheadline = page.heroSubheadline || page.description;
  const accent = page.primaryColor || '#22d3ee';

  const layoutClass =
    page.layoutStyle === 'MINIMALIST'
      ? 'bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-900'
      : page.layoutStyle === 'TECH'
        ? 'bg-[radial-gradient(circle_at_top,#0f172a,#020617_55%,#020617)] text-cyan-50'
        : 'bg-[radial-gradient(circle_at_top,#1e293b,#0f172a_55%,#020617)] text-white';

  return (
    <main className={`min-h-screen px-4 py-10 ${layoutClass}`}>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <section className={`rounded-[32px] p-8 shadow-2xl ${page.layoutStyle === 'MINIMALIST' ? 'border border-slate-200 bg-white' : 'border border-white/10 bg-white/5 backdrop-blur-xl'}`}>
          <span className={`rounded-full px-4 py-2 text-sm font-medium ${page.layoutStyle === 'MINIMALIST' ? 'border border-slate-300 bg-slate-100 text-slate-700' : 'border border-white/20 bg-white/10 text-white'}`}>
            {page.businessType}
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">{headline}</h1>
          <p className={`mt-4 max-w-xl text-lg ${page.layoutStyle === 'MINIMALIST' ? 'text-slate-600' : 'text-slate-300'}`}>{subheadline}</p>
          <p className={`mt-3 text-sm ${page.layoutStyle === 'MINIMALIST' ? 'text-slate-500' : 'text-cyan-200/90'}`}>{page.description}</p>
          <a
            href={`https://wa.me/${page.whatsapp.replace(/\D/g, '')}`}
            className="mt-6 inline-flex rounded-2xl px-6 py-4 font-semibold text-slate-950 transition hover:brightness-110"
            style={{ backgroundColor: accent }}
          >
            Falar no WhatsApp
          </a>
          <div className={`mt-8 grid gap-3 text-sm ${page.layoutStyle === 'MINIMALIST' ? 'text-slate-600' : 'text-slate-200'}`}>
            <p>✓ Estrutura focada em conversão</p>
            <p>✓ Atendimento rápido via WhatsApp</p>
            <p>✓ Layout otimizado para mobile</p>
          </div>
        </section>
        <LeadForm pageId={page.id} ctaText={ctaText} accentColor={accent} minimalist={page.layoutStyle === 'MINIMALIST'} />
      </div>
    </main>
  );
}
