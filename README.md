# IndoKerja — Job Application Management

Simulasi platform lowongan kerja: Job Seeker bisa melamar pekerjaan, Company bisa membuat lowongan dan mengelola kandidat.

## Tech Stack

- **Frontend**: React.js + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (JSON Web Token)
- **Validasi**: Zod

## Struktur Proyek

```
IndoKerja/
├── backend/     # REST API (Express + Prisma)
└── frontend/    # Web app (React + Vite)
```

## Menjalankan Aplikasi

### 1. Backend

```bash
cd backend
npm install
```

Buat file `.env` (lihat contoh field di bawah), lalu jalankan migration dan seed data demo:

```bash
npx prisma migrate deploy   # menerapkan semua migration ke database
npm run seed                # mengisi data demo (users, jobs, applications, histories)
npm run dev                 # menjalankan server di http://localhost:8080
```

`.env` yang dibutuhkan:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
PORT=8080
JWT_SECRET="ganti-dengan-string-rahasia"
```

### 2. Frontend

```bash
cd frontend
npm install
```

Buat file `.env` (boleh dikosongkan, akan memakai proxy Vite ke `http://localhost:8080`):

```env
VITE_API_URL=
```

Lalu jalankan:

```bash
npm run dev   # http://localhost:5173
```

### Akun Demo

Setelah `npm run seed` dijalankan, tersedia akun berikut (password semuanya `demo123`):

| Role | Email |
|---|---|
| Job Seeker | seeker@demo.com |
| Company | company@demo.com |

Ada juga beberapa akun kandidat (`siti@mail.com`, `andi@mail.com`, dst.) dan perusahaan lain (`c-domo@demo.com`, `c-satu@demo.com`, dst.) untuk menguji skenario multi-user.

## Dokumentasi API

Base URL: `http://localhost:8080/api`

Semua endpoint yang butuh login mengirim header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Akses | Body | Deskripsi |
|---|---|---|---|---|
| POST | `/auth/register` | Publik | `{ name, email, password, role }` (`role`: `JOB_SEEKER`\|`COMPANY`) | Daftar akun baru, langsung dapat token |
| POST | `/auth/login` | Publik | `{ email, password }` | Login, dapat token |
| GET | `/auth/me` | Login | - | Data user yang sedang login |

### Jobs

| Method | Endpoint | Akses | Body | Deskripsi |
|---|---|---|---|---|
| GET | `/jobs` | Publik | - | Daftar semua lowongan. Jika login sebagai Job Seeker, setiap job disertai `hasApplied` |
| GET | `/jobs/:id` | Publik | - | Detail satu lowongan |
| POST | `/jobs` | Company | `{ title, description, requirements, location, salaryMin?, salaryMax?, jobType }` | Buat lowongan baru |
| GET | `/jobs/mine` | Company | - | Lowongan milik company yang login, disertai `applicationCount` |
| GET | `/jobs/:id/applications` | Company (pemilik job) | - | Daftar kandidat yang melamar ke lowongan tersebut |
| POST | `/jobs/:id/apply` | Job Seeker | `{ coverLetter? }` | Melamar lowongan (ditolak jika sudah pernah melamar) |

### Applications

| Method | Endpoint | Akses | Body | Deskripsi |
|---|---|---|---|---|
| GET | `/applications/me` | Job Seeker | - | Daftar lamaran milik user yang login beserta status |
| PATCH | `/applications/:id/status` | Company (pemilik job terkait) | `{ status, note? }` (`status`: `APPLIED`\|`REVIEWING`\|`SHORTLISTED`\|`REJECTED`\|`ACCEPTED`) | Ubah status lamaran, otomatis tercatat di histori |
| GET | `/applications/:id/history` | Login | - | Riwayat perubahan status suatu lamaran |

### Format Response

Sukses (2xx): body langsung berupa data (object atau array), sesuai bentuk pada tipe di `frontend/src/types.ts`.

Error:
```json
{ "success": false, "message": "Penjelasan error" }
```

Kode status yang dipakai: `400` (validasi/duplikasi), `401` (belum login/salah kredensial), `403` (tidak punya akses ke resource), `404` (tidak ditemukan), `409` (konflik, mis. email sudah terdaftar), `500` (kesalahan server).

## Desain Database

Model utama (lihat `backend/prisma/schema.prisma`):

- **Users** — `role` (`JOB_SEEKER` / `COMPANY`)
- **Jobs** — dimiliki satu `Users` (company), `job_type` enum
- **Applications** — menghubungkan `Users` (job seeker) dengan `Jobs`, `status` enum, unik per pasangan user-job secara logis (divalidasi di service)
- **Histories** — mencatat setiap perubahan status pada `Applications` (`from_status` → `to_status`, siapa yang mengubah)

## Catatan Implementasi

- Autentikasi & otorisasi berbasis JWT + role guard (`requireAuth`, `requireRole` di `backend/src/middlewares/`).
- Validasi input request memakai Zod (`backend/src/validators/`), dijalankan lewat middleware `validateBody`.
- Error handling terpusat: service melempar `AppError(statusCode, message)`, ditangani satu error handler di `server.ts`.
