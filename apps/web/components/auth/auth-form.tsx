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
  const [success, setSuccess] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    setSuccess('');

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
      setSuccess(mode === 'login' ? 'Login realizado com sucesso.' : 'Conta criada com sucesso.');
      router.push('/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-ink">{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="mt-2 text-sm text-slate-500">Acesse seu painel e gerencie páginas e leads sem complicação.</p>
      </div>
      {mode === 'register' && <input name="name" placeholder="Seu nome" required />}
      {mode === 'register' && <input name="tenantName" placeholder="Nome da empresa" required />}
      <input name="email" type="email" placeholder="E-mail" required />
      <input name="password" type="password" placeholder="Senha (mín. 8 caracteres)" minLength={8} required />
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-600">{success}</p>}
      <Button disabled={loading} className="w-full text-base">
        {loading ? 'Carregando...' : mode === 'login' ? 'Entrar agora' : 'Criar conta grátis'}
      </Button>
      <p className="text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>Não tem conta? <Link href="/register" className="font-semibold text-brand">Cadastre-se</Link></>
        ) : (
          <>Já tem conta? <Link href="/login" className="font-semibold text-brand">Fazer login</Link></>
        )}
      </p>
    </form>
  );
}
