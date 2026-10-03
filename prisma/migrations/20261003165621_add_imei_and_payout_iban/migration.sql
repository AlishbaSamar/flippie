-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "imei" TEXT;

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "payoutIban" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "InventoryItem_imei_idx" ON "InventoryItem"("imei");
