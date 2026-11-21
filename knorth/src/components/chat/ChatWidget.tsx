"use client";
// Kniah: the pixel paw in the bottom-right corner. Clicking it opens a branched menu (page sections,
// socials, and "Ask Kniah"); "Ask Kniah", or Alt+K from anywhere, opens a full-screen "ask"
// overlay modelled on bryllim.com: the page blurs out, a big pixel-font prompt asks for a question,
// and the reply comes back one line at a time in the same spot: "thinking...", then Gemini's answer
// from /api/chat streams in. Esc or a click outside closes.
import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/useReducedMotionSafe";
import LatticeLoader from "@/components/LatticeLoader";
import GlideSelect from "@/components/GlideSelect";
import KnoPaw, { type KnoMood } from "./KnoPaw";
import BranchedMenu, { type BranchedMenuItem } from "@/components/BranchedMenu";
import { content } from "@/app/content";

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

// The paw's menu: every part of the page, the socials, and the chatbot itself.
const MENU: BranchedMenuItem[] = [
  {
    label: "On this page",
    children: [
      { value: "#main", label: "Home" },
      { value: "#credentials", label: "Credentials" },
      { value: "#projects", label: "Projects" },
      { value: "#skills", label: "Skills" },
      { value: "#experience", label: "Experience" },
      { value: "#gallery", label: "Gallery" },
      { value: "#contact", label: "Contact" },
    ],
  },
  { label: "Socials", children: content.links.map((l) => ({ value: l.href, label: l.label })) },
  { label: "Ask Tiffany", value: "ask" },
];
const FLIP_MS = 820;

// How Kniah talks. The server only accepts these three values (see TONES in api/chat/route.ts).
const TONES = [
  { value: "casual", label: "Casual", tag: "Default" },
  { value: "formal", label: "Formal", tag: "Hiring" },
  { value: "funny", label: "Funny", tag: "Playful" },
];

// Something a visitor says about their own goal ("we're hiring a frontend dev"): kept for the whole chat
// The browser's default voice is the robotic one. Prefer a natural female English voice when the device has one
// (Edge's "Natural" voices, Chrome's Google voices, Apple's Samantha), else any English voice.
const VOICE_PREFS = [/natural/i, /aria|jenny|sonia|libby|michelle/i, /google.*(us|uk) english/i, /samantha|karen|serena|zira/i];
function sayAloud(text: string) {
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);
  const english = synth.getVoices().filter((v) => v.lang.startsWith("en"));
  u.voice = VOICE_PREFS.map((re) => english.find((v) => re.test(v.name))).find(Boolean) ?? english[0] ?? null;
  synth.speak(u);
}
const GOAL = /\b(hiring|looking for|recruit\w*|we need|our team|my company|my team|position|role)\b/i;

// Only links that already exist on the site become clickable, so an answer can't smuggle in another URL.
const KNOWN_URLS = new Set(
  [...content.links, ...content.projects, ...content.more, ...content.credentials, ...content.experience]
    .map((x) => ("href" in x ? x.href : ""))
    .filter(Boolean),
);
function linkify(text: string): ReactNode {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) => {
    const url = part.replace(/[.,;:!?)]+$/, "");
    if (i % 2 === 0 || !KNOWN_URLS.has(url)) return <Fragment key={i}>{part}</Fragment>;
    return (
      <Fragment key={i}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="link">
          {url.replace(/^https?:\/\/(www\.)?/, "")} ↗
        </a>
        {part.slice(url.length)}
      </Fragment>
    );
  });
}

// Starts the request right away so the answer streams in while the readout plays.
function startAnswer(messages: Msg[], signal: AbortSignal, tone: string, notes: string[]) {
  const state = { text: "", done: false, error: null as string | null, onChange: () => {} };
  (async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages, tone, notes }),
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
  const [menu, setMenu] = useState(false);
  const [hop, setHop] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [input, setInput] = useState("");
  const [bubble, setBubble] = useState<string | null>(null);
  const [title, setTitle] = useState<Title>({ key: 0, text: DEFAULT_TITLE, small: false, loading: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [tone, setTone] = useState<string | null>(null); // null until the visitor picks one: Kniah then talks casually

  const history = useRef<Msg[]>([]);
  const notes = useRef<string[]>([]); // what the visitor said about their goal, sent with every question
  const run = useRef(0); // bumped on close, so a running sequence knows to stop
  const abort = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Voice: the browser's own speech recognition (mic) and speech synthesis (read replies aloud), no API.
  // shortcut: recognition is Chrome/Edge/Safari only, so the mic button hides elsewhere; upgrade to a hosted voice API if the quality matters.
  // false on the server and on first paint, so the buttons appear after hydration without a mismatch
  const noSub = () => () => {};
  const canListen = useSyncExternalStore(noSub, () => "SpeechRecognition" in window || "webkitSpeechRecognition" in window, () => false);
  const canSpeak = useSyncExternalStore(noSub, () => "speechSynthesis" in window, () => false);
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);
  const speakRef = useRef(false);
  const recog = useRef<{ stop: () => void; abort: () => void } | null>(null);
  const stopVoice = useCallback(() => {
    recog.current?.abort();
    setListening(false);
    window.speechSynthesis?.cancel();
  }, []);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const show = (text: string, loading = false) =>
    setTitle((t) => ({ key: t.key + 1, text, small: true, loading }));
  const close = useCallback(() => {
    run.current++;
    abort.current?.abort();
    stopVoice();
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, [stopVoice]);

  const openAsk = useCallback(() => {
    run.current++;
    setInput("");
    setBubble(null);
    setBusy(false);
    setError(false);
    setTitle((t) => ({ key: t.key + 1, text: DEFAULT_TITLE, small: false, loading: false }));
    setOpen(true);
  }, []);

  // Esc closes; Alt+K opens and closes from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
      else if (e.key === "Escape" && menu) {
        setMenu(false);
        launcherRef.current?.focus();
      }
      else if (e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openAsk();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menu, close, openAsk]);

  // The menu closes on a click anywhere else, and takes focus when it opens
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !launcherRef.current?.contains(t)) setMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    requestAnimationFrame(() => menuRef.current?.querySelector("button")?.focus());
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    speakRef.current = speak;
    if (!speak) window.speechSynthesis?.cancel();
  }, [speak]);

  // Mic button: speech fills the input as it goes, and the question is sent when the visitor stops talking
  const listen = () => {
    if (listening) return stopVoice();
    if (busy) return;
    window.speechSynthesis?.cancel();
    type Rec = { interimResults: boolean; lang: string; start: () => void; stop: () => void; abort: () => void; onresult: unknown; onerror: unknown; onend: unknown };
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Rec = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Rec) return;
    const r = new Rec();
    r.interimResults = true;
    r.lang = navigator.language || "en-US";
    let heard = "";
    r.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      heard = Array.from(e.results, (x) => x[0].transcript).join("");
      setInput(heard.slice(0, 600));
    };
    r.onerror = (e: { error?: string }) => {
      setListening(false);
      if (e.error === "aborted" || e.error === "no-speech") return;
      show(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "The microphone is blocked. Allow it in the browser's address bar, then try again."
          : e.error === "network"
            ? "Voice typing couldn't reach the browser's speech service. Check your connection, or try Chrome or Edge."
            : `The microphone didn't work (${e.error ?? "unknown error"}).`,
      );
    };
    r.onend = () => {
      setListening(false);
      if (recog.current !== r || !heard.trim()) return;
      recog.current = null;
      speakRef.current = true; // asked by voice, so the answer is read aloud unless turned off
      setSpeak(true);
      askRef.current(heard);
    };
    recog.current = r;
    setListening(true);
    r.start();
  };

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const id = run.current;
    stopVoice();
    setBusy(true);
    setError(false);
    setInput("");
    setBubble(question);
    if (GOAL.test(question) && notes.current.length < 3) notes.current.push(question.slice(0, 200));
    history.current = [...history.current, { role: "user" as const, content: question }].slice(-12);
    abort.current = new AbortController();
    const answer = startAnswer(history.current, abort.current.signal, tone ?? "casual", notes.current);

    show("thinking...", true);
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
        if (answer.text && !answer.error) {
          history.current.push({ role: "assistant", content: answer.text });
          if (speakRef.current) sayAloud(answer.text);
        }
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

  // Clears the conversation: Kniah forgets it, and the chips start over
  const startOver = () => {
    run.current++;
    abort.current?.abort();
    stopVoice();
    history.current = [];
    notes.current = [];
    setInput("");
    setBubble(null);
    setBusy(false);
    setError(false);
    setTitle((t) => ({ key: t.key + 1, text: DEFAULT_TITLE, small: false, loading: false }));
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const toggle = () => {
    if (open) { close(); return; }
    setHop((h) => h + 1);
    setMenu((m) => !m);
  };

  const pick = (value: string) => {
    setMenu(false);
    if (value === "ask") openAsk();
    else if (value.startsWith("#")) document.querySelector(value)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    else window.open(value, "_blank", "noopener,noreferrer");
  };

  const onEnter = () => {
    if (reduce || flipping) return;
    setFlipping(true);
    setTimeout(() => setFlipping(false), FLIP_MS);
  };
  const launcherMood: KnoMood = flipping ? "flip" : "idle";

  return (
    <>
      {/* Launcher, with its menu floating above it */}
      <div className="kno-dock-slot fixed right-3 md:right-6 z-[60] flex flex-col items-end gap-2">
        <AnimatePresence>
          {menu && (
            <motion.div
              ref={menuRef}
              id="kno-menu"
              role="navigation"
              aria-label="Site menu"
              initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: EASE }}
              className="origin-bottom-right px-1 py-1"
            >
              <BranchedMenu
                items={MENU}
                defaultOpen={[0, 1]}
                defaultActive="-"
                onSelect={(value) => pick(value)}
                color="var(--color-ink)"
                accentColor="var(--color-ink)"
                lineColor="var(--color-rule)"
                width={220}
                rowHeight={34}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          ref={launcherRef}
          type="button"
          onClick={toggle}
          onPointerEnter={onEnter}
          aria-label="Open the site menu"
          aria-expanded={menu}
          aria-controls="kno-menu"
          className="kno-launcher relative grid place-items-center w-20 h-14"
        >
          <motion.span
            key={hop}
            className="block"
            initial={false}
            animate={hop && !reduce ? { y: [0, -16, 0, -4, 0], scaleY: [1, 1.08, 0.9, 1.02, 1], scaleX: [1, 0.94, 1.08, 0.99, 1] } : undefined}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ transformOrigin: "50% 100%" }}
          >
            <KnoPaw size={58} mood={launcherMood} />
          </motion.span>
        </button>
      </div>

      {/* Ask overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Ask Tiffany"
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

              <div className="ask-head" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={title.key}
                    className={`ask-title ${title.small ? "is-small" : ""}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: 6, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {title.loading ? (
                      <LatticeLoader label="thinking" pattern="spiral" cellSize={8} gap={3} fontSize={24} showTimer={false} color="var(--color-muted)" />
                    ) : (
                      linkify(title.text)
                    )}
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
              ) : null}

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
                  if (!busy) ask(input);
                }}
              />
            </motion.div>
            <div className="absolute right-6 bottom-4 z-[2] flex items-center gap-2">
              {bubble !== null && (
                <button
                  type="button"
                  onClick={startOver}
                  className="min-h-8 cursor-pointer rounded-md px-2.5 text-xs text-muted transition-colors hover:text-ink"
                >
                  Start over
                </button>
              )}
              {canListen && (
                <button
                  type="button"
                  onClick={listen}
                  aria-pressed={listening}
                  aria-label={listening ? "Stop listening" : "Ask with your voice"}
                  className={`min-h-8 cursor-pointer rounded-md px-2.5 text-xs transition-colors hover:text-ink ${listening ? "text-ink" : "text-muted"}`}
                >
                  {listening ? "Listening..." : "Mic"}
                </button>
              )}
              {canSpeak && (
                <button
                  type="button"
                  onClick={() => setSpeak((v) => !v)}
                  aria-pressed={speak}
                  aria-label="Read replies aloud"
                  className={`min-h-8 cursor-pointer rounded-md px-2.5 text-xs transition-colors hover:text-ink ${speak ? "text-ink" : "text-muted"}`}
                >
                  {speak ? "Voice on" : "Voice off"}
                </button>
              )}
              <GlideSelect
                options={TONES}
                value={tone ?? ""}
                placeholder="Model personality"
                onChange={setTone}
                ariaLabel="Model personality: change the tone of the replies"
                surfaceColor="var(--color-paper)"
                highlightColor="var(--color-rule)"
                textColor="var(--color-ink)"
                accentColor="var(--color-ink)"
                size="sm"
                menuWidth={170}
                placement="top"
                align="right"
              />
            </div>
            <p className="absolute bottom-4 left-6 right-80 z-[1] text-sm text-muted">
              AI answers by Google Gemini from Tiffany&apos;s portfolio. They can be wrong, so skip anything private.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
