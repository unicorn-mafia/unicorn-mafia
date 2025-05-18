'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div id="contact" className="flex flex-col items-center justify-between w-full min-h-screen bg-black px-6 py-16">
        <div className="flex flex-col items-center justify-between w-full h-full max-w-5xl mx-auto">
            <div className="flex flex-row gap-10 justify-end w-full text-white font-inter font-medium text-md">
                <div>Linkedin</div>
                <div>Twitter</div>
                <div>WhatsApp</div>
            </div>
            
            <div className="flex flex-col items-start justify-center w-full my-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 gradient-text">
                    Want to build the next unicorn together?
                </h1>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link 
                        href="#"
                        className="bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Get in Touch
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-white text-lg">It could be you</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-row justify-between w-full mt-auto">
                <div className="flex flex-col text-white font-inter font-medium text-md">
                    <div>+44 (00) 0000 000</div>
                    <div>hello@unicornmafia.com</div>
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
