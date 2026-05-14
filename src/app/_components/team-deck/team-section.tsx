"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import YugiohCard, { type YugiohCardProps } from "./yugioh-card";
import CoverCard from "./cover-card";

// ── The Team ─────────────────────────────────────────────────────────────────
const theTeam: YugiohCardProps[] = [
  {
    name: "CHARLIE CHEESMAN",
    title: "Founder / Director",
    avatar: "/team-deck/avatar-charlie.png",
    description:
      "Strategic leader and ex-EY Parthenon consultant who helped define the UK's national AI strategy. Founder of Unicorn Mafia.",
    faction: "purple",
    isFounder: true,
    personalIcon: "/team-deck/icon-charlie.png",
    linkedinUrl: "https://www.linkedin.com/in/charliecheesman/",
  },
  {
    name: "FERGUS MCKENZIE-WILSON",
    title: "Director",
    avatar: "/team-deck/avatar-fergus.png",
    description:
      "Serial entrepreneur and deep-tech engineer. Previously exited a jet-powered drone company. Pioneer in Multi-Agent AI and Knowledge Graphs.",
    faction: "green",
    isFounder: false,
    personalIcon: "/team-deck/icon-fergus.png",
    linkedinUrl: "https://www.linkedin.com/in/fergtech/",
  },
  {
    name: "FATEMA AL KHALIFA",
    title: "Unicorn Stable Master (CEO)",
    avatar: "/team-deck/avatar-fatema.png",
    avatarPosition: "center 22%",
    description:
      "Ecosystem builder who started at Aaltoes, running events for Slush. Architects Unicorn Mafia around the vibe flywheel: more connections, more luck, more unicorns.",
    faction: "blue",
    isFounder: false,
    personalIcon: "/team-deck/icon-fatema.png",
    linkedinUrl: "https://www.linkedin.com/in/fatemaalkhalifa/",
  },
  {
    name: "JIAQI CHEN",
    title: "Chief Hackathon Builder",
    avatar: "/team-deck/avatar-jiaqi.png",
    description:
      "AI builder working across early-stage products, from LLM applications to deployed systems. Focused on turning ideas into working products.",
    faction: "red",
    isFounder: false,
    personalIcon: "/team-deck/icon-jiaqi.png",
    linkedinUrl: "https://www.linkedin.com/in/jqai/",
  },
];

// ── Founding Members ──────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const foundingMembers: YugiohCardProps[] = [
  {
    name: "CHARLIE CHEESMAN",
    title: "Founding Member",
    avatar: "/team-deck/avatar-charlie.png",
    description:
      "Strategic leader and ex-EY Parthenon consultant who helped define the UK's national AI strategy. Founder of Unicorn Mafia.",
    faction: "purple",
    isFounder: true,
    hideBadge: true,
    personalIcon: "/team-deck/icon-charlie.png",
    linkedinUrl: "https://www.linkedin.com/in/charliecheesman/",
  },
  {
    name: "FERGUS MCKENZIE-WILSON",
    title: "Founding Member",
    avatar: "/team-deck/avatar-fergus.png",
    description:
      "Serial entrepreneur and deep-tech engineer. Previously exited a jet-powered drone company. Pioneer in Multi-Agent AI and Knowledge Graphs.",
    faction: "green",
    isFounder: false,
    hideBadge: true,
    personalIcon: "/team-deck/icon-fergus.png",
    linkedinUrl: "https://www.linkedin.com/in/fergtech/",
  },
  {
    name: "DAVID GELBERG",
    title: "Founding Member",
    avatar: "/team-deck/avatar-david.png",
    description:
      "Working at No.10, building tech across prisons, courts, and probation with the Ministry of Justice. Ex–fastest-exited founder, 7× hackathon winner, former quant dev.",
    faction: "black",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-david.png",
    linkedinUrl: "https://www.linkedin.com/in/davidgelberg/",
  },
  {
    name: "EDDY",
    title: "Founding Member",
    avatar: "/team-deck/avatar-eddy.png",
    description:
      "Serial founder and AI consultant. Long-time community builder. Passionate about moral ambition. Working on open source agent orchestration and education to prevent big tech monopolising the AI transition.",
    faction: "purple",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-eddy.png",
  },
  {
    name: "HENRY ALLEN",
    title: "Founding Member",
    avatar: "/team-deck/avatar-henry.png",
    description:
      "Builder and community member. Always shipping something interesting.",
    faction: "blue",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-henry.png",
    linkedinUrl: "https://www.linkedin.com/in/henryallen/",
  },
  {
    name: "JACK JACKSON",
    title: "Founding Member",
    avatar: "/team-deck/avatar-jack.png",
    description:
      "Builder and community member. Bringing energy and creativity to every hackathon.",
    faction: "green",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-jack.png",
    linkedinUrl: "https://www.linkedin.com/in/jackjacksoncs/",
  },
];

// ── Unicorn Council ───────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unicornCouncil: YugiohCardProps[] = [
  {
    name: "EDDY",
    title: "Serial Founder & AI Consultant",
    avatar: "/team-deck/avatar-eddy.png",
    description:
      "Serial founder and AI consultant. Long-time community builder. Passionate about moral ambition. Working on open source agent orchestration and education to prevent big tech monopolising the AI transition.",
    faction: "purple",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-eddy.png",
  },
  {
    name: "JACK JACKSON",
    title: "Founder",
    avatar: "/team-deck/avatar-jack.png",
    description:
      "Builder and community member. Bringing energy and creativity to every hackathon.",
    faction: "green",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-jack.png",
    linkedinUrl: "https://www.linkedin.com/in/jackjacksoncs/",
  },
  {
    name: "HENRY ALLEN",
    title: "Founder",
    avatar: "/team-deck/avatar-henry.png",
    description:
      "Builder and community member. Always shipping something interesting.",
    faction: "blue",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-henry.png",
    linkedinUrl: "https://www.linkedin.com/in/henryallen/",
  },
  {
    name: "ADAM",
    title: "CTO & Co-founder, Stag",
    avatar: "/team-deck/avatar-adam.png",
    description: "CTO & Co-founder at Stag, building the last software in CRE.",
    faction: "red",
    isFounder: false,
    hideBadge: true,
    pixelArt: true,
    personalIcon: "/team-deck/icon-adam.png",
  },
];

// ── Placeholder card ──────────────────────────────────────────────────────────
function PlaceholderCard() {
  return (
    <div
      className="relative w-full max-w-[290px] aspect-[29/45] mx-auto rounded-lg flex flex-col items-center justify-center gap-3"
      style={{
        background: "linear-gradient(160deg, #0a0a14, #0c0c18)",
        border: "1px dashed rgba(179,7,235,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="font-deck-pixel text-[22px]"
        style={{ color: "rgba(179,7,235,0.25)" }}
      >
        ?
      </div>
      <p
        className="font-deck-pixel text-[6px] uppercase tracking-[0.3em] text-center px-6"
        style={{ color: "rgba(179,7,235,0.2)" }}
      >
        Coming soon
      </p>
    </div>
  );
}

// ── Deck component ─────────────────────────────────────────────────────────────
interface DeckProps {
  title: string;
  subtitle: string;
  members: YugiohCardProps[];
  placeholders?: number;
  accentColour?: string;
}

function Deck({
  title,
  subtitle,
  members,
  placeholders = 0,
  accentColour = "#B307EB",
}: DeckProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const totalCards = members.length + placeholders;

  return (
    <section className="py-8 px-6 md:px-12 lg:px-20 border-b border-neutral-200 last:border-b-0">
      {/* Deck header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div
          className="border border-neutral-300 bg-neutral-50 p-4 inline-block"
          style={{ borderLeft: `3px solid ${accentColour}` }}
        >
          <h2 className="text-lg font-medium font-body text-neutral-900 tracking-wide uppercase">
            {title}
          </h2>
          <p className="text-xs text-neutral-500 font-body mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative flex flex-col items-center justify-center min-h-[320px]">
          {!isRevealed ? (
            <motion.button
              type="button"
              className="relative w-full max-w-[290px] aspect-[29/45] cursor-pointer"
              initial={false}
              onClick={() => setIsRevealed(true)}
              aria-expanded={false}
              aria-label={`Reveal ${title} cards`}
            >
              {[...Array(Math.min(totalCards, 4))].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  style={{
                    background:
                      "linear-gradient(160deg, #B307EB10 0%, #0a0a0f 30%, #0a0a0f 70%, #B307EB08 100%)",
                    border: "1px solid rgba(179,7,235,0.15)",
                    transform: `translateY(${(4 - i) * 4}px) translateX(${(4 - i) * 2}px) rotate(${(4 - i) * 1.5 - 3}deg)`,
                    zIndex: i,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                />
              ))}
              <div className="absolute top-0 left-0 w-full h-full z-10">
                <CoverCard title={title} accentHex={accentColour} />
              </div>
            </motion.button>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center w-full">
              {members.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{
                    opacity: 0,
                    y: -60,
                    rotateZ: (i - 2) * 8,
                    scale: 0.7,
                  }}
                  animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <YugiohCard {...member} />
                </motion.div>
              ))}
              {Array.from({ length: placeholders }).map((_, i) => (
                <motion.div
                  key={`placeholder-${i}`}
                  initial={{
                    opacity: 0,
                    y: -60,
                    rotateZ: (members.length + i - 2) * 8,
                    scale: 0.7,
                  }}
                  animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
                  transition={{
                    delay: (members.length + i) * 0.12,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <PlaceholderCard />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-8 pb-4"
          >
            <button
              type="button"
              onClick={() => setIsRevealed(false)}
              className="font-deck-pixel text-[8px] tracking-widest uppercase px-6 py-3 transition-all duration-300 hover:scale-105 bg-neutral-900 text-white border border-neutral-900 hover:bg-white hover:text-neutral-900"
            >
              ▲ Collapse Deck
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function TeamDeckSection() {
  return (
    <div className="team-deck-root">
      <Deck
        title="The Team"
        subtitle="Core operators keeping the mafia running"
        members={theTeam}
        accentColour="#3198F1"
      />
      {/* Founding Members and Unicorn Council hidden — accepting submissions via card tool */}
    </div>
  );
}
