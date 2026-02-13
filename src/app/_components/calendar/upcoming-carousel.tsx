"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "../../_types/calendar";
import { EventCard } from "./event-card";

interface UpcomingCarouselProps {
  events: CalendarEvent[];
}

export function UpcomingCarousel({ events }: UpcomingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragConstraintRight, setDragConstraintRight] = useState(0);

  const handleMeasure = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      setDragConstraintRight(-(scrollWidth - clientWidth));
    }
  };

  React.useEffect(() => {
    handleMeasure();
    window.addEventListener("resize", handleMeasure);
    return () => window.removeEventListener("resize", handleMeasure);
  }, [events]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 340;
      const currentScroll = containerRef.current.scrollLeft;
      containerRef.current.scrollTo({
        left: currentScroll + (direction === "right" ? scrollAmount : -scrollAmount),
        behavior: "smooth",
      });
    }
  };

  if (events.length === 0) return null;

  return (
    <div className="relative">
      {/* Arrow buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center border border-neutral-400 bg-white text-neutral-700 hover:text-black transition-colors"
        aria-label="Scroll left"
      >
        ←
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center border border-neutral-400 bg-white text-neutral-700 hover:text-black transition-colors"
        aria-label="Scroll right"
      >
        →
      </button>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-hidden mx-10"
      >
        <motion.div
          className="flex gap-4 py-2"
          drag="x"
          dragConstraints={{ left: dragConstraintRight, right: 0 }}
          dragDirectionLock
          whileTap={{ scale: 0.98 }}
          onDragEnd={() => {}}
        >
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
