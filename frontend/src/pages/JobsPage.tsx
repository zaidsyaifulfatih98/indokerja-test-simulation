import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobsApi } from '../api';
import { card, h1, input, muted, pageHead } from '../classes';
import { AppliedBadge, EmptyState, ErrorMessage, JobTypeBadge, Spinner } from '../components/ui';
import { useAsync } from '../components/useAsync';
import { formatDate, formatSalary } from '../utils';

export default function JobsPage() {
  const { data: jobs, loading, error } = useAsync(jobsApi.list);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const locationFilter = (params.get('loc') ?? '').toLowerCase();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (jobs ?? []).filter(
      (j) =>
        (!q || [j.title, j.company.name, j.location].some((s) => s.toLowerCase().includes(q))) &&
        (!locationFilter || j.location.toLowerCase().includes(locationFilter)),
    );
  }, [jobs, query, locationFilter]);

  return (
    <>
      <div className={pageHead}>
        <h1 className={h1}>Lowongan Pekerjaan</h1>
        <input
          className={`${input} !mt-0 sm:max-w-sm`}
          type="search"
          placeholder="Cari judul, perusahaan, atau lokasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState title="Belum ada lowongan">Coba ubah kata kunci pencarian.</EmptyState>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
          {filtered.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className={`${card} flex flex-col gap-1.5 transition hover:border-brand hover:shadow-lg hover:shadow-blue-700/10`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{job.title}</h3>
                {job.hasApplied && <AppliedBadge />}
              </div>
              <p className={`${muted} font-medium`}>{job.company.name}</p>
              <ul className="my-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                <li>📍 {job.location}</li>
                <li>💰 {formatSalary(job)}</li>
              </ul>
              <div className="mt-auto flex items-center justify-between pt-2">
                <JobTypeBadge type={job.jobType} />
                <span className={`${muted} text-sm`}>{formatDate(job.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
