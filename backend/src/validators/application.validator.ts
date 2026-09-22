import { z } from "zod";
import { Statuses } from "../../generated/prisma/client";

export const updateApplicationStatusSchema = z.object({
    status: z.enum(Statuses, { message: "Status tidak valid" }),
    note: z.string().trim().max(500).optional(),
});
