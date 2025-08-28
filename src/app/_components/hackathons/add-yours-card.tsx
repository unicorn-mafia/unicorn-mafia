"use client";

import React from "react";
import Link from "next/link";

export function AddYoursCard() {
  return (
    <Link
      href="https://github.com/unicorn-mafia/unicorn-mafia"
      target="_blank"
      rel="noopener noreferrer"
      className="block aspect-square border border-neutral-600 bg-white hover:bg-neutral-100 transition-colors group"
    >
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="w-10 h-10 mb-2 rounded-full border border-neutral-600 flex items-center justify-center bg-neutral-50">
          <span className="text-xl leading-none">+</span>
        </div>
        <div className="px-2">
          <h3 className="text-[11px] font-source font-medium text-neutral-900 tracking-wide leading-tight">
            ADD YOUR HACKATHON WIN
          </h3>
          <p className="mt-1 text-[9px] text-neutral-700 leading-snug">
            Contribute via GitHub
          </p>
        </div>
      </div>
    </Link>
  );
}

