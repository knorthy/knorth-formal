"use client";

// A small pill that trails the mouse pointer and tilts with its movement (the "Drag to spin" pill from
// the knorth portfolio). The text is written straight into the DOM so nothing re-renders on mouse move.
// Mouse only: touch has no hover. Call `move` from a pointermove handler and `hide` on leave, and render
// `pill` inside a `relative` parent (coordinates relative to it), or pass `fixed` and use clientX/Y.
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/useReducedMotionSafe";

export function usePointerLabel(fixed = false): {
  move: (x: number, y: number, label?: string) => void;
  hide: () => void;
  pill: ReactNode;
} {
  const reduce = useReducedMotion();
  const text = useRef<HTMLSpanElement>(null);
  const lastY = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0, { stiffness: 300, damping: 30 });
  const rotate = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

  // An empty label keeps the last one showing (e.g. the pointer crossing a gap between tiles).
  const move = (px: number, py: number, label?: string) => {
    x.set(px + 14);
    y.set(py + 10);
    rotate.set(reduce ? 0 : -(py - lastY.current) * 0.6);
    lastY.current = py;
    if (!label || !text.current) return;
    text.current.textContent = label;
    opacity.set(1);
  };
  const hide = () => {
    opacity.set(0);
    rotate.set(0);
  };

  const pill = (
    <motion.div
      aria-hidden
      style={{ x, y, opacity, rotate }}
      className={`pointer-events-none ${fixed ? "fixed z-[55]" : "absolute z-10"} top-0 left-0 rounded-full border border-rule bg-paper/90 px-3 py-1.5 backdrop-blur-sm`}
    >
      <span ref={text} className="font-mono text-xs whitespace-nowrap text-ink" />
    </motion.div>
  );
  return { move, hide, pill };
}

// A wrapper that shows the pill over its children. `labelOf` reads the label from whatever the pointer is
// over (return "" for none).
export default function PointerLabel({
  labelOf,
  className = "",
  children,
}: {
  labelOf: (target: HTMLElement) => string;
  className?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const { move, hide, pill } = usePointerLabel();
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !box.current) return;
    const r = box.current.getBoundingClientRect();
    move(e.clientX - r.left, e.clientY - r.top, labelOf(e.target as HTMLElement));
  };
  return (
    <div ref={box} className={`relative ${className}`} onPointerMove={onMove} onPointerLeave={hide}>
      {children}
      {pill}
    </div>
  );
}
