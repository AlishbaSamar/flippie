import Link from "next/link";
import { DeviceThumbnail } from "@/components/DeviceThumbnail";
import { conditionGrade } from "@/lib/condition";
import { InventoryItem } from "@/types/commerce";

const GRADE_BADGE: Record<string, string> = {
  Excellent: "bg-primary/10 text-primary",
  Good: "bg-accent/20 text-accent-dark",
  Fair: "bg-ink/10 text-ink",
  Poor: "bg-ink/10 text-muted",
};

export function ProductCard({ item }: { item: InventoryItem }) {
  const grade = conditionGrade(item.condition);

  return (
    <Link
      href={`/shop/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:border-primary hover:shadow-md"
    >
      <DeviceThumbnail category={item.model.category} className="h-44" />
      <div className="flex flex-1 flex-col gap-1 p-5">
        <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${GRADE_BADGE[grade]}`}>
          {grade}
        </span>
        <p className="mt-2 font-semibold text-ink group-hover:text-primary">{item.model.name}</p>
        <p className="text-sm text-muted">{item.storage.label}</p>
        <p className="mt-auto pt-3 text-xl font-bold text-ink">€{item.listPriceEUR}</p>
      </div>
    </Link>
  );
}
