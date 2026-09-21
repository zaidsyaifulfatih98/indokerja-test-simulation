/** Kumpulan utility Tailwind yang dipakai berulang. */

export const card = 'rounded-xl border border-slate-200 bg-white p-5';
export const label = 'mb-3.5 block text-sm font-medium';
export const input =
  'mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus:outline-2 focus:outline-brand';
export const link = 'text-brand hover:underline';
export const muted = 'text-slate-500';
export const pageHead = 'mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between';
export const h1 = 'text-2xl font-bold';
export const h2 = 'mb-1 mt-5 text-lg font-semibold';

interface ButtonOptions {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'sm';
  block?: boolean;
}

export function btn({ variant = 'primary', size = 'md', block }: ButtonOptions = {}) {
  return [
    'inline-block cursor-pointer rounded-lg border text-center font-semibold disabled:cursor-not-allowed disabled:opacity-60',
    size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5',
    variant === 'primary'
      ? 'border-transparent bg-brand text-white hover:bg-brand-dark'
      : 'border-slate-200 text-slate-900 hover:border-brand hover:text-brand',
    block && 'block w-full',
  ]
    .filter(Boolean)
    .join(' ');
}
