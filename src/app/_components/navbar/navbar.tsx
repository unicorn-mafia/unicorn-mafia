'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import AnimatedToggle from './animated-toggle'

export default function Navbar() {
    const [toggle, setToggle] = useState(false);
  return (
    <>
      <nav className="flex w-full justify-between px-6 md:px-9 py-6 md:py-8 border-b border-gray-200">
        <Link href="/" className="text-2xl md:text-3xl font-bold font-inter tracking-tighter text-black">
          LUM
        </Link>
        <div className="flex items-center">
          <div 
            className={`
              hidden md:flex items-center gap-8 mr-6
              transition-all duration-300 ease-in-out
              ${toggle ? "opacity-0 invisible" : "opacity-100 visible"}
              font-medium text-lg text-black font-inter
            `}
          >
            <Link href="/" className="hover:opacity-70 transition-opacity">Works</Link>
            <Link href="#about" className="hover:opacity-70 transition-opacity">About</Link>
            <Link href="#contact" className="hover:opacity-70 transition-opacity">Contact</Link>
          </div>
          <div className="relative w-[18px] h-[18px] flex-none cursor-pointer">
            <AnimatedToggle 
              toggle={toggle} 
              onToggle={() => setToggle(!toggle)} 
            />
          </div>
        </div>
      </nav>
      
      {/* Mobile menu overlay */}
      <div 
        className={`
          fixed inset-0 top-[73px] bg-white z-40 md:hidden
          transition-all duration-300 ease-in-out
          ${toggle ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-12 font-medium text-5xl text-black font-inter">
          <Link 
            href="/" 
            className="hover:opacity-70 transition-opacity"
            onClick={() => setToggle(false)}
          >
            Works
          </Link>
          <Link 
            href="#about" 
            className="hover:opacity-70 transition-opacity"
            onClick={() => setToggle(false)}
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className="hover:opacity-70 transition-opacity"
            onClick={() => setToggle(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  )
}
