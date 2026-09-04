"use client";

import type { FoundNode, PlaceCounts } from "@/lib/found-geo";
import { useMemo, useState } from "react";

type Props = {
  nodes: FoundNode[];
  counts: Record<string, PlaceCounts>;
  selected: string | null;
  onSelect: (place: string) => void;
};

export function FoundMap({ nodes, counts, selected, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  const lit = useMemo(
    () => new Set(nodes.filter((n) => (counts[n.place]?.total ?? 0) > 0).map((n) => n.place)),
    [nodes, counts],
  );

  return (
    <div className="rail-tag overflow-hidden bg-chip">
      <div className="flex items-center justify-between border-b border-dashed border-ink/30 px-4 py-3">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
            The Sayari Map
          </p>
          <p className="mt-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
            Found in Nairobi
          </p>
        </div>
        <span className="stamp !py-0.5 !text-[8px]">Provenance</span>
      </div>

      <div className="relative aspect-[5/4] w-full sm:aspect-[16/11]">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          role="img"
          aria-label="Schematic map of Nairobi neighbourhoods where pairs were found"
        >
          {/* Paper grid */}
          <rect x="0" y="0" width="100" height="100" fill="var(--bone)" />
          {[20, 40, 60, 80].map((v) => (
            <g key={v}>
              <line
                x1={v}
                y1="0"
                x2={v}
                y2="100"
                stroke="var(--line)"
                strokeWidth="0.15"
              />
              <line
                x1="0"
                y1={v}
                x2="100"
                y2={v}
                stroke="var(--line)"
                strokeWidth="0.15"
              />
            </g>
          ))}

          {/* Soft corridors — Ngong Rd / CBD spine */}
          <path
            d="M22 62 Q40 52 55 42 Q65 38 72 38"
            fill="none"
            stroke="var(--tape)"
            strokeWidth="1.2"
            strokeDasharray="1.5 1.2"
            opacity="0.7"
          />
          <path
            d="M28 22 Q34 34 42 40 Q48 46 55 42"
            fill="none"
            stroke="var(--tape)"
            strokeWidth="0.8"
            strokeDasharray="1 1.4"
            opacity="0.55"
          />

          <text
            x="50"
            y="92"
            textAnchor="middle"
            fill="var(--muted)"
            style={{
              fontFamily: "var(--font-ticket), monospace",
              fontSize: "2.4px",
              letterSpacing: "0.2px",
            }}
          >
            SCHEMATIC · NOT TO SCALE · EVERY PAIR HAS A PLACE
          </text>

          {nodes.map((node) => {
            const active = selected === node.place;
            const hot = hover === node.place;
            const hasStock = lit.has(node.place);
            const c = counts[node.place] ?? { found: 0, hold: 0, sold: 0, total: 0 };
            const r = active ? 3.4 : hot ? 3 : 2.4;

            return (
              <g
                key={node.place}
                className="cursor-pointer"
                onMouseEnter={() => setHover(node.place)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect(node.place)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(node.place);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`Found — ${node.place}, ${c.found} on the rail`}
              >
                {(active || hot) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 2.2}
                    fill="none"
                    stroke="var(--nairobi)"
                    strokeWidth="0.35"
                    opacity="0.5"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={
                    active
                      ? "var(--nairobi)"
                      : hasStock
                        ? "var(--ink)"
                        : "var(--chip)"
                  }
                  stroke="var(--ink)"
                  strokeWidth="0.35"
                />
                {hasStock && !active ? (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={0.9}
                    fill="var(--tag)"
                  />
                ) : null}
                <text
                  x={node.x}
                  y={node.y + r + 3.2}
                  textAnchor="middle"
                  fill="var(--ink)"
                  style={{
                    fontFamily: "var(--font-ticket), monospace",
                    fontSize: "2.6px",
                    fontWeight: 700,
                    letterSpacing: "0.15px",
                  }}
                >
                  {node.place.toUpperCase()}
                </text>
                {c.found > 0 ? (
                  <text
                    x={node.x}
                    y={node.y + r + 5.8}
                    textAnchor="middle"
                    fill="var(--nairobi)"
                    style={{
                      fontFamily: "var(--font-ticket), monospace",
                      fontSize: "2.1px",
                      fontWeight: 700,
                    }}
                  >
                    {c.found} FOUND
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
