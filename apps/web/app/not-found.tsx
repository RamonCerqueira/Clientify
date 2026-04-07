import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-white">
      <section className="panel max-w-xl space-y-4 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">404</p>
        <h1 className="text-3xl font-black">Página não encontrada</h1>
        <p className="text-slate-300">A rota acessada não existe ou foi removida.</p>
        <Link href="/" className="inline-block rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950">
          Voltar ao início
        </Link>
      </section>
    </main>
  );
}
