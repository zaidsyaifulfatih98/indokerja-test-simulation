import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { btn } from '../classes';
import { useAuth } from '../context/AuthContext';

const navLink = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 py-1 font-medium ${
    isActive ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-900'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-15 max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
          <Link to="/" className="text-xl font-extrabold text-slate-900">
            indokerja<span className="font-normal text-brand">.id</span>
          </Link>
          <nav className="order-3 flex basis-full flex-wrap gap-4 sm:order-none sm:basis-auto sm:flex-1">
            {user?.role === 'JOB_SEEKER' && (
              <>
                <NavLink to="/jobs" className={navLink}>
                  Lowongan
                </NavLink>
                <NavLink to="/my-applications" className={navLink}>
                  Lamaran Saya
                </NavLink>
              </>
            )}
            {user?.role === 'COMPANY' && (
              <>
                <NavLink to="/company/jobs" end className={navLink}>
                  Lowongan Saya
                </NavLink>
                <NavLink to="/company/jobs/new" className={navLink}>
                  Buat Lowongan
                </NavLink>
              </>
            )}
          </nav>
          {user && (
            <div className="ml-auto flex items-center gap-3">
              <span className="font-medium">{user.name}</span>
              <button className={btn({ variant: 'outline', size: 'sm' })} onClick={handleLogout}>
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6">
        <Outlet />
      </main>
    </>
  );
}
