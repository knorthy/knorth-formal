"use client";

// Every credential in content.credentials, as GroupedCards. Awards (award: true) share one
// "Achievements" group; certificates group by issuer. Add a credential to content.ts and it appears
// here (and in the homepage's first two) with no other edit. Optional `image` on a credential (a
// certificate picture in /public) fills its card's top panel instead of the issuer's logo.
import { content } from "../content";
import GroupedCards, { type CardGroup } from "../grouped-cards";
import aws from "@/assets/certificates/AWSCPE.webp";
import threat from "@/assets/certificates/CyberThreatMan.webp";
import edtp from "@/assets/certificates/EDTP.webp";
import cyber from "@/assets/certificates/IntToCybersec.webp";
import intGit from "@/assets/certificates/IntGIT.webp";
import introGit from "@/assets/certificates/IntroGIT.webp";
import cloud from "@/assets/certificates/UndCC.webp";
import web from "@/assets/certificates/WebFun.webp";
import ai from "@/assets/certificates/AIFun.webp";
import essay from "@/assets/certificates/Champ.webp";
import exchange from "@/assets/certificates/StudEXProg.webp";
import analysis from "@/assets/certificates/BestAnalysis.webp";
import innov from "@/assets/certificates/BestInnov.webp";
import pres from "@/assets/certificates/BestPres.webp";
import iot from "@/assets/certificates/IoTDT.webp";
import ncii from "@/assets/certificates/NCII.webp";

// Cards whose enlarged view is a grid of several pictures instead of just their own.
const GALLERY: Record<string, string[]> = {
  "First Place, International Essay Competition": [analysis.src, essay.src, innov.src, pres.src],
};

// Certificate pictures by credential title.
const IMAGES: Record<string, string> = {
  "AWS Cloud Practitioner Essentials": aws.src,
  "Cyber Threat Management": threat.src,
  "Enterprise Design Thinking Practitioner": edtp.src,
  "Introduction to Cybersecurity": cyber.src,
  "Intermediate Git": intGit.src,
  "Introduction to Git": introGit.src,
  "Understanding Cloud Computing": cloud.src,
  "Web Development Fundamentals": web.src,
  "Artificial Intelligence Fundamentals": ai.src,
  "First Place, International Essay Competition": essay.src,
  "Student Exchange Program 2026": exchange.src,
  "Introduction to IoT": iot.src,
  "Mechatronics Servicing NC II": ncii.src,
};

type Credential = (typeof content.credentials)[number] & { image?: string };

// Shorter filter-tab names for issuers.
const TAB: Record<string, string> = {
  "TESDA National Certificate": "National Certificate",
  "Universitas Wahid Hasyim": "Education",
  "AWS Skill Builder": "AWS",
  "IBM SkillsBuild": "IBM",
};

function groups(): CardGroup[] {
  const map = new Map<string, Credential[]>();
  for (const c of content.credentials as Credential[]) {
    const key = "award" in c ? "Achievements" : c.org;
    map.set(key, [...(map.get(key) ?? []), c]);
  }
  return [...map.entries()].map(([name, items]) => ({
    name: TAB[name] ?? name,
    logoOrg: items[0].org, // Achievements uses the first award's issuer logo
    items: items.map((c) => {
      const award = "award" in c;
      return {
        key: c.title,
        title: c.title,
        sub: "sub" in c ? c.sub : undefined,
        meta: [c.org, c.when && (award ? c.when : `Issued ${c.when}`)].filter(Boolean).join(" · "),
        logoOrg: c.org,
        image: c.image ?? IMAGES[c.title],
        gallery: GALLERY[c.title],
        link: {
          label: award ? "Learn more" : "Show credential",
          href: c.href || undefined,
          ask: `tell me about her ${c.title} ${award ? "win" : "certificate"} from ${c.org}`,
        },
      };
    }),
  }));
}

export default function CertificationsView() {
  return <GroupedCards groups={groups()} noun="credential" label="Filter by issuer" />;
}
