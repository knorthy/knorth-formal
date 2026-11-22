"use client";

// The interactive pieces of the page. Each wraps one reusable component from
// src/components and feeds it the portfolio's content in the page's ink and paper.
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import DriftWall from "@/components/DriftWall";
import PointerLabel, { usePointerLabel } from "@/components/PointerLabel";
import CardSwap, { type CardSwapHandle } from "@/components/CardSwap";
import SlingButton from "@/components/SlingButton";
import LogoLoop from "@/components/LogoLoop";
import type { IconType } from "react-icons";
import {
  SiArduino, SiCplusplus, SiCss, SiDavinciresolve, SiEspressif, SiFigma, SiFirebase, SiFlutter,
  SiGit, SiGithub, SiJavascript, SiLaravel, SiMysql, SiNextdotjs, SiNodedotjs, SiPicsart,
  SiPython, SiReact, SiSupabase, SiTailwindcss, SiTensorflow, SiTypescript, SiVercel,
  SiDocker, SiExpo, SiFastapi, SiGodotengine, SiGooglegemini, SiNpm, SiNumpy, SiOpencv, SiPandas,
  SiPytorch, SiScikitlearn, SiStreamlit, SiVite, SiYolo,
} from "react-icons/si";
import {
  TbArrowsExchange, TbBrandReactNative, TbBrain, TbStack2, TbBrandAdobeAfterEffect, TbBrandAdobeIllustrator, TbBrandAdobePhotoshop,
  TbBrandAdobePremiere, TbBrandAws, TbBrandVscode, TbBrush, TbMoon, TbSchool, TbScissors, TbSun, TbTrophy,
} from "react-icons/tb";
import { content } from "./content";
import DecryptedText from "@/components/DecryptedText";
import { logoFor, maskStyle } from "./logos";
import Link from "next/link";

// Canvas components need real colour values, not CSS variables. Keep in step with globals.css.
const PALETTE = {
  light: { ink: "#0a0a0a", paper: "#ffffff", sheet: "#f5f5f5", well: "#e9e9e9", band: "#a3a3a3" },
  dark: { ink: "#f4f4f5", paper: "#0c0c0f", sheet: "#1e1e22", well: "#2a2a30", band: "#8a8a92" },
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
  // The new theme wipes in as a circle growing from the button; the icons turn over inside it.
  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const apply = () => {
      const next = readTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const box = e.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    );
  };
  const turn = "col-start-1 row-start-1 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
  return (
    <button type="button" onClick={flip} className={className} aria-label="Toggle dark mode">
      <span className="grid place-items-center">
        <TbMoon aria-hidden size={20} className={`${turn} dark:scale-50 dark:-rotate-90 dark:opacity-0`} />
        <TbSun aria-hidden size={20} className={`${turn} scale-50 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100`} />
      </span>
    </button>
  );
}

// Photos drifting past under Experience: hackathons, competitions and the exchange program.
const galleryItems = content.gallery;

// Hovering a photo shows what it is in a pill that trails the pointer (see PointerLabel). On the tilted
// 3D plane the pointer often lands between tiles; the pill keeps the last photo's label until another is hit.
export function GalleryWall() {
  const c = PALETTE[useTheme()];
  return (
    <PointerLabel
      className="h-[460px] md:h-[640px]"
      labelOf={(t) => {
        const tile = t.closest<HTMLElement>("[data-tile-id]");
        return tile?.getAttribute("aria-label") || tile?.querySelector("img")?.alt || "";
      }}
    >
      <DriftWall
        items={galleryItems}
        columns={7}
        tileWidth={220}
        tileHeight={146}
        gap={16}
        radius={4}
        tilt={16}
        turn={-14}
        speed={36}
        parallax={0.5}
        lift={56}
        fade={0.6}
        dim={0.75}
        grayscale
        overlayColor={c.paper}
      />
    </PointerLabel>
  );
}

// The hero's ID card on a lanyard: drag, stretch and throw it; click to flip it to the back.
// Three.js only runs in the browser, so it loads client-side.
const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

// Room below the hero so a thrown or dragged card is never cut off at the bottom.
const LANYARD_EXTRA = 320;

// The grid cell below is an empty placeholder. On desktop it has no height of its own (it stretches to
// the text column), so the hero is sized by its text alone and the lanyard never adds space. The
// lanyard itself renders into a page-wide layer portalled to <body> (absolute, z-50: above the header
// and hero, under Kniah's paw at z-60 and the chat overlay at z-100), lined up with the placeholder,
// so the card can swing or be dragged anywhere without hitting a box edge. `passThrough` keeps that
// layer click-through everywhere except on the card itself.
export function HeroLanyard() {
  const slot = useRef<HTMLDivElement>(null);
  // The lanyard's canvas is click-through, so it can't report hover. It sets the page cursor to
  // grab/grabbing while the pointer is over the card; read that (after it has run) to show the pill.
  const { move, hide, pill } = usePointerLabel(true);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      requestAnimationFrame(() => {
        const over = document.documentElement.style.cursor.startsWith("grab");
        if (over) move(e.clientX, e.clientY, "Hello World");
        else hide();
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  });
  const [box, setBox] = useState<{
    top: number;
    width: number;
    height: number;
    anchor: number;
    size: number;
    strap: number;
  } | null>(null);

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const width = document.documentElement.clientWidth; // excludes the scrollbar: no sideways scroll
      const slotTop = r.top + window.scrollY;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      // Desktop: the placeholder is exactly as tall as the text column beside it. The card is centred
      // on that column and the strap runs from the very top of the page down to it.
      // Phone: the placeholder sits under the text; the card hangs near its bottom.
      const card = desktop ? Math.min(360, Math.max(260, r.height * 0.9)) : 200;
      const top = desktop ? 0 : slotTop;
      const cardTop = desktop ? slotTop + (r.height - card) / 2 - top : r.height - card - 24;
      const H = cardTop + card + LANYARD_EXTRA;
      // Lanyard sizing: card height = size * H; card top = (0.12 + 0.3 * strapLength) * H.
      setBox({
        top,
        width,
        height: H,
        anchor: (r.left + r.width / 2) / width,
        size: card / H,
        strap: Math.max(0, (cardTop / H - 0.12) / 0.3),
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={slot}
      aria-hidden
      className="pointer-events-none -mt-12 h-[400px] md:mt-0 md:h-auto md:self-stretch"
    >
      {box &&
        createPortal(
          <div
            className="pointer-events-none absolute left-0 z-50"
            style={{ top: box.top, width: box.width, height: box.height }}
          >
            <Lanyard
              frontImage="/lanyard/front.webp"
              backImage="/lanyard/back.svg"
              strapImage="/lanyard/strap.svg"
              imageFit="contain"
              cardColor="#ffffff"
              strapColor="#0a0a0a"
              metal="graphite"
              finish="glossy"
              anchor={box.anchor}
              size={box.size}
              strapLength={box.strap}
              grayscale
              passThrough
            />
          </div>,
          document.body,
        )}
      {box && createPortal(pill, document.body)}
    </div>
  );
}

const deckItems = content.projects.map((p) => ({ image: p.image || undefined, title: p.title, alt: p.title }));

// Projects as a stack of tilted cards (the Claro landing layout): the front card's project is written
// out on the left; the deck swaps on its own, on drag, or with the button.
export function ProjectDeck() {
  const theme = useTheme();
  const c = PALETTE[theme];
  const deck = useRef<CardSwapHandle>(null);
  const [index, setIndex] = useState(0);
  const p = content.projects[index];
  const count = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="grid items-center gap-x-10 gap-y-10 py-10 md:grid-cols-[1fr_1.15fr] md:py-16">
      <div key={index} className="settle min-w-0" aria-live="polite">
        <p className="font-mono text-sm text-muted tabular-nums">
          {count(index + 1)} / {count(content.projects.length)}
        </p>
        <h3 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em]">{p.title}</h3>
        <p className="mt-2 text-sm text-muted">{p.kind}</p>
        <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.6] text-pretty text-muted">{p.description}</p>
        <p className="mt-4 text-sm">{p.tools}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-6">
          {/* "See more" opens /projects; the small sling in place of its arrow swaps to the next
              project when tapped or pulled and let go. */}
          <span className="inline-flex items-center gap-2.5 text-sm">
            <Link href="/projects" className="inline-flex min-h-11 items-center">
              <span className="link">See more</span>
              <span className="sr-only"> projects</span>
            </Link>
            <SlingButton
              onSend={() => deck.current?.next()}
              ariaLabel="Next project"
              size={26}
              strokeWidth={1.5}
              armAt={18}
              maxPull={70}
              padColor={c.ink}
              iconColor={c.paper}
              accentColor={c.ink}
              wellColor={c.well}
              bandColor={c.band}
            >
              <svg aria-hidden viewBox="0 0 12 12" className="size-3 fill-none stroke-current" strokeWidth="1.5">
                <path d="M1 6h10M7 2l4 4-4 4" />
              </svg>
            </SlingButton>
          </span>
        </div>
      </div>
      <PointerLabel
        className="h-[360px] min-w-0 [&_img]:grayscale [&_img]:transition-[filter] [&_img]:duration-300 [&_[data-swap-index]:hover_img]:grayscale-0 sm:h-[500px]"
        labelOf={(t) => content.projects[Number(t.closest("[data-swap-index]")?.getAttribute("data-swap-index"))]?.title ?? ""}
      >
        <CardSwap
          ref={deck}
          items={deckItems}
          width={640}
          height={440}
          cardDistance={56}
          verticalDistance={62}
          skewAmount={6}
          delay={5000}
          cardRadius={6}
          theme={theme}
          onChange={setIndex}
        />
      </PointerLabel>
    </div>
  );
}

// One logo per skill, drawn in the page's ink. A skill without an icon here falls back to its name.
const TECH_ICONS: Record<string, IconType> = {
  "Next.js": SiNextdotjs, React: SiReact, "Tailwind CSS": SiTailwindcss, JavaScript: SiJavascript,
  TypeScript: SiTypescript, CSS: SiCss, "Node.js": SiNodedotjs, Python: SiPython, "C++": SiCplusplus,
  Laravel: SiLaravel, MySQL: SiMysql, Firebase: SiFirebase, Supabase: SiSupabase,
  FlutterFlow: SiFlutter, Arduino: SiArduino, ESP32: SiEspressif, TensorFlow: SiTensorflow,
  Gymnasium: TbBrain, AWS: TbBrandAws, Vercel: SiVercel, Figma: SiFigma, Photoshop: TbBrandAdobePhotoshop,
  Canva: TbBrush, CapCut: TbScissors, "Premiere Pro": TbBrandAdobePremiere, Illustrator: TbBrandAdobeIllustrator,
  "After Effects": TbBrandAdobeAfterEffect, "DaVinci Resolve": SiDavinciresolve, Picsart: SiPicsart,
  Git: SiGit, GitHub: SiGithub, "VS Code": TbBrandVscode,
  FastAPI: SiFastapi, "React Native": TbBrandReactNative, CORS: TbArrowsExchange, Expo: SiExpo,
  "Godot 4": SiGodotengine, GDScript: SiGodotengine, PyTorch: SiPytorch, YOLOv8: SiYolo, YOLO11: SiYolo, "Google Gemini": SiGooglegemini,
  Streamlit: SiStreamlit, OpenCV: SiOpencv, "scikit-learn": SiScikitlearn, pandas: SiPandas, NumPy: SiNumpy,
  npm: SiNpm, Docker: SiDocker, Vite: SiVite, Zustand: TbStack2,
};

const skillLogos = content.skills.flatMap((group) =>
  group.items.split(", ").map((name) => {
    const Icon = TECH_ICONS[name];
    return {
      node: (
        <span data-tip={name} className="inline-flex">
          {Icon ? <Icon aria-hidden size={30} /> : <span className="font-medium">{name}</span>}
        </span>
      ),
      title: name,
    };
  }),
);

export function SkillsLoop() {
  return (
    <PointerLabel labelOf={(t) => t.closest<HTMLElement>("[data-tip]")?.dataset.tip ?? ""}>
      <LogoLoop
        logos={skillLogos}
        speed={45}
        logoHeight={30}
        gap={56}
        hoverSpeed={12}
        ariaLabel="Skills"
      />
    </PointerLabel>
  );
}

// Education and credentials as two ruled columns, each entry led by its logo drawn in ink.

// Laid out like immanbufi.dev: 12px column heading over a hairline, then entries led by a 120px logo,
// an 11px issuer, the title, a subtitle, a 12px date and an optional link. Two credentials show up
// front; "View all credentials" opens the rest in place.
function Entry(props: {
  Logo?: IconType;
  /** a logo image, drawn as a mask in the ink colour so it follows light and dark */
  logoSrc?: string;
  label?: string;
  title: string;
  sub?: string;
  when?: string;
  href?: string;
  /** link text: "Show credential" for certificates, "Learn more" for awards */
  linkLabel?: string;
  /** with no href, the link asks Kniah this instead */
  ask?: string;
  /** put the date on the label line ("WHITESTRINGS · Jun 2026 — Present") instead of its own line */
  dateInLabel?: boolean;
}) {
  const inline = props.dateInLabel && props.when;
  const linkClass =
    "mt-1 inline-flex min-h-11 cursor-pointer items-center font-mono text-xs text-muted transition-colors hover:text-ink";
  return (
    <li className="flex gap-6">
      {props.logoSrc ? (
        // The logo files are white on transparent; using them as a mask over the ink colour keeps
        // them monochrome and visible on both the light and the dark page.
        <span
          aria-hidden
          className="block h-[72px] w-[120px] shrink-0 self-start bg-ink"
          style={maskStyle(props.logoSrc, "left center")}
        />
      ) : (
        props.Logo && (
          <span className="flex w-[120px] shrink-0 items-center justify-start self-start pt-1 text-ink">
            <props.Logo aria-hidden size={72} />
          </span>
        )
      )}
      <span className="min-w-0">
        {props.label && (
          <span className="block font-mono text-[11px] leading-snug tracking-[0.08em] text-muted">
            <span className="uppercase">{props.label}</span>
            {inline && <span className="whitespace-nowrap tabular-nums"> · {props.when}</span>}
          </span>
        )}
        <span className="mt-1 block font-pixel text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-tight tracking-[-0.02em]">
          {props.title}
        </span>
        {props.sub && <span className="mt-1.5 block text-sm text-muted">{props.sub}</span>}
        {props.when && !inline && (
          <span className="mt-1.5 block font-mono text-sm text-muted tabular-nums">{props.when}</span>
        )}
        {props.href ? (
          <a href={props.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <span className="link">{props.linkLabel ?? "Learn more"}</span>
            <span aria-hidden className="ml-1">&#8599;</span>
            <span className="sr-only"> about {props.title} (opens in a new tab)</span>
          </a>
        ) : (
          props.ask && (
            // No page yet: ask Kniah about it (ChatWidget listens for "kniah:ask")
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("kniah:ask", { detail: props.ask }))}
              className={linkClass}
            >
              <span className="link">{props.linkLabel ?? "Learn more"}</span>
              <span aria-hidden className="ml-1">↗</span>
              <span className="sr-only"> about {props.title}: asks Kniah</span>
            </button>
          )
        )}
      </span>
    </li>
  );
}

const head =
  "mb-7 border-b border-rule pb-3.5 font-sans text-xs font-medium tracking-[0.08em] text-muted uppercase";

// Same column style as the credentials, text only: work on the left, leadership and volunteering right.
// Leadership shows as many entries as work experience up front, so the two columns start even.
const LEADERSHIP_UP_FRONT = content.experience.length;

// Opens a section of an inner page, styled like the other "View all" links.
function PageLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink"
    >
      {children}
      <span aria-hidden className="ml-1">
        ↗
      </span>
    </Link>
  );
}

// The homepage keeps a short version; the full detail (whiteStrings' roles, every organisation) is
// on /experience.
export function ExperienceGrid() {
  // Work puts "company · date" on one line; leadership keeps the date on its own line.
  const column = (items: { title: string; org: string; sub?: string; when: string }[], id: string, work = false) => (
    <ul id={id} className="flex flex-col gap-10">
      {items.map((e) => (
        <Entry key={`${e.title}-${e.org}`} label={e.org} title={e.title} sub={e.sub} when={e.when} dateInLabel={work} />
      ))}
    </ul>
  );
  return (
    <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
      {/* Each column is a flex column and its link sits in an mt-auto wrapper, so "Learn more" and
          "View all leadership & volunteering" share a baseline however long either list is. */}
      <div className="flex flex-col">
        <h3 className={head}>Work experience</h3>
        {column(content.experience, "work-list", true)}
        <div className="mt-auto">
          <PageLink href="/experience#work">Learn more</PageLink>
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className={head}>Leadership &amp; volunteering</h3>
        {column(content.leadership.slice(0, LEADERSHIP_UP_FRONT), "leadership-list")}
        <div className="mt-auto">
          <PageLink href="/experience#volunteering">View all leadership &amp; volunteering</PageLink>
        </div>
      </div>
    </div>
  );
}

// The homepage shows the first two; "View all credentials" opens the full /certifications page.
export function CredentialsGrid() {
  const shown = content.credentials.slice(0, 2);
  return (
    <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
      <div>
        <h3 className={head}>Education</h3>
        <ul className="flex flex-col gap-12">
          {content.education.map((e) => (
            <Entry key={e.title} Logo={TbSchool} logoSrc={logoFor(e.org)} label={"label" in e ? e.label : undefined} title={e.title} sub={e.org} when={e.when} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className={head}>Recognition &amp; credentials</h3>
        <ul id="credential-list" className="flex flex-col gap-12">
          {shown.map((c) => (
            <Entry
              key={c.title}
              Logo={TbTrophy}
              logoSrc={logoFor(c.org)}
              label={c.org}
              title={c.title}
              sub={"award" in c ? [("sub" in c ? c.sub : ""), c.when].filter(Boolean).join(" · ") : "sub" in c ? c.sub : undefined}
              when={"award" in c ? undefined : c.when && `Issued ${c.when}`}
              href={c.href}
              linkLabel={"award" in c ? "Learn more" : "Show credential"}
              ask={`tell me about her ${c.title} ${"award" in c ? "win" : "certificate"} from ${c.org}`}
            />
          ))}
        </ul>
        {content.credentials.length > 2 && (
          <Link
            href="/certifications"
            className="mt-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink"
          >
            View all credentials
            <span aria-hidden className="ml-1">
              ↗
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

const ICONS = {
  GitHub: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.243 5.634 5.833-5.634zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

// Contact and footer in one block, in the page colours: brand and links, about and socials, then the form.
// The form posts to /api/contact, which emails the message (see api/contact/route.ts).
const field =
  "w-full rounded-[10px] border border-ink/10 bg-ink/5 px-[18px] py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-ink/50";
const faint = "text-ink/45";

// The year is read in the browser only: a prerendered page can't hold the current date.
const noop = () => () => {};
const useYear = () => useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);

export function ContactFooter() {
  const year = useYear();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const touched = useRef(0); // when the visitor first used the form, so instant bot posts can be told apart
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), elapsed: touched.current ? Date.now() - touched.current : 0 }),
    }).catch(() => null);
    if (res?.ok) form.reset();
    setStatus(res?.ok ? "sent" : "error");
  };
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative mt-14 flex min-h-[min(100svh,46rem)] flex-col justify-center overflow-hidden bg-paper px-6 pt-20 pb-16 text-ink md:mt-20"
    >
      <h2 id="contact-title" className="sr-only">
        Contact
      </h2>
      <div className="relative z-10 mx-auto grid w-full max-w-[1040px] gap-x-16 gap-y-12 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-6">
          <h3 className="text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
            Let&apos;s build something together.
          </h3>
          <p className={`max-w-[40ch] text-sm leading-[1.7] ${faint}`}>
            Got a role, a project or an idea? Send a message and I&apos;ll get back to you.
          </p>
          <a href={`mailto:${content.email}`} className="w-fit text-sm">
            <span className="link">{content.email}</span>
          </a>
          <div className="flex gap-3">
            {content.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="flex size-11 items-center justify-center rounded-lg border border-ink/10 bg-ink/[0.07] text-ink/60 transition-colors hover:border-ink/20 hover:bg-ink/[0.12] hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
                  <path d={ICONS[l.label as keyof typeof ICONS]} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={send}
          onFocus={() => {
            touched.current ||= Date.now();
          }}
          className="flex flex-col gap-3"
        >
          {/* Honeypot: invisible to people, bots fill it in and are dropped by the API */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <input name="name" type="text" required placeholder="Your name" aria-label="Your name" className={field} />
          <input name="email" type="email" required placeholder="Your email" aria-label="Your email" className={field} />
          <textarea name="message" required rows={5} placeholder="Message" aria-label="Message" className={`${field} resize-none`} />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full cursor-pointer rounded-[10px] bg-ink p-3.5 text-[15px] font-semibold text-paper transition-[background,transform] hover:-translate-y-0.5 hover:bg-ink/80 active:translate-y-0"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
          <p role="status" className={`min-h-5 text-sm ${status === "error" ? "text-red-600 dark:text-red-300" : "text-ink/60"}`}>
            {status === "sent" && "Thanks, your message was sent."}
            {status === "error" && `Couldn't send that. Please try again, or email ${content.email}.`}
          </p>
        </form>
      </div>

      <p className="relative z-10 mx-auto mt-16 w-full max-w-[1040px] text-sm text-ink/30">
        © {year} {content.name}
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0 w-full translate-y-1/2 text-center text-[min(19vw,22rem)] leading-none font-extrabold tracking-[-0.02em] whitespace-nowrap text-ink/5 select-none"
      >
        DEVELOP
      </div>
    </section>
  );
}

// "What I build": four areas, each with the projects that back it up, linking to /projects.
export function WhatIBuild() {
  return (
    <div>
      <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {content.process.map((s, i) => (
          <li key={s.name} className="flex flex-col border-t border-rule pt-5">
            <span className="font-mono text-xs text-muted">0{i + 1}</span>
            <h4 className="mt-1 text-lg">{s.name}</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
            <p className="mt-4 font-mono text-xs leading-relaxed text-ink">{s.tools}</p>
          </li>
        ))}
      </ol>
      <Link
        href="#contact"
        className="mt-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink"
      >
        Start the conversation
        <span aria-hidden className="ml-1">
          ↗
        </span>
      </Link>
    </div>
  );
}

// Intro link to the resume PDF: reads "Resume", and decrypts into "Hire me" on hover or focus.
// A new `text` makes DecryptedText (animateOn="view") play its reveal again for the new word.
export function ResumeLink({ className, children }: { className?: string; children?: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={content.resume}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <span className="link">
        <DecryptedText
          text={hover ? "Hire me" : "Resume"}
          animateOn="view"
          sequential
          speed={40}
          encryptedClassName="text-muted"
          aria-hidden
        />
      </span>
      {children}
      <span className="sr-only">Resume (PDF, opens in a new tab)</span>
    </a>
  );
}
