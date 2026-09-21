import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { btn } from '../classes';
import logo from '../assets/logo.png';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (location.trim()) params.set('loc', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="indokerja.id - Gerbang Karier Indonesia" className="h-12 w-auto" />
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
  );
}
