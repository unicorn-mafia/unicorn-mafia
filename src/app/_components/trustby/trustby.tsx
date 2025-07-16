'use client';

import React from 'react';
import Image from 'next/image';
import styles from './trustby.module.css';

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
  return (
    <section className="w-full py-16 md:py-24 border-b border-gray-200 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-inter tracking-tighter text-black mb-12 text-center">
          Trusted by hackers from
        </h2>
      </div>
      
      {/* Carousel container */}
      <div className="relative">
        {/* Gradient masks for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className={`flex ${styles['animate-scroll']}`}>
          {/* First set of logos */}
          <div className="flex items-center gap-12 md:gap-16 px-6 md:px-12">
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
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 md:gap-16 px-6 md:px-12">
            {companies.map((company) => (
              <div
                key={`${company.name}-duplicate`}
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
          </div>
        </div>
      </div>
    </section>
  );
}