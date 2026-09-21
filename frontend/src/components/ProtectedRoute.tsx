import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Spinner } from './ui';

export function homePathFor(role: Role): string {
  return role === 'COMPANY' ? '/company/jobs' : '/jobs';
}

/** Batasi akses berdasarkan login dan (opsional) role. */
export default function ProtectedRoute({ role }: { role?: Role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  // Simpan tujuan awal supaya setelah login kembali ke halaman tersebut
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (role && user.role !== role) return <Navigate to={homePathFor(user.role)} replace />;

  return <Outlet />;
}
