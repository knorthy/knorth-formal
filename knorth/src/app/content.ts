// Everything the portfolio shows lives here. Entries below are samples:
// replace them with real ones, then set `sample` to false to remove the
// notice bar and the "Sample" tags.
export const content = {
  sample: true,
  name: "Tiffany Lyssa",
  title: "Developer",
  bio: "I build web apps that are quick to learn and easy to keep running. Most of my work is in TypeScript and React, from the database to the interface.",
  status: "Open to junior developer roles and internships",
  email: "hello@tiffanylyssa.example",
  links: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  projects: [
    {
      title: "Clinic queue board",
      kind: "Team project",
      year: "2026",
      description:
        "A waiting-room screen and staff page for a small clinic. Patients see their place in line; staff call the next number from a phone.",
      tools: "Next.js, PostgreSQL, WebSockets",
      href: "",
    },
    {
      title: "Bus fare calculator",
      kind: "Hackathon project",
      year: "2025",
      description:
        "Type a start and an end stop and get the fare, the transfers and the travel time for each route between them.",
      tools: "React, FastAPI, Python",
      href: "",
    },
    {
      title: "Thesis reference manager",
      kind: "Personal project",
      year: "2025",
      description:
        "Keeps papers, notes and citations for one thesis in a single searchable list, and exports the bibliography in the required format.",
      tools: "TypeScript, SQLite, Tauri",
      href: "",
    },
    {
      title: "Dorm laundry tracker",
      kind: "Personal project",
      year: "2024",
      description:
        "Shows which washers are free in a dormitory and sends a message when a load is done.",
      tools: "React Native, Firebase",
      href: "",
    },
  ],
  skills: [
    { group: "Languages", items: "TypeScript, JavaScript, Python, SQL" },
    { group: "Frameworks", items: "React, Next.js, FastAPI, Tailwind CSS" },
    { group: "Data and tools", items: "PostgreSQL, SQLite, Git, Docker" },
  ],
  education: [
    {
      title: "BS Computer Science",
      org: "Your university",
      when: "2023 to present",
    },
  ],
  credentials: [
    { title: "Certificate name", org: "Issuing organisation", when: "2025" },
    { title: "Award or programme", org: "Organiser", when: "2024" },
  ],
  writing: [
    {
      title: "What a hackathon weekend taught me about scope",
      summary: "Notes on cutting a project down until it can ship in two days.",
      when: "Oct 2026",
      href: "",
    },
    {
      title: "Moving a side project from SQLite to PostgreSQL",
      summary: "What changed, what broke, and what I would do first next time.",
      when: "Jun 2026",
      href: "",
    },
  ],
};
