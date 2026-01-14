'use client';

import React, { useState, useEffect, useRef } from "react";
import styles from './hero.module.css';

const ASCII_FRAMES = [
  `
    ██████╗ ██╗   ██╗██╗██╗     ██████╗ 
    ██╔══██╗██║   ██║██║██║     ██╔══██╗
    ██████╔╝██║   ██║██║██║     ██║  ██║
    ██╔══██╗██║   ██║██║██║     ██║  ██║
    ██████╔╝╚██████╔╝██║███████╗██████╔╝
    ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ 
  `,
  `
    ███████╗██╗  ██╗██╗██████╗ 
    ██╔════╝██║  ██║██║██╔══██╗
    ███████╗███████║██║██████╔╝
    ╚════██║██╔══██║██║██╔═══╝ 
    ███████║██║  ██║██║██║     
    ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     
  `,
  `
    ██╗  ██╗██╗██████╗ ███████╗
    ██║  ██║██║██╔══██╗██╔════╝
    ███████║██║██████╔╝█████╗  
    ██╔══██║██║██╔══██╗██╔══╝  
    ██║  ██║██║██║  ██║███████╗
    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
  `,
  `
    ██████╗ ███████╗███╗   ███╗ ██████╗ 
    ██╔══██╗██╔════╝████╗ ████║██╔═══██╗
    ██║  ██║█████╗  ██╔████╔██║██║   ██║
    ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║
    ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝
    ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝ 
  `,
  `
    ██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗
    ██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝██║  ██║
    ██║     ███████║██║   ██║██╔██╗ ██║██║     ███████║
    ██║     ██╔══██║██║   ██║██║╚██╗██║██║     ██╔══██║
    ███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╗██║  ██║
    ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
  `,
];

const WORDS = ['build', 'ship', 'hire', 'demo', 'launch'];

export default function Hero() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [glitchOffset, setGlitchOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ASCII_FRAMES.length);
      setGlitchOffset(Math.random() * 2 - 1);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col justify-between px-6 md:px-12 lg:px-20 py-8 md:py-12 border-b border-gray-200" style={{ minHeight: 'calc(100vh - 77px)' }}>
      <div className={styles.heroContent}>
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.85] font-semibold font-title tracking-tighter text-black text-center lg:text-left">
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <pre 
            className={styles.asciiArt}
            style={{ transform: `translateX(${glitchOffset}px)` }}
          >
            {ASCII_FRAMES[frameIndex]}
          </pre>
        </div>
      </div>

      <div className={styles.footerContent}>
        <div className="font-mono font-normal text-sm sm:text-base md:text-lg tracking-tight text-black/60">
          <span className={styles.cursor}>_</span> devs helping devs {WORDS[frameIndex]}
        </div>
      </div>
    </section>
  );
}
