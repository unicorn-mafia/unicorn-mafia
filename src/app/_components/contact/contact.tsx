'use client';

import React from 'react';
import styles from './contact.module.css';

export default function Contact() {
  return (
    <div
      id="contact"
      className="flex flex-col items-center justify-between w-full min-h-[75vh] px-6 md:px-12 lg:px-20 py-16"
      style={{ backgroundColor: '#14120B' }}
    >
        <div className="flex flex-col items-center justify-start w-full gap-8">
            <div className="flex flex-col items-start justify-center w-full">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 framer-text leading-tight font-title"
                  data-text-fill="true"
                  style={{
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
                        <span className="text-white font-body">
                          <a href="https://wa.me/447488895960?text=tell%20me%20more" target="_blank" rel="noopener noreferrer">Get in touch</a><span className={styles.cursor}>|</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full mt-8 flex flex-col items-center overflow-hidden px-4">
            <div className="flex flex-row text-white font-title font-medium text-md gap-10 mb-4">
                <a href="https://github.com/unicorn-mafia">Github</a>
                <a href="https://lu.ma/mafia?period=past" target="_blank" rel="noopener noreferrer">Luma</a>
                <a href="https://www.linkedin.com/company/unicorn-mafia/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://x.com/unicorn_mafia" target="_blank" rel="noopener noreferrer">X</a>
            </div>
            <img
              src="/footer-um.svg"
              alt="Unicorn Mafia"
              className="w-full max-w-2xl opacity-40"
            />
            <div className="flex flex-row text-white font-title font-medium text-md gap-4 mt-4">
                <a href="mailto:stable@unicrnmafia.com" className="hover:underline">Sponsor</a>
                <a href="mailto:stable@unicrnmafia.com" className="hover:underline">Invest</a>
                <a href="/brand" className="hover:underline">Brand</a>
                <div>UM ©2026</div>
            </div>
        </div>
    </div>
  )
}
