-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "auth"."Role" AS ENUM ('ADMIN', 'OWNER', 'TENANT');

-- AlterTable
ALTER TABLE "booking"."Bookings" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,0);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "fullName" TEXT,
    "role" "auth"."Role" NOT NULL DEFAULT 'TENANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" TEXT,
    "resetTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."RefreshTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_bookingId_key" ON "Reviews"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "auth"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "auth"."Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "auth"."RefreshTokens"("token");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."RefreshTokens" ADD CONSTRAINT "RefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
