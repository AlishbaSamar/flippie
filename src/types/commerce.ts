import { ConditionAnswers, DeviceModel, StorageOption } from "./device";

export interface Country {
  code: string;
  name: string;
}

export type PurchaseStatus = "submitted" | "approved" | "paid" | "rejected";

export interface Purchase {
  id: string;
  model: DeviceModel;
  storage: StorageOption;
  condition: ConditionAnswers;
  offerEUR: number;
  status: PurchaseStatus;
  country: Country;
  createdAt: string;
}

export type InventoryStatus = "processing" | "listed" | "reserved" | "sold";

export interface InventoryItem {
  id: string;
  model: DeviceModel;
  storage: StorageOption;
  condition: ConditionAnswers;
  listPriceEUR: number;
  status: InventoryStatus;
  sourcePurchaseId?: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  inventoryItemId: string;
  priceEUR: number;
  status: OrderStatus;
  country: Country;
  createdAt: string;
}
