"use client";

// The card grid shared by /certifications and /experience: a row of filter tabs, then one section
// per group (logo, name, count) holding rounded cards with a picture panel, title, meta line and an
// optional link. Pages pass plain data; this file owns the look.
import { useRef, useState } from "react";
import { logoFor, maskStyle } from "./logos";

export type CardItem = {
  key: string;
  title: string;
  sub?: string;
  meta: string;
  /** org whose logo fills the picture panel */
  logoOrg?: string;
  /** shown in the picture panel when there's no logo or image, e.g. "AWS" */
  monogram?: string;
  /** a picture (in /public) for the panel instead of the logo */
  image?: string;
  /** when set, enlarging the image shows all of these in a grid instead */
  gallery?: string[];
  /** href opens in a new tab; without one, `ask` sends that question to Kniah */
  link?: { label: string; href?: string; ask?: string };
};
export type CardGroup = { name: string; logoOrg?: string; monogram?: string; items: CardItem[] };

function Mark({ org, monogram, className, text }: { org?: string; monogram?: string; className: string; text: string }) {
  const src = org ? logoFor(org) : undefined;
  if (src) return <span aria-hidden className={`block bg-ink ${className}`} style={maskStyle(src)} />;
  return (
    <span aria-hidden className={`grid place-items-center font-pixel leading-none text-ink ${text}`}>
      {monogram ?? org?.charAt(0) ?? ""}
    </span>
  );
}

function CardLink({ item }: { item: CardItem }) {
  const link = item.link;
  if (!link || (!link.href && !link.ask)) return null;
  const cls = "mt-auto inline-flex min-h-11 items-center pt-2 text-sm text-muted transition-colors hover:text-ink";
  if (link.href)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span className="link">{link.label}</span>
        <span aria-hidden className="ml-1">
          ↗
        </span>
        <span className="sr-only"> for {item.title} (opens in a new tab)</span>
      </a>
    );
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("kniah:ask", { detail: link.ask }))}
      className={`${cls} cursor-pointer`}
    >
      <span className="link">{link.label}</span>
      <span aria-hidden className="ml-1">
        →
      </span>
    </button>
  );
}

// Click the picture to view it large in a native <dialog> (Esc, focus trap and backdrop come free).
function Zoom({ src, gallery = [src], title }: { src: string; gallery?: string[]; title: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  // Play the close animation (data-closing, see globals.css) before really closing.
  const close = () => {
    const d = ref.current;
    if (!d || d.dataset.closing) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    d.dataset.closing = "1";
    setTimeout(() => {
      delete d.dataset.closing;
      d.close();
    }, 200);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`Enlarge ${title} certificate`}
        className="absolute inset-0 cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" decoding="async" className="size-full object-contain p-4" />
      </button>
      <dialog
        ref={ref}
        onClick={close}
        onCancel={(e) => {
          e.preventDefault(); // Esc: animate out instead of vanishing
          close();
        }}
        aria-label={title}
        className="m-auto max-h-[90vh] max-w-[92vw] cursor-zoom-out overflow-hidden bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-md"
      >
        <div className={`grid gap-4 ${gallery.length > 1 ? "grid-cols-2 place-items-center" : ""}`}>
          {gallery.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={g} src={g} loading="lazy" decoding="async" alt={gallery.length > 1 ? `${title}, certificate ${i + 1}` : title} className={`rounded-xl object-contain ${gallery.length > 1 ? "max-h-[42vh] max-w-[46vw]" : "max-h-[88vh] max-w-[92vw]"}`} />
          ))}
        </div>
      </dialog>
    </>
  );
}

function Card({ item }: { item: CardItem }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-rule">
      <div className="relative grid h-[220px] shrink-0 place-items-center overflow-hidden border-b border-rule bg-[color-mix(in_oklab,var(--color-ink)_3%,var(--color-paper))] p-4">
        {item.image ? (
          <Zoom src={item.image} gallery={item.gallery} title={item.title} />
        ) : (
          <Mark org={item.logoOrg} monogram={item.monogram} className="h-24 w-40" text="text-[clamp(2.5rem,5vw,3.5rem)]" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-5 pb-3">
        <h3 className="text-[17px] leading-snug tracking-[-0.01em]">{item.title}</h3>
        {item.sub && <p className="mt-1 text-sm text-muted">{item.sub}</p>}
        <p className="mt-2 text-sm text-muted">{item.meta}</p>
        <CardLink item={item} />
      </div>
    </li>
  );
}

export default function GroupedCards({
  groups,
  noun,
  label,
}: {
  groups: CardGroup[];
  /** singular word for the count, e.g. "credential" */
  noun: string;
  /** accessible name for the tab row */
  label: string;
}) {
  const [tab, setTab] = useState("All");
  const shown = tab === "All" ? groups : groups.filter((g) => g.name === tab);
  const count = (n: number) => `${n} ${noun}${n === 1 ? "" : "s"}`;

  return (
    <>
      <div
        className="-mx-6 flex gap-x-6 overflow-x-auto border-b border-rule px-6 whitespace-nowrap md:mx-0 md:px-0"
        role="tablist"
        aria-label={label}
      >
        {["All", ...groups.map((g) => g.name)].map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`-mb-px min-h-11 shrink-0 cursor-pointer border-b text-sm transition-colors ${
              tab === name ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-16">
        {shown.map((g) => (
          <section key={g.name} aria-label={g.name}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-rule">
                <Mark org={g.logoOrg} monogram={g.monogram} className="size-6" text="text-sm" />
              </span>
              <h3 className="text-lg">{g.name}</h3>
              <p className="ml-auto shrink-0 text-sm whitespace-nowrap text-muted tabular-nums">{count(g.items.length)}</p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item) => (
                <Card key={item.key} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
