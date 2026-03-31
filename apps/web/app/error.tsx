'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Erro global na aplicação:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-[#030712] p-6 text-white">
        <div className="panel max-w-lg p-8 text-center">
          <h2 className="text-2xl font-bold">Algo inesperado aconteceu</h2>
          <p className="mt-3 text-slate-300">Nossa equipe já pode investigar com os logs do servidor. Tente novamente.</p>
          <button className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950" onClick={() => reset()}>
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
