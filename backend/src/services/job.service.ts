import prisma from "../configs/pool-connection.config";
import { JobTypes } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";

const JOB_WITH_COMPANY = {
    user: { select: { id: true, name: true } },
} as const;

export const jobServices = {
    async create(
        userId: string,
        data: {
            title: string;
            description: string;
            requirements: string;
            location: string;
            salaryMin?: number;
            salaryMax?: number;
            jobType: JobTypes;
        },
    ) {
        return prisma.jobs.create({
            data: {
                title: data.title,
                description: data.description,
                requirements: data.requirements,
                location: data.location,
                salary_min: data.salaryMin,
                salary_max: data.salaryMax,
                job_type: data.jobType,
                user_id: userId,
            },
            include: JOB_WITH_COMPANY,
        });
    },

    async list(currentUserId?: string) {
        const jobs = await prisma.jobs.findMany({
            include: JOB_WITH_COMPANY,
            orderBy: { createdAt: "desc" },
        });

        if (!currentUserId) return jobs;

        const applied = await prisma.applications.findMany({
            where: { user_id: currentUserId, jobs_id: { in: jobs.map((job) => job.id) } },
            select: { jobs_id: true },
        });
        const appliedIds = new Set(applied.map((application) => application.jobs_id));

        return jobs.map((job) => ({ ...job, hasApplied: appliedIds.has(job.id) }));
    },

    async getById(id: string, currentUserId?: string) {
        const job = await prisma.jobs.findUnique({
            where: { id },
            include: JOB_WITH_COMPANY,
        });
        if (!job) {
            throw new AppError(404, "Lowongan tidak ditemukan");
        }

        if (!currentUserId) return job;

        const existing = await prisma.applications.findFirst({
            where: { jobs_id: id, user_id: currentUserId },
        });

        return { ...job, hasApplied: Boolean(existing) };
    },

    async listMine(userId: string) {
        const jobs = await prisma.jobs.findMany({
            where: { user_id: userId },
            include: {
                ...JOB_WITH_COMPANY,
                _count: { select: { applications: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return jobs.map((job) => ({ ...job, applicationCount: job._count.applications }));
    },

    async listApplicants(jobId: string, companyUserId: string) {
        const job = await prisma.jobs.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new AppError(404, "Lowongan tidak ditemukan");
        }
        if (job.user_id !== companyUserId) {
            throw new AppError(403, "Kamu tidak punya akses ke lowongan ini");
        }

        return prisma.applications.findMany({
            where: { jobs_id: jobId },
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
    },
};
