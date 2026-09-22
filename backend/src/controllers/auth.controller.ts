import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { toUserDTO } from "../utils/dto";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, token } = await userService.register(req.body)

            res.status(201).json({
                token,
                user: toUserDTO(user),
            })
        } catch (error) {
            next(error)
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const { user, token } = await userService.login(email, password)

            res.status(200).json({
                token,
                user: toUserDTO(user),
            })
        } catch (error) {
            next(error)
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.getById(req.user!.id)
            if (!user) {
                return res.status(404).json({ success: false, message: "User tidak ditemukan" })
            }
            res.status(200).json(toUserDTO(user))
        } catch (error) {
            next(error)
        }
    },
}
