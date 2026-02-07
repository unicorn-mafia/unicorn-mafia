'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          tweetId: string,
          container: HTMLElement,
          options?: Record<string, string>
        ) => Promise<HTMLElement | undefined>
      }
    }
  }
}

export default function Chapter1() {
  const demos = [
    { name: "peter", x: "steipete", project: "openclaw", tweetId: "2015154809263853680" },
    { name: "lewis", x: "lewis_b_metcalf", project: "ampcode", tweetId: "2016246283720159606" },
    { name: "louis", x: "tokengobbler", project: "review.fast", tweetId: "2015538386895765806" },
    { name: "matt", x: "mattzcarey", project: "model context problem (mcp)", tweetId: "2015916242226344444" },
    { name: "charlie", x: "charlielidbury", project: "agentica", tweetId: "2016636969795584220" },
    { name: "ben", x: "benclarkeio", project: "a2anet", tweetId: "2017021908529614880" },
  ]

  const [failedEmbeds, setFailedEmbeds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true

    script.onload = () => {
      if (!window.twttr?.widgets) return

      demos.forEach((demo) => {
        if (!demo.tweetId) return
        const container = document.getElementById(`tweet-${demo.tweetId}`)
        if (!container) return
        window.twttr!.widgets.createTweet(demo.tweetId, container).catch(() => {})
      })

      // Twitter renders a tiny ~76px iframe for "Not found" errors
      // vs 400px+ for successful embeds. Check after embeds have loaded.
      setTimeout(() => {
        const failed = new Set<string>()
        demos.forEach((demo) => {
          if (!demo.tweetId) return
          const container = document.getElementById(`tweet-${demo.tweetId}`)
          if (!container) return
          const wrapper = container.querySelector('.twitter-tweet-rendered')
          if (!wrapper || (wrapper as HTMLElement).offsetHeight < 100) {
            if (wrapper) wrapper.remove()
            failed.add(demo.tweetId)
          }
        })
        if (failed.size > 0) setFailedEmbeds(failed)
      }, 5000)
    }

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <div id={`tweet-${demo.tweetId}`} />
                    {failedEmbeds.has(demo.tweetId) && (
                      <a
                        href={`https://x.com/${demo.x}/status/${demo.tweetId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors font-body border border-black/10 rounded-md px-3 py-2"
                      >
                        View demo on X
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
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
