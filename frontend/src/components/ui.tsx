import type { ReactNode } from 'react';
import { JOB_TYPE_LABEL, STATUS_LABEL } from '../constants';
import type { ApplicationStatus, JobType } from '../types';

export function Spinner() {
  return (
    <div className="flex justify-center py-12" role="status" aria-label="Memuat">
      <div className="size-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand" />
    </div>
  );
}

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="my-3 rounded-lg bg-red-100 px-3.5 py-2.5 text-sm text-red-700" role="alert">
      {message}
    </div>
  );
}

export function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="my-3 rounded-lg bg-green-100 px-3.5 py-2.5 text-sm text-green-800">
      {message}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-12 text-center text-slate-500">
      <h3 className="font-semibold">{title}</h3>
      {children && <p className="mt-1">{children}</p>}
    </div>
  );
}

const badgeBase = 'inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold';

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-100 text-blue-700',
  REVIEWING: 'bg-amber-100 text-amber-800',
  SHORTLISTED: 'bg-violet-100 text-violet-800',
  REJECTED: 'bg-red-100 text-red-700',
  ACCEPTED: 'bg-green-100 text-green-800',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`${badgeBase} ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function JobTypeBadge({ type }: { type: JobType }) {
  return <span className={`${badgeBase} bg-indigo-50 text-indigo-800`}>{JOB_TYPE_LABEL[type]}</span>;
}

export function AppliedBadge() {
  return <span className={`${badgeBase} bg-blue-100 text-blue-700`}>Sudah dilamar</span>;
}
