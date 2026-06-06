-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING', 'PAYMENT', 'SYSTEM');

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "tieuDe" TEXT NOT NULL,
    "noiDung" TEXT NOT NULL,
    "daXem" BOOLEAN NOT NULL DEFAULT false,
    "loai" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "nghiepVu" TEXT,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nguoiNhanId" TEXT NOT NULL,
    "nguoiNhanType" TEXT,
    "idDoiTuongLienQuan" TEXT,
    "urlDieuHuong" TEXT,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notifications_nguoiNhanId_daXem_idx" ON "Notifications"("nguoiNhanId", "daXem");

-- CreateIndex
CREATE INDEX "Notifications_ngayTao_idx" ON "Notifications"("ngayTao");
