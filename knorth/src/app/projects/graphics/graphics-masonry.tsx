"use client";

import { useSyncExternalStore } from "react";
import Masonry, { type MasonryItem } from "@/components/Masonry";

// Two columns on a phone, otherwise as many 240px columns as fit.
const query = "(max-width: 639px)";
const watch = (cb: () => void) => {
  const m = matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export default function GraphicsMasonry({ items }: { items: MasonryItem[] }) {
  const phone = useSyncExternalStore(watch, () => matchMedia(query).matches, () => false);
  return (
    <Masonry
      items={items}
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
  );
}
