-- Create schemas if they do not exist
CREATE SCHEMA IF NOT EXISTS "booking";
CREATE SCHEMA IF NOT EXISTS "apartment";

-- CreateEnum
CREATE TYPE "booking"."PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "booking"."Bookings" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "booking"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vnpTransactionId" TEXT;
