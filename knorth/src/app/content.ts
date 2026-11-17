// Everything the portfolio shows lives here, taken from the existing knorth portfolio.
// Set `sample` to true to bring back the notice bar and the "Sample" tags for placeholder content.
export const content = {
  sample: false,
  name: "Tiffany Lyssa",
  title: "Software engineer and designer",
  bio: "I build and design web and mobile software, and I also make embedded and IoT hardware with ESP32 and Arduino. Based in Manila, Philippines. Champion of the AI in UX for FinTech Hackathon.",
  status: "Open to jobs and internships",
  // shortcut: placeholder address, no public email exists yet; replace it with a real one.
  email: "hello@tiffanylyssa.example",
  links: [
    { label: "GitHub", href: "https://github.com/knorthy" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tiffany-lyssa-4b210b281/" },
    { label: "X", href: "https://x.com/kno_orth" },
  ],
  // Only projects with an image can sit in the gallery; the rest are in `more`.
  projects: [
    {
      title: "PsoMetric",
      kind: "Image recognition for psoriasis severity",
      image: "/projects/mobile-psometric.webp",
      year: "",
      description:
        "A cross-platform React Native app where clinicians upload skin images and get AI-powered, real-time PASI severity scores with annotated lesion analysis. Role: full-stack developer and UI/UX designer.",
      tools: "React Native, image recognition, AI scoring",
      href: "",
    },
    {
      title: "MetaCampus",
      kind: "AR for interactive student events",
      image: "/projects/mobile-metacampus.webp",
      year: "",
      description:
        "An augmented reality campus engagement platform. Led UI/UX design in Figma and coordinated team milestones for on-time delivery. Role: project manager, full-stack developer and UI/UX designer.",
      tools: "Augmented reality, Figma",
      href: "",
    },
    {
      title: "Dash Car Rentals",
      kind: "Prototype",
      image: "/projects/uiux-dash-car-rentals.webp",
      year: "",
      description:
        "A responsive car rental platform prototype in Figma with intuitive booking flows and real-time availability checking. Role: full-stack developer and UI/UX designer.",
      tools: "Figma",
      href: "",
    },
    {
      title: "IoT Earthquake Detector",
      kind: "Freelance, embedded systems",
      image: "/projects/iot-earthquake-detector.webp",
      year: "",
      description:
        "Seismic detection on ESP controllers with automated alerts and remote monitoring through the cloud.",
      tools: "ESP32, sensors, cloud alerts",
      href: "",
    },
    {
      title: "Misting Sanitation System",
      kind: "Freelance, embedded systems",
      image: "/projects/iot-misting-sanitation.webp",
      year: "",
      description:
        "Arduino-powered misting pipes with sensor-triggered activation and QR-based attendance tracking.",
      tools: "Arduino, sensors, QR attendance",
      href: "",
    },
    {
      title: "Claro",
      kind: "Website",
      image: "/projects/websites-claro-hero.webp",
      year: "",
      description:
        "Landing page and feedback form for a personal expense tracker.",
      tools: "Next.js, React",
      href: "",
    },
  ],
  // Design and build work shown on the drifting wall below Experience (files in public/work).
  gallery: [
    { image: "/work/uiux-event-app.webp", title: "Event app: character setup, events and discover" },
    { image: "/work/graphics-blockchain-decoders.webp", title: "Blockchain Decoders speaker poster" },
    { image: "/work/uiux-competition-site.webp", title: "Competition site: rulebook and events" },
    { image: "/work/graphics-project-coding-2025.webp", title: "Project Coding 2025 event graphics" },
    { image: "/work/websites-claro-feedback.webp", title: "Claro: feedback form and footer" },
    { image: "/work/motion-bcc-teaser.jpg", title: "Blockchain Campus Conference teaser" },
    { image: "/work/graphics-stix-n-print.webp", title: "Social ad for Stix 'N Print co." },
    { image: "/work/uiux-psometric.webp", title: "PsoMetric: sign-in and assessment flows" },
    { image: "/work/qa-illustration.webp", title: "Illustration: a regression run and a bug report" },
  ],
  more: [
    { title: "One Indang", org: "Official mobile app of the Municipality of Indang: public services, emergency contacts, news and issue reporting", when: "" },
    { title: "The Blind Leading the Blown Up", org: "3D game, led gameplay, level design and delivery", when: "" },
    { title: "Reinforcement learning power factor corrector", org: "Model that optimizes power factor correction in a simulated electrical system", when: "" },
    { title: "APFC", org: "ESP-based automatic power factor corrector with real-time monitoring and cloud logging", when: "" },
    { title: "POS systems", org: "Point-of-sale systems with inventory and real-time sales reporting for small businesses", when: "" },
  ],
  skills: [
    { group: "Frontend", items: "Next.js, React, Tailwind CSS, JavaScript, TypeScript, CSS" },
    { group: "Backend", items: "Node.js, Python, C++, Laravel, MySQL, Firebase, Supabase, Spring Boot" },
    { group: "Mobile and embedded", items: "FlutterFlow, Arduino, ESP32" },
    { group: "AI and cloud", items: "TensorFlow, Gymnasium, AWS, Vercel" },
    { group: "Design and media", items: "Figma, Photoshop, Canva, CapCut, Premiere Pro, Illustrator, After Effects, DaVinci Resolve, Picsart" },
    { group: "Tools", items: "Git, GitHub, VS Code" },
  ],
  // Shown as two text-only columns. `org` is the small uppercase line, `sub` the grey line under the title.
  experience: [
    { title: "Engineering Sandbox Trainee", org: "whiteStrings", sub: "Internship. Earlier: Developer Intern and QA Analyst Intern", when: "Jun 2026 — Present" },
    { title: "Freelance Developer", org: "Freelance", sub: "Web, mobile and embedded systems", when: "Jan 2023 — Present" },
    { title: "Freelance Graphic Artist", org: "Freelance", sub: "Publications, video, photography, animation, digital ads", when: "Jan 2022 — 2024" },
  ],
  leadership: [
    { title: "Marketing Committee", org: "AWS Student Builders Group, Spade", when: "Jun 2026 — Present" },
    { title: "Support Council, Operations", org: "AWS User Group BuildHers+", when: "Mar 2026 — Present" },
    { title: "Support Council, Creatives and Graphics", org: "AWS Student Builders Group, Spade", when: "Jun 2024 — Present" },
    { title: "Support Council, Creatives and Graphics", org: "Computer Science Student Organization", when: "Jun 2024 — Jun 2025" },
    { title: "Technical Team, full-stack developer", org: "Quantum Computing Society of the Philippines", sub: "Volunteer", when: "Apr 2026" },
    { title: "Creatives and Graphics", org: "Arduino Philippines", sub: "Volunteer", when: "Mar 2026" },
    { title: "Technical Team, full-stack developer", org: "Blockchain Campus Conference", sub: "Volunteer", when: "May — Nov 2025" },
  ],
  education: [
    { title: "BS Computer Science", org: "Cavite State University", when: "" },
  ],
  // Dates are only filled in where they are known. The first two are shown up front; add `href`
  // (a credential URL) to show a "View credential" link.
  credentials: [
    { title: "AI in UX for FinTech Hackathon", sub: "Champion", org: "KadaKareer x Home Credit", when: "Dec 2025" },
    { title: "Mechatronics Servicing NC II", org: "TESDA", when: "2026" },
    { title: "Introduction to Cybersecurity", org: "Cisco", when: "" },
    { title: "Cyber Threat Management", org: "Cisco", when: "" },
    { title: "Introduction to Cloud Computing", org: "DataCamp", when: "" },
    { title: "Git Foundations", org: "DataCamp", when: "" },
  ],
};
