import type { ReactNode } from "react";
import DecryptedText from "@/components/DecryptedText";
import { content } from "./content";
import {
  ContactFooter,
  CredentialsGrid,
  HeroWall,
  ProjectDeck,
  SkillsLoop,
  ThemeToggle,
} from "./sections";
import ChatWidget from "@/components/chat/ChatWidget";

// Type scale: four sizes only. text-sm (meta), text-lg (text), `title`, `display`.
const wrap = "mx-auto w-full max-w-[1040px] px-6";
const tap = "inline-flex min-h-11 items-center";
const row =
  "border-b border-rule py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex sm:items-baseline sm:justify-between sm:gap-x-6";

const sections = [
  "Projects",
  "Skills",
  "Experience",
  "Credentials",
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
        <div className="min-w-0">{props.children}</div>
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
        <li key={`${item.title}-${item.org}`} className={row}>
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-medium">{item.title}</span>
            <span className="text-muted">{item.org}</span>
          </span>
          {item.when && (
            <span className="block text-sm text-muted tabular-nums">
              {item.when}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
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
        <ThemeToggle className={`${tap} cursor-pointer`} />
      </header>

      <main id="main" className={wrap}>
        <section
          className={`grid gap-x-10 gap-y-12 pt-[clamp(3rem,16vh,9rem)] pb-[clamp(4rem,14vh,8rem)] md:grid-cols-[1fr_400px] md:items-center`}
        >
          <div className="settle">
            <h1 className="text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
              <DecryptedText
                text={content.name}
                animateOn="inViewHover"
                sequential
                speed={45}
                encryptedClassName="text-muted"
              />
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
            <p className="mt-6 flex flex-wrap items-center gap-x-7">
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
            </p>
            <p className="mt-1 text-muted">{content.status}</p>
          </div>

          <HeroWall />
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
          <div className="draw h-px bg-rule" />
          <ProjectDeck />
          <div className="h-px bg-rule" />
          <h3 className="mt-10 mb-4 font-sans text-sm text-muted">Also built</h3>
          <Rows items={content.more} />
        </section>

        <Section id="skills" title="Skills">
          <div className="mb-10">
            <SkillsLoop />
          </div>
          <dl>
            {content.skills.map((s) => (
              <div key={s.group} className={`${row} sm:flex-row-reverse`}>
                <dt className="text-sm text-muted">{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="experience" title="Experience">
          <Rows items={content.experience} />
          <h3 className="mt-10 mb-4 font-sans text-sm text-muted">Leadership and volunteering</h3>
          <Rows items={content.leadership} />
        </Section>

        <section id="credentials" aria-label="Education and credentials">
          <div className="draw draw-view h-px bg-rule" />
          <div className="py-14 md:py-20">
            <CredentialsGrid />
          </div>
        </section>
      </main>

      <ContactFooter />
      <ChatWidget />
    </div>
  );
}
