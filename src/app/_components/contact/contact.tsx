import React from 'react'

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-between w-full h-screen px-20 py-16 bg-black">
        <div className="flex flex-col items-center justify-between w-full h-full">
            <div className="flex flex-row gap-10 justify-end w-full text-white font-inter font-medium text-md">
                <div>Linkedin</div>
                <div>Twitter</div>
                <div>WhatsApp</div>
            </div>
            <div className="flex flex-col items-start justify-center w-full">
                <h2 
                  className="text-5xl font-medium tracking-tight mb-8 framer-text"
                  data-text-fill="true"
                  style={{
                    backgroundImage: 'linear-gradient(95deg, rgb(255, 255, 255) 37%, rgb(56, 56, 56) 95%)',
                  }}
                  >
                    Want to build the next unicorn together?
                </h2>
                <div className="flex items-center gap-4">
                    <button 
                      className="bg-white text-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Get in Touch
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="dot-container">
                            <div className="dot"></div>
                            <div className="dot-pulse"></div>
                        </div>
                        <span 
                          className="text-white">
                          It could be you
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>+44 (00) 0000 000</div>
                    <div>hello@unicrnmafia.com</div>
                </div>
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>All rights reserved,</div>
                    <div>LUM ©2025 </div>
                </div>
            </div>
        </div>
    </div>
  )
}
