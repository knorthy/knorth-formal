---
name: Tiffany Lyssa Portfolio
description: A developer's portfolio set as a Swiss typographic résumé, in ink on paper.
colors:
  paper: "#fafaf8"
  ink: "#141413"
  muted: "#666668"
  rule: "#dfdfda"
typography:
  display:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(1.5rem, 3.4vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
spacing:
  gutter: "24px"
  row: "16px"
  index-row: "24px"
  column-gap: "40px"
  section: "56px"
  section-wide: "80px"
components:
  link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "44px"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    height: "44px"
  nav-link-hover:
    textColor: "{colors.ink}"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    width: "200px"
  row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "16px 0"
  project-entry:
    textColor: "{colors.muted}"
    typography: "{typography.title}"
    padding: "24px 0"
  project-entry-open:
    textColor: "{colors.ink}"
  sample-marker:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  notice-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "8px 24px"
---

# Design System: Tiffany Lyssa Portfolio

## Overview

**Creative North Star: "The CV Sheet"**

The page is the document a recruiter already reads every day, a résumé, set with a typographer's care. It is one sheet of paper in one grotesk: side headings in a left column, content in ruled rows on the right, a name and two sentences at the top. Nothing sits on a surface above the page, because there is only the page.

The system is monochrome and minimalist by the owner's binding commitment. Hierarchy comes from four type sizes, three weights and the difference between ink and grey. Separation comes from hairline rules. Motion happens in two places only: the sheet's rules draw in from the left (the Projects rule on load, each section rule as it scrolls into view), and links draw their underline on hover.

**Key Characteristics:**
- One typeface, four sizes, three weights (400, 500, 600).
- Ink, grey, paper and a hairline; no hue anywhere.
- Side headings left, ruled rows right, inside a 1040px sheet.
- Flat: no cards, no shadows, no filled panels around content.
- One project open at a time.
- Placeholder content is marked as a sample wherever it appears.

## Colors

Four neutrals with a trace of warmth, and no accent.

### Primary
- **Ink** (`ink`): Names, headings, body text, the open project title, link underlines, the focus outline, and the single dark rule under the Projects heading. Inverted with Paper for the text selection, the skip link and the sample notice bar.

### Neutral
- **Paper** (`paper`): The page background, and text on ink fills.
- **Grey** (`muted`): Secondary text: the job title under the name, dates, organisations, tool lists, navigation links at rest, closed project titles, summaries, the Sample marker.
- **Hairline** (`rule`): Every 1px divider: the rule above each section, the lines between rows and between project entries, the vertical line beside the hero's side column.

### Named Rules
**The Ink Only Rule.** No hue. Emphasis is ink against grey, weight, or size, never a colour. A link is ink with an underline that draws in, not a coloured word.

## Typography

**Display Font:** Schibsted Grotesk (loaded with next/font, sans-serif fallback)
**Body Font:** Schibsted Grotesk

**Character:** One grotesk doing every job, tight and slightly condensed at large sizes, plain and open at reading size. The voice is a well-set document, not a poster.

### Hierarchy
- **Display** (600, clamp 40px to 56px, line-height 1.05, tracking -0.03em): The name, once per page. The job title sits beneath it at the same size in weight 500 and Grey.
- **Title** (500, clamp 24px to 36px, line-height 1.25, tracking -0.02em): Project titles in the index, and the closing email link.
- **Body** (400, 18px, line-height 1.6 for paragraphs): Everything that is read: bio, descriptions, row content, side headings (in weight 500). Paragraphs are capped at 54ch.
- **Label** (400, 14px): Metadata: dates, kinds, tool lists, navigation, the Sample marker, the footer. Sentence case, no tracking, no uppercase.

### Named Rules
**The Four Sizes Rule.** 14, 18, the title clamp and the name clamp. A fifth size is not available; rank within a size is carried by weight (500 against 400) and by ink against grey.

**The Tabular Figures Rule.** Years, dates and counts use tabular numerals so they align down a column of rows.

## Layout

A single centred sheet, 1040px wide at most, with a 24px gutter on each side. Inside it, two column schemes recur:

- **Section grid:** a 200px side-heading column, then the content column, 40px apart. Used by every section below the project index.
- **Right column:** content, then a fixed 232px column, 40px apart. Used by the hero (bio left, contact links and status right) and by an open project (description left, tools and link right).

Both collapse to a single column below 768px; the side heading then sits above its content. Rows put their date on the right from 640px and stack it beneath below that.

Vertical rhythm: sections are padded 56px top and bottom, 80px from 768px. Rows are padded 16px, project index rows 24px. The hero opens with fluid space above (48px to 144px, tied to viewport height) so the project index begins near the bottom edge of the first viewport. The header holds a monogram left, section links centre and the email link right; on narrow screens the section links drop to a three-column grid beneath.

Every link and navigation item has a 44px minimum height.

## Elevation & Depth

Flat. There are no shadows and no raised or tinted surfaces; the page has one plane. Order and grouping are conveyed by hairline rules, by column position and by whitespace.

### Named Rules
**The Hairline Rule.** Content is separated by a 1px line, never by a box. Rows carry a line beneath (none under the last); each section carries a line above; the project index opens with the one ink-coloured line on the page.

## Shapes

Square. No element carries a border radius as part of the system, and nothing is outlined as a box: borders appear only as single 1px lines along one edge. The two icons are 12px line drawings in a 1.25 stroke: an arrow pointing up and right after external links, and a plus on each project entry that turns 45 degrees when the entry is open.

## Components

### Links
- **Style:** Ink text at the size of its context, no underline at rest.
- **Hover / Focus:** A 1px underline in the text colour draws from the left over 0.35s (ease `cubic-bezier(0.16, 1, 0.3, 1)`).
- **External links:** Followed by the 12px arrow.
- **Focus:** A 2px ink outline, offset 3px, on every focusable element.

### Navigation
- **Style:** Label size in Grey, turning Ink on hover. The monogram on the left is weight 600 with -0.02em tracking; the email link on the right is body size with the drawn underline.
- **Mobile:** Section links wrap to a three-column grid under the monogram and email link.

### Section
- **Structure:** A hairline rule across the sheet, then the side heading (body size, weight 500) in the 200px column and the content beside it.
- **Motion:** The rule draws from the left on load (0.9s, same ease), only when the visitor has not asked for reduced motion.

### Rows
- **Style:** A title in weight 500, a secondary part in Grey, and a date at Label size on the right in tabular numerals. Hairline beneath each row, none beneath the last.
- **Use:** Skills, education, credentials, writing.

### Project Index
The signature component: a list of projects that opens one at a time.
- **Closed entry:** Title at Title size in Grey; kind, year and a plus at Label size on the right.
- **Open entry:** Title turns Ink, the plus turns to a cross, and the description (54ch) appears with tools and the project link in the 232px right column.
- **Behaviour:** Entries share one group, so opening one closes the others. The first is open on arrival. Built on native disclosure elements, so it works without script and from the keyboard.
- **Motion:** Height eases open over 0.4s where the browser supports it and the visitor has not asked for reduced motion; otherwise it opens at once.

### Sample Marker
- **Style:** The word "Sample" at Label size, weight 400, in Grey, set beside the heading of any group whose content is placeholder.
- **Notice bar:** While any sample content remains, a full-width Ink bar with Paper text at Label size sits above the header and says so.
- **Behaviour:** Both are driven by one flag in the content file and disappear together when it is turned off.

### Named Rules
**The One Open Rule.** In the project index exactly one entry is expanded at a time; opening another closes it.

**The Marked Sample Rule.** Placeholder content is never shown unmarked. If it is not real, the group heading says "Sample".

## Do's and Don'ts

### Do:
- **Do** set every surface in Schibsted Grotesk at one of the four sizes: 14px, 18px, the title clamp (24px to 36px) or the name clamp (40px to 56px).
- **Do** separate content with 1px hairline rules and whitespace.
- **Do** keep content inside the 1040px sheet, with side headings in the 200px column and secondary detail in the 232px right column.
- **Do** cap reading text at 54ch.
- **Do** put load animation, smooth scrolling and eased opening behind the reduced-motion check.
- **Do** give links and navigation items a 44px minimum height and the 2px ink focus outline.
- **Do** mark placeholder content with the Sample marker.

### Don't:
- **Don't** introduce a hue, a tint or a gradient; the palette is ink, grey, paper and hairline.
- **Don't** wrap content in cards, panels or shadows.
- **Don't** add a fifth type size or a second typeface.
- **Don't** add icons beyond the arrow and the plus.
- **Don't** let more than one project entry stay open.
- **Don't** add motion beyond the rules drawing in on load, the underline drawing on hover, and the entry easing open.
