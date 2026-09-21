import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { btn } from '../classes';
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
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  if (loading) return <Spinner />;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;

  const search = (q: string, loc = '') => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (loc.trim()) params.set('loc', loc.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(keyword, location);
  };

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
          <Link to="/" className="text-xl font-extrabold text-slate-900">
            indokerja<span className="font-normal text-brand">.id</span>
          </Link>
          <form
            onSubmit={handleSubmit}
            className="order-3 flex w-full items-center rounded-xl border border-slate-200 bg-white p-1 md:order-none md:mx-auto md:w-auto md:flex-1 md:max-w-xl"
          >
            <input
              aria-label="Kata kunci"
              className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-sm outline-none focus:bg-slate-50"
              placeholder="Judul pekerjaan atau perusahaan"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              aria-label="Lokasi"
              className="min-w-0 flex-1 border-l border-slate-200 px-3 py-1.5 text-sm outline-none focus:bg-slate-50"
              placeholder="Lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className={btn({ size: 'sm' })}>Cari</button>
          </form>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link to="/login" className={btn({ variant: 'outline', size: 'sm' })}>
              Masuk
            </Link>
            <Link to="/register" className={btn({ size: 'sm' })}>
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">
            Gerbang Karier Indonesia
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Temukan pekerjaan impian, <span className="text-brand">mulai dari sini</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Ribuan lowongan dari perusahaan terbaik menunggu Anda. Lamar dan pantau statusnya di satu
            tempat.
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
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-brand hover:shadow-lg hover:shadow-blue-700/10"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="mt-3 block font-semibold text-slate-900">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      
      {/* Company CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Punya lowongan? Temukan kandidat terbaik.</h2>
            <p className="mt-2 max-w-xl text-blue-100">
              Pasang lowongan, kelola pelamar, dan perbarui status rekrutmen dalam satu dashboard.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-brand hover:bg-blue-50"
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
