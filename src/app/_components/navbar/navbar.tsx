'use client'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Navbar() {
    const [toggle, setToggle] = useState(false);
  return (
    <nav className="flex w-full justify-between px-9 py-8 border-b border-2 border-gray-100">
      <div className="text-3xl font-bold font-inter tracking-tighter text-black">
        LUM
      </div>
      <div className="flex items-center relative">
        <div 
          className={`
            flex items-center gap-8 mr-4
            transition-opacity duration-300 ease-in-out 
            ${!toggle ? "opacity-0 pointer-events-none invisible" : "opacity-100 visible"} 
            font-medium font-inter text-lg text-black
          `}
        >
          <Link href="/">Works</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>
        <div className="relative w-[18px] h-[18px] flex-none">
          <div 
            className="h-full w-full" 
            tabIndex={0} 
            data-highlight="true"
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={toggle}
          >
            <div style={{ transform: 'none', transformOrigin: '50% 50%' }}>
              <div 
                className="w-[5px] h-[5px] bg-black transition-all duration-300" 
                style={{ 
                  transform: 'none', 
                  transformOrigin: '50% 50%', 
                  position: 'absolute', 
                  top: toggle ? '1.5px' : '0px', 
                  left: toggle ? '1.5px' : '0px'
                }}
              ></div>
              <div 
                className="w-[5px] h-[5px] bg-black transition-all duration-300" 
                style={{ 
                  transform: 'none', 
                  transformOrigin: '50% 50%', 
                  position: 'absolute', 
                  top: toggle ? '1.5px' : '0px', 
                  left: toggle ? '11.5px' : '13px'
                }}
              ></div>
            </div>
            <div 
              className="w-[5px] h-[5px] bg-black transition-opacity duration-300" 
              style={{ 
                opacity: toggle ? 1 : 0, 
                willChange: 'transform', 
                position: 'absolute', 
                top: '6.5px', 
                left: '6.5px' 
              }}
            ></div>
            <div style={{ transform: 'none', transformOrigin: '50% 50%' }}>
              <div 
                className="w-[5px] h-[5px] bg-black transition-all duration-300" 
                style={{ 
                  transform: 'none', 
                  transformOrigin: '50% 50%', 
                  position: 'absolute', 
                  top: toggle ? '11.5px' : '13px', 
                  left: toggle ? '1.5px' : '0px'
                }}
              ></div>
              <div 
                className="w-[5px] h-[5px] bg-black transition-all duration-300" 
                style={{ 
                  transform: 'none', 
                  transformOrigin: '50% 50%', 
                  position: 'absolute', 
                  top: toggle ? '11.5px' : '13px', 
                  left: toggle ? '11.5px' : '13px'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
