import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../mockJobs';
import { jobsApi } from '../api';
import JobCard from '../components/JobCard';
import { useAsync } from '../components/useAsync';
import Navbar from '../components/Navbar';
import { homePathFor } from '../components/ProtectedRoute';
import { Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';



const CATEGORIES = [
  { icon: '💻', name: 'Teknologi & IT' },
  { icon: '📣', name: 'Marketing & Sales' },
  { icon: '🎨', name: 'Desain & Kreatif' },
  { icon: '📊', name: 'Keuangan & Akuntansi' },
  { icon: '🎧', name: 'Customer Service' },
  { icon: '👥', name: 'Human Resources' },
  { icon: '🏭', name: 'Operasional & Produksi' },
  { icon: '🎓', name: 'Pendidikan' },
];



export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data, error } = useAsync(jobsApi.list);
  const jobs = data ?? (error ? MOCK_JOBS : null); // SEMENTARA: dummy saat backend mati

  if (loading) return <Spinner />;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const search = (q: string, loc = '') => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (loc.trim()) params.set('loc', loc.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="flex min-h-[calc(100svh-4rem)] items-center bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-dark">
            Gerbang Karier Indonesia
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Temukan pekerjaan impianmu dengan<span className="text-accent-dark"> mudah </span> <span>dan</span><span className="text-accent-dark"> transparan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Ribuan lowongan dari perusahaan terbaik menunggumu. Lamar dan wujudkan masa depanmu. 
            
          </p>

          
        </div>
      </section>

      
      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Jelajahi berdasarkan kategori</h2>
        <p className="mt-1 text-slate-500">Pilih bidang yang sesuai dengan keahlian Anda.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => search(c.name)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-accent hover:shadow-lg hover:shadow-amber-500/10"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="mt-3 block font-semibold text-slate-900">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      
      {/* Featured jobs */}
      {jobs && jobs.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold text-slate-900">Lowongan Kerja Pilihan</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/jobs" className="font-semibold text-brand hover:underline">
                Lihat Semua Lowongan →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Company CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Punya lowongan? Temukan kandidat terbaik.</h2>
            <p className="mt-2 max-w-xl text-slate-300">
              Pasang lowongan, kelola pelamar, dan perbarui status rekrutmen dalam satu dashboard.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 rounded-lg bg-accent px-6 py-3 font-semibold text-brand hover:bg-accent-dark"
          >
            Pasang Lowongan
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <span>
            <strong className="text-slate-900">indokerja</strong>
            <span className="text-brand">.id</span> — Gerbang Karier Indonesia
          </span>
          <span>© {new Date().getFullYear()} IndoKerja. Simulasi untuk tes asesmen.</span>
        </div>
      </footer>
    </div>
  );
}
