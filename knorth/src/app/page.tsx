import DecryptedText from "@/components/DecryptedText";
import { content } from "./content";
import {
  ContactFooter,
  CredentialsGrid,
  ExperienceGrid,
  GalleryWall,
  HeroLanyard,
  ProjectDeck,
  SkillsLoop,
  ThemeToggle,
  ResumeLink,
  WhatIBuild,
} from "./sections";
import ChatWidget from "@/components/chat/ChatWidget";
import SkillTerminal from "./skill-terminal";

// Type scale: four sizes only. text-sm (meta), text-lg (text), `title`, `display`.
const wrap = "mx-auto w-full max-w-[1040px] px-6";
const tap = "inline-flex min-h-11 items-center";

const sections = [
  "Credentials",
  "Projects",
  "Skills",
  "Experience",
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
              <span className="mt-2 block text-[clamp(1.25rem,3vw,1.75rem)] font-medium tracking-[-0.02em] text-muted">
                {content.title}
              </span>
            </h1>
            <p className="mt-7 max-w-[54ch] text-base leading-[1.6] text-pretty">
              {content.bio}
            </p>
            <p className="mt-3">
              <Sample />
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-7">
              {content.links.filter((l) => l.label !== "X").map((l) => (
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
              <ResumeLink className={tap}>
                <Arrow />
              </ResumeLink>
            </p>
            <p className="mt-1 text-sm text-muted">{content.status}</p>
          </div>

          <HeroLanyard />
        </section>

        <section id="credentials" aria-label="Education and credentials">
          <div className="draw draw-view h-px bg-rule" />
          <div className="py-14 md:py-20">
            <CredentialsGrid />
          </div>
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
          <h3 className="mt-10 mb-6 font-sans text-sm text-muted">What I build</h3>
          <WhatIBuild />
        </section>

        {/* Heading above; the logo strip and the terminal use the full sheet width. */}
        <section id="skills" aria-labelledby="skills-title">
          <div className="draw draw-view h-px bg-rule" />
          <div className="py-14 md:py-20">
            <h2 id="skills-title" className="mb-8 text-lg font-medium">
              Skills
            </h2>
            <div className="mb-10">
              <SkillsLoop />
            </div>
            <SkillTerminal />
          </div>
        </section>

        <section id="experience" aria-label="Experience">
          <div className="draw draw-view h-px bg-rule" />
          <div className="py-14 md:py-20">
            <ExperienceGrid />
          </div>
        </section>

        {/* Heading and line keep the side-heading grid; the wall itself spans the whole sheet. */}
        <section id="gallery" aria-labelledby="gallery-title">
          <div className="draw draw-view h-px bg-rule" />
          <div className="grid gap-x-10 gap-y-6 pt-14 pb-8 md:grid-cols-[200px_1fr] md:pt-20">
            <h2 id="gallery-title" className="text-lg font-medium">
              Gallery
            </h2>
            <p className="text-[15px] text-balance text-muted">
              Where I&apos;ve been and what I&apos;ve been up to lately, caught on camera along the way. Hover a photo to bring it forward in colour.
            </p>
          </div>
          <div className="pb-14 md:pb-20">
            <GalleryWall />
          </div>
        </section>

      </main>

      <ContactFooter />
      <ChatWidget />
    </div>
  );
}
