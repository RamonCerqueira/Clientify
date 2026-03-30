'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export function DashboardHeader() {
  const { session, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-slate-500">Bem-vindo de volta</p>
        <h2 className="text-xl font-bold text-ink">{session?.user.name || 'Usuário'}</h2>
        <p className="text-xs text-slate-400">Perfil: {session?.user.role || 'MEMBER'}</p>
      </div>
      <Button type="button" className="md:w-auto" onClick={logout}>
        Sair
      </Button>
    </header>
  );
}
