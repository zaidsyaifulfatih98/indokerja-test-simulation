import { ArrowRight, ChartColumn, Factory, GraduationCap, Headset, Laptop, Megaphone, Palette, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../../api';
import JobCard from '../../components/JobCard';
import { useAsync } from '../../components/useAsync';
import Navbar from '../../components/Navbar';



const CATEGORIES = [
  { icon: Laptop, name: 'Teknologi & IT' },
  { icon: Megaphone, name: 'Marketing & Sales' },
  { icon: Palette, name: 'Desain & Kreatif' },
  { icon: ChartColumn, name: 'Keuangan & Akuntansi' },
  { icon: Headset, name: 'Customer Service' },
  { icon: Users, name: 'Human Resources' },
  { icon: Factory, name: 'Operasional & Produksi' },
  { icon: GraduationCap, name: 'Pendidikan' },
];



export default function LandingPage() {
  const navigate = useNavigate();
  const { data: jobs } = useAsync(jobsApi.list);

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
      <section className="px-4 pt-4">
        <div
          className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl items-center overflow-hidden rounded-2xl bg-brand bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.pinimg.com/736x/01/49/bf/0149bf3f43afa7d258ec377eb1cc72c1.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/85 to-brand/10" />
          <div className="relative w-full px-6 py-16 sm:px-12 sm:py-24">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
              Gerbang Karier Indonesia
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              Temukan pekerjaan impianmu dengan<span className="text-accent"> mudah </span>
              
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-200">
              Ribuan lowongan dari perusahaan terbaik menunggumu. Lamar dan wujudkan masa depanmu.
            </p>
            <Link
              to="/jobs"
              className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-brand hover:bg-accent-dark"
            >
              Cari Lowongan
            </Link>
          </div>
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
              <c.icon size={32} className="text-brand" />
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
                Lihat Semua Lowongan <ArrowRight size={16} className="ml-1 inline" />
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
