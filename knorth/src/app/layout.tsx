import type { Metadata } from "next";
import { Geist_Mono, Geist_Pixel } from "next/font/google";
import { content } from "./content";
import MobileNotice from "./mobile-notice";
import "./globals.css";

// The chatbot's pairing, site-wide: Geist Pixel for headings, Geist Mono for everything else.
const pixel = Geist_Pixel({ variable: "--font-geist-pixel", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${content.name}, ${content.title}`,
  description: content.bio,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pixel.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        {/* Sets the theme before first paint: the saved choice, else the system setting. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t=="dark"||t=="light"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"`,
          }}
        />
        {children}
        <MobileNotice />
      </body>
    </html>
  );
}
