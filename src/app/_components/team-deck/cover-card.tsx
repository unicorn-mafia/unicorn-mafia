"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { OrnamentalFrame } from "./card-ornaments";
import { teamDeckUrl } from "./deck-assets";

const UNICORN_PATTERN = teamDeckUrl("/team-deck/unicorn-pattern.jpeg");
const UM_LOGO_ICON = teamDeckUrl("/team-deck/um-logo-icon.png");

interface CoverCardProps {
  title?: string;
  accentHex?: string;
}

export default function CoverCard({
  title = "the team",
  accentHex,
}: CoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    setIsHovered(false);
  }, []);

  const gold = isHovered ? "#FFD700" : "#999999";
  const goldDark = isHovered ? "#B8860B" : "#555555";
  const goldLight = isHovered ? "#FFEC8B" : "#BBBBBB";
  const effectiveGold = accentHex ?? gold;
  const effectiveGoldDark = accentHex ? accentHex + "aa" : goldDark;
  const effectiveGoldLight = accentHex ? accentHex + "66" : goldLight;

  return (
    <motion.div
      ref={cardRef}
      className="w-full max-w-[290px] aspect-[29/45] select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.rotateX !== 0 || tilt.rotateY !== 0 ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      <div
        className="relative w-full h-full rounded-lg"
        style={{
          background: `linear-gradient(145deg, ${effectiveGoldLight}40, ${effectiveGoldDark}60, ${effectiveGold}30, ${effectiveGoldDark}50, ${effectiveGoldLight}35)`,
          backgroundSize: "400% 400%",
          animation: isHovered
            ? "team-deck-holographic 6s ease infinite"
            : "none",
          padding: "4px",
          boxShadow: `0 0 0 1px ${effectiveGold}30, inset 0 0 0 1px ${effectiveGold}15, 0 0 ${isHovered ? "40px" : "15px"} ${effectiveGold}15, 0 12px 40px rgba(0,0,0,0.9)`,
          transition: "box-shadow 0.4s ease",
        }}
      >
        <div
          className="relative w-full h-full rounded-md"
          style={{
            background: "#08080E",
            padding: "3px",
            boxShadow: `inset 0 0 8px ${effectiveGold}10`,
          }}
        >
          <div
            className="relative w-full h-full rounded"
            style={{
              background: `linear-gradient(135deg, ${effectiveGold}50, ${effectiveGoldDark}40, ${effectiveGoldLight}30, ${effectiveGold}45)`,
              backgroundSize: "300% 300%",
              animation: isHovered
                ? "team-deck-holographic 5s ease infinite"
                : "none",
              padding: "2px",
            }}
          >
            <div
              className="relative w-full h-full rounded-sm"
              style={{
                background: `linear-gradient(160deg, #0c0c16, ${effectiveGold}06, #08080E)`,
                padding: "6px",
              }}
            >
              <OrnamentalFrame color={effectiveGold} />
              <div
                className="relative w-full h-full rounded-sm overflow-hidden flex flex-col items-center justify-center gap-6"
                style={{
                  background: `linear-gradient(160deg, #0a0a14 0%, ${effectiveGold}06 40%, #06060C 60%, ${effectiveGold}04 100%)`,
                  border: `1px solid ${effectiveGold}15`,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${UNICORN_PATTERN})`,
                    backgroundSize: "260px 260px",
                    backgroundRepeat: "repeat",
                    opacity: 0.18,
                    imageRendering: "pixelated",
                    mixBlendMode: "lighten",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "3px 3px",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px)",
                    backgroundSize: "100% 2px",
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                    animation: isHovered
                      ? "team-deck-holographic 3s ease infinite"
                      : "none",
                    opacity: isHovered ? 1 : 0,
                  }}
                />
                <div
                  className="absolute inset-[8px] pointer-events-none z-10 rounded-sm"
                  style={{
                    border: `1px solid ${effectiveGold}12`,
                    boxShadow: `inset 0 0 20px ${effectiveGold}06`,
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-300 z-30"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={UM_LOGO_ICON}
                    alt=""
                    className="w-14 h-14 invert opacity-50"
                    style={{ imageRendering: "pixelated" }}
                    width={56}
                    height={56}
                  />
                </div>
                <div className="relative z-10 text-center">
                  <motion.p
                    className="font-deck-pixel text-[7px] tracking-[0.3em] uppercase"
                    style={{
                      color: accentHex ?? (isHovered ? "#FFD700" : "#BBBBBB"),
                      textShadow: isHovered
                        ? `0 0 12px ${accentHex ?? "#FFD700"}60`
                        : "none",
                      transition: "color 0.4s ease, text-shadow 0.4s ease",
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {title} →
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
