import type { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface BadgeProps {
  children: ReactNode;
  tone?: 'brand' | 'neutral' | 'success' | 'warning';
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'brand' && 'bg-sky-100 text-sky-800',
        tone === 'neutral' && 'bg-slate-100 text-slate-700',
        tone === 'success' && 'bg-emerald-100 text-emerald-800',
        tone === 'warning' && 'bg-amber-100 text-amber-800',
      )}
    >
      {children}
    </span>
  );
}
