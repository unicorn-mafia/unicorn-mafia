'use client';

import React, { useState, useEffect, useRef } from "react";
import styles from './hero.module.css';

const UNICORN_ASCII = `               ,,))))))));,
            __)))))))))))))),
 \\|/       -\\(((((''''((((((((.
 -*-==//////((''  .     \`)))))),
 /|\\      ))| o    ;-.    '(((((                                  ,(,
          ( \`|    /  )    ;))))'                               ,_))^;(~
             |   |   |   ,))((((_     _____------~~~-.        %,;(;(>';'~
             o_);   ;    )))(((  ~---~  \`::\`           \\      %%~~)(v;(\`('~
                   ;    ''''\`\`\`\`         \`:       \`:::|\\,__,%%    );\`'; ~
                  |   _                )     /      \`:|\`----'     \`-'
            ______/\\/~    |                 /        /
          /~;;.____/;;'  /          ___--,-(   \`;;;/
         / //  _;______;'------~~~~~    /;;/\\    /
        //  | |                        / ;   \\;;,\\
       (<_  | ;                      /',/-----'  _>
        \\_| ||_                     //~;~~~~~~~~~
            \`\\_|                   (,~~
                                    \\~\\
                                     ~~`;

const WORDS = ['ship', 'build', 'hire', 'demo', 'launch'];

const PIXEL_FRAMES = [
  `               ░░▒▒▓▓████▓▓▒▒
            ░░▒▒▓▓████████▓▓▒▒░░
 ░▒▓       ░▒▓███████████████▓▒░
 ▓█▓══════▒▓██▓▓  ░░   ▒▓████▓▒
 ░▒▓      ▓██▒ ●    ░░    ▒███▓                                  ░▒▓
          ▒ ▓▒    ░  ▒    ░▓██▓▒                               ░▒▓▓▒░
             ▓   ▒   ▒   ░▓▓███▓     ▓▓▓▓▓▓▓▓▓▓▓▓▓░░        ▒▓▓▓▓▓▒░
             ●▒▓   ░    ▓▓▓███  ▓▓▓▓▓  ░░▒▒           ▓      ▒▒▓▓▓▓▒░
                   ░    ▒▒▒▒▓▓▓▓         ░       ░░░▓▓░▓▓▒▒    ▓▒▒ ░
                  ▓   ▓                ▒     ░      ░▓▒▓▓▓▒     ▒▒
            ▓▓▓▓▓▓▒▒▓    ▓                 ░        ░
          ░▓▓▓░▓▓▓▓░▓▓  ░          ▓▓▓▓▓░▒   ▒▓▓▓░
         ░ ░░  ▓▓▓▓▓▓▓▒▓▓▓▓▓▓▓▓▓    ░▓▓░▓    ░
        ░░  ▓ ▓                        ░ ▓   ▓▓▓░▓
       ░▓▓  ▓ ░                      ░▒░░▓▓▓▓▓  ▓▒
        ▓▓▓ ▓▓▓                     ░░▓░▓▓▓▓▓▓▓▓
            ▒▓▓▓                   ░▒▓▓
                                    ▓▓▓
                                     ▓▓`,
  `               ▓▓████████▓▓▒▒
            ▒▒▓▓██████████████▒▒
 ▒▓█       ▒▓█████████████████▓░
 ███══════▓███▓▓  ▒▒   ▓█████▓▒
 ▒▓█      ███▓ ◉    ▓▓    ████▓                                  ▒▓█
          ▓ █▓    ▒  ▓    ▓███▓▒                               ▒▓██▓▒
             █   ▓   ▓   ▓█████▓     █████████████▓▒▒        ▓█████▓▒
             ◉▓█   ▒    █████▓  █████  ▒▒▓▓           █      ▓▓████▓▒
                   ▒    ▓▓▓▓████         ▒       ▒▒▒██▒██▓▓    █▓▓ ▒
                  █   █                ▓     ▒      ▒█▓██▓▒     ▓▓
            ██████▓▓█    █                 ▒        ▒
          ▒███▒████▒██  ▒          █████▒▓   ▓███▒
         ▒ ▒▒  ██████▓██████████    ▒██▒█    ▒
        ▒▒  █ █                        ▒ █   ███▒█
       ▒██  █ ▒                      ▒▓▒▒████▓  █▓
        ███ ███                     ▒▒█▒████████
            ▓███                   ▒▓██
                                    ███
                                     ██`,
];

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [pixelFrame, setPixelFrame] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2000);

    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    if (isHovered) {
      hoverIntervalRef.current = setInterval(() => {
        setPixelFrame((prev) => (prev + 1) % PIXEL_FRAMES.length);
      }, 150);
    } else {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    }

    return () => {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current);
      }
    };
  }, [isHovered]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div 
          className={styles.artWrapper}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <pre className={`${styles.asciiArt} ${isHovered ? styles.pixelated : ''}`}>
            {isHovered ? PIXEL_FRAMES[pixelFrame] : UNICORN_ASCII}
          </pre>
        </div>
      </div>

      <div className={styles.footerContent}>
        <span className={styles.cursor}>_</span> devs helping devs {WORDS[wordIndex]}
      </div>
    </section>
  );
}
