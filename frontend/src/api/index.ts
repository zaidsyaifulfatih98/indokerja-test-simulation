import { http } from './client';
import type {
  Applicant,
  Application,
  ApplicationHistoryEntry,
  ApplicationStatus,
  AuthResponse,
  CreateJobInput,
  Job,
  Role,
  User,
} from '../types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const authApi = {
  login: (email: string, password: string) =>
    http.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
  register: (input: RegisterInput) =>
    http.post<AuthResponse>('/auth/register', input).then((r) => r.data),
  me: () => http.get<User>('/auth/me').then((r) => r.data),
};

export const jobsApi = {
  list: () => http.get<Job[]>('/jobs').then((r) => r.data),
  get: (id: string) => http.get<Job>(`/jobs/${id}`).then((r) => r.data),
  create: (input: CreateJobInput) => http.post<Job>('/jobs', input).then((r) => r.data),
  mine: () => http.get<Job[]>('/jobs/mine').then((r) => r.data),
  applicants: (jobId: string) =>
    http.get<Applicant[]>(`/jobs/${jobId}/applications`).then((r) => r.data),
  apply: (jobId: string, coverLetter?: string) =>
    http.post<Application>(`/jobs/${jobId}/apply`, { coverLetter }).then((r) => r.data),
};

export const applicationsApi = {
  mine: () => http.get<Application[]>('/applications/me').then((r) => r.data),
  updateStatus: (id: string, status: ApplicationStatus, note?: string) =>
    http.patch<Applicant>(`/applications/${id}/status`, { status, note }).then((r) => r.data),
  history: (id: string) =>
    http.get<ApplicationHistoryEntry[]>(`/applications/${id}/history`).then((r) => r.data),
};
