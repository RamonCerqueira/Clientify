'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export function DashboardHeader() {
  const { session, logout } = useAuth();

  return (
    <header className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Painel inteligente</p>
        <h2 className="text-xl font-bold text-white">Olá, {session?.user.name || 'usuário'} 👋</h2>
        <p className="text-sm text-slate-300">Perfil: {session?.user.role || 'MEMBER'}</p>
      </div>
      <Button type="button" className="md:w-auto" onClick={logout}>
        Sair
      </Button>
    </header>
  );
}
