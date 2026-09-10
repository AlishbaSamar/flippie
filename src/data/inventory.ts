import { IPADS, IPHONES, GALAXY_S } from "@/data/devices";
import { estimateResalePrice } from "@/lib/valuation";
import { ConditionAnswers, DeviceModel } from "@/types/device";
import { InventoryItem } from "@/types/commerce";

function iphone(name: string): DeviceModel {
  const model = IPHONES.find((m) => m.name === `iPhone ${name}`);
  if (!model) throw new Error(`Unknown iPhone model: ${name}`);
  return model;
}

function galaxy(name: string): DeviceModel {
  const model = GALAXY_S.find((m) => m.name === `Galaxy ${name}`);
  if (!model) throw new Error(`Unknown Galaxy model: ${name}`);
  return model;
}

function item(model: DeviceModel, gb: number, condition: ConditionAnswers): InventoryItem {
  const storage = model.storageOptions.find((option) => option.gb === gb);
  if (!storage) {
    throw new Error(`${model.name} has no ${gb}GB storage option`);
  }
  return {
    id: `${model.id}-${gb}-${condition.functional}-${condition.screen}`,
    model,
    storage,
    condition,
    listPriceEUR: estimateResalePrice(model, storage, condition),
    status: "listed",
  };
}

const excellent: ConditionAnswers = {
  functional: "works-perfectly",
  screen: "flawless",
  body: "flawless",
  battery: "90-100",
};

const good: ConditionAnswers = {
  functional: "works-perfectly",
  screen: "light-wear",
  body: "light-wear",
  battery: "80-89",
};

const fair: ConditionAnswers = {
  functional: "minor-issues",
  screen: "light-wear",
  body: "light-wear",
  battery: "below-80",
};

export const INVENTORY: InventoryItem[] = [
  item(iphone("11"), 64, fair),
  item(iphone("12"), 64, good),
  item(iphone("13"), 128, excellent),
  item(iphone("14"), 128, excellent),
  item(iphone("14"), 256, good),
  item(iphone("15"), 128, excellent),
  item(iphone("15"), 256, good),
  item(iphone("16"), 128, excellent),
  item(iphone("17"), 256, excellent),

  item(IPADS[0], 64, good),
  item(IPADS[1], 256, excellent),
  item(IPADS[2], 128, excellent),

  item(galaxy("S21"), 128, good),
  item(galaxy("S22"), 128, excellent),
  item(galaxy("S23"), 256, good),
  item(galaxy("S23 Ultra"), 256, excellent),
  item(galaxy("S24"), 256, excellent),
  item(galaxy("S24 Ultra"), 512, excellent),
  item(galaxy("S25"), 128, excellent),
];

export function findInventoryItem(id: string): InventoryItem | undefined {
  return INVENTORY.find((entry) => entry.id === id);
}
