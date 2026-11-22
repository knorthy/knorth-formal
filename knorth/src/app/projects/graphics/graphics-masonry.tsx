"use client";

import { useState, useSyncExternalStore } from "react";
import Masonry, { type MasonryItem } from "@/components/Masonry";

// Two columns on a phone, otherwise as many 240px columns as fit.
const query = "(max-width: 639px)";
const watch = (cb: () => void) => {
  const m = matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const CATEGORIES = ["All", "Poster", "Pubmat", "Mockups"];

export default function GraphicsMasonry({ items }: { items: (MasonryItem & { category: string })[] }) {
  const phone = useSyncExternalStore(watch, () => matchMedia(query).matches, () => false);
  const [tab, setTab] = useState("All");
  const shown = tab === "All" ? items : items.filter((i) => i.category === tab);
  return (
    <>
      <div className="-mx-6 mb-6 flex gap-x-6 overflow-x-auto border-b border-rule px-6 whitespace-nowrap md:mx-0 md:px-0" role="tablist" aria-label="Filter by type">
        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`-mb-px min-h-11 shrink-0 cursor-pointer border-b text-sm transition-colors ${
              tab === name ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {/* key remounts the grid so the layout and entrance animation restart for the new set. */}
      <Masonry
        key={tab}
        items={shown}
        columns={phone ? 2 : "auto"}
        columnWidth={240}
        gap={phone ? 8 : 12}
        radius={12}
        animateFrom="bottom"
        hoverEffect="zoom"
        captions="hover"
        lightbox
        draggable
      />
    </>
  );
}
