-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE INDEX "Order_stripeSessionId_idx" ON "Order"("stripeSessionId");
