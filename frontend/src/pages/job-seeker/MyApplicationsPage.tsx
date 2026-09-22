import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { applicationsApi } from '../../api';
import { card, h1, link, muted, pageHead } from '../../classes';
import { EmptyState, ErrorMessage, JobTypeBadge, Spinner, StatusBadge } from '../../components/ui';
import { useAsync } from '../../components/useAsync';
import { formatDate } from '../../utils';

export default function MyApplicationsPage() {
  const { data: applications, loading, error } = useAsync(applicationsApi.mine);

  return (
    <>
      <div className={pageHead}>
        <h1 className={h1}>Lamaran Saya</h1>
      </div>
      <ErrorMessage message={error} />
      {loading ? (
        <Spinner />
      ) : !applications || applications.length === 0 ? (
        <EmptyState title="Belum ada lamaran">
          <Link to="/jobs" className={link}>
            Cari lowongan
          </Link>{' '}
          dan mulai melamar.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <div key={app.id} className={`${card} flex flex-wrap items-center justify-between gap-4`}>
              <div>
                <Link to={`/jobs/${app.job.id}`} className={`${link} text-base font-bold`}>
                  {app.job.title}
                </Link>
                <p className={`${muted} font-medium`}>{app.job.company.name}</p>
                <p className={`${muted} text-sm`}>
                  <MapPin size={14} className="mr-1 inline -mt-0.5" />{app.job.location} · Dilamar {formatDate(app.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <JobTypeBadge type={app.job.jobType} />
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
