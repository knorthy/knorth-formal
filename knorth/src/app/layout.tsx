import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { content } from "./content";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${content.name}, ${content.title}`,
  description: content.bio,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibsted.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
