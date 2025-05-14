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
      <div className="flex items-center gap-8">
        <div className={`flex items-center gap-8 ${!toggle ? "hidden" : ""} font-medium font-inter text-lg text-black`}>
            <Link href="/">Works</Link>
            <Link href="/">About</Link>
            <Link href="/">Contact</Link>
        </div>
        <div className="flex items-center">
            <button onClick={() => setToggle(!toggle)} className="p-2 bg-black"/>
        </div>
      </div>
    </nav>
  )
}
