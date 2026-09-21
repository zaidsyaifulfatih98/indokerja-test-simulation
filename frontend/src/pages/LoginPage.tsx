import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { btn, card, h1, input, label, link, muted } from '../classes';
import { homePathFor } from '../components/ProtectedRoute';
import { ErrorMessage } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = await login(email.trim(), password);
      // Kembali ke halaman tujuan awal bila role-nya sesuai (mis. hasil pencarian dari landing page)
      const from = (routerLocation.state as { from?: string } | null)?.from;
      const canReturn = from && (u.role === 'JOB_SEEKER') === !from.startsWith('/company');
      navigate(canReturn ? from : homePathFor(u.role), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center pt-6">
      <form className={`${card} w-full max-w-sm`} onSubmit={handleSubmit}>
        <h1 className={h1}>Masuk</h1>
        <p className={muted}>Masuk sebagai Job Seeker atau Company.</p>
        <ErrorMessage message={error} />
        <label className={`${label} mt-4`}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className={btn({ block: true })} disabled={submitting}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
        <p className={`${muted} mt-4 text-center`}>
          Belum punya akun?{' '}
          <Link to="/register" className={link}>
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
