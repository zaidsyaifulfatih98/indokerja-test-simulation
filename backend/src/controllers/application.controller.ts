import { Request, Response, NextFunction } from "express";
import { applicationService } from "../services/application.service";
import { toApplicantDTO, toApplicationDTO, toHistoryDTO } from "../utils/dto";
import { Statuses } from "../../generated/prisma/client";

export const applicationController = {
    async listMine(req: Request, res: Response, next: NextFunction) {
        try {
            const applications = await applicationService.listMine(req.user!.id)
            res.status(200).json(applications.map(toApplicationDTO))
        } catch (error) {
            next(error)
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, note } = req.body as { status: Statuses; note?: string }
            const updated = await applicationService.updateStatus(req.params.id as string, req.user!.id, status, note)
            res.status(200).json(toApplicantDTO(updated))
        } catch (error) {
            next(error)
        }
    },

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const history = await applicationService.getHistory(req.params.id as string)
            res.status(200).json(history.map(toHistoryDTO))
        } catch (error) {
            next(error)
        }
    },
}
