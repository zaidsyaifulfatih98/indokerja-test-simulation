import { MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsApi } from '../../api';
import { btn } from '../../classes';
import JobCard from '../../components/JobCard';
import { EmptyState, ErrorMessage, Spinner } from '../../components/ui';
import { useAsync } from '../../components/useAsync';
import { JOB_TYPE_LABEL } from '../../constants';
import type { JobType } from '../../types';

type Sort = 'newest' | 'salary';

const JOB_TYPES = Object.keys(JOB_TYPE_LABEL) as JobType[];
const searchInput =
  'min-w-0 flex-1 bg-transparent px-2 py-3 text-slate-900 outline-none placeholder:text-slate-500';

export default function JobsPage() {
  const { data: jobs, loading, error } = useAsync(jobsApi.list);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [location, setLocation] = useState(params.get('loc') ?? '');
  const [types, setTypes] = useState<JobType[]>([]);
  const [sort, setSort] = useState<Sort>('newest');

  const toggleType = (t: JobType) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const reset = () => {
    setQuery('');
    setLocation('');
    setTypes([]);
    setSort('newest');
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const list = (jobs ?? []).filter(
      (j) =>
        (!q || [j.title, j.company.name].some((s) => s.toLowerCase().includes(q))) &&
        (!loc || j.location.toLowerCase().includes(loc)) &&
        (types.length === 0 || types.includes(j.jobType)),
    );
    return sort === 'salary'
      ? [...list].sort((a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0))
      : list;
  }, [jobs, query, location, types, sort]);

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex flex-[2] items-center rounded-xl bg-white px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand">
          <Search size={18} className="text-slate-500" aria-hidden />
          <input
            className={searchInput}
            placeholder="Cari judul pekerjaan atau perusahaan"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="flex flex-1 items-center rounded-xl bg-white px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand">
          <MapPin size={18} className="text-slate-500" aria-hidden />
          <input
            className={searchInput}
            placeholder="Semua Kota/Provinsi"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>

      <h1 className="mb-4 mt-6 text-2xl font-bold">
        Lowongan di Indonesia
        {!loading && <span className="ml-2 text-base font-normal text-slate-500">({filtered.length})</span>}
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-20 lg:w-72">
          <div className="border-b border-slate-200 pb-4">
            <label htmlFor="sort" className="mb-2 block font-medium">
              Urutkan
            </label>
            <select
              id="sort"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="newest">Terbaru</option>
              <option value="salary">Gaji tertinggi</option>
            </select>
          </div>

          <fieldset className="py-4">
            <legend className="mb-2 font-medium">Tipe Pekerjaan</legend>
            <div className="flex flex-col gap-2">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer accent-brand"
                    checked={types.includes(t)}
                    onChange={() => toggleType(t)}
                  />
                  {JOB_TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </fieldset>

          <button className={btn({ variant: 'outline', size: 'sm', block: true })} onClick={reset}>
            Reset Filter
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <ErrorMessage message={error} />
          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState title="Belum ada lowongan">Coba ubah kata kunci atau filter.</EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
