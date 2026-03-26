"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import posthog from "posthog-js";
import AnimatedToggle from "./animated-toggle";
import styles from "./logo.module.css";
import { useKeyboardNav, menuItems } from "@/app/_hooks/useKeyboardNav";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const [mounted, setMounted] = useState(false);
  useKeyboardNav();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="bg-white flex items-center px-6 md:px-9 py-6 md:py-3 border border-black">
        {/* Left - Mobile toggle */}
        <div className="w-[48px] flex justify-start md:hidden">
          <div className="relative w-[18px] h-[18px] flex-none cursor-pointer">
            <AnimatedToggle
              toggle={toggle}
              onToggle={() => {
                posthog.capture("mobile_menu_toggled", {
                  action: toggle ? "closed" : "opened",
                });
                setToggle(!toggle);
              }}
            />
          </div>
        </div>

        {/* Left on desktop - Logo */}
        <Link href="/" className={`${styles.logo} hidden md:block`}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="255.273"
              y="480.364"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="416.091"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="351.818"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="319.545"
              y="351.818"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="319.545"
              y="287.545"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="383.818"
              y="287.545"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="383.818"
              y="223.273"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="448.091"
              y="223.273"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="287.545"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="351.818"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="576.636"
              y="351.818"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="640.909"
              y="351.818"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="640.909"
              y="416.091"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="705.182"
              y="480.364"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="769.455"
              y="544.636"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="769.455"
              y="608.909"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="769.455"
              y="673.182"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="705.182"
              y="737.455"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="640.909"
              y="737.455"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="576.636"
              y="673.182"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="673.182"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="737.455"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="801.727"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="512.364"
              y="801.727"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="520.747"
              y="480.364"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="191"
              y="544.636"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="480.364"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="191"
              y="544.636"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="544.636"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="191"
              y="608.909"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="608.909"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="191"
              y="673.182"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="191"
              y="737.455"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              x="255.273"
              y="673.182"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
            <rect
              className={styles.horn1}
              x="640.909"
              y="287.545"
              width="64.2727"
              height="64.2727"
              fill="#B307EB"
            />
            <rect
              className={styles.horn2}
              x="705.182"
              y="287.545"
              width="64.2727"
              height="64.2727"
              fill="#3198F1"
            />
            <rect
              className={styles.horn3}
              x="705.182"
              y="223.273"
              width="64.2727"
              height="64.2727"
              fill="#4EF9BD"
            />
            <rect
              className={styles.horn4}
              x="769.455"
              y="159"
              width="64.2727"
              height="64.2727"
              fill="#EE1701"
            />
            <rect
              x="191"
              y="480.364"
              width="64.2727"
              height="64.2727"
              fill="black"
            />
          </svg>
        </Link>

        {/* Birthday balloons — expires after March 30 2026 */}
        {new Date() < new Date("2026-03-31T00:00:00Z") && (
          <span className="hidden md:inline-block relative w-16 h-16 ml-2">
            {[
              { src: "/balloon-cyan.png", x: 2, delay: 0, dur: 3.5 },
              { src: "/balloon-red.png", x: 14, delay: 0.6, dur: 4.0 },
              { src: "/balloon-purple.png", x: 28, delay: 1.2, dur: 3.2 },
              { src: "/balloon-blue.png", x: 40, delay: 0.3, dur: 3.8 },
              { src: "/balloon-rainbow.png", x: 8, delay: 2.0, dur: 3.6 },
              { src: "/balloon-red.png", x: 34, delay: 1.8, dur: 4.2 },
              { src: "/balloon-cyan.png", x: 22, delay: 2.5, dur: 3.3 },
              { src: "/balloon-purple.png", x: 46, delay: 0.9, dur: 3.9 },
              { src: "/balloon-blue.png", x: 4, delay: 1.5, dur: 4.1 },
              { src: "/balloon-rainbow.png", x: 38, delay: 2.8, dur: 3.4 },
            ].map((b, i) => (
              <img
                key={i}
                src={b.src}
                alt=""
                className="absolute w-5 h-auto"
                style={{
                  left: `${b.x}px`,
                  bottom: 0,
                  animation: `balloonRise ${b.dur}s ease-out infinite ${b.delay}s`,
                  opacity: 0,
                }}
              />
            ))}
          </span>
        )}

        {/* Center - Navigation Links (desktop) */}
        <div
          className={`
            hidden md:flex items-center justify-center gap-8 flex-1
            transition-all duration-300 ease-in-out
            font-medium text-lg text-black font-title
          `}
        >
          {menuItems.map((item) => (
            <Link
              key={item.shortcut}
              href={item.href}
              className="nav-link"
              onClick={() =>
                posthog.capture("nav_link_clicked", {
                  label: item.label,
                  href: item.href,
                })
              }
            >
              {item.label}
              <span className="keyboard-badge">{item.shortcut}</span>
            </Link>
          ))}
        </div>

        {/* Center on mobile - Logo */}
        <div className="flex-1 flex justify-center md:hidden">
          <Link href="/" className={styles.logo}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="255.273"
                y="480.364"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="416.091"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="351.818"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="319.545"
                y="351.818"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="319.545"
                y="287.545"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="383.818"
                y="287.545"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="383.818"
                y="223.273"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="448.091"
                y="223.273"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="512.364"
                y="287.545"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="512.364"
                y="351.818"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="576.636"
                y="351.818"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="640.909"
                y="351.818"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="640.909"
                y="416.091"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="705.182"
                y="480.364"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="769.455"
                y="544.636"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="769.455"
                y="608.909"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="769.455"
                y="673.182"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="705.182"
                y="737.455"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="640.909"
                y="737.455"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="576.636"
                y="673.182"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="512.364"
                y="673.182"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="512.364"
                y="737.455"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="512.364"
                y="801.727"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="520.747"
                y="480.364"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="191"
                y="544.636"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="480.364"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="191"
                y="544.636"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="544.636"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="191"
                y="608.909"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="608.909"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="191"
                y="673.182"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="191"
                y="737.455"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                x="255.273"
                y="673.182"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
              <rect
                className={styles.horn1}
                x="640.909"
                y="287.545"
                width="64.2727"
                height="64.2727"
                fill="#B307EB"
              />
              <rect
                className={styles.horn2}
                x="705.182"
                y="287.545"
                width="64.2727"
                height="64.2727"
                fill="#3198F1"
              />
              <rect
                className={styles.horn3}
                x="705.182"
                y="223.273"
                width="64.2727"
                height="64.2727"
                fill="#4EF9BD"
              />
              <rect
                className={styles.horn4}
                x="769.455"
                y="159"
                width="64.2727"
                height="64.2727"
                fill="#EE1701"
              />
              <rect
                x="191"
                y="480.364"
                width="64.2727"
                height="64.2727"
                fill="black"
              />
            </svg>
          </Link>
        </div>

        {/* Right spacer on mobile for balance */}
        <div className="w-[48px] md:hidden"></div>

        {/* Right spacer on desktop */}
        <div className="w-[48px] hidden md:block"></div>
      </nav>

      {/* Mobile menu overlay - rendered via portal to escape stacking context */}
      {mounted &&
        toggle &&
        createPortal(
          <div
            className="fixed bg-white md:hidden border border-black"
            style={{
              zIndex: 9999,
              top: "calc(1rem + 105px)",
              left: "2rem",
              right: "2rem",
              bottom: "1rem",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 font-medium text-3xl text-black font-title">
              {menuItems.map((item) => (
                <Link
                  key={item.shortcut}
                  href={item.href}
                  className="hover:opacity-70 transition-opacity"
                  onClick={() => {
                    posthog.capture("nav_link_clicked", {
                      label: item.label,
                      href: item.href,
                      source: "mobile_menu",
                    });
                    setToggle(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
