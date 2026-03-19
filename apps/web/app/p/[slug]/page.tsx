import { Metadata } from 'next';
import { LeadForm } from '@/components/forms/lead-form';
import { pageService } from '@/services/pageService';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await pageService.getPublic(slug);

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await pageService.getPublic(slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <section>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{page.businessType}</span>
          <h1 className="mt-6 text-4xl font-bold">{page.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">{page.description}</p>
          <a href={`https://wa.me/${page.whatsapp.replace(/\D/g, '')}`} className="mt-6 inline-flex rounded-xl bg-emerald-500 px-6 py-4 font-semibold text-white">
            Falar no WhatsApp
          </a>
        </section>
        <LeadForm pageId={page.id} />
      </div>
    </main>
  );
}
