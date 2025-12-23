'use client';

import React from 'react';
import Image from 'next/image';
import { InfiniteSlider } from '../ui/infinite-slider';
import { useScrollAnimation } from '../../_hooks/useScrollAnimation';
import animationStyles from '../../_styles/animations.module.css';

const companies = [
  { name: 'Amazon', logo: '/companies/amazon.svg' },
  { name: 'Anthropic', logo: '/companies/anthropic.svg' },
  { name: 'Apple', logo: '/companies/apple.svg' },
  { name: 'Cambridge', logo: '/companies/cambridge.svg' },
  { name: 'Google', logo: '/companies/google.svg' },
  { name: 'Imperial', logo: '/companies/imperial.svg' },
  { name: 'Meta', logo: '/companies/meta.svg' },
  { name: 'Nvidia', logo: '/companies/nvidia.svg' },
  { name: 'OpenAI', logo: '/companies/openai.svg' },
  { name: 'Oxford', logo: '/companies/oxford.svg' },
  { name: 'UCL', logo: '/companies/ucl.svg' },
  { name: 'Y Combinator', logo: '/companies/ycombinator.svg' },
];

export default function TrustBy() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section 
      ref={ref}
      className={`w-full py-16 md:py-24 border-b border-gray-200 ${animationStyles.fadeInUp} ${isVisible ? animationStyles.visible : ''}`}
    >
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-title tracking-tighter text-black text-center">
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
