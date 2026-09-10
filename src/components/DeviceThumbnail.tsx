import type { DeviceCategory } from "@/types/device";

const CATEGORY_STYLES: Record<DeviceCategory, { gradient: string; shape: string }> = {
  iphone: { gradient: "from-primary/15 to-primary/5", shape: "h-20 w-12 rounded-2xl" },
  ipad: { gradient: "from-accent/20 to-accent/5", shape: "h-20 w-16 rounded-xl" },
  "galaxy-s": { gradient: "from-ink/10 to-ink/[0.02]", shape: "h-20 w-11 rounded-2xl" },
};

export function DeviceThumbnail({ category, className }: { category: DeviceCategory; className?: string }) {
  const style = CATEGORY_STYLES[category];
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} ${className ?? "h-40"}`}
    >
      <div className={`border-2 border-ink/15 bg-white/70 ${style.shape}`} />
    </div>
  );
}
