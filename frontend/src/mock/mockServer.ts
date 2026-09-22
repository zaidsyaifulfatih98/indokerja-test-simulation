import { AxiosError } from 'axios';
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import seed from './db.json';
import type { ApplicationStatus, JobType, Role } from '../types';

/**
 * SEMENTARA: "backend" palsu berbasis JSON. Data awal dari db.json, perubahan disimpan di
 * localStorage (hapus key `indokerja_mockdb` untuk reset). Matikan lewat USE_MOCK di api/client.ts.
 * Akun demo: seeker@demo.com / company@demo.com (password bebas).
 */
interface DbUser { id: string; name: string; email: string; password: string; role: Role }
interface DbJob {
  id: string; title: string; description: string; requirements: string | null; location: string;
  salaryMin: number | null; salaryMax: number | null; jobType: JobType; createdAt: string;
  companyId: string; companyName: string;
}
interface DbApp {
  id: string; jobId: string; candidateId: string; status: ApplicationStatus;
  coverLetter: string | null; createdAt: string; updatedAt: string;
}
interface DbHistory {
  id: string; applicationId: string; fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus; note: string | null; createdAt: string; changedById: string | null;
}
interface Db { users: DbUser[]; jobs: DbJob[]; applications: DbApp[]; history: DbHistory[] }

const KEY = 'indokerja_mockdb';
const DEFAULT_SEEKER = 'u-seeker';
const DEFAULT_COMPANY = 'u-company';

const load = (): Db => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    /* abaikan */
  }
  return structuredClone(seed) as unknown as Db;
};
const db = load();
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* abaikan */
  }
};
const uid = () => Math.random().toString(36).slice(2, 10);
const publicUser = (u: DbUser) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function toJob(j: DbJob, viewerId?: string, forCompany = false) {
  const { companyId, companyName, ...rest } = j;
  return {
    ...rest,
    company: { id: companyId, name: companyName },
    ...(forCompany
      ? { applicationCount: db.applications.filter((a) => a.jobId === j.id).length }
      : {
          hasApplied:
            !!viewerId && db.applications.some((a) => a.jobId === j.id && a.candidateId === viewerId),
        }),
  };
}

const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function route(method: string, path: string, body: any, token: string | null): unknown {
  const me = db.users.find((u) => u.id === token);
  const seekerId = me?.role === 'JOB_SEEKER' ? me.id : DEFAULT_SEEKER;
  const companyId = me?.role === 'COMPANY' ? me.id : DEFAULT_COMPANY;
  let m: RegExpMatchArray | null;

  if (method === 'post' && path === '/auth/login') {
    const u = db.users.find((x) => x.email === body.email);
    if (!u) throw new HttpError(401, 'Email tidak terdaftar (coba seeker@demo.com atau company@demo.com).');
    return { token: u.id, user: publicUser(u) };
  }
  if (method === 'post' && path === '/auth/register') {
    if (db.users.some((u) => u.email === body.email)) throw new HttpError(409, 'Email sudah terdaftar.');
    const u: DbUser = { id: `u-${uid()}`, name: body.name, email: body.email, password: body.password, role: body.role };
    db.users.push(u);
    save();
    return { token: u.id, user: publicUser(u) };
  }
  if (method === 'get' && path === '/auth/me') {
    if (!me) throw new HttpError(401, 'Sesi tidak valid.');
    return publicUser(me);
  }

  if (method === 'get' && path === '/jobs') {
    return [...db.jobs].sort(byNewest).map((j) => toJob(j, me?.id));
  }
  if (method === 'get' && path === '/jobs/mine') {
    return db.jobs.filter((j) => j.companyId === companyId).sort(byNewest).map((j) => toJob(j, undefined, true));
  }
  if (method === 'post' && path === '/jobs') {
    const c = db.users.find((u) => u.id === companyId)!;
    const job: DbJob = {
      id: `j-${uid()}`, requirements: null, salaryMin: null, salaryMax: null, ...body,
      createdAt: new Date().toISOString(), companyId, companyName: c.name,
    };
    db.jobs.push(job);
    save();
    return toJob(job, undefined, true);
  }
  if (method === 'get' && (m = path.match(/^\/jobs\/([^/]+)\/applications$/))) {
    const jobId = m[1];
    return db.applications.filter((a) => a.jobId === jobId).sort(byNewest).map((a) => {
      const c = db.users.find((u) => u.id === a.candidateId)!;
      return {
        id: a.id, status: a.status, coverLetter: a.coverLetter, createdAt: a.createdAt,
        candidate: { id: c.id, name: c.name, email: c.email },
      };
    });
  }
  if (method === 'post' && (m = path.match(/^\/jobs\/([^/]+)\/apply$/))) {
    const job = db.jobs.find((j) => j.id === m![1]);
    if (!job) throw new HttpError(404, 'Lowongan tidak ditemukan.');
    if (db.applications.some((a) => a.jobId === job.id && a.candidateId === seekerId)) {
      throw new HttpError(409, 'Anda sudah melamar lowongan ini.');
    }
    const now = new Date().toISOString();
    const app: DbApp = {
      id: `a-${uid()}`, jobId: job.id, candidateId: seekerId, status: 'APPLIED',
      coverLetter: body?.coverLetter || null, createdAt: now, updatedAt: now,
    };
    db.applications.push(app);
    db.history.push({
      id: `h-${uid()}`, applicationId: app.id, fromStatus: null, toStatus: 'APPLIED',
      note: null, createdAt: now, changedById: null,
    });
    save();
    return { ...app, job: toJob(job) };
  }
  if (method === 'get' && (m = path.match(/^\/jobs\/([^/]+)$/))) {
    const job = db.jobs.find((j) => j.id === m![1]);
    if (!job) throw new HttpError(404, 'Lowongan tidak ditemukan.');
    return toJob(job, seekerId);
  }
  if (method === 'get' && path === '/applications/me') {
    return db.applications.filter((a) => a.candidateId === seekerId).sort(byNewest).map((a) => {
      const { id, title, location, jobType, company } = toJob(db.jobs.find((x) => x.id === a.jobId)!);
      return {
        id: a.id, status: a.status, createdAt: a.createdAt, updatedAt: a.updatedAt,
        job: { id, title, location, jobType, company },
      };
    });
  }
  if (method === 'patch' && (m = path.match(/^\/applications\/([^/]+)\/status$/))) {
    const app = db.applications.find((a) => a.id === m![1]);
    if (!app) throw new HttpError(404, 'Lamaran tidak ditemukan.');
    const now = new Date().toISOString();
    db.history.push({
      id: `h-${uid()}`, applicationId: app.id, fromStatus: app.status, toStatus: body.status,
      note: body.note ?? null, createdAt: now, changedById: companyId,
    });
    app.status = body.status;
    app.updatedAt = now;
    save();
    return app;
  }
  if (method === 'get' && (m = path.match(/^\/applications\/([^/]+)\/history$/))) {
    const appId = m[1];
    return db.history
      .filter((h) => h.applicationId === appId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((h) => {
        const u = db.users.find((x) => x.id === h.changedById);
        return {
          id: h.id, fromStatus: h.fromStatus, toStatus: h.toStatus, note: h.note, createdAt: h.createdAt,
          changedBy: u ? { id: u.id, name: u.name } : null,
        };
      });
  }
  throw new HttpError(404, `Endpoint tidak ditemukan: ${method.toUpperCase()} ${path}`);
}

export const mockAdapter: AxiosAdapter = (config: InternalAxiosRequestConfig) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const auth = String(config.headers?.Authorization ?? '');
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const response = { status: 200, statusText: 'OK', headers: {}, config, request: {}, data: undefined as unknown };
      try {
        response.data = structuredClone(
          route((config.method ?? 'get').toLowerCase(), config.url ?? '', body, token),
        );
        resolve(response);
      } catch (e) {
        if (!(e instanceof HttpError)) {
          reject(e);
          return;
        }
        response.status = e.status;
        response.data = { message: e.message };
        reject(new AxiosError(e.message, String(e.status), config, {}, response));
      }
    }, 250);
  });
