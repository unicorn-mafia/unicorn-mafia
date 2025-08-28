'use client';

import React from 'react';
import styles from './contact.module.css';
import { useScrollAnimation } from '../../_hooks/useScrollAnimation';
import animationStyles from '../../_styles/animations.module.css';

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div 
      id="contact" 
      ref={ref}
      className={`flex flex-col items-center justify-between w-full min-h-screen px-6 md:px-12 lg:px-20 py-16 bg-black ${animationStyles.fadeInUpSlow} ${isVisible ? animationStyles.visible : ''}`}
    >
        <div className="flex flex-col items-center justify-between w-full flex-1">
            <div className="flex flex-row justify-end w-full text-white font-inter font-medium text-md">
                <div style={{ marginRight: '2.5rem' }}>
                    <a href="https://github.com/unicorn-mafia">Github</a>
                </div>
                <div>
                    <a href="https://lu.ma/mafia?period=past" target="_blank" rel="noopener noreferrer">Luma</a>
                </div>
                {/* <a href="#">Linkedin</a>
                <a href="#">X / Twitter</a> */}
            </div>
            <div className="flex flex-col items-start justify-center w-full">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 framer-text leading-tight"
                  data-text-fill="true"
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    backgroundImage: 'linear-gradient(95deg, rgb(255, 255, 255) 37%, rgb(56, 56, 56) 95%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                    Want to build the next unicorn together?
                </h2>
                <div className="flex items-center" style={{ gap: '1rem' }}>
                    <div className="flex items-center" style={{ gap: '0.5rem' }}>
                        <div className={styles.dotContainer}>
                            <div className={styles.dot}></div>
                            <div className={styles.dotPulse}></div>
                        </div>
                        <span
                          className="text-white"
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                        >
                          It could be you<span className={styles.cursor}>|</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <a href="mailto:stable@unicrnmafia.com">stable@unicrnmafia.com</a>
                </div>
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>UM ©2025 </div>
                </div>
            </div>
        </div>
    </div>
  )
}
