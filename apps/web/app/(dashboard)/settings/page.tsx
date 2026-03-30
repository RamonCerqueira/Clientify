'use client';

import { useEffect, useState } from 'react';
import { getAuthSession } from '@/hooks/useAuth';

export default function SettingsPage() {
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    setOwnerName(session?.user.name || 'Minha empresa');
  }, []);

  return (
    <section className="panel space-y-4 p-6">
      <h1 className="text-xl font-bold text-white">Configurações</h1>
      <p className="text-sm text-slate-300">Espaço para branding, billing, integrações e preferências do tenant.</p>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">Responsável atual</p>
        <p className="font-semibold text-white">{ownerName}</p>
      </div>
    </section>
  );
}
