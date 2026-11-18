"use client";

// The skills as a small terminal: type (or click) a command like print(frontend-stack), the stack
// prints as clickable names, and the panel on the right shows the picked skill's proficiency, a
// one-line note and the work on this page that uses it. Data: content.skills (the stacks) and
// content.skillDetails (level + note); linked work is found from project tools and role skills.
import { useEffect, useRef, useState } from "react";
import { content } from "./content";

type Line = { kind: "cmd" | "text" | "error"; text: string } | { kind: "stack"; group: string; items: string[] };

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
const COMMANDS = [...STACKS.map((s) => s.command), "print(all-stacks)", "help", "clear"];

// Projects and roles whose tools/skills list this skill, with a link when one exists.
function linkedWork(skill: string) {
  const has = (list: string | undefined) =>
    (list ?? "").split(",").some((t) => t.trim().toLowerCase() === skill.toLowerCase());
  const work: { name: string; href?: string }[] = [];
  for (const p of content.projects) if (has(p.tools)) work.push({ name: p.title, href: p.href || undefined });
  for (const e of content.experience)
    for (const r of ("roles" in e ? e.roles : []) ?? [])
      if (has(r.skills)) work.push({ name: `${r.title}, ${e.org}` });
  return work;
}

const HELP = [
  "commands:",
  ...STACKS.map((s) => `  ${s.command.padEnd(30)} ${s.group.toLowerCase()}`),
  `  ${"print(all-stacks)".padEnd(30)} every stack`,
  `  ${"clear".padEnd(30)} clear the screen`,
];

export default function SkillTerminal() {
  const first = STACKS[0];
  const [lines, setLines] = useState<Line[]>([
    { kind: "text", text: "tiffany's skills. type a command below, or click one." },
    { kind: "cmd", text: first.command },
    { kind: "stack", group: first.group, items: first.items },
  ]);
  const [input, setInput] = useState("");
  const [skill, setSkill] = useState(first.items[0]);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setInput("");
    const key = cmd.toLowerCase().replace(/\s+/g, "");
    if (key === "clear") {
      setLines([]);
      return;
    }
    const echo: Line = { kind: "cmd", text: cmd };
    let out: Line[];
    if (key === "help") out = HELP.map((text) => ({ kind: "text", text }));
    else if (key === "print(all-stacks)" || key === "print(all)")
      out = STACKS.map((s) => ({ kind: "stack", group: s.group, items: s.items }));
    else {
      const stack = STACKS.find((s) => s.command === key || slug(s.group) === key);
      out = stack
        ? [{ kind: "stack", group: stack.group, items: stack.items }]
        : [{ kind: "error", text: `command not found: ${cmd}. try help` }];
    }
    setLines((l) => [...l, echo, ...out].slice(-40));
  };

  const detail = content.skillDetails[skill];
  const work = linkedWork(skill);

  return (
    <div className="grid overflow-hidden rounded-lg border border-rule md:grid-cols-[1fr_280px]">
      {/* Terminal */}
      <div className="flex min-w-0 flex-col font-mono text-sm">
        <div className="flex items-center gap-2 border-b border-rule px-4 py-2.5 text-xs text-muted">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2 rounded-full bg-rule" />
            <span className="size-2 rounded-full bg-rule" />
            <span className="size-2 rounded-full bg-rule" />
          </span>
          <span className="ml-2">tiffany@portfolio: ~/skills</span>
        </div>

        <div
          ref={screen}
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          className="h-[260px] overflow-y-auto px-4 py-3 leading-relaxed"
        >
          {lines.map((line, i) =>
            line.kind === "stack" ? (
              <div key={i} className="mb-2">
                <p className="text-muted"># {line.group.toLowerCase()}</p>
                <p className="flex flex-wrap gap-x-1 gap-y-1">
                  {line.items.map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={name === skill}
                      onClick={() => setSkill(name)}
                      className={`min-h-8 cursor-pointer rounded px-1.5 transition-colors ${
                        name === skill ? "bg-ink text-paper" : "text-ink hover:bg-rule"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </p>
              </div>
            ) : (
              <p
                key={i}
                className={
                  line.kind === "cmd" ? "text-ink" : line.kind === "error" ? "text-ink" : "whitespace-pre-wrap text-muted"
                }
              >
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
          how it works: run a command, then pick a skill to see its proficiency and linked work.
        </p>
      </div>

      {/* Skill detail */}
      <aside
        aria-live="polite"
        aria-label="Skill detail"
        className="border-t border-rule px-5 py-5 md:border-t-0 md:border-l"
      >
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Skill detail</p>
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
          <ul className="mt-2">
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
      </aside>
    </div>
  );
}
