// Issuer and school logos from src/assets/logo, shared by the homepage and the certifications page.
// The files are white on transparent; pages draw them as a mask in the ink colour (see LogoMark).
import accord from "@/assets/logo/ACCORD.png";
import aws from "@/assets/logo/AWS.png";
import cisco from "@/assets/logo/CISCO.png";
import cvsu from "@/assets/logo/CVSU.png";
import datacamp from "@/assets/logo/DATACAMP.png";
import homeCredit from "@/assets/logo/HOMECREDIT.png";
import ibm from "@/assets/logo/IBM.png";
import tesda from "@/assets/logo/TESDA.png";

const LOGOS: Record<string, string> = {
  AWS: aws.src,
  // The exchange program's logo stands for its host, Universitas Wahid Hasyim.
  "Universitas Wahid Hasyim": accord.src,
  Cisco: cisco.src,
  DataCamp: datacamp.src,
  IBM: ibm.src,
  "Home Credit": homeCredit.src,
  TESDA: tesda.src,
  "Cavite State University": cvsu.src,
};

// Matches on the name appearing in the org, so "TESDA National Certificate" still finds TESDA.
export const logoFor = (org: string) => Object.entries(LOGOS).find(([name]) => org.includes(name))?.[1];

// CSS for drawing a white-on-transparent logo in the current ink colour.
export const maskStyle = (src: string, position = "center") => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: position,
  WebkitMaskPosition: position,
});
