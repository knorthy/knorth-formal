"use client";

// The interactive pieces of the page. Each wraps one reusable component from
// src/components and feeds it the portfolio's content in the page's ink and paper.
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import CardSwap, { Card } from "@/components/CardSwap";
import DriftWall from "@/components/DriftWall";
import InfiniteMenu from "@/components/InfiniteMenu";
import LatticeLoader from "@/components/LatticeLoader";
import LogoLoop from "@/components/LogoLoop";
import PixelCard from "@/components/PixelCard";
import SlingButton from "@/components/SlingButton";
import { content } from "./content";

// Folder reads its colours from a canvas, so it can only render in the browser.
const Folder = dynamic(() => import("@/components/Folder"), { ssr: false });

const INK = "#141413";
const PAPER = "#fafaf8";

const wallItems = content.projects.map((p) => ({ image: p.image, title: p.title }));

// Decorative backdrop: `inert` keeps its many repeated tiles out of the tab order.
export function HeroWall() {
  return (
    <div inert aria-hidden className="h-[300px] md:h-[440px]">
      <DriftWall
        items={wallItems}
        columns={3}
        tileWidth={170}
        tileHeight={113}
        gap={14}
        radius={2}
        tilt={14}
        turn={-16}
        speed={22}
        parallax={0}
        fade={0.55}
        dim={0.9}
        grayscale
        overlayColor={PAPER}
      />
    </div>
  );
}

const sphereItems = content.projects.map((p) => ({
  image: p.image,
  title: p.title,
  description: p.description,
  link: p.href || undefined,
}));

export function ProjectSphere() {
  return (
    <div className="relative h-[420px] md:h-[560px]">
      <InfiniteMenu
        items={sphereItems}
        count={90}
        roundness={0.06}
        autoplay={5}
        dim={0.35}
        zoom={1.1}
        theme="light"
        accentColor={INK}
      />
    </div>
  );
}

const skillLogos = content.skills.flatMap((group) =>
  group.items.split(", ").map((name) => ({
    node: <span className="font-medium tracking-[-0.02em]">{name}</span>,
    title: name,
  })),
);

export function SkillsLoop() {
  return (
    <LogoLoop
      logos={skillLogos}
      speed={45}
      logoHeight={30}
      gap={56}
      hoverSpeed={12}
      ariaLabel="Skills"
    />
  );
}

export function WritingDeck() {
  return (
    <div className="h-[380px] md:h-[440px]">
      <CardSwap
        width={380}
        height={250}
        cardDistance={44}
        verticalDistance={52}
        skewAmount={4}
        delay={5000}
        cardRadius={4}
        theme="light"
      >
        {content.writing.map((post) => (
          <Card key={post.title} className="flex flex-col justify-between p-6">
            <span className="text-sm text-muted tabular-nums">{post.when}</span>
            <span>
              <span className="block text-xl leading-tight font-medium tracking-[-0.02em]">
                {post.title}
              </span>
              <span className="mt-2 block text-sm text-muted">{post.summary}</span>
            </span>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
}

const papers = [...content.credentials, ...content.education].map((c) => ({
  title: c.title,
  description: `${c.org}, ${c.when}`,
}));

export function CredentialFolder() {
  return (
    <div className="flex min-h-[380px] justify-center overflow-hidden pt-24 pb-10">
      <Folder
        label="Credentials"
        items={papers}
        color={INK}
        paperColor="#ffffff"
        variant="matte"
        layout="row"
        size={1.15}
        theme="light"
      />
    </div>
  );
}

export function ContactCard() {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const firstName = content.name.split(" ")[0];

  const send = () => {
    if (status === "working") return;
    setStatus("working");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus("done");
      window.location.href = `mailto:${content.email}`;
    }, 900);
  };

  return (
    <PixelCard
      theme="light"
      radius={4}
      gap={7}
      fade={0.75}
      opacity={0.55}
      noFocus
      style={{ width: "100%", height: 300 }}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <SlingButton
          onSend={send}
          ariaLabel={`Email ${firstName}`}
          padColor={INK}
          iconColor={PAPER}
          accentColor={INK}
          wellColor="#e6e6e1"
          bandColor="#9d9d98"
        />
        <p className="font-medium">Pull back and let go to email {firstName}</p>
        <div className="h-5 text-muted">
          {status !== "idle" && (
            <LatticeLoader
              status={status}
              label="Opening your mail app"
              doneLabel="Opened in"
              doneColor="currentColor"
              pattern="snake"
            />
          )}
        </div>
      </div>
    </PixelCard>
  );
}
