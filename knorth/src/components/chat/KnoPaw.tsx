"use client";
// Kniah's icon: a pixel paw print in flat ink, shaded with the muted grey along its bottom edge.
// Monochrome: both colours come from the site's tokens, so it follows light and dark mode.
// The kno-mover / kno-body layers are what kno.css animates for each `mood`.
import PixelGrid, { type Palette } from "./PixelGrid";
import "./kno.css";

export type KnoMood = "idle" | "flip" | "sing" | "spin" | "sleep" | "think" | "sit" | "dizzy";

const PALETTE: Palette = { B: "var(--color-ink)", S: "var(--color-muted)" };

// 26 x 22: four toes above one wide pad.
const PAW = [
  "......BBBBB....BBBBB......",
  ".....BBBBBBB..BBBBBBB.....",
  ".....BBBBBBB..BBBBBBB.....",
  ".....BBBBBBB..BBBBBBB.....",
  "......BBBBB....BBBBB......",
  ".......BBB......BBB.......",
  "..BBB................BBB..",
  ".BBBBB..............BBBBB.",
  ".BBBBB..............BBBBB.",
  ".BBBBB...BBBBBBBB...BBBBB.",
  "..BBBB..BBBBBBBBBB..BBBB..",
  "...BBB.BBBBBBBBBBBB.BBB...",
  "....B.BBBBBBBBBBBBBB.B....",
  ".....BBBBBBBBBBBBBBBB.....",
  "....BBBBBBBBBBBBBBBBBB....",
  "....BBBBBBBBBBBBBBBBBB....",
  "....BBBBBBBBBBBBBBBBBB....",
  "....BBBBBBBBBBBBBBBBBB....",
  ".....BBBBBBBBBBBBBBBB.....",
  "......BBBBBBBBBBBBBB......",
  ".......SSSSSSSSSSSS.......",
  ".........SSSSSSSS.........",
];

export default function KnoPaw({ size = 72, mood = "idle", className = "" }: {
  size?: number;
  mood?: KnoMood;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 34 25"
      width={size}
      height={(size * 25) / 34}
      shapeRendering="crispEdges"
      aria-hidden
      data-mood={mood}
      className={`kno overflow-visible ${className}`}
    >
      <g className="kno-mover">
        <g className="kno-body">
          <PixelGrid rows={PAW} palette={PALETTE} x={4} y={2} />
        </g>
      </g>
    </svg>
  );
}
