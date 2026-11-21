"use client";

// Phones only (hidden from md up): a blurred cover with a note. Double-tap, or Enter, lifts it for the rest of the visit.
import { useRef, useSyncExternalStore } from "react";

const KEY = "mobile-notice-dismissed";
const EVENT = "mobile-notice";
const read = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const watch = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export default function MobileNotice() {
  const dismissed = useSyncExternalStore(watch, read, () => false);
  const lastTap = useRef(0);
  if (dismissed) return null;

  const lift = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };
  const onTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 400) lift();
    lastTap.current = now;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="This site is not finished for phones"
      tabIndex={0}
      onPointerUp={onTap}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && lift()}
      className="fixed inset-0 z-[200] flex touch-none flex-col items-center justify-center gap-5 bg-paper/70 px-8 text-center backdrop-blur-2xl md:hidden"
    >
      <p className="text-balance text-[clamp(1.5rem,7vw,2rem)] leading-[1.15] tracking-[-0.02em]">
        Please don&apos;t break my website.
      </p>
      <p className="max-w-[30ch] text-pretty text-base leading-[1.6] text-muted">
        Responsive has been a nightmare. It looks best on an iPad or a laptop, and I promise I&apos;ll fix the phone
        version soon.
      </p>
      <p className="absolute bottom-8 text-sm text-muted">If you insist, double-tap to unblur.</p>
    </div>
  );
}
