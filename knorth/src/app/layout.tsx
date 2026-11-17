import type { Metadata } from "next";
import { Geist_Mono, Geist_Pixel, Schibsted_Grotesk } from "next/font/google";
import { content } from "./content";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});
// Used only by Kniah's ask overlay.
const pixel = Geist_Pixel({ variable: "--font-pixel", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${content.name}, ${content.title}`,
  description: content.bio,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${pixel.variable} ${geistMono.variable} antialiased`}
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
      </body>
    </html>
  );
}
