'use client';

import React from 'react';
import Image from 'next/image';
import { InfiniteSlider } from '../ui/infinite-slider';
import { useScrollAnimation } from '../../_hooks/useScrollAnimation';
import animationStyles from '../../_styles/animations.module.css';

export type Company = {
  name: string;
  logo: string;
};
export default function TrustBy({ companies }: { companies: Company[] }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section 
      ref={ref}
      className={`w-full py-16 md:py-24 border-b border-gray-200 ${animationStyles.fadeInUp} ${isVisible ? animationStyles.visible : ''}`}
    >
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-inter tracking-tighter text-black text-center">
          The best hackers from
        </h2>
      </div>

      <InfiniteSlider
        duration={60}
        durationOnHover={120}
        gap={48}
        reverse={false}
      >
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex-shrink-0 w-32 md:w-40 h-16 md:h-20 relative grayscale hover:grayscale-0 transition-all duration-300"
          >
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}
