---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Portfolio home

Scope: the single home page (`src/app/page.tsx`). Mode: Experience.
Audience and job: recruiters and hiring teams scanning to decide on an interview. Action: email Tiffany or open her profiles.
Content: projects, skills, education and credentials, writing, GitHub activity. All sample content until the owner replaces `src/app/content.ts`; samples are marked on the page.
Constraints: monochrome, minimalist (owner's words). Code-led build. Reference for craft level: immanbufi.dev.
Chosen direction: CV Sheet (the owner picked it on the decision page). Memorable moment: the ruled sheet draws its lines in on load, and the project index opens one entry at a time.
Unresolved: real content, dark theme.

## Direction contract

THESIS: The page a recruiter already reads every day, a résumé, set with a typographer's care. It refuses the centred greeting hero over a grid of project cards.

OWN-WORLD: Paper `#fafaf8`, ink `#141413`, grey `#666668`, hairline rules `#dfdfda`. One grotesk (Schibsted Grotesk) in four sizes. Side headings in a left column, content in ruled rows on the right. No cards, no shadows, no colour, no icons beyond a plus and an arrow.

STORY: The visitor learns who she is and what she does in the first lines, opens the projects one at a time, sweeps skills and credentials as rows, and emails her.

FIRST VIEWPORT: Nav on top: monogram left, section links centre, "Email Tiffany" right. Name at about 56px with the title in grey beneath, a two-sentence bio under it, all in the left column. A ruled side column on the right holds contact links and status. The project index begins near the bottom edge.

FORM: Swiss typographic résumé, position 1 on the ordered list (the pick card). seed:6e5a92544bee1c10. Signature interaction: an exclusive project index, one entry open at a time. Motion grammar: rules draw from the left once on load; links draw their underline on hover.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
