"use client";

/**
 * Deck UI adapted from github.com/Fatemaad/unicorn-whisperer-studio (TeamSection + cards).
 */

import { useState } from "react";
import { motion } from "framer-motion";
import YugiohCard, { type YugiohCardProps } from "./yugioh-card";
import CoverCard from "./cover-card";

const teamMembers: YugiohCardProps[] = [
  {
    name: "CHARLIE CHEESMAN",
    title: "Founder / Director",
    avatar: "/team-deck/avatar-charlie.png",
    description:
      "Strategic leader and ex-EY Parthenon consultant who helped define the UK’s national AI strategy. Founder of Unicorn Mafia. Charlie bridges the gap between complex enterprise data and rapid, outcome-led value creation, helping FTSE100 companies deploy at startup speed.",
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
      "Serial entrepreneur and deep-tech engineer who previously exited a jet-powered drone company. A pioneer in Multi-Agent AI and Knowledge Graphs, Fergus architects the robust, mission-critical systems that allow enterprises to move from simple 'chat' to autonomous execution.",
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
      "Early-stage ecosystem builder who started in Finland at Aaltoes, running events for Slush—Europe’s leading tech conference. Now architects Unicorn Mafia around a simple thesis—the vibe flywheel: more connections, more luck, more unicorns.",
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
  {
    name: "DAVID GELBERG",
    title: "Advisor",
    avatar: "/team-deck/avatar-david.png",
    description:
      "Working at No.10, building tech across prisons, courts, and probation with the Ministry of Justice. I care deeply about the UK—this is my way of contributing. Ex–fastest-exited founder, 7× hackathon winner, former quant dev for top sports bettors.",
    faction: "purple",
    isFounder: false,
    personalIcon: "/team-deck/icon-david.png",
    linkedinUrl: "https://www.linkedin.com/in/davidgelberg/",
  },
];

export default function TeamDeckSection() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="team-deck-root">
      <section className="py-8 px-6 md:px-12 lg:px-20">
        <div className="relative flex flex-col items-center justify-center min-h-[480px]">
          {!isRevealed ? (
            <motion.div
              className="relative w-[290px] h-[450px] cursor-pointer"
              initial={false}
              onClick={() => setIsRevealed(true)}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-[290px] h-[450px] rounded-lg"
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
              <div className="absolute top-0 left-0 z-10">
                <CoverCard />
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center w-full">
              {teamMembers.map((member, i) => (
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
            </div>
          )}
        </div>

        {isRevealed ? (
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
        ) : null}
      </section>
    </div>
  );
}
