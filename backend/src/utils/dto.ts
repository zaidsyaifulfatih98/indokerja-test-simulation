type DecimalLike = { toNumber(): number } | number | string;

function toNumber(value: DecimalLike | null): number | null {
    if (value === null) return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value);
    return value.toNumber();
}

export function toUserDTO(user: { id: string; name: string; email: string; role: string }) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export function toJobDTO(job: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string;
    salary_min: DecimalLike | null;
    salary_max: DecimalLike | null;
    job_type: string;
    createdAt: Date;
    user: { id: string; name: string };
    hasApplied?: boolean;
    applicationCount?: number;
}) {
    return {
        id: job.id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salaryMin: toNumber(job.salary_min),
        salaryMax: toNumber(job.salary_max),
        jobType: job.job_type,
        createdAt: job.createdAt,
        company: { id: job.user.id, name: job.user.name },
        ...(job.hasApplied !== undefined && { hasApplied: job.hasApplied }),
        ...(job.applicationCount !== undefined && { applicationCount: job.applicationCount }),
    };
}

export function toApplicantDTO(application: {
    id: string;
    status: string;
    cover_letter: string | null;
    createdAt: Date;
    user: { id: string; name: string; email: string };
}) {
    return {
        id: application.id,
        status: application.status,
        coverLetter: application.cover_letter,
        createdAt: application.createdAt,
        candidate: { id: application.user.id, name: application.user.name, email: application.user.email },
    };
}

export function toApplicationDTO(application: {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    Job: {
        id: string;
        title: string;
        location: string;
        job_type: string;
        user: { id: string; name: string };
    };
}) {
    return {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        job: {
            id: application.Job.id,
            title: application.Job.title,
            location: application.Job.location,
            jobType: application.Job.job_type,
            company: { id: application.Job.user.id, name: application.Job.user.name },
        },
    };
}

export function toHistoryDTO(history: {
    id: string;
    from_status: string | null;
    to_status: string;
    note: string | null;
    createdAt: Date;
    user: { id: string; name: string } | null;
}) {
    return {
        id: history.id,
        fromStatus: history.from_status,
        toStatus: history.to_status,
        note: history.note,
        createdAt: history.createdAt,
        changedBy: history.user ? { id: history.user.id, name: history.user.name } : null,
    };
}
