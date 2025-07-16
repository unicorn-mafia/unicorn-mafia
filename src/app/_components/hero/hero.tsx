import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-between w-full h-full px-20 pt-12 pb-24 border-b-2 border-gray-100">
      <div className="flex flex-row items-center justify-between w-full bg">
        <div className="text-10xl leading-none font-semibold font-inter tracking-tightest text-black">
          <div>LONDON&apos;S</div>
          <div>UNICORN</div>
          <div>MAFIA</div>
        </div>
        <div className="flex h-full justify-end items-start">
          <Image
            src="/hero.avif"
            alt="London unicorn mafia hero image"
            width={841}
            height={686}
            className="block w-4/5 rounded-inherit object-center object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full text-3xl">
        <div className=" font-inter font-medium tracking-tighter text-black">hello@unicrnmafia.com</div>
        <div className="flex flex-col font-source font-normal tracking-tighter pl-12 text-black gap-4 text-justify">
          <div>community.members = 350+</div>
          <div>console.log(&quot;London&apos;s smartest minds, building the future.&quot;)</div>
        </div>
      </div>
    </div>
  );
}
