import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../api';
import { getErrorMessage } from '../api/client';
import { btn, card, h1, input, label, pageHead } from '../classes';
import { ErrorMessage } from '../components/ui';
import { JOB_TYPE_LABEL } from '../constants';
import type { JobType } from '../types';

const toNumber = (v: string) => (v.trim() === '' ? undefined : Number(v));
const formRow = 'grid grid-cols-1 gap-4 sm:grid-cols-2';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const min = toNumber(salaryMin);
    const max = toNumber(salaryMax);
    if (min !== undefined && max !== undefined && min > max) {
      setError('Gaji minimum tidak boleh lebih besar dari gaji maksimum.');
      return;
    }

    setSubmitting(true);
    try {
      await jobsApi.create({
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim() || undefined,
        location: location.trim(),
        salaryMin: min,
        salaryMax: max,
        jobType,
      });
      navigate('/company/jobs');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={pageHead}>
        <h1 className={h1}>Buat Lowongan Baru</h1>
      </div>
      <form className={`${card} max-w-3xl`} onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <label className={label}>
          Judul pekerjaan
          <input className={input} required value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <div className={formRow}>
          <label className={label}>
            Lokasi
            <input
              className={input}
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label className={label}>
            Tipe pekerjaan
            <select
              className={input}
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
            >
              {Object.entries(JOB_TYPE_LABEL).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={formRow}>
          <label className={label}>
            Gaji minimum (IDR)
            <input
              className={input}
              type="number"
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </label>
          <label className={label}>
            Gaji maksimum (IDR)
            <input
              className={input}
              type="number"
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </label>
        </div>
        <label className={label}>
          Deskripsi
          <textarea
            className={`${input} resize-y`}
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className={label}>
          Kualifikasi (opsional)
          <textarea
            className={`${input} resize-y`}
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </label>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            className={btn({ variant: 'outline' })}
            onClick={() => navigate('/company/jobs')}
          >
            Batal
          </button>
          <button className={btn()} disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Publikasikan'}
          </button>
        </div>
      </form>
    </>
  );
}
