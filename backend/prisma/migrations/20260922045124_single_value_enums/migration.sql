/*
  Warnings:

  - You are about to drop the column `descripton` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `description` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED',
ALTER COLUMN "status" SET DATA TYPE "Statuses" USING (COALESCE("status"[1], 'APPLIED'::"Statuses")),
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "descripton",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "job_type" SET DATA TYPE "JobTypes" USING ("job_type"[1]),
ALTER COLUMN "job_type" SET NOT NULL;

ALTER TABLE "Jobs" ALTER COLUMN "description" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DATA TYPE "Roles" USING ("role"[1]),
ALTER COLUMN "role" SET NOT NULL;
