-- Fix typo: SHORLISTED -> SHORTLISTED
CREATE TYPE "Statuses_new" AS ENUM ('APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED');

ALTER TABLE "Applications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Applications" ALTER COLUMN "status" TYPE "Statuses_new" USING (
  CASE WHEN "status"::text = 'SHORLISTED' THEN 'SHORTLISTED' ELSE "status"::text END
)::"Statuses_new";
ALTER TABLE "Applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED';

ALTER TABLE "Histories" ALTER COLUMN "from_status" TYPE "Statuses_new" USING (
  CASE WHEN "from_status"::text = 'SHORLISTED' THEN 'SHORTLISTED' ELSE "from_status"::text END
)::"Statuses_new";
ALTER TABLE "Histories" ALTER COLUMN "to_status" TYPE "Statuses_new" USING (
  CASE WHEN "to_status"::text = 'SHORLISTED' THEN 'SHORTLISTED' ELSE "to_status"::text END
)::"Statuses_new";

DROP TYPE "Statuses";
ALTER TYPE "Statuses_new" RENAME TO "Statuses";
