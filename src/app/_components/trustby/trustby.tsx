import React from 'react';

const companies = [
  { name: 'Amazon', logo: '/companies/amazon.png', logoHd: '/companies/amazon.svg' },
  { name: 'Anthropic', logo: '/companies/anthropic.png', logoHd: '/companies/anthropic.svg' },
  { name: 'Apple', logo: '/companies/apple.png', logoHd: '/companies/apple.svg' },
  { name: 'Cambridge', logo: '/companies/cambridge.png', logoHd: '/companies/cambridge.svg' },
  { name: 'Google', logo: '/companies/google.png', logoHd: '/companies/google.svg' },
  { name: 'Imperial', logo: '/companies/imperial.png', logoHd: '/companies/imperial.svg' },
  { name: 'Meta', logo: '/companies/meta.png', logoHd: '/companies/meta.svg' },
  { name: 'Nvidia', logo: '/companies/nvidia.png', logoHd: '/companies/nvidia.svg' },
  { name: 'OpenAI', logo: '/companies/openai.png', logoHd: '/companies/openai.svg' },
  { name: 'Oxford', logo: '/companies/oxford.png', logoHd: '/companies/oxford.svg' },
  { name: 'UCL', logo: '/companies/ucl.png', logoHd: '/companies/ucl.svg' },
  { name: 'Y Combinator', logo: '/companies/ycombinator.png', logoHd: '/companies/ycombinator.svg' },
  { name: 'xAI', logo: '/companies/xai.svg', logoHd: '/companies/xai-hd.svg' },
  { name: 'Palantir', logo: '/companies/palantir.svg', logoHd: '/companies/palantir-hd.svg' },
];

export default function TrustBy() {
  return (
    <section className="w-full py-16 md:py-24 border-b border-gray-200">
      <div className="px-6 md:px-12 lg:px-20 mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-title tracking-tighter text-black text-center">
          The best hackers from
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center animate-scroll-left" style={{ width: 'max-content' }}>
          {/* First set of logos */}
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex-shrink-0 w-36 h-14 mx-8 relative grayscale hover:grayscale-0 transition-[filter] duration-300 group"
            >
              {/* Pixelated version */}
              <img
                src={company.logo}
                alt={company.name}
                className="absolute inset-0 w-full h-full object-contain [image-rendering:pixelated] opacity-100 group-hover:opacity-0 transition-opacity duration-300"
              />
              {/* HD version - visible on hover */}
              <img
                src={company.logoHd}
                alt={company.name}
                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {companies.map((company) => (
            <div
              key={`${company.name}-dup`}
              className="flex-shrink-0 w-36 h-14 mx-8 relative grayscale hover:grayscale-0 transition-[filter] duration-300 group"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="absolute inset-0 w-full h-full object-contain [image-rendering:pixelated] opacity-100 group-hover:opacity-0 transition-opacity duration-300"
              />
              <img
                src={company.logoHd}
                alt={company.name}
                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
