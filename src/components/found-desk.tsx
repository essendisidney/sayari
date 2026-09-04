"use client";

import { FoundMap } from "@/components/found-map";
import { FoundPlacePanel } from "@/components/found-place-panel";
import type { FoundNode, PlaceCounts } from "@/lib/found-geo";
import type { RailPair, SpottedPost } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type Props = {
  nodes: FoundNode[];
  counts: Record<string, PlaceCounts>;
  pairsByPlace: Record<string, RailPair[]>;
  spottedByPlace: Record<string, SpottedPost[]>;
  initialPlace: string | null;
};

export function FoundDesk({
  nodes,
  counts,
  pairsByPlace,
  spottedByPlace,
  initialPlace,
}: Props) {
  const router = useRouter();
  const selected =
    initialPlace && nodes.some((n) => n.place === initialPlace)
      ? initialPlace
      : (nodes.find((n) => (counts[n.place]?.found ?? 0) > 0)?.place ??
        nodes[0]?.place ??
        null);

  const node = useMemo(
    () => nodes.find((n) => n.place === selected) ?? null,
    [nodes, selected],
  );

  function onSelect(place: string) {
    router.replace(`/found?place=${encodeURIComponent(place)}`, {
      scroll: false,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      <FoundMap
        nodes={nodes}
        counts={counts}
        selected={selected}
        onSelect={onSelect}
      />
      {node ? (
        <FoundPlacePanel
          place={node.place}
          blurb={node.blurb}
          counts={counts[node.place] ?? { found: 0, hold: 0, sold: 0, total: 0 }}
          pairs={pairsByPlace[node.place] ?? []}
          spotted={spottedByPlace[node.place] ?? []}
        />
      ) : null}
    </div>
  );
}
