import React from 'react'
import styles from './contact.module.css'

export default function Contact() {
  return (
    <div id="contact" className="flex flex-col items-center justify-between w-full min-h-screen px-6 md:px-12 lg:px-20 py-16 bg-black">
        <div className="flex flex-col items-center justify-between w-full flex-1">
            <div className="flex flex-row gap-10 justify-end w-full text-white font-inter font-medium text-md">
                <a href="https://github.com/unicorn-mafia">Github</a>
                <a href="https://lu.ma/mafia?period=past" target="_blank" rel="noopener noreferrer">Luma</a>
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
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={styles.dotContainer}>
                            <div className={styles.dot}></div>
                            <div className={styles.dotPulse}></div>
                        </div>
                        <span
                          className="text-white"
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                        >
                          Get in touch
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>um@unicrnmafia.com</div>
                </div>
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>All rights reserved</div>
                    <div>UM ©2025 </div>
                </div>
            </div>
        </div>
    </div>
  )
}
