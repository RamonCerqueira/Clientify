'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { saveAuthSession } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    try {
      const payload =
        mode === 'login'
          ? await authService.login({
              email: String(formData.get('email')),
              password: String(formData.get('password')),
            })
          : await authService.register({
              name: String(formData.get('name')),
              email: String(formData.get('email')),
              password: String(formData.get('password')),
              tenantName: String(formData.get('tenantName')),
            });

      saveAuthSession(payload);
      router.push('/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="panel space-y-4 p-8">
      <h1 className="text-2xl font-bold text-white">{mode === 'login' ? 'Acessar painel' : 'Criar conta SaaS'}</h1>
      <p className="text-sm text-slate-300">Fluxo rápido para times de marketing, comercial e atendimento.</p>

      {mode === 'register' && <input name="name" placeholder="Seu nome" required />}
      {mode === 'register' && <input name="tenantName" placeholder="Nome da empresa" required />}
      <input name="email" type="email" placeholder="E-mail" required />
      <input name="password" type="password" placeholder="Senha (mín. 8 caracteres)" minLength={8} required />

      {error && <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      <Button disabled={loading} className="w-full text-base">
        {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
      </Button>

      <p className="text-center text-sm text-slate-400">
        {mode === 'login' ? (
          <>
            Ainda não tem conta?{' '}
            <Link href="/register" className="font-semibold text-cyan-300">
              Começar agora
            </Link>
          </>
        ) : (
          <>
            Já possui acesso?{' '}
            <Link href="/login" className="font-semibold text-cyan-300">
              Fazer login
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
