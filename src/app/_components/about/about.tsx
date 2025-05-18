import React from 'react'

export default function About() {
  return (
    <div className="flex flex-col items-center justify-between w-full px-20 pt-20 pb-24 gap-20">
        <div className="w-full font-inter font-medium text-3xl tracking-tighter">about.</div>
        <div className="flex flex-col font-inter font-medium text-5xl tracking-tight space-x-10 w-full">
            <div>// 150+ hackers. One mission:</div>
            <div>build the next unicorn.</div>
        </div>
        <div className="w-full font-inter font-medium text-xl tracking-tighter text-center">We are a community of motivated hackers (insert some very important text here later)</div>
    </div>
  )
}
