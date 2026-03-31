import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Registro</p>
        <h1 className="text-4xl font-black text-white md:text-5xl">Ative seu motor de leads em minutos.</h1>
        <p className="text-slate-300">Tenant criado automaticamente, sem setup complexo.</p>
      </section>
      <AuthForm mode="register" />
    </main>
  );
}
