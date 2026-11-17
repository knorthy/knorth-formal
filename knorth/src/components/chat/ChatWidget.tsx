"use client";
// Kniah: the pixel paw in the bottom-right corner. Clicking it (or Alt+K) opens a full-screen "ask"
// overlay modelled on bryllim.com: the page blurs out, a big pixel-font prompt asks for a question,
// and the reply comes back one line at a time in the same spot. The first question of a visit first
// reads out what the visitor's browser shared on page load (lib/exposure.ts); then Gemini's answer
// from /api/chat takes its place. Enter skips the readout, Esc or a click outside closes.
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/useReducedMotionSafe";
import { collectExposure } from "@/lib/exposure";
import KnoPaw, { type KnoMood } from "./KnoPaw";
import { useKnoBrain } from "./useKnoBrain";

type Msg = { role: "user" | "assistant"; content: string };
type Title = { key: number; text: string; small: boolean; loading: boolean };

const DEFAULT_TITLE = "what do you want to ask?";
const ERRORS: Record<string, string> = {
  not_configured: "my brain isn't plugged in yet. reach tiffany through the contact section instead",
  rate_limited: "that's a lot of questions! give me a few minutes, or ask tiffany directly",
  busy: "i'm a little swamped right now. try again in a moment",
  error: "my whiskers lost signal. try again, or reach tiffany through the contact section",
};
const EASE = [0.16, 1, 0.3, 1] as const;
const FLIP_MS = 820;

// One plain sentence per thing the browser gave away. Labels come from lib/exposure.ts.
const SAY: Record<string, (v: string) => string> = {
  "IP address": (v) => (v === "localhost" ? "you're on localhost, so your public ip stays hidden here" : `your public ip address is ${v}`),
  Location: (v) => `you are somewhere around ${v}`,
  Connection: (v) => `your connection is ${v}`,
  System: (v) => `you are on ${v}`,
  Browser: (v) => `you are browsing with ${v}`,
  Device: (v) => `your device is a ${v}`,
  CPU: (v) => `your processor runs ${v}`,
  Memory: (v) => `you have ${v} of memory`,
  Graphics: (v) => `your graphics card is ${v}`,
  Screen: (v) => `your screen is ${v}`,
  "Time zone": (v) => `your timezone is ${v}`,
  Languages: (v) => `your browser speaks ${v}`,
  "Came from": (v) => (v.startsWith("typed") ? "you typed this address in, or came from a bookmark" : `you came here from ${v}`),
};

async function exposureLines(): Promise<string[]> {
  const data = await collectExposure();
  const lines = data.groups
    .flatMap((g) => g.rows)
    .filter((r) => SAY[r.label])
    .map((r) => SAY[r.label](r.value).toLowerCase());
  if (data.fingerprint) lines.push(`together that's a fingerprint: ${data.fingerprint.match(/.{1,4}/g)!.join(" ")}`);
  return lines;
}

// Starts the request right away so the answer streams in while the readout plays.
function startAnswer(messages: Msg[], signal: AbortSignal) {
  const state = { text: "", done: false, error: null as string | null, onChange: () => {} };
  (async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages }),
        signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "error" }));
        state.error = ERRORS[error] ?? ERRORS.error;
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        state.text += decoder.decode(value, { stream: true });
        const marker = state.text.indexOf("\u0000");
        if (marker !== -1) {
          state.error = ERRORS[state.text.slice(marker + 1)] ?? ERRORS.error;
          state.text = state.text.slice(0, marker).trim();
          return;
        }
        state.onChange();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") state.error = ERRORS.error;
    } finally {
      state.done = true;
      state.onChange();
    }
  })();
  return state;
}

export default function ChatWidget() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hop, setHop] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [input, setInput] = useState("");
  const [bubble, setBubble] = useState<string | null>(null);
  const [title, setTitle] = useState<Title>({ key: 0, text: DEFAULT_TITLE, small: false, loading: false });
  const [busy, setBusy] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [error, setError] = useState(false);

  const history = useRef<Msg[]>([]);
  const revealed = useRef(false);
  const run = useRef(0); // bumped on close, so a running sequence knows to stop
  const skipped = useRef(false);
  const wake = useRef<(() => void) | null>(null);
  const abort = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const show = (text: string, loading = false) =>
    setTitle((t) => ({ key: t.key + 1, text, small: true, loading }));
  // Waits unless the visitor skipped; resolves false once the overlay has closed.
  const wait = (ms: number, id: number) =>
    new Promise<boolean>((resolve) => {
      if (skipped.current) return resolve(run.current === id);
      const t = setTimeout(() => resolve(run.current === id), ms);
      wake.current = () => { clearTimeout(t); resolve(run.current === id); };
    });

  const close = useCallback(() => {
    run.current++;
    abort.current?.abort();
    setOpen(false);
    setSessions((n) => n + 1);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const openAsk = useCallback(() => {
    run.current++;
    setInput("");
    setBubble(null);
    setBusy(false);
    setRevealing(false);
    setError(false);
    setTitle((t) => ({ key: t.key + 1, text: DEFAULT_TITLE, small: false, loading: false }));
    setOpen(true);
  }, []);

  // Esc closes; Alt+K opens and closes from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
      else if (e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openAsk();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openAsk]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open]);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const id = run.current;
    setBusy(true);
    setError(false);
    setInput("");
    setBubble(question);
    skipped.current = false;
    history.current = [...history.current, { role: "user" as const, content: question }].slice(-12);
    abort.current = new AbortController();
    const answer = startAnswer(history.current, abort.current.signal);

    show("thinking...", true);
    if (!(await wait(1200, id))) return;

    if (!revealed.current) {
      revealed.current = true;
      setRevealing(true);
      show("analyzing...", true);
      const facts = await exposureLines();
      if (!(await wait(1000, id))) return;
      const script = [
        "before i answer",
        "here is what your browser already shared the moment you opened this site",
        ...facts,
        "none of this needed your permission",
        "your browser shares it with every website you open, automatically",
        "so be mindful of what you click, and who you trust online",
        "as for your question",
      ];
      for (const [i, line] of script.entries()) {
        if (i === 1) setBubble(null);
        show(line);
        if (!(await wait(1600 + line.length * 22, id))) return;
      }
      setRevealing(false);
      setBubble(question);
    }

    // The answer: stream into one title so it doesn't re-animate on every chunk
    const key = Date.now();
    const render = () => {
      if (run.current !== id) return;
      if (answer.error && !answer.text) {
        setError(true);
        setTitle({ key, text: answer.error, small: true, loading: false });
      } else if (answer.text) {
        setTitle({ key, text: answer.error ? `${answer.text}\n\n${answer.error}` : answer.text, small: true, loading: false });
      } else if (!answer.done) {
        setTitle({ key, text: "thinking...", small: true, loading: true });
      }
      if (answer.done && run.current === id) {
        if (answer.text && !answer.error) history.current.push({ role: "assistant", content: answer.text });
        setBusy(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    answer.onChange = render;
    render();
  };

  // Other parts of the page can ask on the visitor's behalf, e.g. a project's "Learn more"
  const askRef = useRef(ask);
  useEffect(() => {
    askRef.current = ask;
  });
  useEffect(() => {
    const onAsk = (e: Event) => {
      const question = (e as CustomEvent<string>).detail;
      if (!question) return;
      openAsk();
      setTimeout(() => askRef.current(question), 300);
    };
    window.addEventListener("kniah:ask", onAsk);
    return () => window.removeEventListener("kniah:ask", onAsk);
  }, [openAsk]);

  const toggle = () => {
    if (open) { close(); return; }
    setHop((h) => h + 1);
    setTimeout(openAsk, reduce ? 0 : 260);
  };

  const brain = useKnoBrain(open || hovered, sessions);
  const launcherMood: KnoMood = flipping ? "flip" : hovered ? "idle" : brain.mood;
  const onEnter = () => {
    setHovered(true);
    if (reduce || flipping) return;
    setFlipping(true);
    setTimeout(() => setFlipping(false), FLIP_MS);
  };
  const bubbleText = open ? null : hovered ? "ask me anything" : brain.line;

  return (
    <>
      {/* Launcher. On phones the remark floats above the paw. */}
      <div className="kno-dock-slot fixed right-3 md:right-6 z-[60] flex items-end gap-2 pointer-events-none [&>*]:pointer-events-auto">
        <AnimatePresence mode="wait">
          {bubbleText && (
            <motion.div
              key={bubbleText}
              aria-hidden
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 6, scale: 0.95, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: EASE }}
              className="absolute bottom-full right-1 mb-2 md:static md:mb-7 w-max max-w-[200px] md:max-w-[240px] px-3 py-2 border border-ink bg-paper text-ink text-sm leading-snug pointer-events-none origin-bottom-right"
            >
              {bubbleText}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          ref={launcherRef}
          type="button"
          onClick={toggle}
          onPointerEnter={onEnter}
          onPointerLeave={() => setHovered(false)}
          aria-label="Ask Kniah about Tiffany (Alt+K)"
          aria-haspopup="dialog"
          className="kno-launcher relative grid place-items-center w-20 h-16"
        >
          <motion.span
            key={hop}
            className="block"
            initial={false}
            animate={hop && !reduce ? { y: [0, -16, 0, -4, 0], scaleY: [1, 1.08, 0.9, 1.02, 1], scaleX: [1, 0.94, 1.08, 0.99, 1] } : undefined}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ transformOrigin: "50% 100%" }}
          >
            <KnoPaw size={76} mood={launcherMood} />
          </motion.span>
        </button>
      </div>

      {/* Ask overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ask Kniah about Tiffany"
            className="fixed inset-0 z-[100] flex items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          >
            <div className="ask-backdrop absolute inset-0" onClick={close} />
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 min-h-11 px-3 font-mono text-sm text-muted hover:text-ink"
            >
              esc
            </button>
            <motion.div
              className="relative z-[1] flex max-h-[85svh] w-full max-w-[900px] flex-col items-start gap-6 overflow-y-auto pl-[clamp(0rem,9vw,8rem)]"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
              onClick={() => inputRef.current?.focus()}
            >
              {bubble && <p className="ask-bubble">{bubble}</p>}

              <div className={`ask-head ${title.loading ? "is-shimmer" : ""}`} aria-live="polite">
                {title.loading && <span className="ask-loader" aria-hidden />}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={title.key}
                    className={`ask-title ${title.small ? "is-small" : ""}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: 6, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {title.text}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {error && (
                <a href="#contact" onClick={close} className="link text-sm">
                  Go to contact
                </a>
              )}

              {!busy ? (
                <div className="ask-field" aria-hidden>
                  <span>{input}</span>
                  <span className="ask-caret" />
                </div>
              ) : (
                revealing && <p className="font-mono text-sm text-muted">press enter to skip</p>
              )}

              <input
                ref={inputRef}
                className="ask-hidden-input"
                type="text"
                value={input}
                maxLength={600}
                readOnly={busy}
                autoComplete="off"
                spellCheck={false}
                aria-label="Type your question about Tiffany, then press Enter"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (busy) {
                    skipped.current = true;
                    wake.current?.();
                  } else ask(input);
                }}
              />
            </motion.div>
            <p className="absolute bottom-4 left-6 right-24 z-[1] text-sm text-muted">
              AI answers by Google Gemini from Tiffany&apos;s portfolio. They can be wrong, so skip anything private.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
