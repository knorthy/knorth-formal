import type { Metadata } from "next";
import { content } from "../content";
import GroupedCards, { type CardGroup } from "../grouped-cards";
import Link from "next/link";
import PageShell from "../page-shell";

export const metadata: Metadata = {
  title: `Projects · ${content.name}`,
  description: `Every project ${content.name} has built, from mobile apps to embedded hardware.`,
};

// Every project (the homepage deck's five, then the smaller builds), grouped by `category` in the
// order the categories first appear.
function groups(): CardGroup[] {
  const all = [
    ...content.projects.map((p) => ({ title: p.title, category: p.category, text: p.kind, image: p.image, href: p.href, tools: p.tools, description: p.description })),
    ...content.more.map((m) => ({ title: m.title, category: m.category, text: m.org, image: "image" in m ? m.image : "", href: "href" in m ? m.href : "", tools: "tools" in m ? m.tools : undefined, description: ("description" in m ? m.description : undefined) ?? m.org })),
  ];
  const map = new Map<string, typeof all>();
  for (const p of all) map.set(p.category, [...(map.get(p.category) ?? []), p]);
  return [...map.entries()].map(([name, items]) => ({
    name,
    monogram: name.charAt(0),
    items: items.map((p) => ({
      key: p.title,
      title: p.title,
      meta: p.text,
      image: p.image || undefined,
      detail: { tools: p.tools, description: p.description },
      monogram: p.title
        .split(/\s+/)
        .filter((w) => /^[A-Z]/.test(w))
        .map((w) => w[0])
        .join("")
        .slice(0, 4),
      link: p.href
        ? { label: "View on GitHub", href: p.href }
        : { label: "Learn more", ask: `tell me more about ${p.title}` },
    })),
  }));
}

export default function ProjectsPage() {
  const total = content.projects.length + content.more.length;
  return (
    <PageShell
      current="/projects"
      title="Projects"
      intro={
        <>
          These are my tech projects: mobile apps, web builds, a 3D game and embedded hardware, grouped by what they are. Each links to its code where the code is public.{" "}
          <Link href="/projects/graphics" className="link text-ink">
            Go to graphics projects ↗
          </Link>
        </>
      }
      count={`${total} projects`}
    >
      <GroupedCards groups={groups()} noun="project" label="Filter by type" />
    </PageShell>
  );
}
