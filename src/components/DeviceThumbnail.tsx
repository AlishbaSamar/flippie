import type { DeviceCategory } from "@/types/device";

const CATEGORY_BACKDROPS: Record<DeviceCategory, string> = {
  iphone: "from-primary/15 to-primary/5",
  ipad: "from-accent/20 to-accent/5",
  "galaxy-s": "from-ink/10 to-ink/[0.02]",
};

/** A handful of on-brand tint variants, picked per model so devices in the same
 * category don't all render as one identical shape (there's no real product
 * photography yet — this is the interim differentiator). */
const TINTS = [
  { body: "var(--color-primary)", body2: "var(--color-primary-dark)" },
  { body: "var(--viz-series-1)", body2: "var(--viz-seq-600)" },
  { body: "var(--viz-series-3)", body2: "#0d7a52" },
  { body: "var(--viz-series-5)", body2: "#b34c73" },
  { body: "var(--color-accent-dark)", body2: "#a5761f" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

interface DeviceThumbnailProps {
  category: DeviceCategory;
  modelName?: string;
  releaseYear?: number;
  className?: string;
}

export function DeviceThumbnail({ category, modelName, releaseYear, className }: DeviceThumbnailProps) {
  const tint = TINTS[modelName ? hashString(modelName) % TINTS.length : 0];
  const isTablet = category === "ipad";
  // Dynamic Island shipped across the mainline iPhone lineup starting with the 15 (2023).
  const hasDynamicIsland = category === "iphone" && (releaseYear ?? 0) >= 2023;
  const hasNotch = category === "iphone" && !hasDynamicIsland;

  const width = isTablet ? 100 : 62;
  const bodyX = (140 - width) / 2;

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_BACKDROPS[category]} ${className ?? "h-40"}`}
    >
      <svg viewBox="0 0 140 160" className="h-[78%] w-auto" aria-hidden="true">
        <rect
          x={bodyX}
          y={10}
          width={width}
          height={140}
          rx={isTablet ? 10 : 16}
          fill="white"
          fillOpacity={0.75}
          stroke={tint.body2}
          strokeWidth={2}
        />
        <rect
          x={bodyX + 4}
          y={14}
          width={width - 8}
          height={132}
          rx={isTablet ? 7 : 12}
          fill={tint.body}
          fillOpacity={0.14}
        />

        {hasNotch && (
          <rect x={70 - 13} y={14} width={26} height={7} rx={3.5} fill={tint.body2} opacity={0.55} />
        )}
        {hasDynamicIsland && (
          <rect x={70 - 10} y={19} width={20} height={6} rx={3} fill={tint.body2} opacity={0.6} />
        )}
        {category === "galaxy-s" && <circle cx={70} cy={19} r={3} fill={tint.body2} opacity={0.55} />}
        {isTablet && <circle cx={70} cy={17} r={2.5} fill={tint.body2} opacity={0.5} />}

        {!isTablet && (
          <rect x={70 - 16} y={140} width={32} height={3.5} rx={1.75} fill={tint.body2} opacity={0.4} />
        )}
      </svg>
    </div>
  );
}
