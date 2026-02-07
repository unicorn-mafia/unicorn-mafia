'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const ORGANIZATION = {
  name: 'Unicorn Mafia',
  website: 'https://www.unicornmafia.ai',
  email: 'stable@unicornmafia.ai',
  linkedInCompanyId: '108478332',
}

function generateLinkedInUrl(year: number, month: number): string {
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Community Member',
    issueYear: year.toString(),
    issueMonth: month.toString(),
    certUrl: ORGANIZATION.website,
    organizationId: ORGANIZATION.linkedInCompanyId,
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

const ANNOUNCEMENT_POST = `joined ${ORGANIZATION.name} — the highest signal developer community in the UK.

we remove every excuse not to build. tools, knowledge, connections — whatever you need to go from idea to shipped, it's here. no fluff, just builders helping builders move faster.

500+ devs, 500+ hackathon wins, 30+ companies in the works.

${ORGANIZATION.website}`

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="text-xs font-body border border-black/20 px-2.5 py-1 hover:bg-black hover:text-white transition-colors"
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

export default function LinkedInBadgePage() {
  const START_YEAR = 2025
  const START_MONTH = 3

  const [joinYear, setJoinYear] = useState(START_YEAR)
  const [joinMonth, setJoinMonth] = useState(START_MONTH)
  const [linkedInUrl, setLinkedInUrl] = useState('')

  useEffect(() => {
    if (joinYear === START_YEAR && joinMonth < START_MONTH) {
      setJoinMonth(START_MONTH)
    }
    setLinkedInUrl(generateLinkedInUrl(joinYear, joinMonth))
  }, [joinYear, joinMonth])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => currentYear - i)
  const allMonths = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  ]
  const firstMonthIndex = joinYear === START_YEAR ? START_MONTH - 1 : 0

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">

        {/* header */}
        <div className="mb-10">
          <h1 className="text-2xl font-medium font-title tracking-tight mb-2">
            linkedin badge
          </h1>
          <p className="text-neutral-500 text-sm font-body">
            add unicorn mafia to your profile
          </p>
        </div>

        {/* add to linkedin */}
        <div className="border-t border-black/10 pt-8 mb-10">
          <p className="text-neutral-500 text-sm mb-6">when did you join?</p>

          <div className="flex items-center gap-3 mb-8">
            <select
              value={joinMonth}
              onChange={(e) => setJoinMonth(parseInt(e.target.value))}
              className="font-body text-sm bg-white border border-black/20 px-3 py-2 appearance-none cursor-pointer hover:border-black transition-colors"
            >
              {allMonths.map((month, idx) => (
                idx >= firstMonthIndex && (
                  <option key={month} value={idx + 1}>
                    {month}
                  </option>
                )
              ))}
            </select>
            <select
              value={joinYear}
              onChange={(e) => setJoinYear(parseInt(e.target.value))}
              className="font-body text-sm bg-white border border-black/20 px-3 py-2 appearance-none cursor-pointer hover:border-black transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-body text-sm bg-black text-white px-5 py-3 hover:opacity-80 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            add to linkedin
          </a>
        </div>

        {/* announcement post */}
        <div className="border-t border-black/10 pt-8 mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-neutral-500 text-sm">announcement post</p>
            <CopyButton text={ANNOUNCEMENT_POST} />
          </div>

          <pre className="whitespace-pre-wrap text-sm font-body leading-relaxed text-black/80">
            {ANNOUNCEMENT_POST}
          </pre>
        </div>

        {/* download logo */}
        <div className="border-t border-black/10 pt-8 mb-10">
          <p className="text-neutral-500 text-sm mb-6">download logo</p>

          <div className="flex gap-4">
            <a
              href="/brand/um-black.svg"
              download="unicorn-mafia-logo-black.svg"
              className="flex items-center gap-3 font-body text-sm border border-black/20 px-4 py-3 hover:border-black transition-colors"
            >
              <Image
                src="/brand/um-black.svg"
                alt="Black Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              black
            </a>
            <a
              href="/brand/um-white.svg"
              download="unicorn-mafia-logo-white.svg"
              className="flex items-center gap-3 font-body text-sm bg-black text-white px-4 py-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/brand/um-white.svg"
                alt="White Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              white
            </a>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-black/10 pt-8">
          <p className="text-neutral-500 text-sm font-body">
            questions?{' '}
            <a
              href={`mailto:${ORGANIZATION.email}`}
              className="text-black hover:underline"
            >
              {ORGANIZATION.email}
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
