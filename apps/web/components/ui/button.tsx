import { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60', className)}
      {...props}
    />
  );
}
