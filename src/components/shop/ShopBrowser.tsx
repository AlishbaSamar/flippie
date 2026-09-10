"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORY_LABELS } from "@/data/devices";
import { conditionGrade, ConditionGrade } from "@/lib/condition";
import { InventoryItem } from "@/types/commerce";
import type { DeviceCategory } from "@/types/device";

const CATEGORY_FILTERS: (DeviceCategory | "all")[] = ["all", "iphone", "ipad", "galaxy-s"];
const GRADE_FILTERS: (ConditionGrade | "all")[] = ["all", "Excellent", "Good", "Fair", "Poor"];
const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest devices first" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function ShopBrowser({ items }: { items: InventoryItem[] }) {
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>("all");
  const [grade, setGrade] = useState<(typeof GRADE_FILTERS)[number]>("all");
  const [sort, setSort] = useState<SortValue>("price-asc");

  const filtered = useMemo(() => {
    let result = items.filter((item) => category === "all" || item.model.category === category);
    result = result.filter((item) => grade === "all" || conditionGrade(item.condition) === grade);

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.listPriceEUR - b.listPriceEUR;
      if (sort === "price-desc") return b.listPriceEUR - a.listPriceEUR;
      return b.model.releaseYear - a.model.releaseYear;
    });

    return result;
  }, [items, category, grade, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((option) => (
            <button
              key={option}
              onClick={() => setCategory(option)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                category === option
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-ink hover:border-primary"
              }`}
            >
              {option === "all" ? "All devices" : CATEGORY_LABELS[option]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={grade}
            onChange={(event) => setGrade(event.target.value as (typeof GRADE_FILTERS)[number])}
            className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold text-ink"
          >
            {GRADE_FILTERS.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "Any condition" : option}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-semibold text-ink"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No devices match those filters right now.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
