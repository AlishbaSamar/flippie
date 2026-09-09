import { DeviceCategory, DeviceModel, StorageOption } from "@/types/device";

const storages = (...gbList: number[]): StorageOption[] =>
  gbList.map((gb) => ({ gb, label: gb >= 1000 ? `${gb / 1000}TB` : `${gb}GB` }));

function iphone(
  name: string,
  releaseYear: number,
  storageOptions: StorageOption[],
  basePriceEUR: number,
): DeviceModel {
  return {
    id: `iphone-${name.toLowerCase().replace(/\s+/g, "-")}`,
    category: "iphone",
    name: `iPhone ${name}`,
    releaseYear,
    image: "/devices/iphone-placeholder.svg",
    storageOptions,
    basePriceEUR,
  };
}

function ipad(name: string, releaseYear: number, storageOptions: StorageOption[], basePriceEUR: number): DeviceModel {
  return {
    id: `ipad-${name.toLowerCase().replace(/\s+/g, "-")}`,
    category: "ipad",
    name: `iPad (${name})`,
    releaseYear,
    image: "/devices/ipad-placeholder.svg",
    storageOptions,
    basePriceEUR,
  };
}

function galaxy(name: string, releaseYear: number, storageOptions: StorageOption[], basePriceEUR: number): DeviceModel {
  return {
    id: `galaxy-${name.toLowerCase().replace(/\s+/g, "-")}`,
    category: "galaxy-s",
    name: `Galaxy ${name}`,
    releaseYear,
    image: "/devices/galaxy-placeholder.svg",
    storageOptions,
    basePriceEUR,
  };
}

export const IPHONES: DeviceModel[] = [
  iphone("11", 2019, storages(64, 128, 256), 120),
  iphone("12", 2020, storages(64, 128, 256), 180),
  iphone("13", 2021, storages(128, 256, 512), 260),
  iphone("14", 2022, storages(128, 256, 512), 340),
  iphone("15", 2023, storages(128, 256, 512), 460),
  iphone("16", 2024, storages(128, 256, 512), 600),
  iphone("17", 2025, storages(256, 512, 1000), 780),
];

export const IPADS: DeviceModel[] = [
  ipad("9th generation", 2021, storages(64, 256), 140,),
  ipad("10th generation", 2022, storages(64, 256), 220),
  ipad("11th generation", 2025, storages(128, 256, 512), 320),
];

export const GALAXY_S: DeviceModel[] = [
  galaxy("S21", 2021, storages(128, 256), 110),
  galaxy("S21+", 2021, storages(128, 256), 140),
  galaxy("S21 Ultra", 2021, storages(128, 256, 512), 190),
  galaxy("S22", 2022, storages(128, 256), 160),
  galaxy("S22+", 2022, storages(128, 256), 200),
  galaxy("S22 Ultra", 2022, storages(128, 256, 512), 260),
  galaxy("S23", 2023, storages(128, 256), 240),
  galaxy("S23+", 2023, storages(256, 512), 290),
  galaxy("S23 Ultra", 2023, storages(256, 512, 1000), 380),
  galaxy("S24", 2024, storages(128, 256), 340),
  galaxy("S24+", 2024, storages(256, 512), 410),
  galaxy("S24 Ultra", 2024, storages(256, 512, 1000), 520),
  galaxy("S25", 2025, storages(128, 256), 460),
  galaxy("S25+", 2025, storages(256, 512), 540),
  galaxy("S25 Ultra", 2025, storages(256, 512, 1000), 660),
];

export const ALL_DEVICES: DeviceModel[] = [...IPHONES, ...IPADS, ...GALAXY_S];

export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
  iphone: "iPhone",
  ipad: "iPad",
  "galaxy-s": "Samsung Galaxy S",
};

export function devicesByCategory(category: DeviceCategory): DeviceModel[] {
  switch (category) {
    case "iphone":
      return IPHONES;
    case "ipad":
      return IPADS;
    case "galaxy-s":
      return GALAXY_S;
  }
}
