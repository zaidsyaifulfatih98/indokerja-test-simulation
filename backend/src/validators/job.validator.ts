import { z } from "zod";
import { JobTypes } from "../../generated/prisma/client";

export const createJobSchema = z.object({
    title: z.string().trim().min(3, "Judul minimal 3 karakter").max(100),
    description: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
    requirements: z.string().trim().min(3, "Requirement wajib diisi"),
    location: z.string().trim().min(3, "Lokasi wajib diisi"),
    salaryMin: z.number().positive().optional(),
    salaryMax: z.number().positive().optional(),
    jobType: z.enum(JobTypes, { message: "Job type tidak valid" }),
});

export const applyJobSchema = z.object({
    coverLetter: z.string().trim().max(2000).optional(),
});
