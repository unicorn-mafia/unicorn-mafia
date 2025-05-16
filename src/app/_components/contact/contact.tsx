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
            <div>
                <div></div>
                <div>
                    <div></div>
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
