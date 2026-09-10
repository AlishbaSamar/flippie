import { ConditionAnswers, DeviceModel, Quote, StorageOption } from "@/types/device";

const FUNCTIONAL_MULTIPLIER: Record<ConditionAnswers["functional"], number> = {
  "works-perfectly": 1,
  "minor-issues": 0.7,
  "does-not-turn-on": 0.15,
};

const SCREEN_MULTIPLIER: Record<ConditionAnswers["screen"], number> = {
  flawless: 1,
  "light-wear": 0.9,
  "cracked-or-damaged": 0.55,
};

const BODY_MULTIPLIER: Record<ConditionAnswers["body"], number> = {
  flawless: 1,
  "light-wear": 0.95,
  "heavy-wear": 0.8,
};

const BATTERY_MULTIPLIER: Record<ConditionAnswers["battery"], number> = {
  "90-100": 1,
  "80-89": 0.92,
  "below-80": 0.8,
  unknown: 0.88,
};

const STORAGE_STEP_BONUS = 0.06;

export function estimateOffer(model: DeviceModel, storage: StorageOption, condition: ConditionAnswers): number {
  const storageIndex = model.storageOptions.findIndex((option) => option.gb === storage.gb);
  const storageMultiplier = 1 + Math.max(storageIndex, 0) * STORAGE_STEP_BONUS;

  const conditionMultiplier =
    FUNCTIONAL_MULTIPLIER[condition.functional] *
    SCREEN_MULTIPLIER[condition.screen] *
    BODY_MULTIPLIER[condition.body] *
    BATTERY_MULTIPLIER[condition.battery];

  const raw = model.basePriceEUR * storageMultiplier * conditionMultiplier;
  return Math.max(Math.round(raw / 5) * 5, 10);
}

export function buildQuote(model: DeviceModel, storage: StorageOption, condition: ConditionAnswers): Quote {
  return {
    model,
    storage,
    condition,
    offerEUR: estimateOffer(model, storage, condition),
  };
}

const RESALE_MARGIN = 1.35;

/** What we list a refurbished device for, after buying it at the trade-in offer price. */
export function estimateResalePrice(model: DeviceModel, storage: StorageOption, condition: ConditionAnswers): number {
  const offer = estimateOffer(model, storage, condition);
  return Math.round((offer * RESALE_MARGIN) / 5) * 5 - 1;
}
