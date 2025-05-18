import React from 'react'

export default function Contact() {
  return (
    <div id="contact" className="flex flex-col items-center justify-between w-full h-screen px-20 py-16 bg-black">
        <div className="flex flex-col items-center justify-between w-full h-full">
            <div className="flex flex-row gap-10 justify-end w-full text-white font-inter font-medium text-md">
                <div>Linkedin</div>
                <div>Twitter</div>
                <div>WhatsApp</div>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <h2 className="text-6xl font-inter font-medium tracking-tight text-white mb-10">
                    Want to build the next <span className="text-[#777777]">unicorn together?</span>
                </h2>
                <div className="flex items-center gap-6">
                    <button className="bg-white text-black font-inter font-medium px-8 py-4">
                        Get in Touch
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-white"></div>
                        <span className="text-white font-inter">It could be you</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between w-full">
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
