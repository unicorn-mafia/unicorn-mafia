'use client'

import { useEffect } from 'react'

export default function Chapter1() {
  const demos = [
    { name: "peter", x: "steipete", project: "clawdbot", tweetId: "2015154809263853680" },
    { name: "lewis", x: "lewis_b_metcalf", project: "ampcode", tweetId: "2016246283720159606" },
    { name: "louis", x: "tokengobbler", project: "review.fast", tweetId: "2015538386895765806" },
    { name: "matt", x: "mattzcarey", project: "model context problem (mcp)", tweetId: "2015916242226344444" },
    { name: "charlie", x: "charlielidbury", project: "agentica", tweetId: "2016636969795584220" },
    { name: "ben", x: "benclarkeio", project: "a2anet" },
  ]

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-medium font-title tracking-tight mb-2">
            chapter 1
          </h1>
          <p className="text-neutral-500 text-sm font-body">jan 2025</p>
        </div>

        <div className="border-t border-black/10 pt-8">
          <p className="text-neutral-500 text-sm mb-6">demos</p>

          <div className="space-y-6">
            {demos.map((demo) => (
              <div key={demo.name}>
                <div className="flex items-baseline gap-2">
                  <a
                    href={`https://x.com/${demo.x}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-body text-black hover:underline"
                  >
                    {demo.name}
                  </a>
                  <span className="text-neutral-500 text-sm">— {demo.project}</span>
                </div>
                {demo.tweetId && (
                  <div className="mt-3">
                    <blockquote className="twitter-tweet" data-media-max-width="560">
                      <a href={`https://x.com/i/status/${demo.tweetId}`}></a>
                    </blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
