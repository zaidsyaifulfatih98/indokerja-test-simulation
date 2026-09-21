import type { Job } from './types';

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatSalary(job: Pick<Job, 'salaryMin' | 'salaryMax'>): string {
  const { salaryMin: min, salaryMax: max } = job;
  if (min && max) return `${rupiah.format(min)} - ${rupiah.format(max)}`;
  if (min) return `Mulai ${rupiah.format(min)}`;
  if (max) return `Hingga ${rupiah.format(max)}`;
  return 'Gaji dirahasiakan';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format ringkas untuk kartu, mis. "Rp 6-8jt". */
export function formatSalaryCompact(job: Pick<Job, 'salaryMin' | 'salaryMax'>): string {
  const jt = (n: number) => `${Number((n / 1_000_000).toFixed(1))}`.replace('.', ',');
  const { salaryMin: min, salaryMax: max } = job;
  if (min && max) return `Rp ${jt(min)}-${jt(max)}jt`;
  if (min) return `Rp ${jt(min)}jt+`;
  if (max) return `≤ Rp ${jt(max)}jt`;
  return 'Gaji dirahasiakan';
}
