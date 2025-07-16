import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-col w-full px-6 md:px-12 lg:px-20 pt-8 md:pt-12 pb-16 md:pb-24 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-8 lg:gap-10">
        <div className="flex flex-col gap-0 flex-1">
          <h1 className="text-[48px] sm:text-[60px] md:text-[80px] lg:text-[100px] xl:text-[120px] leading-[0.85] font-semibold font-inter tracking-tighter text-black">
            <div>UNICORN</div>
            <div>MAFIA</div>
          </h1>
        </div>
        <div className="flex justify-center lg:justify-end items-start w-full lg:w-auto mt-4 lg:mt-0">
          <Image
            src="/hero.avif"
            alt="unicorn mafia hero image"
            width={841}
            height={686}
            className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-full max-w-[300px] lg:max-w-[334px] h-auto object-cover"
            priority
          />
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 w-full mt-10 md:mt-16">
        <div className="font-inter font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-tighter text-black">
          mafia@unicrnmafia.com
        </div>
        <div className="font-mono font-normal text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-black md:text-justify">
          <div>// 350+ hackers. One mission: build the next unicorn.</div>
        </div>
      </div>
    </div>
  );
}
