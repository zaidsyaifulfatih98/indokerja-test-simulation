import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../../api';
import { btn, card, h1, muted, pageHead } from '../../classes';
import { EmptyState, ErrorMessage, JobTypeBadge, Spinner } from '../../components/ui';
import { useAsync } from '../../components/useAsync';
import { formatDate, formatSalary } from '../../utils';

export default function CompanyJobsPage() {
  const { data: jobs, loading, error } = useAsync(jobsApi.mine);

  return (
    <>
      <div className={pageHead}>
        <h1 className={h1}>Lowongan Saya</h1>
        <Link to="/company/jobs/new" className={btn()}>
          + Buat Lowongan
        </Link>
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <Spinner />
      ) : !jobs || jobs.length === 0 ? (
        <EmptyState title="Belum ada lowongan">Buat lowongan pertama Anda.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className={`${card} flex flex-wrap items-center justify-between gap-4`}>
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-semibold">{job.title}</h3>
                <p className={`${muted} text-sm`}>
                  <MapPin size={14} className="mr-1 inline -mt-0.5" />{job.location} · {formatSalary(job)} · {formatDate(job.createdAt)}
                </p>
                <JobTypeBadge type={job.jobType} />
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={muted}>{job.applicationCount ?? 0} pelamar</span>
                <Link
                  to={`/company/jobs/${job.id}/applicants`}
                  className={btn({ variant: 'outline', size: 'sm' })}
                >
                  Lihat Kandidat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
