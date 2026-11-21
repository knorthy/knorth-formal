// The frame shared by the inner pages (/projects, /experience, /certifications): header with page links and
// the theme toggle, a big title, an intro line and a count, the page body, and
// Kniah. Each page passes its own title, words and content.
import type { ReactNode } from "react";
import Link from "next/link";
import ChatWidget from "@/components/chat/ChatWidget";
import { content } from "./content";
import { ThemeToggle } from "./sections";

const wrap = "mx-auto w-full max-w-[1040px] px-6";
const tap = "inline-flex min-h-11 items-center";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
];

export default function PageShell(props: {
  current: string;
  title: string;
  intro: ReactNode;
  count: string;
  children: ReactNode;
}) {
  const initials = content.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="text-lg">
      <header className={`${wrap} flex flex-wrap items-center justify-between gap-x-8 py-5`}>
        <Link href="/" aria-label={`${content.name}, home`} className={`${tap} font-semibold tracking-[-0.02em]`}>
          {initials}
        </Link>
        <nav aria-label="Pages" className="order-last flex w-full flex-wrap gap-x-5 text-sm text-muted md:order-none md:w-auto md:gap-x-6">
          {PAGES.map((p) =>
            p.href === props.current ? (
              <Link key={p.href} href={p.href} aria-current="page" className={`${tap} text-ink`}>
                {p.label}
              </Link>
            ) : (
              <Link key={p.href} href={p.href} className={`${tap} transition-colors hover:text-ink`}>
                {p.label}
              </Link>
            ),
          )}
        </nav>
        <ThemeToggle className={`${tap} cursor-pointer`} />
      </header>

      <main className={`${wrap} pt-[clamp(3rem,10vh,6rem)] pb-24`}>
        <h1 className="text-[clamp(2.5rem,7vw,4.25rem)] leading-none tracking-[-0.04em]">{props.title}</h1>
        <p className="mt-6 max-w-[60ch] leading-[1.6] text-muted">{props.intro}</p>
        <p className="mt-4 text-sm text-muted tabular-nums">{props.count}</p>

        <div className="mt-12">{props.children}</div>
      </main>
      <ChatWidget />
    </div>
  );
}
