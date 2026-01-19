'use client';

import UnicornBorder from './unicorn-border';

export default function UnicornFrame() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Left border area */}
      <div className="absolute top-0 left-0 bottom-0 w-8 md:w-20 lg:w-32 overflow-visible">
        <UnicornBorder direction="vertical" />
      </div>
      {/* Right border area */}
      <div className="absolute top-0 right-0 bottom-0 w-8 md:w-20 lg:w-32 overflow-visible">
        <UnicornBorder direction="vertical" />
      </div>
      {/* Top border area */}
      <div className="absolute top-0 left-8 md:left-20 lg:left-32 right-8 md:right-20 lg:right-32 h-4 md:h-6 lg:h-8 overflow-visible">
        <UnicornBorder direction="horizontal" />
      </div>
      {/* Bottom border area */}
      <div className="absolute bottom-0 left-8 md:left-20 lg:left-32 right-8 md:right-20 lg:right-32 h-4 md:h-6 lg:h-8 overflow-visible">
        <UnicornBorder direction="horizontal" />
      </div>
      {/* Middle gap area (between header and main) */}
      <div className="absolute left-8 md:left-20 lg:left-32 right-8 md:right-20 lg:right-32 top-[calc(4rem+1rem)] md:top-[calc(4rem+1.5rem)] lg:top-[calc(4rem+2rem)] h-2 md:h-3 lg:h-4 overflow-visible">
        <UnicornBorder direction="horizontal" />
      </div>
    </div>
  );
}
