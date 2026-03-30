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

  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <section className="panel p-8">
          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">{page.businessType}</span>
          <h1 className="mt-6 text-4xl font-black">{page.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-300">{page.description}</p>
          <a href={`https://wa.me/${page.whatsapp.replace(/\D/g, '')}`} className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-white">
            Falar no WhatsApp
          </a>
        </section>
        <LeadForm pageId={page.id} />
      </div>
    </main>
  );
}
