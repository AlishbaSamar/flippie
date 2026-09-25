"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORY_LABELS } from "@/lib/category-labels";
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
const PAGE_SIZE = 9;

export function ShopBrowser({
  items,
  initialCategory,
}: {
  items: InventoryItem[];
  initialCategory?: DeviceCategory;
}) {
  const [category, setCategory] = useState<(typeof CATEGORY_FILTERS)[number]>(initialCategory ?? "all");
  const [grade, setGrade] = useState<(typeof GRADE_FILTERS)[number]>("all");
  const [sort, setSort] = useState<SortValue>("price-asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Reset pagination when filters change, following React's "adjust state
  // during render" pattern instead of an effect (avoids an extra render pass).
  const filterKey = `${category}|${grade}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);

  function clearFilters() {
    setCategory("all");
    setGrade("all");
  }

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
        <div className="py-16 text-center">
          <p className="text-muted">No devices match those filters right now.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {visible.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                Load more devices
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
