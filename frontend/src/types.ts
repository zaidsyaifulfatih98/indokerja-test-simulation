export type Role = 'JOB_SEEKER' | 'COMPANY';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';

export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: JobType;
  createdAt: string;
  company: { id: string; name: string };
  /** Hanya untuk Job Seeker */
  hasApplied?: boolean;
  /** Hanya untuk Company (lowongan miliknya) */
  applicationCount?: number;
}

export interface CreateJobInput {
  title: string;
  description: string;
  requirements?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job: Pick<Job, 'id' | 'title' | 'location' | 'jobType' | 'company'>;
}

export interface Applicant {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string | null;
  createdAt: string;
  candidate: { id: string; name: string; email: string };
}

export interface ApplicationHistoryEntry {
  id: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note?: string | null;
  createdAt: string;
  changedBy?: { id: string; name: string } | null;
}
