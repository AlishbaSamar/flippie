import type {
  DeviceModel as DbDeviceModel,
  DeviceCategory as DbCategory,
  InventoryItem as DbInventoryItem,
} from "@/generated/prisma/client";
import type { ConditionAnswers, DeviceCategory, DeviceModel, StorageOption } from "@/types/device";
import type { InventoryItem } from "@/types/commerce";

const DB_TO_APP_CATEGORY: Record<DbCategory, DeviceCategory> = {
  IPHONE: "iphone",
  IPAD: "ipad",
  GALAXY_S: "galaxy-s",
};

const APP_TO_DB_CATEGORY: Record<DeviceCategory, DbCategory> = {
  iphone: "IPHONE",
  ipad: "IPAD",
  "galaxy-s": "GALAXY_S",
};

export function toDbCategory(category: DeviceCategory): DbCategory {
  return APP_TO_DB_CATEGORY[category];
}

export function mapDeviceModel(row: DbDeviceModel): DeviceModel {
  return {
    id: row.id,
    category: DB_TO_APP_CATEGORY[row.category],
    name: row.name,
    releaseYear: row.releaseYear,
    image: `/devices/${DB_TO_APP_CATEGORY[row.category]}-placeholder.svg`,
    storageOptions: row.storageOptions as unknown as StorageOption[],
    basePriceEUR: row.basePriceEUR,
  };
}

export function mapCondition(json: unknown): ConditionAnswers {
  return json as ConditionAnswers;
}

export function mapInventoryItem(row: DbInventoryItem & { model: DbDeviceModel }): InventoryItem {
  const model = mapDeviceModel(row.model);
  const storage = model.storageOptions.find((s) => s.gb === row.storageGb) ?? {
    gb: row.storageGb,
    label: row.storageLabel,
  };

  return {
    id: row.id,
    model,
    storage,
    condition: mapCondition(row.condition),
    listPriceEUR: row.listPriceEUR,
    status: row.status.toLowerCase() as InventoryItem["status"],
    sourcePurchaseId: row.sourcePurchaseId ?? undefined,
  };
}
