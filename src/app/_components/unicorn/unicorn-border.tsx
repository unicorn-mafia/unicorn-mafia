'use client';

import { useMemo } from 'react';
import AnimatedUnicorn from './animated-unicorn';
import { useScrollProgress } from '@/app/_hooks/useScrollProgress';

interface UnicornBorderProps {
  direction: 'horizontal' | 'vertical';
}

export default function UnicornBorder({ direction }: UnicornBorderProps) {
  const scrollProgress = useScrollProgress();

  // Calculate number of unicorns needed based on typical screen sizes
  // Horizontal: ~25 unicorns for wide screens at 80px each
  // Vertical: ~15 unicorns for tall screens at 80px each
  const unicornCount = useMemo(() => {
    return direction === 'horizontal' ? 25 : 15;
  }, [direction]);

  return (
    <div
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'}`}
    >
      {Array.from({ length: unicornCount }, (_, i) => (
        <AnimatedUnicorn
          key={i}
          scrollProgress={scrollProgress}
          size={80}
        />
      ))}
    </div>
  );
}
