import { Router } from "express";
import { jobController } from "../controllers/job.controller";
import { attachUserIfPresent, requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { applyJobSchema, createJobSchema } from "../validators/job.validator";
import { Roles } from "../../generated/prisma/client";

const jobRouter = Router();

jobRouter.get("/mine", requireAuth, requireRole(Roles.COMPANY), jobController.listMine);
jobRouter.get("/", attachUserIfPresent, jobController.list);
jobRouter.post("/", requireAuth, requireRole(Roles.COMPANY), validateBody(createJobSchema), jobController.create);
jobRouter.get("/:id/applications", requireAuth, requireRole(Roles.COMPANY), jobController.listApplicants);
jobRouter.post(
    "/:id/apply",
    requireAuth,
    requireRole(Roles.JOB_SEEKER),
    validateBody(applyJobSchema),
    jobController.apply,
);
jobRouter.get("/:id", attachUserIfPresent, jobController.getById);

export default jobRouter;
