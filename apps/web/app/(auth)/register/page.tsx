import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Registro</p>
        <h1 className="mt-4 text-4xl font-bold text-ink">Lance sua operação de captação em minutos.</h1>
        <p className="mt-4 text-slate-600">Crie sua conta, ganhe seu tenant automaticamente e publique páginas prontas para captar contatos.</p>
        <p className="mt-6 text-sm text-slate-500">Já possui acesso? <Link href="/login" className="font-semibold text-brand">Entrar</Link></p>
      </section>
      <AuthForm mode="register" />
    </main>
  );
}
