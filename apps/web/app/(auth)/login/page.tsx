import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Login</p>
        <h1 className="mt-4 text-4xl font-bold text-ink">Acesse seu painel e acompanhe novos leads em tempo real.</h1>
        <p className="mt-4 text-slate-600">Entre para gerenciar suas páginas, visualizar contatos e responder com rapidez.</p>
        <p className="mt-6 text-sm text-slate-500">Ainda não tem conta? <Link href="/register" className="font-semibold text-brand">Criar agora</Link></p>
      </section>
      <AuthForm mode="login" />
    </main>
  );
}
