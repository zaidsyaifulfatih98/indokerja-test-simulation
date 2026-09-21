import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { btn, card, h1, input, label, link, muted } from '../classes';
import { homePathFor } from '../components/ProtectedRoute';
import { ErrorMessage } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

const ROLES: { value: Role; label: string }[] = [
  { value: 'JOB_SEEKER', label: 'Job Seeker' },
  { value: 'COMPANY', label: 'Company' },
];

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('JOB_SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setSubmitting(true);
    try {
      const u = await register({ name: name.trim(), email: email.trim(), password, role });
      navigate(homePathFor(u.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center pt-6">
      <form className={`${card} w-full max-w-sm`} onSubmit={handleSubmit}>
        <h1 className={h1}>Daftar</h1>
        <div className="mb-4 mt-3 flex rounded-lg bg-slate-100 p-1" role="radiogroup" aria-label="Tipe akun">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={role === r.value}
              onClick={() => setRole(r.value)}
              className={`flex-1 cursor-pointer rounded-md p-2 font-semibold ${
                role === r.value ? 'bg-white text-brand shadow-sm' : 'text-slate-500'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <ErrorMessage message={error} />
        <label className={label}>
          {role === 'COMPANY' ? 'Nama Perusahaan' : 'Nama Lengkap'}
          <input className={input} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={label}>
          Email
          <input
            className={input}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={label}>
          Password
          <input
            className={input}
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className={btn({ block: true })} disabled={submitting}>
          {submitting ? 'Memproses...' : 'Daftar'}
        </button>
        <p className={`${muted} mt-4 text-center`}>
          Sudah punya akun?{' '}
          <Link to="/login" className={link}>
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}
