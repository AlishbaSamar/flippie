-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('IPHONE', 'IPAD', 'GALAXY_S');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('PROCESSING', 'LISTED', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DeviceModel" (
    "id" TEXT NOT NULL,
    "category" "DeviceCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "basePriceEUR" INTEGER NOT NULL,
    "storageOptions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "storageLabel" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "listPriceEUR" INTEGER NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'LISTED',
    "sourcePurchaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "storageLabel" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "offerEUR" INTEGER NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "priceEUR" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeviceModel_category_idx" ON "DeviceModel"("category");

-- CreateIndex
CREATE INDEX "InventoryItem_status_idx" ON "InventoryItem"("status");

-- CreateIndex
CREATE INDEX "InventoryItem_modelId_idx" ON "InventoryItem"("modelId");

-- CreateIndex
CREATE INDEX "Purchase_countryCode_idx" ON "Purchase"("countryCode");

-- CreateIndex
CREATE INDEX "Purchase_createdAt_idx" ON "Purchase"("createdAt");

-- CreateIndex
CREATE INDEX "Purchase_modelId_idx" ON "Purchase"("modelId");

-- CreateIndex
CREATE INDEX "Order_countryCode_idx" ON "Order"("countryCode");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "DeviceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "DeviceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
