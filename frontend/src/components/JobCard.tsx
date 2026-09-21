import { Link } from 'react-router-dom';
import { JOB_TYPE_LABEL } from '../constants';
import type { Job } from '../types';
import { formatSalaryCompact } from '../utils';

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg hover:ring-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
        <span className="shrink-0 text-sm font-semibold text-brand">{formatSalaryCompact(job)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700">
          {JOB_TYPE_LABEL[job.jobType]}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-brand text-lg font-bold text-accent">
          {job.company.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-brand">{job.company.name}</p>
          <p className="truncate text-sm text-slate-600">📍 {job.location}</p>
        </div>
      </div>
    </Link>
  );
}
