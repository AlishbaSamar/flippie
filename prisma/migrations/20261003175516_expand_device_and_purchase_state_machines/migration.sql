-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryStatus" ADD VALUE 'WIPING_DATA';
ALTER TYPE "InventoryStatus" ADD VALUE 'REPAIR';
ALTER TYPE "InventoryStatus" ADD VALUE 'FINAL_QA';
ALTER TYPE "InventoryStatus" ADD VALUE 'RETURNED';
ALTER TYPE "InventoryStatus" ADD VALUE 'QUARANTINE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PurchaseStatus" ADD VALUE 'RECEIVED';
ALTER TYPE "PurchaseStatus" ADD VALUE 'IN_INSPECTION';
ALTER TYPE "PurchaseStatus" ADD VALUE 'REVISED_OFFER_SENT';

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "revisedOfferEUR" INTEGER,
ADD COLUMN     "revisedOfferNote" TEXT NOT NULL DEFAULT '';
