-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "shippingLabelSentAt" TIMESTAMP(3),
ADD COLUMN     "shippingLabelUrl" TEXT,
ADD COLUMN     "shippingTrackingNumber" TEXT NOT NULL DEFAULT '';
