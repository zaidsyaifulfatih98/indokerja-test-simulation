import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jobsApi } from '../api';
import { getErrorMessage } from '../api/client';
import { btn, card, h1, h2, input, label, link, muted } from '../classes';
import { ErrorMessage, JobTypeBadge, Spinner, SuccessMessage } from '../components/ui';
import { useAsync } from '../components/useAsync';
import { formatDate, formatSalary } from '../utils';

export default function JobDetailPage() {
  const { id = '' } = useParams();
  const fetchJob = useCallback(() => jobsApi.get(id), [id]);
  const { data: job, loading, error, reload } = useAsync(fetchJob);

  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (loading && !job) return <Spinner />;
  if (!job) return <ErrorMessage message={error ?? 'Lowongan tidak ditemukan.'} />;

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setApplyError(null);
    setApplying(true);
    try {
      await jobsApi.apply(job.id, coverLetter.trim() || undefined);
      setSuccess('Lamaran berhasil dikirim!');
      await reload();
    } catch (err) {
      setApplyError(getErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <Link to="/jobs" className={`${link} mb-3 inline-block`}>
        ← Kembali ke daftar
      </Link>
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_340px]">
        <article className={card}>
          <h1 className={h1}>{job.title}</h1>
          <p className={`${muted} font-medium`}>{job.company.name}</p>
          <ul className="my-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <li>📍 {job.location}</li>
            <li>💰 {formatSalary(job)}</li>
            <li>
              <JobTypeBadge type={job.jobType} />
            </li>
            <li className={muted}>Diposting {formatDate(job.createdAt)}</li>
          </ul>
          <h2 className={h2}>Deskripsi</h2>
          <p className="whitespace-pre-wrap">{job.description}</p>
          {job.requirements && (
            <>
              <h2 className={h2}>Kualifikasi</h2>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </>
          )}
        </article>

        <aside className={`${card} md:sticky md:top-20`}>
          <h2 className={`${h2} !mt-0`}>Lamar Pekerjaan</h2>
          <SuccessMessage message={success} />
          {job.hasApplied ? (
            <>
              <p className={`${muted} mb-3`}>Anda sudah melamar lowongan ini.</p>
              <Link to="/my-applications" className={btn({ variant: 'outline', block: true })}>
                Lihat status lamaran
              </Link>
            </>
          ) : (
            <form onSubmit={handleApply}>
              <ErrorMessage message={applyError} />
              <label className={label}>
                Cover letter (opsional)
                <textarea
                  className={`${input} resize-y`}
                  rows={5}
                  maxLength={2000}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Ceritakan singkat mengapa Anda cocok..."
                />
              </label>
              <button className={btn({ block: true })} disabled={applying}>
                {applying ? 'Mengirim...' : 'Apply Job'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </>
  );
}
