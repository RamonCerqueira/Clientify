import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-10 px-6 py-16">
      <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
        Lead Capture OS · 2026
      </span>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-black leading-tight text-white md:text-6xl">
            Transforme visitantes em{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              oportunidades reais
            </span>{' '}
            com páginas de alta conversão.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Crie páginas em minutos, receba leads qualificados e mova cada contato no pipeline sem fricção.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-4 text-sm font-bold text-slate-950">
              Começar grátis
            </Link>
            <Link href="/login" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white">
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-sm text-slate-300">Visão instantânea</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Leads hoje</p>
              <strong className="mt-2 block text-2xl text-white">+128</strong>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Conversão</p>
              <strong className="mt-2 block text-2xl text-white">24.8%</strong>
            </article>
            <article className="col-span-2 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 p-4">
              <p className="text-xs text-cyan-100">Tempo médio de resposta</p>
              <strong className="mt-2 block text-2xl text-white">3m 12s</strong>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
