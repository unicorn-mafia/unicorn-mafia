import React from 'react'

export default function Affiliations() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-between w-full px-12 py-26 gap-18">
        <div className="text-5xl font-title font-bold tracking-tighter text-black">Trusted by</div>
        <div className="flex flex-row items-center justify-center w-full gap-12 text-3xl font-title font-bold tracking-tighter text-gray-400">
          <div>Logo 1</div>
          <div>Logo 2</div>
          <div>Logo 3</div>
          <div>Logo 4</div>
        </div>
      </div>
    </div>
  )
}
