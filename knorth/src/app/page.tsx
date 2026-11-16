import type { ReactNode } from "react";
import { content } from "./content";

// Type scale: four sizes only. text-sm (meta), text-lg (text), `title`, `display`.
const wrap = "mx-auto w-full max-w-[1040px] px-6";
const tap = "inline-flex min-h-11 items-center";
const title =
  "text-[clamp(1.5rem,3.4vw,2.25rem)] leading-tight font-medium tracking-[-0.02em]";
const row =
  "border-b border-rule py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex sm:items-baseline sm:justify-between sm:gap-x-6";
// Right-hand column shared by the hero side column and the open project.
const cols = "md:grid-cols-[1fr_232px]";

const sections = [
  "Projects",
  "Skills",
  "Education",
  "Credentials",
  "Writing",
  "GitHub",
];

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="ml-1.5 size-3 fill-none stroke-current"
      strokeWidth="1.25"
    >
      <path d="M3 9l6-6M4 3h5v5" />
    </svg>
  );
}

// Marks a whole group as placeholder content.
function Sample() {
  return content.sample ? (
    <span className="text-sm font-normal text-muted">Sample</span>
  ) : null;
}

function Section(props: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={props.id} aria-labelledby={`${props.id}-title`}>
      <div className="draw draw-view h-px bg-rule" />
      <div className="grid gap-x-10 gap-y-6 py-14 md:grid-cols-[200px_1fr] md:py-20">
        <h2
          id={`${props.id}-title`}
          className="flex items-baseline gap-3 text-lg font-medium md:flex-col md:gap-1"
        >
          {props.title}
          <Sample />
        </h2>
        <div>{props.children}</div>
      </div>
    </section>
  );
}

function Rows(props: {
  items: { title: string; org: string; when: string }[];
}) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.title} className={row}>
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-medium">{item.title}</span>
            <span className="text-muted">{item.org}</span>
          </span>
          <span className="block text-sm text-muted tabular-nums">
            {item.when}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Sample pattern only: a fixed pseudo-random fill so the grid has a shape.
// shortcut: no real GitHub data, wire the contributions API once a username exists.
const shades = ["#ecece8", "#cfcfca", "#9d9d98", "#5c5c59", "#141413"];
const cells = Array.from({ length: 53 * 7 }, (_, i) => {
  const n = ((i * 2654435761) >>> 0) % 100;
  const busy = i > 200 ? 25 : 60;
  return n < busy ? 0 : n < 78 ? 1 : n < 90 ? 2 : n < 97 ? 3 : 4;
});

export default function Home() {
  const mail = `mailto:${content.email}`;
  const firstName = content.name.split(" ")[0];
  const initials = content.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="text-lg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      {content.sample && (
        <p role="note" className="bg-ink px-6 py-2 text-center text-sm text-paper">
          This page shows sample content. Replace it in src/app/content.ts.
        </p>
      )}

      <header
        className={`${wrap} flex flex-wrap items-center justify-between gap-x-8 py-5`}
      >
        <a
          href="#main"
          aria-label={content.name}
          className={`${tap} font-semibold tracking-[-0.02em]`}
        >
          {initials}
        </a>
        <nav
          aria-label="Sections"
          className="order-last grid w-full grid-cols-3 gap-x-6 text-sm text-muted md:order-none md:flex md:w-auto"
        >
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className={`${tap} transition-colors hover:text-ink`}
            >
              {s}
            </a>
          ))}
        </nav>
        <a href={mail} className={tap}>
          <span className="link">Email {firstName}</span>
        </a>
      </header>

      <main id="main" className={wrap}>
        <section
          className={`grid gap-x-10 gap-y-12 pt-[clamp(3rem,16vh,9rem)] pb-[clamp(4rem,14vh,8rem)] ${cols}`}
        >
          <div className="settle">
            <h1 className="text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
              {content.name}
              <span className="block font-medium text-muted">
                {content.title}
              </span>
            </h1>
            <p className="mt-7 max-w-[54ch] leading-[1.6] text-pretty">
              {content.bio}
            </p>
            <p className="mt-3">
              <Sample />
            </p>
          </div>

          <dl className="settle border-rule [animation-delay:120ms] md:-ml-7 md:border-l md:pl-7">
            <dt className="flex items-baseline gap-3 text-sm text-muted">
              Connect <Sample />
            </dt>
            <dd className="mt-1 mb-7 flex flex-col items-start">
              {content.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tap}
                >
                  <span className="link">{l.label}</span>
                  <Arrow />
                </a>
              ))}
            </dd>
            <dt className="flex items-baseline gap-3 text-sm text-muted">
              Status <Sample />
            </dt>
            <dd className="mt-2 leading-snug">{content.status}</dd>
          </dl>
        </section>

        <section
          id="projects"
          aria-labelledby="projects-title"
          className="pb-14 md:pb-20"
        >
          <h2
            id="projects-title"
            className="flex items-baseline gap-3 pb-4 font-medium"
          >
            Projects
            <Sample />
            <span className="ml-auto text-sm font-normal text-muted tabular-nums">
              {content.projects.length}
            </span>
          </h2>
          <div className="draw h-px bg-ink" />
          {content.projects.map((p, i) => (
            <details
              key={p.title}
              name="projects"
              open={i === 0}
              className="group border-b border-rule last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6">
                <span
                  className={`${title} text-muted transition-colors group-open:text-ink group-hover:text-ink`}
                >
                  {p.title}
                </span>
                <span className="flex shrink-0 items-center gap-4 text-sm text-muted">
                  <span className="hidden sm:inline">{p.kind}</span>
                  <span className="tabular-nums">{p.year}</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className="size-3 stroke-ink transition-transform duration-300 group-open:rotate-45"
                    strokeWidth="1.25"
                  >
                    <path d="M6 1v10M1 6h10" />
                  </svg>
                </span>
              </summary>
              <div className={`grid gap-x-10 gap-y-4 pb-9 ${cols}`}>
                <p className="max-w-[54ch] leading-[1.6] text-pretty">
                  {p.description}
                </p>
                <div className="flex flex-col items-start gap-1 text-sm text-muted">
                  <p className="sm:hidden">{p.kind}</p>
                  <p>{p.tools}</p>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${tap} text-lg text-ink`}
                    >
                      <span className="link">Visit project</span>
                      <Arrow />
                    </a>
                  )}
                </div>
              </div>
            </details>
          ))}
        </section>

        <Section id="skills" title="Skills">
          <dl>
            {content.skills.map((s) => (
              <div key={s.group} className={`${row} sm:flex-row-reverse`}>
                <dt className="text-sm text-muted">{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" title="Education">
          <Rows items={content.education} />
        </Section>

        <Section id="credentials" title="Credentials">
          <Rows items={content.credentials} />
        </Section>

        <Section id="writing" title="Writing">
          <ul>
            {content.writing.map((w) => (
              <li key={w.title} className={row}>
                <span className="block max-w-[54ch]">
                  {w.href ? (
                    <a href={w.href} className="link font-medium">
                      {w.title}
                    </a>
                  ) : (
                    <span className="font-medium">{w.title}</span>
                  )}
                  <span className="mt-1 block text-muted">{w.summary}</span>
                </span>
                <span className="block shrink-0 text-sm text-muted tabular-nums">
                  {w.when}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="github" title="GitHub">
          <p className="mb-5 text-muted">
            Contributions over the last 12 months.
          </p>
          <div
            role="img"
            aria-label="Contribution grid, sample pattern"
            className="grid grid-flow-col grid-rows-7 gap-[2px] sm:gap-[3px]"
          >
            {cells.map((level, i) => (
              <span
                key={i}
                className="aspect-square rounded-[1px]"
                style={{ background: shades[level] }}
              />
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <a href={mail} className={`${title} inline-flex items-center`}>
            <span className="link">Email {firstName}</span>
          </a>
          <p className="mt-3 max-w-[54ch] text-muted">{content.status}.</p>
        </Section>
      </main>

      <footer className={wrap}>
        <div className="draw h-px bg-rule" />
        <div className="flex flex-wrap items-center justify-between gap-x-8 py-6 text-sm">
          <span className="font-medium">{content.name}</span>
          <span className="flex flex-wrap gap-x-7">
            {content.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={tap}
              >
                <span className="link">{l.label}</span>
                <Arrow />
              </a>
            ))}
          </span>
        </div>
      </footer>
    </div>
  );
}
