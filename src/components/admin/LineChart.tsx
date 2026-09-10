"use client";

import { useRef, useState } from "react";
import { formatCurrencyCompact } from "@/lib/format";

export interface LineChartSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  labels: string[];
  series: LineChartSeries[];
  valueFormat?: "currency" | "number";
  height?: number;
}

function formatValue(value: number, format: "currency" | "number"): string {
  return format === "currency" ? formatCurrencyCompact(value) : value.toLocaleString();
}

const WIDTH = 640;
const PAD_LEFT = 44;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export function LineChart({ labels, series, valueFormat = "number", height = 260 }: LineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = height - PAD_TOP - PAD_BOTTOM;
  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));
  const niceMax = Math.ceil(maxValue / 4) * 4 || 1;

  const xFor = (index: number) => PAD_LEFT + (index / Math.max(1, labels.length - 1)) * plotWidth;
  const yFor = (value: number) => PAD_TOP + plotHeight - (value / niceMax) * plotHeight;

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const ratio = (relativeX - PAD_LEFT) / plotWidth;
    const index = Math.round(ratio * (labels.length - 1));
    setHoverIndex(Math.min(labels.length - 1, Math.max(0, index)));
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      {series.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-4 text-xs font-medium text-ink">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full touch-none"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Trend chart"
      >
        {gridLines.map((fraction) => {
          const y = PAD_TOP + plotHeight * (1 - fraction);
          return (
            <g key={fraction}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} stroke="var(--viz-grid)" strokeWidth={1} />
              <text x={PAD_LEFT - 8} y={y + 3} textAnchor="end" fontSize={10} fill="var(--viz-text-muted)">
                {formatValue(Math.round(niceMax * fraction), valueFormat)}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => (
          <text
            key={label}
            x={xFor(index)}
            y={height - 8}
            textAnchor={index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"}
            fontSize={10}
            fill="var(--viz-text-muted)"
          >
            {label}
          </text>
        ))}

        {series.map((s) => {
          const points = s.values.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
          const last = s.values.length - 1;
          return (
            <g key={s.key}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={xFor(last)}
                cy={yFor(s.values[last])}
                r={4}
                fill={s.color}
                stroke="var(--viz-surface)"
                strokeWidth={2}
              />
            </g>
          );
        })}

        {hoverIndex !== null && (
          <line
            x1={xFor(hoverIndex)}
            x2={xFor(hoverIndex)}
            y1={PAD_TOP}
            y2={PAD_TOP + plotHeight}
            stroke="var(--viz-baseline)"
            strokeWidth={1}
          />
        )}
        {hoverIndex !== null &&
          series.map((s) => (
            <circle
              key={s.key}
              cx={xFor(hoverIndex)}
              cy={yFor(s.values[hoverIndex])}
              r={4}
              fill={s.color}
              stroke="var(--viz-surface)"
              strokeWidth={2}
            />
          ))}
      </svg>

      {hoverIndex !== null && (
        <div className="mt-2 rounded-lg border border-border bg-white p-3 text-xs shadow-sm">
          <p className="font-semibold text-ink">{labels[hoverIndex]}</p>
          <ul className="mt-1 space-y-1">
            {series.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-6">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
                <span className="font-semibold text-ink">{formatValue(s.values[hoverIndex], valueFormat)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
