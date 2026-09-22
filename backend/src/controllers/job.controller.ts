import { Request, Response, NextFunction } from "express";
import { jobServices } from "../services/job.service";
import { applicationService } from "../services/application.service";
import { toApplicantDTO, toApplicationDTO, toJobDTO } from "../utils/dto";

export const jobController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await jobServices.create(req.user!.id, req.body);
            res.status(201).json(toJobDTO(job));
        } catch (error) {
            next(error);
        }
    },

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const jobs = await jobServices.list(req.user?.id);
            res.status(200).json(jobs.map(toJobDTO));
        } catch (error) {
            next(error);
        }
    },

    async listMine(req: Request, res: Response, next: NextFunction) {
        try {
            const jobs = await jobServices.listMine(req.user!.id);
            res.status(200).json(jobs.map(toJobDTO));
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const job = await jobServices.getById(req.params.id as string, req.user?.id);
            res.status(200).json(toJobDTO(job));
        } catch (error) {
            next(error);
        }
    },

    async listApplicants(req: Request, res: Response, next: NextFunction) {
        try {
            const applicants = await jobServices.listApplicants(req.params.id as string, req.user!.id);
            res.status(200).json(applicants.map(toApplicantDTO));
        } catch (error) {
            next(error);
        }
    },

    async apply(req: Request, res: Response, next: NextFunction) {
        try {
            const { coverLetter } = req.body as { coverLetter?: string };
            const application = await applicationService.apply(req.params.id as string, req.user!.id, coverLetter);
            res.status(201).json(toApplicationDTO(application));
        } catch (error) {
            next(error);
        }
    },
};
