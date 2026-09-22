import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { Roles } from "../../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

function extractToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return null;
    return header.slice("Bearer ".length);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
    }
}

export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
    const token = extractToken(req);
    if (token) {
        try {
            req.user = verifyToken(token);
        } catch {
            // Token invalid, biarkan request lanjut sebagai anonim
        }
    }
    next();
}

export function requireRole(...roles: Roles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Belum login" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Tidak punya akses untuk aksi ini" });
        }
        next();
    };
}
