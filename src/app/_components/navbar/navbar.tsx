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
        <button 
          onClick={() => setToggle(!toggle)} 
          className="relative w-6 h-6 flex flex-wrap content-start justify-start gap-0.5 p-0.5 focus:outline-none"
          aria-label={toggle ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={toggle}
        >
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
        </button>
      </div>
    </nav>
  )
}
