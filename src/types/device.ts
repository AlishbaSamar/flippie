export type DeviceCategory = "iphone" | "ipad" | "galaxy-s";

export interface StorageOption {
  label: string;
  gb: number;
}

export interface DeviceModel {
  id: string;
  category: DeviceCategory;
  name: string;
  releaseYear: number;
  image: string;
  storageOptions: StorageOption[];
  /** Best-condition, top-storage trade-in value in EUR; used as the pricing anchor. */
  basePriceEUR: number;
}

export type FunctionalStatus = "works-perfectly" | "minor-issues" | "does-not-turn-on";
export type ScreenCondition = "flawless" | "light-wear" | "cracked-or-damaged";
export type BodyCondition = "flawless" | "light-wear" | "heavy-wear";
export type BatteryHealth = "90-100" | "80-89" | "below-80" | "unknown";

export interface ConditionAnswers {
  functional: FunctionalStatus;
  screen: ScreenCondition;
  body: BodyCondition;
  battery: BatteryHealth;
}

export interface Quote {
  model: DeviceModel;
  storage: StorageOption;
  condition: ConditionAnswers;
  offerEUR: number;
}
