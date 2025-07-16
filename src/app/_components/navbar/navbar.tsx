'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import AnimatedToggle from './animated-toggle'
import styles from './logo.module.css'

export default function Navbar() {
    const [toggle, setToggle] = useState(false);
  return (
    <>
      <nav className="flex w-full justify-between px-6 md:px-9 py-6 md:py-6 border-b border-gray-200">
        <Link href="/" className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="255.273" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="416.091" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="319.545" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="319.545" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="383.818" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="383.818" y="223.273" width="64.2727" height="64.2727" fill="black"/>
            <rect x="448.091" y="223.273" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="287.545" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="576.636" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="351.818" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="416.091" width="64.2727" height="64.2727" fill="black"/>
            <rect x="705.182" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="769.455" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="705.182" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="640.909" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="576.636" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="801.727" width="64.2727" height="64.2727" fill="black"/>
            <rect x="512.364" y="801.727" width="64.2727" height="64.2727" fill="black"/>
            <rect x="520.747" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="480.364" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="544.636" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="608.909" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect x="191" y="737.455" width="64.2727" height="64.2727" fill="black"/>
            <rect x="255.273" y="673.182" width="64.2727" height="64.2727" fill="black"/>
            <rect className={styles.horn1} x="640.909" y="287.545" width="64.2727" height="64.2727" fill="#B307EB"/>
            <rect className={styles.horn2} x="705.182" y="287.545" width="64.2727" height="64.2727" fill="#3198F1"/>
            <rect className={styles.horn3} x="705.182" y="223.273" width="64.2727" height="64.2727" fill="#4EF9BD"/>
            <rect className={styles.horn4} x="769.455" y="159" width="64.2727" height="64.2727" fill="#EE1701"/>
            <rect x="191" y="480.364" width="64.2727" height="64.2727" fill="black"/>
          </svg>
        </Link>
        <div className="flex items-center">
          <div
            className={`
              items-center gap-8 mr-6
              transition-all duration-300 ease-in-out
              ${toggle ? "hidden md:flex" : "hidden"}
              font-medium text-lg text-black font-inter
            `}
          >
            <Link href="#works" className="hover:opacity-70 transition-opacity">Works</Link>
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
