import type { Metadata } from "next";
import { content } from "../content";
import PageShell from "../page-shell";
import CertificationsView from "./certifications-view";

export const metadata: Metadata = {
  title: `Certifications · ${content.name}`,
  description: `Every course, certificate and award ${content.name} has earned, grouped by issuer.`,
};

export default function CertificationsPage() {
  return (
    <PageShell
      current="/certifications"
      title="Certifications"
      intro="Courses, certificates and awards behind the work on this site, from design thinking and cybersecurity to IoT and a hackathon win."
      count={`${content.credentials.length} credentials`}
      back={{ href: "/#credentials", label: "Back to the portfolio" }}
    >
      <CertificationsView />
    </PageShell>
  );
}
