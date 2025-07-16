import React from 'react'

export default function About() {
  return (
    <div id="about" className="flex flex-col items-center justify-between w-full px-20 pt-20 pb-24 gap-20">
        <div className="w-full font-inter font-medium text-3xl tracking-tighter">about.</div>
        <div className="flex flex-col font-inter font-medium text-5xl tracking-tight w-full gap-8">
            <div>The highest signal community of developers in London</div>
            <div className="flex flex-col gap-6 text-2xl text-gray-700">
                <div>We are highly technical builders who turn ideas into reality.</div>
                <div>We organize hackathons, build companies, and ship products that matter.</div>
            </div>
            <div className="flex flex-row gap-16 mt-8">
                <div className="flex flex-col items-center">
                    <div className="font-mono text-6xl font-bold text-black">40+</div>
                    <div className="text-xl text-gray-600">Hackathon Wins</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-mono text-6xl font-bold text-black">350+</div>
                    <div className="text-xl text-gray-600">Active Members</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-mono text-6xl font-bold text-black">10+</div>
                    <div className="text-xl text-gray-600">Companies Built</div>
                </div>
            </div>
        </div>
    </div>
  )
}
