'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import AnimatedToggle from './animated-toggle'

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
            transition-all duration-300 ease-in-out
            ${toggle ? "opacity-100 visible" : "opacity-0 pointer-events-auto invisible"}
            font-medium text-lg text-black font-inter
          `}
        >
          <Link href="/">Works</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </div>
        <div className="relative w-[18px] h-[18px] flex-none ">
          <AnimatedToggle 
            toggle={toggle} 
            onToggle={() => setToggle(!toggle)} 
          />
        </div>
      </div>
    </nav>
  )
}
