"use client";
// Kniah's icon: a chubby pixel cat, tail curled on the left. Flat ink; the two
// eyes are gaps so the page shows through, so it follows light and dark mode. Drawn at 2px a cell
// (size 58 on a 29-wide viewBox) to keep the pixels crisp. The kno-mover / kno-body layers are what
// kno.css animates for each `mood`.
import PixelGrid, { type Palette } from "./PixelGrid";
import "./kno.css";

export type KnoMood = "idle" | "flip" | "sing" | "spin" | "sleep" | "think" | "sit" | "dizzy";

const PALETTE: Palette = { B: "var(--color-ink)" };

// 25 x 16, traced cell by cell from the reference sprite. Ears are outlined, the eyes are gaps.
const CAT = [
  "..............B.......B..",
  ".............BBB.....BBB.",
  "............BB.B....BB.B.",
  "...........BB..BB..BB..B.",
  "..........BB..BBBBBBBB.B.",
  "........BBBBBBBBBBBBBBBB.",
  ".......BBBBBBBBBBBBBBBBB.",
  "BB....BBBBBBBBBBBBBBBBBB.",
  "BBB...BBBBBBBBBBBBBBBBBB.",
  "BBB...BBBBBBBBBBBBBBBBBBB",
  ".BBB..BBBBBBBB.BBBBBB.BBB",
  ".BBBBBBBBBBBBB.BBBBBB.BBB",
  "..BBBBBBBBBBBBBBBBBBBBBBB",
  "....BBBBBBBBBBBBBBBBBBBB.",
  "........BBBBBBBBBBBBBBB..",
  "..........BBBBBBBBBBB....",
];

export default function KnoPaw({ size = 58, mood = "idle", className = "" }: {
  size?: number;
  mood?: KnoMood;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 29 20"
      width={size}
      height={(size * 20) / 29}
      shapeRendering="crispEdges"
      aria-hidden
      data-mood={mood}
      className={`kno overflow-visible ${className}`}
    >
      <g className="kno-mover">
        <g className="kno-body">
          <PixelGrid rows={CAT} palette={PALETTE} x={2} y={2} />
        </g>
      </g>
    </svg>
  );
}
