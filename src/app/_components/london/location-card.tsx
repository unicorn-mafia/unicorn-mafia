"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { LondonLocation } from "../../_types/london";
import { CATEGORY_META } from "../../_types/london";

interface LocationCardProps {
  location: LondonLocation | null;
  onClose: () => void;
}

export function LocationCard({ location, onClose }: LocationCardProps) {
  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-[1000] bg-white border border-neutral-300 shadow-lg"
        >
          {/* Accent bar */}
          <div
            className="h-[3px] w-full"
            style={{
              backgroundColor: CATEGORY_META[location.category].color,
            }}
          />

          <div className="p-4">
            {/* Category + close */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_META[location.category].color,
                  }}
                />
                <span className="text-[10px] font-mono font-medium text-neutral-400 tracking-widest">
                  {CATEGORY_META[location.category].label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </button>
            </div>

            {/* Name */}
            <h3 className="text-sm font-mono font-bold text-neutral-900 tracking-wide mb-1">
              {location.name}
            </h3>

            {/* Area */}
            <p className="text-[11px] font-mono text-neutral-500 tracking-wide mb-1">
              {location.area}
            </p>

            {/* Tagline */}
            {location.tagline && (
              <p className="text-[11px] font-mono text-neutral-400 tracking-wide mb-3">
                {location.tagline}
              </p>
            )}

            {/* CTA */}
            <a
              href={location.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-mono tracking-widest hover:bg-neutral-700 transition-colors"
            >
              {CATEGORY_META[location.category].cta}
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-2.5 h-2.5"
              >
                <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5H4.56l7.72 7.72a.75.75 0 1 1-1.06 1.06L3.5 4.56v2.69a.75.75 0 0 1-1.5 0v-3.5A1.75 1.75 0 0 1 3.75 2Zm9.5 3.25a.75.75 0 0 1 .75.75v6.25A1.75 1.75 0 0 1 12.25 14H6a.75.75 0 0 1 0-1.5h6.25a.25.25 0 0 0 .25-.25V6a.75.75 0 0 1 .75-.75Z" />
              </svg>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
