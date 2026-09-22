import { Router } from "express";
import { applicationController } from "../controllers/application.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { updateApplicationStatusSchema } from "../validators/application.validator";
import { Roles } from "../../generated/prisma/client";

const applicationRouter = Router();

applicationRouter.get("/me", requireAuth, requireRole(Roles.JOB_SEEKER), applicationController.listMine);
applicationRouter.patch(
    "/:id/status",
    requireAuth,
    requireRole(Roles.COMPANY),
    validateBody(updateApplicationStatusSchema),
    applicationController.updateStatus,
);
applicationRouter.get("/:id/history", requireAuth, applicationController.getHistory);

export default applicationRouter;
