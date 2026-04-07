import { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(6,182,212,0.22)] transition-transform hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
