"use client";

/**
 * Ported from github.com/Fatemaad/unicorn-whisperer-studio-4578cab1 (EventsSection).
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrnamentalFrame } from "../team-deck/card-ornaments";

const UNICORN_PATTERN = "/hackathons-events/unicorn-pattern.jpeg";
const TROPHY_IMG = "/hackathons-events/uniward.png";
const HELSINKI_IMG = "/hackathons-events/events/helsinki-pixel.jpg";
const NYC_IMG = "/hackathons-events/events/nyc-pixel.jpg";
const WARSAW_IMG = "/hackathons-events/events/warsaw-pixel.jpg";
const MOZART_IMG = "/hackathons-events/events/london-mozart.jpg";
const HACKEUROPE_IMG = "/hackathons-events/events/london-hackeurope.jpg";

type CardLabel = "Hosted" | "Forward Deployed" | "Co-op";

/** Partner / sponsor marks on the card image — same shell for every sticker. */
type EventSticker =
  | { kind: "img"; src: string; alt: string; className?: string }
  | { kind: "text"; label: string };

interface MetricLine {
  label: string;
  value: string;
}

interface EventData {
  title: string;
  date: string;
  sortDate: number;
  location: string;
  cardLabel: CardLabel;
  image: string;
  tagline: string;
  metrics: MetricLine[];
  trophies: number;
  stickers?: EventSticker[];
}

const events: EventData[] = [
  {
    title: "Mozart AI Hackathon",
    date: "MAR 2026",
    sortDate: 202603,
    location: "London",
    cardLabel: "Co-op",
    image: MOZART_IMG,
    tagline: "OpenAI × ElevenLabs × UNICORN MAFIA",
    metrics: [
      { label: "SIGNUPS", value: "300+" },
      { label: "PARTNERS", value: "OpenAI · ElevenLabs" },
      { label: "FORMAT", value: "48H HACK" },
    ],
    trophies: 0,
    stickers: [
      { kind: "img", src: "/hackathons-events/stickers/openai.png", alt: "OpenAI" },
      { kind: "img", src: "/hackathons-events/stickers/elevenlabs.svg", alt: "ElevenLabs" },
    ],
  },
  {
    title: "Project ElevenLabs",
    date: "DEC 2025",
    sortDate: 202512,
    location: "Warsaw, Poland",
    cardLabel: "Forward Deployed",
    image: WARSAW_IMG,
    tagline: "Voice AI hackathon in Warsaw",
    metrics: [
      { label: "X VIEWS", value: "111K+" },
      { label: "BUILDERS", value: "50+" },
      { label: "SPONSOR", value: "ELEVENLABS" },
    ],
    trophies: 1,
    stickers: [
      { kind: "img", src: "/hackathons-events/stickers/elevenlabs.svg", alt: "ElevenLabs" },
    ],
  },
  {
    title: "Junction Helsinki",
    date: "NOV 2025",
    sortDate: 202511,
    location: "Helsinki, Finland",
    cardLabel: "Forward Deployed",
    image: HELSINKI_IMG,
    tagline: "Europe's largest hackathon",
    metrics: [
      { label: "FLOWN OUT", value: "25" },
      { label: "TEAMS WON", value: "2" },
      { label: "HACKERS", value: "1500+" },
    ],
    trophies: 2,
    stickers: [
      { kind: "img", src: "/hackathons-events/stickers/junction.png", alt: "Junction" },
    ],
  },
  {
    title: "Mafia in Manhattan",
    date: "OCT 2025",
    sortDate: 202510,
    location: "New York City",
    cardLabel: "Hosted",
    image: NYC_IMG,
    tagline: "Transatlantic builder invasion",
    metrics: [
      { label: "BUILDERS", value: "35" },
      { label: "PRIZES", value: "$100K" },
      { label: "CITY", value: "NYC" },
    ],
    trophies: 1,
    stickers: [
      { kind: "img", src: "/hackathons-events/stickers/coral.png", alt: "CORAL" },
    ],
  },
  {
    title: "HackEurope",
    date: "2025",
    sortDate: 202509,
    location: "Europe",
    cardLabel: "Forward Deployed",
    image: HACKEUROPE_IMG,
    tagline: "Flew builders out to compete",
    metrics: [
      { label: "BUILDERS", value: "30+" },
      { label: "FORMAT", value: "FLEW OUT" },
      { label: "STATUS", value: "COMPLETE" },
    ],
    trophies: 0,
    stickers: [{ kind: "text", label: "HACKEUROPE" }],
  },
];

const sortedEvents = [...events].sort((a, b) => b.sortDate - a.sortDate);

const labelColors: Record<CardLabel, string> = {
  "Hosted": "#B307EB",
  "Forward Deployed": "#3198F1",
  "Co-op": "#4EF9BD",
};

/* ── Milestone Bar ── */
const MilestoneBar = ({
  label,
  filled,
  total,
  displayValue,
  color,
  delay,
}: {
  label: string;
  filled: number;
  total: number;
  displayValue: string;
  color: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-5 max-w-2xl"
    >
      <span className="font-body text-[10px] md:text-[11px] tracking-normal normal-case w-28 md:w-32 text-left text-neutral-900/50 shrink-0">
        {label}
      </span>
      <div className="flex gap-[3px] h-5 md:h-6 items-center flex-1">
        {Array.from({ length: filled }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ delay: delay + i * 0.08, duration: 0.2, ease: "backOut" }}
            className="rounded-[1px] w-4 md:w-5 origin-bottom"
            style={{
              height: "100%",
              background: color,
              boxShadow: `0 0 8px ${color}30`,
            }}
          />
        ))}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + filled * 0.08 + 0.15, duration: 0.3, ease: "backOut" }}
          className="font-body text-xs md:text-sm text-neutral-900 ml-2 whitespace-nowrap normal-case"
        >
          {displayValue}
        </motion.span>
        {Array.from({ length: total - filled }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 0.3 }}
            transition={{ delay: delay + (filled + 1) * 0.08 + 0.2 + i * 0.04, duration: 0.15 }}
            className="rounded-[1px] w-4 md:w-5 origin-bottom"
            style={{
              height: "100%",
              background: "rgba(23, 23, 23, 0.06)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

function PartnerStickerChip({ sticker }: { sticker: EventSticker }) {
  return (
    <div
      className={cn(
        "relative inline-flex max-w-[min(92px,calc(100vw-8rem))] items-center justify-center overflow-hidden rounded-[5px]",
        "shadow-[0_1px_8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.45)]",
        "ring-[0.5px] ring-white/30"
      )}
      title={sticker.kind === "img" ? sticker.alt : sticker.label}
    >
      {/* Silver / pearl base — slow drift */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #f7f8fb 0%, #e8ecf2 14%, #dde3ec 28%, #cfd8e8 40%, #eef1f8 52%, #ebe4f2 64%, #e4eaf2 78%, #fafbfd 100%)",
          backgroundSize: "220% 220%",
          animation: "hackathons-events-holographic 8s ease infinite",
        }}
      />
      {/* Iridescent sweep */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-90 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) 42%, rgba(180,210,255,0.45) 50%, rgba(255,190,220,0.35) 58%, transparent 82%)",
          backgroundSize: "240% 100%",
          animation: "hackathons-events-holographic 5.5s ease infinite",
        }}
      />
      {/* Cool / warm tint foil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(165deg, rgba(140,180,255,0.18) 0%, transparent 42%, rgba(255,160,200,0.12) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px rounded-[4px] ring-[0.5px] ring-inset ring-white/50"
      />
      <div className="relative z-10 flex items-center justify-center px-1 py-0.5">
        {sticker.kind === "img" ? (
          /* Opaque white pad so transparent / dark logos stay visible on holographic shell */
          <div className="flex max-w-full items-center justify-center rounded-[3px] bg-white px-1 py-0.5 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sticker.src}
              alt={sticker.alt}
              className={cn(
                "relative max-h-[18px] w-auto max-w-[min(80px,18vw)] object-contain object-center",
                sticker.className
              )}
              loading="lazy"
              width={160}
              height={40}
            />
          </div>
        ) : (
          <span className="font-deck-pixel text-[6px] tracking-[0.14em] uppercase text-neutral-800 whitespace-nowrap px-0.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
            {sticker.label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Event Card — white/holographic borders ── */
const EventCard = ({
  event,
  isExpanded,
  onToggle,
}: {
  event: EventData;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeColor = labelColors[event.cardLabel];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (0.5 - y) * 12, rotateY: (x - 0.5) * 12, glareX: x * 100, glareY: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }, []);

  // White/holographic palette
  const borderLight = "rgba(255,255,255,0.35)";
  const borderMid = "rgba(255,255,255,0.18)";
  const borderDim = "rgba(255,255,255,0.08)";

  return (
    <div className="flex flex-col items-center relative">
      {/* Card */}
      <motion.div
        ref={cardRef}
        className="relative w-full select-none cursor-pointer"
        style={{
          perspective: 800,
          transformStyle: "preserve-3d",
          aspectRatio: "3/4",
          boxShadow: isExpanded ? "0 30px 60px rgba(0,0,0,0.6), 0 15px 30px rgba(0,0,0,0.4)" : "none",
          zIndex: isExpanded ? 20 : 10,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onToggle}
        animate={{
          rotateX: isExpanded ? 0 : tilt.rotateX,
          rotateY: isExpanded ? 0 : tilt.rotateY,
          scale: isExpanded ? 1.08 : tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1.03 : 1,
          y: isExpanded ? -16 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        whileTap={{ scale: 1.06, y: -10, transition: { duration: 0.15 } }}
      >
        {/* LAYER 1: Outer holographic/white edge */}
        <div
          className="relative rounded-lg w-full h-full"
          style={{
            background:
              tilt.rotateX !== 0 || tilt.rotateY !== 0
                ? `linear-gradient(${145 + tilt.rotateY * 5}deg, rgba(255,100,200,0.4), rgba(100,200,255,0.35), rgba(255,255,255,0.4), rgba(200,255,150,0.3), rgba(255,200,100,0.35), rgba(150,100,255,0.4), rgba(255,100,200,0.4))`
                : `linear-gradient(145deg, ${borderMid}, ${borderLight}, ${borderMid})`,
            backgroundSize: "400% 400%",
            transition: "background 0.4s ease",
            padding: "4px",
            boxShadow:
              tilt.rotateX !== 0 || tilt.rotateY !== 0
                ? `0 0 0 1px ${borderDim}, 0 0 25px rgba(200,150,255,0.15), 0 12px 40px rgba(0,0,0,0.9)`
                : `0 0 0 1px ${borderDim}, 0 12px 40px rgba(0,0,0,0.9)`,
          }}
        >
          {/* LAYER 2: Dark channel */}
          <div
            className="relative w-full h-full rounded-md"
            style={{ background: "#08080E", padding: "3px", boxShadow: `inset 0 0 8px rgba(255,255,255,0.03)` }}
          >
            {/* LAYER 3: Inner holographic/white border */}
            <div
              className="relative w-full h-full rounded"
              style={{
                background: `linear-gradient(135deg, ${borderMid}, rgba(200,230,255,0.2), ${borderLight}, rgba(255,220,180,0.15))`,
                backgroundSize: "300% 300%",
                animation: "hackathons-events-holographic 5s ease infinite",
                padding: "2px",
              }}
            >
              {/* LAYER 4: Inner dark with ornaments */}
              <div
                className="relative h-full min-h-0 w-full rounded-sm"
                style={{
                  background: "linear-gradient(160deg, #0c0c16, rgba(255,255,255,0.02), #08080E)",
                  padding: "6px",
                }}
              >
                <OrnamentalFrame color="rgba(255,255,255,0.5)" />

                {/* Card body */}
                <div
                  className="relative rounded-sm overflow-hidden w-full h-full min-h-0 flex flex-col"
                  style={{
                    background: "linear-gradient(160deg, #0a0a14 0%, rgba(255,255,255,0.03) 40%, #06060C 60%)",
                    border: `1px solid ${borderDim}`,
                  }}
                >
                  {/* Unicorn pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[4]"
                    style={{
                      backgroundImage: `url(${UNICORN_PATTERN})`,
                      backgroundSize: "260px",
                      backgroundRepeat: "repeat",
                      opacity: 0.12,
                      imageRendering: "pixelated",
                      mixBlendMode: "lighten",
                    }}
                  />
                  {/* Fine pixel grid */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[5]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                      backgroundSize: "3px 3px",
                    }}
                  />
                  {/* Coarse grid overlay — readable on card */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[5]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                      backgroundPosition: "0 0, 0 0",
                      opacity: 0.85,
                    }}
                  />
                  {/* CRT scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[6]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 2px)",
                      backgroundSize: "100% 2px",
                    }}
                  />
                  {/* Prismatic sweep */}
                  <div
                    className="absolute inset-0 pointer-events-none z-[8]"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: "hackathons-events-holographic 3s ease infinite",
                    }}
                  />
                  {/* Glare */}
                  <div
                    className="absolute inset-0 pointer-events-none z-30 rounded-sm transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
                      opacity: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1 : 0,
                    }}
                  />

                  {/* Title header */}
                  <div className="relative z-[45] shrink-0 px-3 pt-3 pb-1">
                    <div
                      className="relative flex items-center justify-between gap-2 px-2.5 py-2"
                      style={{
                        background: "linear-gradient(135deg, rgba(6,6,12,0.94), rgba(6,6,12,0.85))",
                        borderTop: `2px solid ${borderLight}`,
                        borderBottom: `1px solid ${borderDim}`,
                        borderLeft: `1px solid ${borderDim}`,
                        borderRight: `1px solid ${borderDim}`,
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                    >
                      <h3
                        className="font-deck-pixel text-[11px] tracking-wider leading-tight flex-1 text-white uppercase"
                        style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}
                      >
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Image (B&W) with badge + postcard */}
                  <div className="relative z-[45] flex min-h-0 flex-1 flex-col px-3 pb-2">
                    <div
                      className="relative min-h-[140px] w-full flex-1 overflow-hidden"
                      style={{ border: `1px solid ${borderDim}`, background: "rgba(0,0,0,0.9)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt={event.title}
                        className="relative z-[1] h-full w-full object-cover"
                        style={{ filter: "grayscale(100%) brightness(0.85) contrast(1.2)" }}
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 z-[2]"
                        style={{
                          background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.7) 100%)",
                        }}
                      />
                      {/* Grid on photo — above vignette, below badges */}
                      <div
                        className="pointer-events-none absolute inset-0 z-[3]"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                          mixBlendMode: "overlay",
                          opacity: 0.55,
                        }}
                      />

                      {/* Card label tag — translucent colored, grid, shine on hover */}
                      <div
                        className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-sm overflow-hidden group/badge"
                        style={{
                          background: "rgba(8, 8, 14, 0.92)",
                          border: `1px solid ${badgeColor}35`,
                          boxShadow: `0 0 12px ${badgeColor}15`,
                        }}
                      >
                        {/* Pixel grid overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage:
                              `linear-gradient(${badgeColor}10 1px, transparent 1px), linear-gradient(90deg, ${badgeColor}10 1px, transparent 1px)`,
                            backgroundSize: "3px 3px",
                          }}
                        />
                        {/* Shine sweep — activates on card hover */}
                        <div
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(105deg, transparent 35%, ${badgeColor}30 45%, ${badgeColor}50 50%, ${badgeColor}30 55%, transparent 65%)`,
                            backgroundSize: "200% 100%",
                            animation: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? "hackathons-events-holographic 2s ease infinite" : "none",
                            opacity: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1 : 0,
                          }}
                        />
                        <span
                          className="relative z-10 font-deck-pixel text-[7px] tracking-[0.15em] uppercase"
                          style={{ color: badgeColor, textShadow: `0 0 8px ${badgeColor}60` }}
                        >
                          {event.cardLabel}
                        </span>
                      </div>

                      {event.stickers && event.stickers.length > 0 ? (
                        <div className="absolute bottom-2 left-2 z-20 flex max-w-[min(100%,calc(100%-5rem))] flex-wrap items-center gap-1.5 pointer-events-none">
                          {event.stickers.map((sticker, i) => (
                            <PartnerStickerChip key={i} sticker={sticker} />
                          ))}
                        </div>
                      ) : null}

                      {/* Trophy health bar */}
                      {event.trophies > 0 && (
                        <div
                          className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-sm"
                          style={{
                            background: "rgba(0,0,0,0.75)",
                            border: "1px solid rgba(179,7,235,0.3)",
                            boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={TROPHY_IMG} alt="Trophy" className="w-4 h-4 object-contain" />
                          <div className="flex gap-[2px] items-center">
                            {Array.from({ length: 2 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-3 rounded-[1px]"
                                style={{
                                  background:
                                    i < event.trophies
                                      ? "linear-gradient(180deg, #D946EF 0%, #B307EB 100%)"
                                      : "rgba(255,255,255,0.1)",
                                  boxShadow: i < event.trophies ? "0 0 6px rgba(179,7,235,0.4)" : "none",
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-deck-pixel text-[7px]" style={{ color: "#D946EF" }}>
                            {event.trophies}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom bar — shrink-0 keeps location/date visible inside aspect-ratio card */}
                  <div className="relative z-50 shrink-0 px-3 pb-2">
                    <div
                      className="relative px-2.5 py-1.5 overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(6,6,12,0.98), rgba(6,6,12,0.95))",
                        borderTop: `1px solid ${borderDim}`,
                        borderBottom: `2px solid ${borderLight}`,
                        borderLeft: `1px solid ${borderDim}`,
                        borderRight: `1px solid ${borderDim}`,
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-deck-pixel text-[6px] tracking-[0.15em] uppercase text-white/55">
                          {event.location}
                        </p>
                        <p className="font-deck-pixel text-[6px] tracking-[0.15em] text-white/75">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Intel log — slides out from UNDER the card ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full -mt-10 relative z-[1] pt-10"
          >
            <div
              className="mx-[4px] rounded-b-md relative overflow-hidden"
              style={{
                background: "#050508",
                border: `1px solid ${borderDim}`,
                borderTop: `2px solid ${borderLight}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
              }}
            >
              {/* Unicorn pattern overlay — darker */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${UNICORN_PATTERN})`,
                  backgroundSize: "260px",
                  backgroundRepeat: "repeat",
                  opacity: 0.06,
                  imageRendering: "pixelated",
                  mixBlendMode: "lighten",
                }}
              />
              {/* Pixel grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "3px 3px",
                }}
              />
              {/* CRT scanlines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 2px)",
                  backgroundSize: "100% 2px",
                }}
              />

              <div className="relative z-10 p-4">
                {/* Corner ornaments */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/20" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/20" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/20" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/20" />

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white/40" />
                  <span className="font-deck-pixel text-[7px] tracking-[0.25em] uppercase text-white/60">
                    INTEL LOG
                  </span>
                </div>
                <div className="space-y-2.5">
                  {event.metrics.map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.08 + i * 0.08 }}
                      className="flex items-center justify-between font-mono"
                    >
                      <span className="text-[10px] tracking-wider text-white/60">{m.label}</span>
                      <div className="flex-1 mx-3 border-b border-dotted border-white/15" />
                      <span className="text-sm font-bold text-white">{m.value}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="font-mono text-[9px] mt-3 italic text-white/35"
                >
                  {event.tagline}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const allLabels: CardLabel[] = ["Hosted", "Forward Deployed", "Co-op"];

const labelDescriptions: Record<CardLabel, string> = {
  "Hosted": "hosted in the stable",
  "Forward Deployed": "builders sent to win globally",
  "Co-op": "run alongside partners",
};

const EventsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<CardLabel | null>(null);

  const filteredEvents = activeFilter ? sortedEvents.filter((e) => e.cardLabel === activeFilter) : sortedEvents;

  return (
    <div className="hackathons-events-root">
    <section id="events" className="w-full px-6 md:px-12 lg:px-20 py-12 border-b border-neutral-300">
      {/* Stacked milestone bars — themed */}
      <div className="mb-10 space-y-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900/30 animate-pulse" />
          <span className="font-body text-xs text-neutral-900/50 normal-case">milestones</span>
        </div>
        <MilestoneBar label="hackathons hosted" filled={6} total={12} displayValue="6" color="#B307EB" delay={0.2} />
        <MilestoneBar label="hackathon wins" filled={10} total={20} displayValue="500+" color="#3198F1" delay={1.0} />
        <MilestoneBar label="x views" filled={7} total={20} displayValue="361k+" color="#4EF9BD" delay={2.0} />
        <MilestoneBar label="cities" filled={5} total={10} displayValue="5" color="#EE1701" delay={2.9} />
      </div>

      {/* Filter buttons */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="font-body text-xs text-neutral-900/50 mr-1 normal-case">filter:</span>
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          className={`relative cursor-pointer font-body text-[10px] tracking-normal normal-case px-3 py-1.5 rounded-sm border overflow-hidden transition-colors duration-200 ${
            activeFilter === null
              ? "text-[#EE1701] border-[#EE170180] shadow-[0_0_12px_#EE170120]"
              : "text-white/70 border-white/10 hover:text-[#EE1701]"
          }`}
          style={{
            background: "rgba(10, 10, 16, 0.95)",
          }}
        >
          {/* Light grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
          <span className="relative z-10">all</span>
        </button>
        {allLabels.map((label) => {
          const c = labelColors[label];
          const isActive = activeFilter === label;
          return (
            <div key={label} className="relative group">
              <button
                type="button"
                onClick={() => setActiveFilter(activeFilter === label ? null : label)}
                className="group relative cursor-pointer font-body text-[10px] tracking-normal normal-case px-3 py-1.5 rounded-sm border overflow-hidden transition-colors duration-200"
                style={{
                  ...( { "--accent": c } as React.CSSProperties ),
                  background: "rgba(10, 10, 16, 0.95)",
                  borderColor: isActive ? `${c}80` : "rgba(255,255,255,0.1)",
                  boxShadow: isActive ? `0 0 12px ${c}20` : "none",
                }}
              >
                {/* Light grid overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: isActive
                      ? `linear-gradient(${c}15 1px, transparent 1px), linear-gradient(90deg, ${c}15 1px, transparent 1px)`
                      : "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "3px 3px",
                  }}
                />
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    !isActive ? "text-white/70 group-hover:text-[var(--accent)]" : ""
                  }`}
                  style={isActive ? { color: c } : undefined}
                >
                  {label.toLowerCase()}
                </span>
              </button>
              {/* Hover tooltip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50"
                style={{
                  background: "rgba(20, 20, 28, 0.95)",
                  border: `1px solid ${c}18`,
                  boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
                }}
              >
                <span className="font-mono text-[9px]" style={{ color: c }}>
                  {labelDescriptions[label]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredEvents.map((event, i) => (
          <EventCard
            key={event.title}
            event={event}
            isExpanded={expandedIndex === i}
            onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
    </div>
  );
};

export default EventsSection;
