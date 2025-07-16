import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="h-screen w-full flex flex-col justify-between px-6 md:px-12 lg:px-20 py-8 md:py-12 border-b border-gray-200">
      {/* Main hero content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.85] font-semibold font-inter tracking-tighter text-black text-center lg:text-left">
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/hero.avif"
            alt="unicorn mafia hero image"
            width={841}
            height={686}
            className="w-full max-w-[400px] lg:max-w-[500px] h-auto object-cover"
            priority
          />
        </div>
      </div>
      
      {/* Footer content */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-8">
        <div className="font-inter font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tighter text-black">
          mafia@unicrnmafia.com
        </div>
        <div className="font-mono font-normal text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-black sm:text-right">
          // 350+ hackers. One mission: build the next unicorn.
        </div>
      </div>
    </section>
  );
}