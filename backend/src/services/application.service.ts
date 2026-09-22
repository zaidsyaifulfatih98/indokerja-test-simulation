import prisma from "../configs/pool-connection.config";
import { Statuses } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";

const APPLICATION_LIST_INCLUDE = {
    Job: {
        include: { user: { select: { id: true, name: true } } },
    },
} as const;

export const applicationService = {
    async apply(jobId: string, userId: string, coverLetter?: string) {
        const job = await prisma.jobs.findUnique({ where: { id: jobId } })
        if (!job) {
            throw new AppError(404, "Lowongan tidak ditemukan")
        }

        const existing = await prisma.applications.findFirst({
            where: { jobs_id: jobId, user_id: userId },
        })
        if (existing) {
            throw new AppError(409, "Kamu sudah melamar lowongan ini")
        }

        const application = await prisma.applications.create({
            data: {
                jobs_id: jobId,
                user_id: userId,
                cover_letter: coverLetter,
                histories: {
                    create: {
                        to_status: Statuses.APPLIED,
                        user_id: userId,
                    },
                },
            },
            include: APPLICATION_LIST_INCLUDE,
        })

        return application
    },

    async listMine(userId: string) {
        return prisma.applications.findMany({
            where: { user_id: userId },
            include: APPLICATION_LIST_INCLUDE,
            orderBy: { createdAt: "desc" },
        })
    },

    async updateStatus(applicationId: string, companyUserId: string, newStatus: Statuses, note?: string) {
        const application = await prisma.applications.findUnique({
            where: { id: applicationId },
            include: { Job: true },
        })
        if (!application) {
            throw new AppError(404, "Lamaran tidak ditemukan")
        }
        if (application.Job.user_id !== companyUserId) {
            throw new AppError(403, "Kamu tidak punya akses ke lamaran ini")
        }

        const previousStatus = application.status

        const updated = await prisma.applications.update({
            where: { id: applicationId },
            data: {
                status: newStatus,
                histories: {
                    create: {
                        from_status: previousStatus,
                        to_status: newStatus,
                        note,
                        user_id: companyUserId,
                    },
                },
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        })

        return updated
    },

    async getHistory(applicationId: string) {
        return prisma.histories.findMany({
            where: { application_id: applicationId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: "asc" },
        })
    },
}
