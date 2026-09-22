import { z } from "zod";
import { Roles } from "../../generated/prisma/client";

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(50),
    email: z.email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(Roles, { message: "Role harus JOB_SEEKER atau COMPANY" }),
});

export const loginSchema = z.object({
    email: z.email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});
