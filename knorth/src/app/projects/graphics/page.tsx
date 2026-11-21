import type { Metadata } from "next";
import Link from "next/link";
import FlexCarousel from "@/components/FlexCarousel";
import GraphicsMasonry from "./graphics-masonry";
import { content } from "../../content";
import PageShell from "../../page-shell";

export const metadata: Metadata = {
  title: `Graphics · ${content.name}`,
  description: `Graphic design work by ${content.name}: posters, social posts, video and motion graphics.`,
};

const items = content.graphics.map((g, i) => ({ id: i, img: g.img, width: g.w, height: g.h, title: g.title, description: g.description }));
const slides = content.graphics.map((g) => ({ src: g.img, alt: g.title, title: g.title, subtitle: g.description }));

export default function GraphicsPage() {
  const { src, poster, title } = content.graphicsVideo;
  return (
    <PageShell
      current="/projects"
      title="Graphics"
      intro={
        <>
          This is my graphic design work: posters, publications, video and motion graphics, made with Photoshop, Illustrator, Canva, Premiere Pro, After Effects and more.{" "}
          <Link href="/projects" className="link text-ink">
            Go to tech projects ↗
          </Link>
        </>
      }
      count={`${content.graphics.length} works`}
    >
      <video
        controls
        preload="metadata"
        poster={poster}
        aria-label={title}
        className="aspect-video w-full rounded-xl border border-rule bg-black object-contain"
      >
        <source src={src} />
      </video>

      <div className="relative mt-12 h-[400px] w-full md:mt-16 md:h-[560px]">
        <FlexCarousel items={slides} preset="liquid" intro="rise" cardHeight={0.5} gap={12} squeeze={0.2} focusOnClick captions />
      </div>

      <div className="mt-16">
        <GraphicsMasonry items={items} />
      </div>
    </PageShell>
  );
}
