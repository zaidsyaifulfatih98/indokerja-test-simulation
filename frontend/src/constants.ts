import type { ApplicationStatus, JobType } from './types';

export const JOB_TYPE_LABEL: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
};

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  REVIEWING: 'Reviewing',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
};

export const STATUS_ORDER = Object.keys(STATUS_LABEL) as ApplicationStatus[];
