import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Login</p>
        <h1 className="text-4xl font-black text-white md:text-5xl">Seu cockpit de aquisição em um só lugar.</h1>
        <p className="text-slate-300">Acompanhe páginas, novos leads e negociações em tempo real.</p>
      </section>
      <AuthForm mode="login" />
    </main>
  );
}
