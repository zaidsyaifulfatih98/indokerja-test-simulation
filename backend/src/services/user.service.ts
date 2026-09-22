import prisma from "../configs/pool-connection.config";
import bcrypt from "bcrypt";
import { Roles } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";

export const userService = {
    async register(data: { name: string; email: string; password: string; role: Roles }) {
        const existing = await prisma.users.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new AppError(409, "Email sudah terdaftar");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.users.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
        });

        const token = signToken({ id: user.id, role: user.role });
        return { user, token };
    },

    async login(email: string, password: string) {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            throw new AppError(401, "Email atau password salah");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AppError(401, "Email atau password salah");
        }

        const token = signToken({ id: user.id, role: user.role });
        return { user, token };
    },

    async getById(id: string) {
        return prisma.users.findUnique({ where: { id } });
    },
};
