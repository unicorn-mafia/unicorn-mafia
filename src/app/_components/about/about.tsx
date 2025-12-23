'use client';

import React from 'react';
import { useScrollAnimation } from '../../_hooks/useScrollAnimation';
import animationStyles from '../../_styles/animations.module.css';

export default function About() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      id="about"
      ref={ref}
      className={`flex flex-col items-center justify-between w-full px-6 md:px-12 lg:px-20 pt-20 pb-24 gap-20 ${animationStyles.fadeInUpDelayed} ${isVisible ? animationStyles.visible : ''}`}
    >
        <div className="w-full font-title font-medium text-3xl tracking-tighter">about.</div>
        <div className="flex flex-col font-title font-medium text-5xl tracking-tight w-full gap-8">
            <div className="flex flex-col gap-6 text-2xl text-gray-700">
                <div>Unicorn Mafia is an invite-only community of London's sharpest developers.</div>
                <div className="italic">"The highest signal community of builders in London."</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 mt-8">
                <div className="flex flex-col items-center">
                    <div className="font-mono text-5xl sm:text-6xl font-bold text-black">500+</div>
                    <div className="text-lg sm:text-xl text-gray-600">Hackathon wins</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-mono text-5xl sm:text-6xl font-bold text-black">30+</div>
                    <div className="text-lg sm:text-xl text-gray-600">Companies being built</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-mono text-5xl sm:text-6xl font-bold text-black">500+</div>
                    <div className="text-lg sm:text-xl text-gray-600">Developers</div>
                </div>
            </div>
        </div>
    </div>
  )
}
