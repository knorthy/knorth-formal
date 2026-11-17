"use client";
// Kniah's brain, trimmed for this page: says hi once per visit, comments the first time each section
// scrolls into view, sings then sleeps when the visitor is idle, and says a word after the chat closes.
// Everything stops while `paused` (chat open or Kniah hovered).
import { useEffect, useRef, useState } from "react";
import type { KnoMood } from "./KnoPaw";

const COOLDOWN_MS = 6000; // between any two remarks
const LINE_MS = 4200;
const IDLE_SING_MS = 15000;
const IDLE_SLEEP_MS = 40000;
const GREETED_KEY = "kniah-greeted";

const SECTIONS: Record<string, string> = {
  projects: "pull the sling, there's more in the pile",
  skills: "so many tools, so little time",
  experience: "real jobs, real bugs squashed",
  credentials: "the paper trail! very official",
  contact: "say hi! she replies faster than your group chat",
};
const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

export function useKnoBrain(paused: boolean, chatSessions = 0): { mood: KnoMood; line: string | null } {
  const [mood, setMood] = useState<KnoMood>("idle");
  const [line, setLine] = useState<string | null>(null);
  const seen = useRef({ sections: new Set<string>(), sessions: 0, greeted: false });

  useEffect(() => {
    if (paused) return;
    const mem = seen.current;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
      timers.add(t);
      return t;
    };

    let lineT: ReturnType<typeof setTimeout> | undefined;
    let lastSpoke = 0;
    let state: "awake" | "singing" | "sleeping" = "awake";
    const say = (text: string, ms = LINE_MS, force = false) => {
      if (!force && Date.now() - lastSpoke < COOLDOWN_MS) return false;
      lastSpoke = Date.now();
      if (lineT) clearTimeout(lineT);
      setLine(text);
      lineT = later(() => setLine(null), ms);
      return true;
    };

    // Idle: sing, then sleep; any activity wakes her
    let singT: ReturnType<typeof setTimeout> | undefined;
    let sleepT: ReturnType<typeof setTimeout> | undefined;
    const armIdle = () => {
      clearTimeout(singT);
      clearTimeout(sleepT);
      singT = later(() => {
        if (document.hidden) return;
        state = "singing";
        setMood("sing");
        say(pick(["♪ la la laa ♪", "♪ do re mi meow ♪"]), 5000, true);
      }, IDLE_SING_MS);
      sleepT = later(() => {
        if (document.hidden) return;
        state = "sleeping";
        setMood("sleep");
        say(pick(["zzz…", "five more minutes…"]), 3200, true);
      }, IDLE_SLEEP_MS);
    };
    let lastActivity = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivity < 300) return;
      lastActivity = now;
      if (state === "sleeping") {
        state = "awake";
        setMood("flip");
        later(() => setMood("idle"), 820);
        say("huh?! oh, hi again", LINE_MS, true);
      } else if (state === "singing") {
        state = "awake";
        setMood("idle");
      }
      armIdle();
    };

    // Sections: one remark the first time each comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (!e.isIntersecting || mem.sections.has(id) || !SECTIONS[id]) continue;
          if (say(SECTIONS[id])) mem.sections.add(id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    Object.keys(SECTIONS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Hello once per visit, or a word after the chat closes
    if (chatSessions > mem.sessions) {
      mem.sessions = chatSessions;
      later(() => say(pick(["that was fun! ask me again anytime", "come back if you think of more questions"]), LINE_MS, true), 500);
    } else {
      let greeted = mem.greeted;
      try { greeted ||= sessionStorage.getItem(GREETED_KEY) === "1"; } catch { /* storage blocked */ }
      if (!greeted) {
        later(() => {
          mem.greeted = true;
          try { sessionStorage.setItem(GREETED_KEY, "1"); } catch { /* storage blocked */ }
          say("hi! I'm Kniah. click me if you've got questions about Tiffany", 6000, true);
        }, 4000);
      }
    }

    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onActivity, opts);
    window.addEventListener("scroll", onActivity, opts);
    window.addEventListener("keydown", onActivity);
    armIdle();

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("keydown", onActivity);
      setLine(null);
      setMood("idle");
    };
  }, [paused, chatSessions]);

  return { mood, line };
}
