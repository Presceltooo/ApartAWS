-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE t.typname = 'ReviewStatus' AND n.nspname = 'apartment') THEN
        CREATE TYPE "apartment"."ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');
    END IF;
END$$;

-- AlterTable
ALTER TABLE "apartment"."Apartments" ADD COLUMN IF NOT EXISTS "isAutoApproveReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "apartment"."Reviews" ADD COLUMN IF NOT EXISTS "status" "apartment"."ReviewStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "apartment"."Reviews" ADD COLUMN IF NOT EXISTS "reply" TEXT;
ALTER TABLE "apartment"."Reviews" ADD COLUMN IF NOT EXISTS "repliedAt" TIMESTAMP(3);
