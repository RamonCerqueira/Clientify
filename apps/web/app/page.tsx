import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 px-6 text-center">
      <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-brand">SaaS multi-tenant para captura de leads</span>
      <h1 className="max-w-3xl text-4xl font-bold text-ink md:text-6xl">Crie páginas, receba contatos e converta pelo WhatsApp.</h1>
      <p className="max-w-2xl text-lg text-slate-600">Uma interface simples para empresas que precisam lançar campanhas rapidamente sem depender de times técnicos.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/register" className="rounded-xl bg-brand px-6 py-4 font-semibold text-white">Começar agora</Link>
        <Link href="/login" className="rounded-xl border border-slate-300 px-6 py-4 font-semibold text-slate-700">Já tenho conta</Link>
      </div>
    </main>
  );
}
