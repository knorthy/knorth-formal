// Gallery photos, imported so Next fingerprints and caches them (src/assets/gallery).
import hcHack from "@/assets/gallery/HC-Hack.jpg";
import hcHack1 from "@/assets/gallery/HC-Hack1.jpg";
import iec from "@/assets/gallery/IEC.jpg";
import iecChamp from "@/assets/gallery/IEC-CHAMP.jpg";
import iecChamp1 from "@/assets/gallery/EIC-CHAMP1.jpg";
import exchange from "@/assets/gallery/EXCHANGESTUDEPROG.jpg";
import exchange1 from "@/assets/gallery/EXSTUDPROG.jpg";
import exchange2 from "@/assets/gallery/EXSTUDPROG2.jpg";
import friends from "@/assets/gallery/UNWAHAS-Friends.jpeg";
import friends1 from "@/assets/gallery/UWAHAS-Friends1.jpeg";
import friends2 from "@/assets/gallery/UNWAHAS-Friends2.jpeg";
import friends3 from "@/assets/gallery/UNWAHAS-Friends3.jpeg";
import friends4 from "@/assets/gallery/UNWAHAS-Friends4.jpg";
import hackerHouse from "@/assets/gallery/HACKERHOUSE.jpg";
import hhVolunteer from "@/assets/gallery/HH-VOLUNTEER.jpg";
import ygg from "@/assets/gallery/YGG.jpg";
import ygg1 from "@/assets/gallery/YGG1.jpg";
import ygg2 from "@/assets/gallery/YGG2.jpg";
import ygg3 from "@/assets/gallery/YGG3.jpg";
import ygg4 from "@/assets/gallery/YGG4.jpg";

// Everything the portfolio shows lives here, taken from the existing knorth portfolio.
// Set `sample` to true to bring back the notice bar and the "Sample" tags for placeholder content.
export const content = {
  sample: false,
  name: "Tiffany Lyssa",
  title: "Full-Stack Developer",
  bio: "I design and build web and mobile software, then take it into hardware with ESP32 and Arduino. From the interface to the circuit, I own the whole build. Based in Manila, Philippines.",
  status: "Open to jobs and internships",
  // shortcut: placeholder address, no public email exists yet; replace it with a real one.
  email: "tiffanylyssa.inquiry@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/knorthy" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tiffany-lyssa-4b210b281/" },
    { label: "X", href: "https://x.com/kno_orth" },
  ],
  // The intro shows this in place of X (X stays in the footer and the paw menu).
  resume: "/Tiffany-Lyssa-Resume.pdf",
  // The project deck, best work first. `image` is optional: a card without one shows the title.
  projects: [
    {
      title: "PsoMetric",
      category: "Machine learning",
      kind: "Image recognition for psoriasis severity",
      image: "/projects/mobile-psometric.webp",
      year: "",
      description:
        "A cross-platform React Native app where clinicians upload skin images and get AI-powered, real-time PASI severity scores with annotated lesion analysis. Role: full-stack developer and UI/UX designer.",
      tools: "React Native, image recognition, AI scoring",
      href: "https://github.com/knorthy/PsoMetric",
    },
    {
      title: "One Indang",
      category: "Mobile apps",
      kind: "Digital governance app",
      image: "/projects/mobile-oneindang.webp",
      year: "",
      description:
        "The official mobile app of the Municipality of Indang: a citizen-centric platform for public services, emergency contacts, news and community issue reporting. Role: full-stack developer and UI/UX designer.",
      tools: "Mobile app, LGU platform",
      href: "https://github.com/knorthy/OneIndang",
    },
    {
      title: "The Blind Leading the Blown Up",
      category: "Games",
      kind: "3D game",
      image: "/projects/game-tbltbu.webp",
      year: "",
      description:
        "A 3D game. Led the design and development end to end: gameplay mechanics, level design and project delivery. Role: lead project personnel, 3D game designer and developer.",
      tools: "3D game design, level design",
      href: "https://github.com/ArhonJay/TBLTBU",
    },
    {
      title: "Reinforcement Learning APFC",
      category: "Machine learning",
      kind: "Automatic power factor corrector",
      image: "",
      year: "",
      description:
        "A reinforcement learning model that dynamically optimizes power factor correction, reducing energy waste in a simulated electrical system, alongside an ESP-based corrector with real-time monitoring and cloud-based logging.",
      tools: "Reinforcement learning, ESP32, cloud logging",
      href: "",
    },
    {
      title: "MetaCampus",
      category: "Mobile apps",
      kind: "AR for interactive student events",
      image: "/projects/mobile-metacampus.webp",
      year: "",
      description:
        "An augmented reality campus engagement platform. Led UI/UX design in Figma and coordinated team milestones for on-time delivery. Role: project manager, full-stack developer and UI/UX designer.",
      tools: "Augmented reality, Figma",
      href: "https://github.com/knorthy/MetaCampus",
    },
  ],
  // Photos on the drifting wall below Experience (files in src/assets/gallery). `title` is the alt text
  // and the label that follows the pointer when a photo is hovered.
  // The wall deals photo N into column N % 7. Columns 0 and 6 sit at the faded edges, so positions
  // 0, 6, 7, 13 and 14 hold the friends photos; the event photos land in the clear middle columns.
  gallery: [
    { image: friends.src, title: "Friends from Universitas Wahid Hasyim" },
    { image: hcHack.src, title: "Home Credit AI in UX Hackathon Champions" },
    { image: hhVolunteer.src, title: "Blockchain Campus Conference 2025 Volunteers" },
    { image: iecChamp.src, title: "International Essay Competition Champion" },
    { image: exchange1.src, title: "Exchange Student Program, Universitas Wahid Hasyim" },
    { image: ygg.src, title: "YGG Play Summit" },
    { image: friends1.src, title: "Friends from Universitas Wahid Hasyim" },
    { image: friends2.src, title: "Friends from Universitas Wahid Hasyim" },
    { image: hackerHouse.src, title: "Hacker House Volunteers, Blockchain Campus Conference 2025" },
    { image: ygg1.src, title: "YGG Play Summit, on stage" },
    { image: iec.src, title: "International Essay Competition" },
    { image: hcHack1.src, title: "Home Credit AI in UX Hackathon Champions" },
    { image: exchange.src, title: "Exchange Student Program" },
    { image: friends3.src, title: "Friends from Universitas Wahid Hasyim" },
    { image: friends4.src, title: "Friends from Universitas Wahid Hasyim" },
    { image: iecChamp1.src, title: "International Essay Competition Champion" },
    { image: ygg2.src, title: "After the YGG Play Summit" },
    { image: exchange2.src, title: "Exchange Student Program" },
    { image: ygg3.src, title: "Pixels booth, YGG Play Summit" },
    { image: ygg4.src, title: "YGG Play Summit" },
  ],
  // Smaller builds: on the /projects page beside the deck's five, not on the homepage.
  more: [
    { title: "Claro", image: "/projects/websites-claro-hero.webp", category: "Web", org: "Landing page and feedback form for a personal expense tracker", when: "", href: "https://github.com/knorthy/WhiteString-Expense-Tracker" },
    { title: "Dash Car Rentals", image: "/projects/uiux-dash-car-rentals.webp", category: "Web", org: "Responsive car rental website with booking flows and real-time availability", when: "" },
    { title: "IoT Earthquake Detector", image: "/projects/iot-earthquake-detector.webp", category: "Embedded & IoT", org: "Seismic detection on ESP controllers with automated alerts and remote cloud monitoring", when: "" },
    { title: "Misting Sanitation System", image: "/projects/iot-misting-sanitation.webp", category: "Embedded & IoT", org: "Arduino misting pipes with sensor-triggered activation and QR-based attendance", when: "" },
    { title: "POS systems", category: "Web", org: "Point-of-sale systems with inventory and real-time sales reporting for small businesses", when: "" },
    { title: "tilaOK", image: "/projects/ml-tilaok.webp", category: "Machine learning", org: "Machine learning project with a companion website", when: "" },
    { title: "CIRCU-360", image: "/projects/ml-circu-360.webp", category: "Machine learning", org: "Machine learning project", when: "" },
    { title: "SmartHerd", category: "Mobile apps", org: "Mobile app", when: "" },
    { title: "Juno", category: "Mobile apps", org: "Mobile assistant app", when: "" },
    { title: "HomeVision", category: "Mobile apps", org: "Mobile app with machine learning", when: "" },
    { title: "QCSP Competition", category: "Web", org: "Landing page for the QCSP competition", when: "" },
    { title: "Personal websites", category: "Web", org: "Personal websites I designed and built", when: "" },
  ],
  // "What I build" on the homepage: each area lists the projects (by `category`) that show it.
  services: [
    { name: "Web apps", category: "Web", text: "Responsive sites and web apps in Next.js and React, from landing pages to point-of-sale systems with live sales reporting." },
    { name: "Mobile apps", category: "Mobile apps", text: "Cross-platform apps, from a React Native clinical imaging tool to the official app of the Municipality of Indang." },
    { name: "UI/UX design", category: "UI/UX design", text: "Flows and interfaces designed in Figma by the same person who builds them. Champion of the AI in UX for FinTech Hackathon." },
    { name: "Embedded & IoT", category: "Embedded & IoT", text: "ESP32 and Arduino builds with sensors, alerts and cloud logging." },
  ],
  skills: [
    { group: "Frontend", items: "Next.js, React, Tailwind CSS, JavaScript, TypeScript, CSS" },
    { group: "Backend", items: "Node.js, Python, C++, Laravel, MySQL, Firebase, Supabase, Spring Boot" },
    { group: "Mobile and embedded", items: "FlutterFlow, Arduino, ESP32" },
    { group: "AI and cloud", items: "TensorFlow, Gymnasium, AWS, Vercel" },
    { group: "Design and media", items: "Figma, Photoshop, Canva, CapCut, Premiere Pro, Illustrator, After Effects, DaVinci Resolve, Picsart" },
    { group: "Tools", items: "Git, GitHub, VS Code" },
  ],
  // The skills terminal's detail panel. DRAFT: `level` (0–100) and `note` are first guesses from the
  // projects and roles on this page, written for Tiffany to correct before publishing. Linked work is
  // found automatically from each project's `tools` and each role's `skills`.
  skillDetails: {
    "Next.js": { level: 80, note: "Builds her personal and portfolio sites, including Claro's landing page." },
    React: { level: 82, note: "Built Claro, the team's expense tracker at whiteStrings." },
    "Tailwind CSS": { level: 80, note: "Styles her React and Next.js sites." },
    JavaScript: { level: 80, note: "The base of her web work, from sites to small tools." },
    TypeScript: { level: 72, note: "Typed React and Next.js code, including Claro at whiteStrings." },
    CSS: { level: 82, note: "Responsive layouts and the finishing details on her websites." },
    "Node.js": { level: 65, note: "Server-side JavaScript behind her web projects." },
    Python: { level: 62, note: "Machine learning work, like the reinforcement learning power factor corrector." },
    "C++": { level: 55, note: "Firmware for her Arduino and ESP32 builds." },
    Laravel: { level: 55, note: "Trained in it during the whiteStrings developer internship." },
    MySQL: { level: 62, note: "Trained in SQL at whiteStrings; databases for her web apps." },
    Firebase: { level: 65, note: "Backend and data for her app projects." },
    Supabase: { level: 60, note: "Postgres backend for her web projects." },
    "Spring Boot": { level: 45, note: "Java backend framework she has built with." },
    FlutterFlow: { level: 60, note: "Cross-platform mobile app builds." },
    Arduino: { level: 75, note: "Runs the misting sanitation system and other hardware builds." },
    ESP32: { level: 75, note: "Runs the IoT earthquake detector and the power factor corrector." },
    TensorFlow: { level: 50, note: "Machine learning experiments, including image recognition." },
    Gymnasium: { level: 50, note: "Training environment for the reinforcement learning power factor corrector." },
    AWS: { level: 50, note: "Cloud services, explored through the AWS student communities she helps run." },
    Vercel: { level: 72, note: "Hosts her Next.js sites." },
    Figma: { level: 88, note: "Where she designs each interface before building it, from PsoMetric to MetaCampus." },
    Photoshop: { level: 75, note: "Posters, ads and event graphics." },
    Canva: { level: 85, note: "Fast event publications and social posts, often made live during events." },
    CapCut: { level: 75, note: "Quick edits for social video." },
    "Premiere Pro": { level: 65, note: "Editing promotional videos." },
    Illustrator: { level: 70, note: "Vector graphics for events and campaigns." },
    "After Effects": { level: 65, note: "Motion graphics and typography animation." },
    "DaVinci Resolve": { level: 70, note: "Editing and colour for promo videos, like the Blockchain Campus Conference teaser." },
    Picsart: { level: 70, note: "Quick photo edits for social content." },
    Git: { level: 78, note: "Version control on every project." },
    GitHub: { level: 80, note: "Hosts her repositories, from PsoMetric to Claro." },
    "VS Code": { level: 85, note: "Her everyday editor." },
  } as Record<string, { level: number; note: string }>,
  // Shown as two text-only columns. `org` is the small uppercase line, `sub` the grey line under the title.
  experience: [
    // `roles`: one company, several positions, newest first. Folded under a "Learn more" toggle so the
    // list starts short.
    {
      title: "Internship",
      org: "whiteStrings®",
      sub: "Three roles in six months: QA Analyst, Developer, engineering sandbox trainee.",
      when: "Jun 2026 — Present",
      roles: [
        {
          title: "Engineering Sandbox Trainee",
          when: "Sep 2026 — Present",
          text: "A self-paced, mentor-guided program of hands-on engineering tasks.",
        },
        {
          title: "Developer Intern",
          when: "Jul — Aug 2026 · Remote",
          text: "Trained in Laravel and SQL, then built Claro, the team's expense tracker, in React and TypeScript.",
          skills: "React Native, TypeScript",
        },
        {
          title: "QA Analyst Intern",
          when: "Jun — Jul 2026",
          text: "Tested the company's software to find bugs and make sure features worked before release.",
          skills: "Quality Assurance, Software Quality Assurance",
        },
      ],
    },
    { title: "Full-Stack Developer", org: "Freelance", sub: "Web, mobile and embedded systems", when: "Jan 2023 — Present" },
    { title: "Graphic Artist", org: "Freelance", sub: "Publications, video, photography, animation, digital ads", when: "Jan 2022 — 2024" },
  ],
  leadership: [
    { title: "Marketing Committee", org: "AWS Student Builders Group, Spade", when: "Jun 2026 — Present" },
    { title: "Support Council, Operations", org: "AWS User Group BuildHers+", when: "Mar 2026 — Present" },
    { title: "Support Council, Creatives and Graphics", org: "AWS Student Builders Group, Spade", when: "Jun 2024 — Present" },
    { title: "Support Council, Creatives and Graphics", org: "Computer Science Student Organization", when: "Jun 2024 — Jun 2025" },
    { title: "Technical Team, full-stack developer", org: "Quantum Computing Society of the Philippines", sub: "Volunteer", when: "Apr 2026" },
    { title: "Creatives and Graphics", org: "Arduino Philippines", sub: "Volunteer", when: "Mar 2026" },
    { title: "Technical Team", org: "Blockchain Campus Conference", sub: "Volunteer", when: "May — Nov 2025" },
  ],
  education: [
    { label: "Bachelor of Science in", title: "Computer Science", org: "Cavite State University", when: "" },
    { label: "ACCORD 2026", title: "Student Exchange Program", org: "Universitas Wahid Hasyim, Indonesia", when: "Oct 2026" },
  ],
  // Dates are only filled in where they are known. The first two are shown up front.
  // `href`: paste the credential's page (Credly badge, certificate, post about the win).
  // Certificates get "Show credential" (e.g. a Credly badge) and an "Issued" date; entries with
  // `award: true` are achievements and get "Learn more" (e.g. a post about the win) and a plain date.
  // Until an `href` is filled in, the link asks Kniah about that entry instead.
  credentials: [
    { title: "Mechatronics Servicing NC II", org: "TESDA National Certificate", when: "2026", href: "" },
    { title: "AI in UX for FinTech Hackathon", sub: "Champion", org: "KadaKareer x Home Credit", when: "Dec 2025", href: "", award: true },
    { title: "First Place, International Essay Competition", sub: "Student Exchange Program 2026. Also won Best Analysis, Best Innovation and Best Presentation.", org: "Universitas Wahid Hasyim", when: "Oct 2026", href: "", award: true },
    { title: "Student Exchange Program 2026", sub: "Certificate of Participation", org: "Universitas Wahid Hasyim", when: "Oct 2026", href: "" },
    { title: "AWS Cloud Practitioner Essentials", org: "AWS Skill Builder", when: "Nov 2026", href: "https://skillbuilder.aws/learn/94T2BEN85A/aws-cloud-practitioner-essentials/8D79F3AVR7" },
    { title: "Artificial Intelligence Fundamentals", org: "IBM SkillsBuild", when: "Nov 2026", href: "https://www.credly.com/badges/637b1c38-f754-4c73-9706-2abb330f8166/public_url" },
    { title: "Web Development Fundamentals", org: "IBM SkillsBuild", when: "Nov 2026", href: "https://www.credly.com/badges/2444ac68-bb62-45a9-b2b4-1cc0e872a766/public_url" },
    { title: "Enterprise Design Thinking Practitioner", org: "IBM SkillsBuild", when: "Nov 2026", href: "https://www.credly.com/badges/03900c1b-a128-4b60-9aa1-2ce8795b831b/public_url" },
    { title: "Introduction to IoT", org: "Cisco", when: "Nov 2026", href: "https://www.credly.com/badges/725d5e34-9668-4b06-bb35-2b5c9e801f3d/public_url" },
    { title: "Introduction to Cybersecurity", org: "Cisco", when: "May 2026", href: "https://www.credly.com/badges/771d7e61-8a12-4313-bee6-6edd34ded57b/public_url" },
    { title: "Cyber Threat Management", org: "Cisco", when: "May 2026", href: "https://www.credly.com/badges/be564097-b5e6-40a5-b1ec-92e18c60c022/public_url" },
    { title: "Intermediate Git", org: "DataCamp", when: "Sep 2025", href: "" },
    { title: "Introduction to Git", org: "DataCamp", when: "Sep 2025", href: "" },
    { title: "Understanding Cloud Computing", org: "DataCamp", when: "Feb 2025", href: "" },
  ],
};
