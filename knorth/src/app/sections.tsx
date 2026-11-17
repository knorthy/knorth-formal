"use client";

// The interactive pieces of the page. Each wraps one reusable component from
// src/components and feeds it the portfolio's content in the page's ink and paper.
import { useSyncExternalStore } from "react";
import DriftWall from "@/components/DriftWall";
import InfiniteMenu from "@/components/InfiniteMenu";
import LogoLoop from "@/components/LogoLoop";
import type { IconType } from "react-icons";
import {
  SiArduino, SiCplusplus, SiCss, SiDavinciresolve, SiEspressif, SiFigma, SiFirebase, SiFlutter,
  SiGit, SiGithub, SiJavascript, SiLaravel, SiMysql, SiNextdotjs, SiNodedotjs, SiPicsart,
  SiCisco, SiDatacamp, SiPython, SiReact, SiSpringboot, SiSupabase, SiTailwindcss, SiTensorflow, SiTypescript, SiVercel,
} from "react-icons/si";
import {
  TbBrain, TbBrandAdobeAfterEffect, TbBrandAdobeIllustrator, TbBrandAdobePhotoshop,
  TbBrandAdobePremiere, TbBrandAws, TbBrandVscode, TbBrush, TbRobot, TbSchool, TbScissors, TbTrophy,
} from "react-icons/tb";
import { content } from "./content";

// Canvas components need real colour values, not CSS variables. Keep in step with globals.css.
const PALETTE = {
  light: { ink: "#141413", paper: "#fafaf8", sheet: "#ffffff", well: "#e6e6e1", band: "#9d9d98" },
  dark: { ink: "#ededea", paper: "#141413", sheet: "#262624", well: "#2a2a28", band: "#6f6f6b" },
};

// The theme lives on <html data-theme>, set before paint by the script in layout.tsx.
const watchTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const readTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const useTheme = () => useSyncExternalStore(watchTheme, readTheme, () => "light" as const);

// Both labels render and CSS shows one, so the right word is there before hydration.
export function ThemeToggle({ className }: { className?: string }) {
  const flip = () => {
    const next = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button type="button" onClick={flip} className={className}>
      <span className="link dark:hidden">Dark mode</span>
      <span className="link hidden dark:inline">Light mode</span>
    </button>
  );
}

const wallItems = content.projects.map((p) => ({ image: p.image, title: p.title }));

// Decorative backdrop: `inert` keeps its many repeated tiles out of the tab order.
export function HeroWall() {
  const theme = useTheme();
  const c = PALETTE[theme];
  return (
    <div inert aria-hidden className="h-[300px] md:h-[440px]">
      <DriftWall
        items={wallItems}
        columns={3}
        tileWidth={170}
        tileHeight={113}
        gap={14}
        radius={2}
        tilt={14}
        turn={-16}
        speed={22}
        parallax={0}
        fade={0.55}
        dim={0.9}
        grayscale
        overlayColor={c.paper}
      />
    </div>
  );
}

const sphereItems = content.projects.map((p) => ({
  image: p.image,
  title: p.title,
  description: p.description,
  link: p.href || undefined,
}));

export function ProjectSphere() {
  const theme = useTheme();
  const c = PALETTE[theme];
  return (
    <div className="relative h-[420px] md:h-[560px]">
      <InfiniteMenu
        items={sphereItems}
        count={90}
        roundness={0.06}
        autoplay={5}
        dim={0.35}
        zoom={1.1}
        theme={theme}
        accentColor={c.ink}
      />
    </div>
  );
}

// One logo per skill, drawn in the page's ink. A skill without an icon here falls back to its name.
const TECH_ICONS: Record<string, IconType> = {
  "Next.js": SiNextdotjs, React: SiReact, "Tailwind CSS": SiTailwindcss, JavaScript: SiJavascript,
  TypeScript: SiTypescript, CSS: SiCss, "Node.js": SiNodedotjs, Python: SiPython, "C++": SiCplusplus,
  Laravel: SiLaravel, MySQL: SiMysql, Firebase: SiFirebase, Supabase: SiSupabase, "Spring Boot": SiSpringboot,
  FlutterFlow: SiFlutter, Arduino: SiArduino, ESP32: SiEspressif, TensorFlow: SiTensorflow,
  Gymnasium: TbBrain, AWS: TbBrandAws, Vercel: SiVercel, Figma: SiFigma, Photoshop: TbBrandAdobePhotoshop,
  Canva: TbBrush, CapCut: TbScissors, "Premiere Pro": TbBrandAdobePremiere, Illustrator: TbBrandAdobeIllustrator,
  "After Effects": TbBrandAdobeAfterEffect, "DaVinci Resolve": SiDavinciresolve, Picsart: SiPicsart,
  Git: SiGit, GitHub: SiGithub, "VS Code": TbBrandVscode,
};

const skillLogos = content.skills.flatMap((group) =>
  group.items.split(", ").map((name) => {
    const Icon = TECH_ICONS[name];
    return {
      node: Icon ? <Icon aria-hidden size={30} /> : <span className="font-medium">{name}</span>,
      title: name,
    };
  }),
);

export function SkillsLoop() {
  return (
    <LogoLoop
      logos={skillLogos}
      speed={45}
      logoHeight={30}
      gap={56}
      hoverSpeed={12}
      ariaLabel="Skills"
    />
  );
}

// Education and credentials as two ruled columns, each entry led by its logo drawn in ink.
const LOGOS: Record<string, IconType> = {
  Cisco: SiCisco,
  DataCamp: SiDatacamp,
  TESDA: TbRobot,
  "KadaKareer x Home Credit": TbTrophy,
};

// Sizes follow immanbufi.dev: 12px heading, 11px issuer, 17px title, 14px subtitle, 12px date.
function Entry(props: { Logo: IconType; label?: string; title: string; sub?: string; when?: string }) {
  return (
    <li className="flex gap-[18px]">
      <span className="flex w-24 shrink-0 items-start text-ink">
        <props.Logo aria-hidden size={56} />
      </span>
      <span className="min-w-0">
        {props.label && (
          <span className="block font-mono text-[11px] leading-snug tracking-[0.08em] text-muted uppercase">
            {props.label}
          </span>
        )}
        <span className="block text-[17px] leading-tight font-semibold tracking-[-0.02em]">
          {props.title}
        </span>
        {props.sub && <span className="mt-1 block text-sm text-muted">{props.sub}</span>}
        {props.when && (
          <span className="mt-2 block font-mono text-xs text-muted tabular-nums">{props.when}</span>
        )}
      </span>
    </li>
  );
}

export function CredentialsGrid() {
  const head =
    "mb-7 border-b border-rule pb-3.5 text-xs font-medium tracking-[0.08em] text-muted uppercase";
  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
      <div>
        <h3 className={head}>Education</h3>
        <ul className="flex flex-col gap-12">
          {content.education.map((e) => (
            <Entry key={e.title} Logo={TbSchool} title={e.title} sub={e.org} when={e.when} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className={head}>Recognition &amp; credentials</h3>
        <ul className="flex flex-col gap-12">
          {content.credentials.map((c) => (
            <Entry key={c.title} Logo={LOGOS[c.org] ?? TbTrophy} label={c.org} title={c.title} when={c.when} />
          ))}
        </ul>
      </div>
    </div>
  );
}

const ICONS = {
  GitHub: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.243 5.634 5.833-5.634zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

// Contact and footer in one dark block: brand and links, about and socials, then the form.
// The form opens the visitor's mail app with the message filled in.
// shortcut: mailto only, no server; add an email API route when a real address exists.
const field =
  "w-full rounded-[10px] border border-white/10 bg-white/5 px-[18px] py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/50";
const faint = "text-white/45";

// The year is read in the browser only: a prerendered page can't hold the current date.
const noop = () => () => {};
const useYear = () => useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);

export function ContactFooter() {
  const year = useYear();
  const firstName = content.name.split(" ")[0];
  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Message from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n${f.get("name")} (${f.get("email")})`;
    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const nav = [
    ["Home", "#main"],
    ["Projects", "#projects"],
    ["Experience", "#experience"],
    ["Credentials", "#credentials"],
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative mt-14 flex min-h-svh flex-col justify-center overflow-hidden bg-[#0d0d0d] px-[8vw] pt-20 pb-16 text-white md:mt-20"
    >
      <h2 id="contact-title" className="sr-only">
        Contact
      </h2>
      <div className="relative z-10 flex flex-col justify-between gap-[60px] md:flex-row md:flex-wrap">
        <div className="flex max-w-[280px] flex-col gap-5">
          <span className="text-lg font-semibold tracking-[-0.2px]">{content.name}</span>
          <p className={`text-sm leading-[1.7] ${faint}`}>
            {content.title}. {content.status}.
          </p>
          <nav aria-label="Footer" className="mt-2 flex flex-col gap-3 text-sm">
            {nav.map(([label, href]) => (
              <a key={label} href={href} className="w-fit text-white/50 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <p className="mt-4 text-sm text-white/25">
            © {year} {content.name}. Built with care.
          </p>
        </div>

        <div className="flex max-w-[260px] flex-col gap-6">
          <h3 className="font-semibold text-white/90">About {firstName}</h3>
          <p className={`text-sm leading-[1.75] ${faint}`}>{content.bio}</p>
          <div>
            <p className="mb-2.5 text-sm font-semibold text-white/40">Follow me</p>
            <div className="flex gap-3">
              {content.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.12] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
                    <path d={ICONS[l.label as keyof typeof ICONS]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[480px] flex-1 md:min-w-[320px]">
          <h3 className="mb-5 text-[clamp(1.125rem,2vw,1.375rem)] font-semibold">
            Send me a message
          </h3>
          <form onSubmit={send} className="flex flex-col gap-3">
            <input name="name" type="text" required placeholder="Your name" aria-label="Your name" className={field} />
            <input name="email" type="email" required placeholder="Your email" aria-label="Your email" className={field} />
            <textarea name="message" required rows={5} placeholder="Message" aria-label="Message" className={`${field} resize-none`} />
            <button
              type="submit"
              className="w-full cursor-pointer rounded-[10px] bg-white p-3.5 text-[15px] font-semibold text-[#0a0c0a] transition-[background,transform] hover:-translate-y-0.5 hover:bg-white/80 active:translate-y-0"
            >
              Send message
            </button>
          </form>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-full translate-y-1/2 text-center text-[19vw] leading-none font-extrabold tracking-[-0.02em] whitespace-nowrap text-white/5 select-none"
      >
        DEVELOP
      </div>
    </section>
  );
}
