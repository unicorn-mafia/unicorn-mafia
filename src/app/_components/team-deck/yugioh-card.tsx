"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrnamentalFrame } from "./card-ornaments";
import { teamDeckUrl } from "./deck-assets";

const GOLD_UNICORN = teamDeckUrl("/team-deck/gold-unicorn.png");
const UM_LOGO_ICON = teamDeckUrl("/team-deck/um-logo-icon.png");
const UNICORN_PATTERN = teamDeckUrl("/team-deck/unicorn-pattern.jpeg");

export interface YugiohCardProps {
  name: string;
  title: string;
  avatar: string;
  avatarPosition?: string;
  description: string;
  faction: "purple" | "blue" | "green" | "red";
  isFounder?: boolean;
  personalIcon?: string;
  linkedinUrl?: string;
}

const factionColors: Record<
  string,
  { hex: string; glow: string; secondary: string }
> = {
  purple: { hex: "#B307EB", glow: "rgba(179,7,235,0.4)", secondary: "#D946EF" },
  blue: { hex: "#3198F1", glow: "rgba(49,152,241,0.4)", secondary: "#60A5FA" },
  green: { hex: "#4EF9BD", glow: "rgba(78,249,189,0.4)", secondary: "#34D399" },
  red: { hex: "#EE1701", glow: "rgba(238,23,1,0.4)", secondary: "#F97316" },
};

export default function YugiohCard({
  name,
  title,
  avatar,
  avatarPosition,
  description,
  faction,
  isFounder = false,
  personalIcon,
  linkedinUrl,
}: YugiohCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const fc = factionColors[faction];

  useEffect(() => {
    if (isHovered) {
      setScanDone(false);
      const timer = setTimeout(() => setScanDone(true), 2500);
      return () => clearTimeout(timer);
    }
    setScanDone(false);
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - y) * 20,
      rotateY: (x - 0.5) * 20,
      glareX: x * 100,
      glareY: y * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    setIsHovered(false);
  }, []);
  const openLinkedin = useCallback(() => {
    if (!linkedinUrl) return;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  }, [linkedinUrl]);

  const accentColor = isFounder ? "#FFD700" : fc.hex;

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-[290px] h-[450px] mx-auto select-none ${linkedinUrl ? "cursor-pointer" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={openLinkedin}
      onKeyDown={(e) => {
        if (!linkedinUrl) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLinkedin();
        }
      }}
      role={linkedinUrl ? "link" : undefined}
      tabIndex={linkedinUrl ? 0 : undefined}
      aria-label={linkedinUrl ? `Open ${name} LinkedIn profile` : undefined}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      <div
        className="relative rounded-lg w-full h-full"
        style={{
          background: `linear-gradient(145deg, ${accentColor}40, ${fc.hex}60, ${accentColor}30, ${fc.secondary}50, ${accentColor}35)`,
          backgroundSize: "400% 400%",
          animation: "team-deck-holographic 6s ease infinite",
          padding: "4px",
          boxShadow: `
            0 0 0 1px ${accentColor}30,
            inset 0 0 0 1px ${accentColor}15,
            0 0 40px ${accentColor}15,
            0 12px 40px rgba(0,0,0,0.9)
          `,
        }}
      >
        <div
          className="relative w-full h-full rounded-md"
          style={{
            background: "#08080E",
            padding: "3px",
            boxShadow: `inset 0 0 8px ${accentColor}10`,
          }}
        >
          <div
            className="relative w-full h-full rounded"
            style={{
              background: `linear-gradient(135deg, ${accentColor}50, ${fc.secondary}40, ${accentColor}30, ${fc.hex}45)`,
              backgroundSize: "300% 300%",
              animation: "team-deck-holographic 5s ease infinite",
              padding: "2px",
            }}
          >
            <div
              className="relative w-full h-full rounded-sm"
              style={{
                background: `linear-gradient(160deg, #0c0c16, ${fc.hex}06, #08080E)`,
                padding: "6px",
              }}
            >
              <OrnamentalFrame color={accentColor} />
              <div
                className="relative rounded-sm overflow-hidden w-full h-full flex flex-col"
                style={{
                  background: `linear-gradient(160deg, #0a0a14 0%, ${fc.hex}08 40%, #06060C 60%, ${fc.secondary}06 100%)`,
                  border: `1px solid ${accentColor}15`,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none z-[4]"
                  style={{
                    backgroundImage: `url(${UNICORN_PATTERN})`,
                    backgroundSize: "260px 260px",
                    backgroundRepeat: "repeat",
                    opacity: 0.15,
                    imageRendering: "pixelated",
                    mixBlendMode: "lighten",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-[5]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "3px 3px",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-[6]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 2px)",
                    backgroundSize: "100% 2px",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-[7] mix-blend-overlay"
                  style={{
                    backgroundImage: `
                  radial-gradient(ellipse at 15% 85%, ${fc.hex}20 0%, transparent 50%),
                  radial-gradient(ellipse at 85% 15%, ${fc.secondary}15 0%, transparent 40%)
                `,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-[8]"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    animation: "team-deck-holographic 3s ease infinite",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-30 rounded-sm transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
                    opacity: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1 : 0,
                  }}
                />

                <div className="px-3 pt-3 pb-1 relative z-10">
                  <div
                    className="relative flex items-center justify-between gap-2 px-2.5 py-2"
                    style={{
                      background: `linear-gradient(135deg, rgba(6,6,12,0.94), rgba(6,6,12,0.85))`,
                      borderTop: `2px solid ${accentColor}70`,
                      borderBottom: `1px solid ${accentColor}30`,
                      borderLeft: `1px solid ${accentColor}20`,
                      borderRight: `1px solid ${accentColor}20`,
                      boxShadow: `0 0 14px rgba(0,0,0,0.6), 0 -1px 8px ${accentColor}12, inset 0 1px 0 ${accentColor}10`,
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    <h3
                      className="font-deck-pixel text-[13px] tracking-wider leading-tight flex-1"
                      style={{
                        color: accentColor,
                        textShadow: `0 0 14px ${accentColor}60, 0 0 28px ${accentColor}25`,
                        imageRendering: "pixelated",
                      }}
                    >
                      {name}
                    </h3>
                    {personalIcon ? (
                      <div
                        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded"
                        style={{
                          background: `linear-gradient(135deg, rgba(6,6,12,0.95), ${accentColor}12)`,
                          border: `1px solid ${accentColor}45`,
                          boxShadow: `0 0 10px ${accentColor}15, inset 0 0 6px ${accentColor}06`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={teamDeckUrl(personalIcon)}
                          alt=""
                          className="w-8 h-8 object-contain"
                          style={{
                            filter: `drop-shadow(0 0 8px ${accentColor}70)`,
                            imageRendering: "pixelated",
                          }}
                          width={32}
                          height={32}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="px-3 pb-3 relative z-10 flex flex-1 min-h-0 flex-col gap-1.5">
                  <div
                    className="relative min-h-[168px] w-full flex-1 cursor-pointer overflow-hidden"
                    style={{
                      border: `1px solid ${accentColor}20`,
                      background: "rgba(0,0,0,0.9)",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={teamDeckUrl(avatar)}
                        alt={name}
                        className="w-full h-full object-cover transition-all duration-500"
                        style={{
                          objectPosition: avatarPosition ?? "center",
                          filter: isHovered
                            ? `brightness(1.15) contrast(1.2) saturate(1.3) drop-shadow(0 0 20px ${accentColor}40)`
                            : "brightness(0.9) contrast(1.05)",
                        }}
                        loading="lazy"
                        width={512}
                        height={512}
                      />
                      <div
                        className="absolute inset-0 z-[9] transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `
                        radial-gradient(ellipse at 50% 60%, ${accentColor}15 0%, transparent 60%),
                        linear-gradient(180deg, transparent 50%, ${accentColor}18 100%)
                      `,
                          opacity: isHovered ? 1 : 0,
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none z-[8]"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.7) 100%)",
                        }}
                      />
                      {isHovered && !scanDone ? (
                        <div
                          className="absolute inset-0 z-[25] pointer-events-none"
                          style={{
                            background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 46%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.05) 54%, transparent 100%)`,
                            animation:
                              "team-deck-scan-once 2.5s ease-out forwards",
                          }}
                        />
                      ) : null}
                      {isHovered ? (
                        <div
                          className="absolute inset-0 z-[10] pointer-events-none mix-blend-screen"
                          style={{
                            boxShadow: `inset 2px 0 8px ${fc.hex}20, inset -2px 0 8px ${fc.secondary}20`,
                          }}
                        />
                      ) : null}
                    </div>

                    <div
                      className="absolute top-2 left-2 z-20"
                      style={{
                        background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, ${accentColor}08 100%)`,
                        border: `1px solid ${accentColor}40`,
                        borderLeft: `2px solid ${accentColor}`,
                        padding: "4px 8px",
                        boxShadow: `0 0 12px ${accentColor}15, 0 2px 8px rgba(0,0,0,0.6)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={isFounder ? GOLD_UNICORN : UM_LOGO_ICON}
                          alt="Rank"
                          className={`w-5 h-5 ${!isFounder ? "invert opacity-60" : ""}`}
                          style={{ imageRendering: "pixelated" }}
                          width={20}
                          height={20}
                        />
                        <span
                          className="font-deck-pixel text-[5px] uppercase tracking-[0.3em]"
                          style={{
                            color: accentColor,
                            textShadow: `0 0 8px ${accentColor}50`,
                          }}
                        >
                          {isFounder ? "Genesis" : "Core"}
                        </span>
                      </div>
                      <div
                        className="mt-1 h-[1px]"
                        style={{
                          background: `linear-gradient(90deg, ${accentColor}60, transparent)`,
                        }}
                      />
                    </div>

                    <AnimatePresence>
                      {isHovered ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 flex items-center justify-center p-4 z-20 overflow-y-auto"
                          style={{
                            background: `rgba(0,0,0,0.88)`,
                          }}
                        >
                          <p className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-left text-white/95">
                            {description}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <p
                    className="shrink-0 px-0.5 font-mono text-[6px] leading-snug text-white/55 line-clamp-3"
                    title={description}
                  >
                    {description}
                  </p>
                </div>

                <div className="px-3 pb-2 relative z-10 shrink-0">
                  <div
                    className="relative px-2.5 py-1.5 text-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(6,6,12,0.94), rgba(6,6,12,0.85))`,
                      borderTop: `1px solid ${accentColor}30`,
                      borderBottom: `2px solid ${accentColor}70`,
                      borderLeft: `1px solid ${accentColor}20`,
                      borderRight: `1px solid ${accentColor}20`,
                      boxShadow: `0 0 14px rgba(0,0,0,0.6), 0 1px 8px ${accentColor}12, inset 0 -1px 0 ${accentColor}10`,
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    <p
                      className="font-deck-pixel text-[7px] tracking-[0.2em] uppercase"
                      style={{
                        color: accentColor + "90",
                        textShadow: `0 0 8px ${accentColor}30`,
                      }}
                    >
                      {title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
