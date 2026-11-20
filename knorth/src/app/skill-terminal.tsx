"use client";

// The skills as a small terminal: type (or click) a command like print(frontend-stack), the stack
// prints as clickable names, and the panel on the right shows the picked skill's proficiency, a
// one-line note and the work on this page that uses it. Data: content.skills (the stacks) and
// content.skillDetails (level + note); linked work is found from project tools and role skills.
import { useEffect, useRef, useState } from "react";
import { content } from "./content";

type Line =
  | { kind: "cmd" | "text"; text: string }
  | { kind: "error"; name: string; text: string; hint?: string }
  | { kind: "stack"; group: string; items: string[] };

const slug = (group: string) =>
  group
    .toLowerCase()
    .replace(/ and /g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const STACKS = content.skills.map((s) => ({
  group: s.group,
  command: `print(${slug(s.group)}-stack)`,
  items: s.items.split(", "),
}));
const COMMANDS = [...STACKS.map((s) => s.command), "print(all-stacks)", "help"];
const STACK_NAMES = [...STACKS.map((s) => `${slug(s.group)}-stack`), "all-stacks"];

// Reads one command the way a tiny interpreter would, and explains anything it can't run.
type Result = { ok: true; lines: Line[] } | { ok: false; error: Extract<Line, { kind: "error" }> };
function interpret(cmd: string): Result {
  const err = (name: string, text: string, hint?: string): Result => ({
    ok: false,
    error: { kind: "error", name, text, hint },
  });
  const stackLines = (names: string[]): Line[] =>
    STACKS.filter((s) => names.includes(`${slug(s.group)}-stack`)).map((s) => ({
      kind: "stack",
      group: s.group,
      items: s.items,
    }));

  const lower = cmd.toLowerCase();
  if (lower === "help") return { ok: true, lines: HELP.map((text) => ({ kind: "text", text })) };

  const word = lower.match(/^[a-z_][a-z0-9_-]*/)?.[0];
  if (!word) return err("SyntaxError", `invalid syntax: '${cmd}'`, "commands start with a name, e.g. print(frontend-stack)");
  if (word !== "print") {
    const close = word.startsWith("pri") || word === "echo" || word === "show" || word === "ls";
    return err(
      "CommandNotFound",
      `'${word}' is not a command`,
      close ? "did you mean print(...)? type help for every command" : "type help for every command",
    );
  }

  const rest = cmd.slice(word.length).trim();
  if (!rest.startsWith("(")) return err("SyntaxError", "expected '(' after print", "write it as print(frontend-stack)");
  if (!rest.includes(")")) return err("SyntaxError", "missing ')' to close print(", "every '(' needs a matching ')'");
  const close = rest.indexOf(")");
  if (rest.slice(close + 1).trim()) {
    return err("SyntaxError", `unexpected '${rest.slice(close + 1).trim()}' after ')'`, "run one command at a time");
  }

  let arg = rest.slice(1, close).trim();
  const quote = arg[0];
  if (quote === '"' || quote === "'") {
    if (arg.length < 2 || arg[arg.length - 1] !== quote) {
      return err("SyntaxError", "unterminated string", `close the ${quote === '"' ? "double" : "single"} quote`);
    }
    arg = arg.slice(1, -1).trim();
  }
  if (!arg) return err("TypeError", "print() needs a stack name", "e.g. print(frontend-stack)");
  if (arg.includes(",")) return err("TypeError", "print() takes one stack at a time", "or use print(all-stacks)");

  const name = arg.toLowerCase();
  if (name === "all-stacks" || name === "all") return { ok: true, lines: stackLines(STACK_NAMES) };
  const exact = STACK_NAMES.find((n) => n === name || n === `${name}-stack`);
  if (exact) return { ok: true, lines: stackLines([exact]) };
  const guess = STACK_NAMES.find((n) => n.startsWith(name.replace(/-stack$/, "")) || name.startsWith(n.split("-")[0]));
  return err(
    "NameError",
    `'${arg}' is not defined`,
    guess ? `did you mean print(${guess})?` : `stacks: ${STACK_NAMES.join(", ")}`,
  );
}

// Projects and roles whose tools/skills list this skill, with a link when one exists.
function linkedWork(skill: string) {
  const has = (list: string | undefined) =>
    (list ?? "").split(",").some((t) => t.trim().toLowerCase() === skill.toLowerCase());
  const work: { name: string; href?: string }[] = [];
  for (const p of [...content.projects, ...content.more])
    if ("tools" in p && has(p.tools)) work.push({ name: p.title, href: ("href" in p && p.href) || undefined });
  for (const e of content.experience) {
    if ("skills" in e && has(e.skills)) work.push({ name: `${e.title}, ${e.org}` });
    for (const r of ("roles" in e ? e.roles : []) ?? [])
      if (has(r.skills)) work.push({ name: `${r.title}, ${e.org}` });
  }
  return work;
}

const HELP = [
  "commands:",
  ...STACKS.map((s) => `  ${s.command.padEnd(30)} ${s.group.toLowerCase()}`),
  `  ${"print(all-stacks)".padEnd(30)} every stack`,
  `  ${"help".padEnd(30)} this list`,
  "press Reset to clear the screen.",
];

// Small line icons for the toolbar (14px, 1.5 stroke, currentColor).
const icon = "size-3.5 fill-none stroke-current";
const Chevron = () => (
  <svg aria-hidden viewBox="0 0 16 16" className={icon} strokeWidth="1.5"><path d="M4 6l4 4 4-4" /></svg>
);
const Clock = () => (
  <svg aria-hidden viewBox="0 0 16 16" className={icon} strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4.5V8l2.5 1.5" /></svg>
);
const Play = () => (
  <svg aria-hidden viewBox="0 0 16 16" className={icon} strokeWidth="1.5"><path d="M5 3.5v9l7-4.5z" /></svg>
);
const Undo = () => (
  <svg aria-hidden viewBox="0 0 16 16" className={icon} strokeWidth="1.5"><path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 2.5v2.8h2.8" /></svg>
);

const tool =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-rule px-3.5 text-xs text-ink transition-colors hover:border-ink disabled:cursor-default disabled:opacity-40 disabled:hover:border-rule";
const menuItem =
  "block w-full cursor-pointer px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-rule focus-visible:bg-rule";

export default function SkillTerminal() {
  // The screen starts empty; nothing prints until the visitor runs a command.
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [skill, setSkill] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [menu, setMenu] = useState<null | "examples" | "history">(null);
  const [status, setStatus] = useState<"ready" | "running">("ready");
  const screen = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const busy = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Menus close on a click elsewhere or Esc
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setInput("");
    setMenu(null);
    setHistory((h) => [cmd, ...h.filter((c) => c !== cmd)].slice(0, 10));
    setStatus("running");
    clearTimeout(busy.current);
    busy.current = setTimeout(() => setStatus("ready"), 450);
    if (cmd.toLowerCase() === "clear") {
      clear();
      return;
    }
    const echo: Line = { kind: "cmd", text: cmd };
    const result = interpret(cmd);
    setLines((l) => [...l, echo, ...(result.ok ? result.lines : [result.error])].slice(-40));
  };

  // Reset clears the screen (typing clear does the same); the picked skill stays on the right.
  function clear() {
    setLines([]);
    setInput("");
    setMenu(null);
  }

  const detail = skill ? content.skillDetails[skill] : undefined;
  const work = skill ? linkedWork(skill) : [];

  return (
    <div className="grid rounded-lg border border-rule md:grid-cols-[1fr_320px]">
      {/* Terminal */}
      <div className="flex min-w-0 flex-col font-mono text-sm">
        <div ref={bar} className="border-b border-rule px-4 py-3">
          <p className="flex items-center gap-2 text-xs text-ink" aria-live="polite">
            <span
              aria-hidden
              className={`size-2 rounded-full ${status === "running" ? "animate-pulse bg-muted" : "bg-ink"}`}
            />
            {status}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menu === "examples"}
                onClick={() => setMenu((m) => (m === "examples" ? null : "examples"))}
                className={tool}
              >
                Examples <Chevron />
              </button>
              {menu === "examples" && (
                <span role="menu" className="absolute top-full left-0 z-20 mt-1 block min-w-[240px] rounded-md border border-rule bg-paper py-1">
                  {COMMANDS.map((c) => (
                    <button key={c} type="button" role="menuitem" onClick={() => run(c)} className={menuItem}>
                      {c}
                    </button>
                  ))}
                </span>
              )}
            </span>
            <span className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menu === "history"}
                disabled={!history.length}
                onClick={() => setMenu((m) => (m === "history" ? null : "history"))}
                className={tool}
              >
                <Clock /> History
              </button>
              {menu === "history" && (
                <span role="menu" className="absolute top-full left-0 z-20 mt-1 block min-w-[240px] rounded-md border border-rule bg-paper py-1">
                  {history.map((c) => (
                    <button key={c} type="button" role="menuitem" onClick={() => run(c)} className={menuItem}>
                      {c}
                    </button>
                  ))}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => run(input)}
              disabled={!input.trim()}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-ink px-3.5 text-xs font-medium text-paper transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-40"
            >
              <Play /> Run
            </button>
            <button type="button" onClick={clear} className={tool}>
              <Undo /> Reset
            </button>
          </div>
        </div>

        <div
          ref={screen}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          className="h-[300px] overflow-y-auto px-4 py-3 leading-relaxed"
        >
          {lines.map((line, i) =>
            line.kind === "stack" ? (
              <div key={i} className="mb-2">
                <p className="text-muted"># {line.group.toLowerCase()}</p>
                <ul>
                  {line.items.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        aria-pressed={name === skill}
                        onClick={() => setSkill(name)}
                        className={`flex min-h-7 w-fit cursor-pointer items-center gap-2 rounded px-1.5 text-left transition-colors ${
                          name === skill ? "bg-ink text-paper" : "text-ink hover:bg-rule"
                        }`}
                      >
                        <span aria-hidden className={name === skill ? "text-paper" : "text-muted"}>
                          &gt;
                        </span>
                        {name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : line.kind === "error" ? (
              <div key={i} role="alert" className="mb-1">
                <p className="text-ink">
                  <span aria-hidden className="mr-1.5">
                    ✗
                  </span>
                  <span className="font-semibold">{line.name}:</span> {line.text}
                </p>
                {line.hint && <p className="pl-5 text-muted">↳ {line.hint}</p>}
              </div>
            ) : (
              <p key={i} className={line.kind === "cmd" ? "text-ink" : "whitespace-pre-wrap text-muted"}>
                {line.kind === "cmd" && <span className="text-muted">$ </span>}
                {line.text}
              </p>
            ),
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
          className="flex items-center gap-2 border-t border-rule px-4"
        >
          <span aria-hidden className="text-muted">
            $
          </span>
          <label htmlFor="skill-cmd" className="sr-only">
            Terminal command, for example print(frontend-stack)
          </label>
          <input
            id="skill-cmd"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type a command, e.g. print(frontend-stack)"
            autoComplete="off"
            spellCheck={false}
            className="min-h-11 w-full bg-transparent text-ink outline-none placeholder:text-muted"
          />
        </form>

        {/* Suggested commands drift left to right; clicking one runs it. Paused on hover/focus. */}
        <div className="skill-marquee overflow-hidden border-t border-rule py-2">
          <div className="skill-marquee-track flex w-max gap-2">
            {[...COMMANDS, ...COMMANDS].map((c, i) => (
              <button
                key={i}
                type="button"
                tabIndex={i < COMMANDS.length ? 0 : -1}
                aria-hidden={i >= COMMANDS.length}
                onClick={() => run(c)}
                className="cursor-pointer rounded-full border border-rule px-3 py-1 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="border-t border-rule px-4 py-2.5 text-xs text-muted">
          how it works: type a command and press Run (or Enter), or pick one from Examples. then click a
          skill to see its proficiency and linked work.
        </p>
      </div>

      {/* Skill detail */}
      <aside
        aria-live="polite"
        aria-label="Skill detail"
        className="border-t border-rule md:relative md:border-t-0 md:border-l"
      >
        {/* On md+ this panel is taken out of the row's height, so a long linked-work list scrolls inside it instead of stretching the box. */}
        <div className="flex flex-col px-5 py-5 md:absolute md:inset-0">
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Skill detail</p>
        {!skill ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Run a command, then pick a skill from the output to see its proficiency and linked work here.
          </p>
        ) : (
          <>
        <p className="mt-2 font-pixel text-[clamp(1.5rem,3vw,2rem)] leading-tight">{skill}</p>

        {detail && (
          <>
            <div className="mt-6 flex items-baseline justify-between font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
              <span>Proficiency</span>
              <span className="tabular-nums">{detail.level}</span>
            </div>
            <div className="mt-2 h-0.5 bg-rule" role="presentation">
              <div className="skill-bar h-full bg-ink" style={{ width: `${detail.level}%` }} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{detail.note}</p>
          </>
        )}

        <p className="mt-6 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          Linked work · {work.length}
        </p>
        {work.length ? (
          <ul className="mt-2 max-h-64 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] md:max-h-none [&::-webkit-scrollbar]:hidden">
            {work.map((w) => (
              <li key={w.name} className="flex items-baseline justify-between gap-3 border-b border-rule py-2.5 last:border-b-0">
                <span className="text-sm">{w.name}</span>
                {w.href ? (
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-[11px] tracking-[0.08em] text-muted uppercase hover:text-ink"
                  >
                    Open ↗<span className="sr-only"> {w.name} (opens in a new tab)</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">Not tied to a project on this page yet.</p>
        )}
          </>
        )}
        </div>
      </aside>
    </div>
  );
}
