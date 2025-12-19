'use client';

import React from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '../../_hooks/useScrollAnimation';
import animationStyles from '../../_styles/animations.module.css';

const workspaceProviders = [
  { name: 'Halkin', logo: '/companies/halkin.svg', url: 'https://www.halkin.com/locations/1-2-paris-garden' },
];

export default function TrustBy() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section 
      ref={ref}
      className={`w-full py-16 md:py-24 border-b border-gray-200 ${animationStyles.fadeInUp} ${isVisible ? animationStyles.visible : ''}`}
    >
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-inter tracking-tighter text-black text-center">
          Workspace provided by
        </h2>
      </div>

      <div className="flex flex-row items-center justify-center w-full gap-12">
        {workspaceProviders.map((provider) => (
          <div
            key={provider.name}
            className="flex-shrink-0 w-32 md:w-40 h-16 md:h-20 relative grayscale hover:grayscale-0 transition-all duration-300"
          >
            <a href={provider.url} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
              <Image
                src={provider.logo}
                alt={provider.name}
                fill
                className="object-contain"
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
