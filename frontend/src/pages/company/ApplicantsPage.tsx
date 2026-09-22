import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationsApi, jobsApi } from '../../api';
import { getErrorMessage } from '../../api/client';
import { card, h1, input, link, muted, pageHead } from '../../classes';
import { EmptyState, ErrorMessage, Spinner, StatusBadge } from '../../components/ui';
import { useAsync } from '../../components/useAsync';
import { STATUS_LABEL, STATUS_ORDER } from '../../constants';
import type { ApplicationHistoryEntry, ApplicationStatus } from '../../types';
import { formatDate, formatDateTime } from '../../utils';

export default function ApplicantsPage() {
  const { id = '' } = useParams();
  const fetchApplicants = useCallback(() => jobsApi.applicants(id), [id]);
  const { data: applicants, loading, error, reload } = useAsync(fetchApplicants);

  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openHistoryId, setOpenHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<ApplicationHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async (applicationId: string) => {
    setHistoryLoading(true);
    try {
      setHistory(await applicationsApi.history(applicationId));
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    setActionError(null);
    setBusyId(applicationId);
    try {
      await applicationsApi.updateStatus(applicationId, status);
      await reload();
      if (openHistoryId === applicationId) await loadHistory(applicationId);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const toggleHistory = async (applicationId: string) => {
    if (openHistoryId === applicationId) {
      setOpenHistoryId(null);
      return;
    }
    setOpenHistoryId(applicationId);
    setHistory([]);
    await loadHistory(applicationId);
  };

  return (
    <>
      <Link to="/company/jobs" className={`${link} mb-3 inline-block`}>
        ← Kembali ke lowongan
      </Link>
      <div className={pageHead}>
        <h1 className={h1}>Kandidat</h1>
      </div>
      <ErrorMessage message={error ?? actionError} />
      {loading && !applicants ? (
        <Spinner />
      ) : !applicants || applicants.length === 0 ? (
        <EmptyState title="Belum ada pelamar">Kandidat akan tampil di sini.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {applicants.map((a) => (
            <div key={a.id} className={card}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{a.candidate.name}</h3>
                  <p className={`${muted} text-sm`}>
                    {a.candidate.email} · Melamar {formatDate(a.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusBadge status={a.status} />
                  <select
                    className={`${input} !mt-0 !w-auto !py-1.5`}
                    aria-label={`Ubah status ${a.candidate.name}`}
                    value={a.status}
                    disabled={busyId === a.id}
                    onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {a.coverLetter && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2.5 text-sm">
                  {a.coverLetter}
                </p>
              )}
              <button
                className={`${link} mt-2 cursor-pointer text-sm`}
                onClick={() => toggleHistory(a.id)}
              >
                {openHistoryId === a.id ? 'Sembunyikan riwayat' : 'Lihat riwayat status'}
              </button>
              {openHistoryId === a.id &&
                (historyLoading ? (
                  <Spinner />
                ) : (
                  <ol className="mt-3 border-l-2 border-slate-200 pl-4">
                    {history.map((h) => (
                      <li key={h.id} className="relative flex flex-col pb-2.5 pl-3">
                        <span className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-brand" />
                        <strong>
                          {h.fromStatus ? `${STATUS_LABEL[h.fromStatus]} → ` : ''}
                          {STATUS_LABEL[h.toStatus]}
                        </strong>
                        <span className={`${muted} text-sm`}>
                          {formatDateTime(h.createdAt)}
                          {h.changedBy ? ` · oleh ${h.changedBy.name}` : ''}
                        </span>
                        {h.note && <span className="text-sm">{h.note}</span>}
                      </li>
                    ))}
                  </ol>
                ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
