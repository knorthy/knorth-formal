import type { Metadata } from "next";
import { content } from "../content";
import { type CardGroup } from "../grouped-cards";
import PageShell from "../page-shell";
import LeadershipCards from "./leadership-cards";

export const metadata: Metadata = {
  title: `Experience · ${content.name}`,
  description: `Where ${content.name} has worked, led and volunteered.`,
};

// Short monogram for an org without a logo: "AWS User Group BuildHers+" -> "AWS", otherwise initials.
function monogram(org: string) {
  const name = org.split(",")[0];
  const acronym = name.match(/\b[A-Z]{2,}\b/)?.[0];
  if (acronym) return acronym;
  return name
    .split(/\s+/)
    .filter((w) => !/^(of|the|and|for|x)$/i.test(w))
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 4);
}

// Leadership & volunteering as card groups (the same layout as /certifications)
function leadershipGroups(): CardGroup[] {
  const lead = content.leadership.filter((l) => !("sub" in l && l.sub === "Volunteer"));
  const vol = content.leadership.filter((l) => "sub" in l && l.sub === "Volunteer");
  const card = (l: (typeof content.leadership)[number]) => ({
    key: `${l.title}-${l.org}`,
    title: l.title,
    meta: [l.org, l.when].filter(Boolean).join(" · "),
    logoOrg: l.org,
    monogram: monogram(l.org),
  });
  return [
    { name: "Leadership", monogram: "L", items: lead.map(card) },
    { name: "Volunteering", monogram: "V", items: vol.map(card) },
  ].filter((g) => g.items.length);
}

type Role = { title: string; when: string; text?: string; skills?: string };

// Work experience as a timeline: dates on the left, the role on the right, sub-roles nested beneath.
function WorkTimeline() {
  return (
    <ol className="border-t border-rule">
      {content.experience.map((e) => {
        const roles: Role[] = "roles" in e ? (e.roles as Role[]) : [];
        return (
          <li
            key={`${e.title}-${e.org}`}
            className="grid gap-x-10 gap-y-2 border-b border-rule py-10 md:grid-cols-[200px_1fr]"
          >
            <p className="font-mono text-sm text-muted tabular-nums md:pt-1.5">{e.when}</p>
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{e.org}</p>
              <h3 className="mt-1 text-[clamp(1.375rem,2.6vw,1.75rem)] leading-tight tracking-[-0.02em]">{e.title}</h3>
              {"sub" in e && e.sub && <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">{e.sub}</p>}
              {roles.length > 0 && (
                <ol className="mt-6 flex flex-col gap-6 border-l border-rule pl-6">
                  {roles.map((r) => (
                    <li key={r.title} className="relative">
                      <span aria-hidden className="absolute top-[0.55em] -left-[28.5px] size-[9px] rounded-full border border-ink bg-paper" />
                      <p className="font-pixel text-[19px] leading-tight">{r.title}</p>
                      <p className="mt-1 font-mono text-xs text-muted tabular-nums">{r.when}</p>
                      {r.text && <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">{r.text}</p>}
                      {r.skills && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {r.skills.split(", ").map((s) => (
                            <li key={s} className="rounded-full border border-rule px-2.5 py-1 font-mono text-[11px] text-ink">
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function ExperiencePage() {
  const total = content.experience.length + content.leadership.length;
  return (
    <PageShell
      current="/experience"
      title="Experience"
      intro="Where she has worked, and the communities she helps run and volunteers for, from AWS student groups to conference tech teams."
      count={`${content.experience.length} roles · ${content.leadership.length} in leadership and volunteering · ${total} in all`}
    >
      <section id="work" aria-labelledby="work-title" className="scroll-mt-8">
        <h2 id="work-title" className="mb-6 font-mono text-xs tracking-[0.08em] text-muted uppercase">
          Work experience
        </h2>
        <WorkTimeline />
      </section>

      <section id="volunteering" aria-labelledby="vol-title" className="mt-24 scroll-mt-8">
        <h2 id="vol-title" className="mb-6 font-mono text-xs tracking-[0.08em] text-muted uppercase">
          Leadership &amp; volunteering
        </h2>
        <LeadershipCards groups={leadershipGroups()} />
      </section>
    </PageShell>
  );
}
