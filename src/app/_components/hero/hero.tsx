'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from './hero.module.css';

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = '// 500+ hackers. One mission: build the next unicorn.';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex flex-col justify-between px-6 md:px-12 lg:px-20 py-8 md:py-12 border-b border-gray-200" style={{ minHeight: 'calc(100vh - 77px)' }}>
      {/* Main hero content */}
      <div className={styles.heroContent}>
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.85] font-semibold font-inter tracking-tighter text-black text-center lg:text-left">
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/hero.avif"
            alt="unicorn mafia hero image"
            width={841}
            height={686}
            className="w-full max-w-[400px] lg:max-w-[500px] h-auto object-cover"
            priority
          />
        </div>
      </div>

      {/* Footer content */}
      <div className={styles.footerContent}>
        <div className="font-inter font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tighter text-black">
          um@unicrnmafia.com
        </div>
        <div className="font-mono font-normal text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-black sm:text-right">
          {typewriterText}
          <span className={styles.cursor}>|</span>
        </div>
      </div>
    </section>
  );
}
