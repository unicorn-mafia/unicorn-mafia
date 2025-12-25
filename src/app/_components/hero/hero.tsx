'use client';

import React, { useState, useEffect } from "react";
import styles from './hero.module.css';

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = '// 850+ hackers. One mission: build the next unicorn.';

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
          <svg width="500" height="500" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[400px] lg:max-w-[500px] h-auto">
            <rect x="255.273" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="416.091" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="319.545" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="319.545" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="383.818" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="383.818" y="223.273" width="64.2727" height="64.2727" fill="black"/>
            <rect x="448.091" y="223.273" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="576.636" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="416.091" width="64.2727" height="64.2727" fill="black"/>
            <rect x="705.182" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="705.182" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="576.636" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="801.727" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="801.727" width="64.2727" height="64.2727" fill="black"/>
            <rect x="520.747" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="287.545" width="64.2727" height="64.2727" fill="#B307EB"/>
            <rect x="705.182" y="287.545" width="64.2727" height="64.2727" fill="#3198F1"/>
            <rect x="705.182" y="223.273" width="64.2727" height="64.2727" fill="#4EF9BD"/>
            <rect x="769.455" y="159" width="64.2727" height="64.2727" fill="#EE1701"/>
            <rect x="191" y="480.364" width="64.2727" height="64.2727" fill="black"/>
          </svg>
        </div>
      </div>

      {/* Footer content */}
      <div className={styles.footerContent}>
        <div className="font-mono font-normal text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-black sm:text-right">
          {typewriterText}
        </div>
      </div>
    </section>
  );
}
