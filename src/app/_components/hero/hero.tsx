'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from './hero.module.css';

const AsciiUnicorn = dynamic(() => import("./ascii-unicorn"), {
  ssr: false,
});

const WORDS = ['ship', 'build', 'hire', 'demo', 'launch'];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2000);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div className={styles.artWrapper}>
          <div className={styles.canvasContainer}>
            <AsciiUnicorn />
          </div>
        </div>
      </div>

      <div className={styles.footerContent}>
        <span className={styles.cursor}>_</span> devs helping devs {WORDS[wordIndex]}
      </div>
    </section>
  );
}
