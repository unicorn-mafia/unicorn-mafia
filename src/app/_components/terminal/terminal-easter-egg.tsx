'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ASCII_ART = `██╗   ██╗███╗   ██╗██╗ ██████╗ ██████╗ ██████╗ ███╗   ██╗    ███╗   ███╗ █████╗ ███████╗██╗ █████╗
██║   ██║████╗  ██║██║██╔════╝██╔═══██╗██╔══██╗████╗  ██║    ████╗ ████║██╔══██╗██╔════╝██║██╔══██╗
██║   ██║██╔██╗ ██║██║██║     ██║   ██║██████╔╝██╔██╗ ██║    ██╔████╔██║███████║█████╗  ██║███████║
██║   ██║██║╚██╗██║██║██║     ██║   ██║██╔══██╗██║╚██╗██║    ██║╚██╔╝██║██╔══██║██╔══╝  ██║██╔══██║
╚██████╔╝██║ ╚████║██║╚██████╗╚██████╔╝██║  ██║██║ ╚████║    ██║ ╚═╝ ██║██║  ██║██║     ██║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝`

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const START_YEAR = 2025
const START_MONTH = 2 // index into MONTHS (mar = 2)
const LINKEDIN_BLUE = '#0A66C2'
const LINKEDIN_LIGHT = '#70B5F9'

function generateLinkedInUrl(year: number, monthIndex: number): string {
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Community Member',
    issueYear: year.toString(),
    issueMonth: (monthIndex + 1).toString(),
    certUrl: 'https://www.unicornmafia.ai',
    organizationId: '108478332',
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

function LinkedInOutput({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'typing' | 'pick-year' | 'pick-month' | 'launching' | 'done'>('typing')
  const [typedText, setTypedText] = useState('')
  const [monthIdx, setMonthIdx] = useState(START_MONTH)
  const [year, setYear] = useState(START_YEAR)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentYear = new Date().getFullYear()

  const fullText = 'adding unicorn mafia to your linkedin...'

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return
    if (typedText.length < fullText.length) {
      const t = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 25)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setPhase('pick-year'), 400)
    return () => clearTimeout(t)
  }, [phase, typedText])

  // Keyboard handler for picking
  useEffect(() => {
    if (phase !== 'pick-year' && phase !== 'pick-month') return

    const handler = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (phase === 'pick-year') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          setYear(prev => prev > START_YEAR ? prev - 1 : prev)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          setYear(prev => prev < currentYear ? prev + 1 : prev)
        } else if (e.key === 'Enter') {
          // Clamp month when entering month picker if year is start year
          setMonthIdx(prev => year === START_YEAR && prev < START_MONTH ? START_MONTH : prev)
          setPhase('pick-month')
        }
      } else if (phase === 'pick-month') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          setMonthIdx(prev => {
            const min = year === START_YEAR ? START_MONTH : 0
            return prev > min ? prev - 1 : prev
          })
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          setMonthIdx(prev => prev < 11 ? prev + 1 : prev)
        } else if (e.key === 'Enter') {
          setPhase('launching')
        }
      }
    }

    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [phase, year, currentYear])

  // Launch LinkedIn after selection
  useEffect(() => {
    if (phase !== 'launching') return
    const t = setTimeout(() => {
      window.open(generateLinkedInUrl(year, monthIdx), '_blank')
      setPhase('done')
      onComplete()
    }, 600)
    return () => clearTimeout(t)
  }, [phase, year, monthIdx, onComplete])

  // Scroll into view
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [phase, monthIdx, year])

  const availableMonths = year === START_YEAR ? MONTHS.slice(START_MONTH) : MONTHS

  return (
    <div ref={containerRef}>
      {/* Typing phase */}
      <span style={{ color: LINKEDIN_BLUE }}>{typedText}</span>
      {phase === 'typing' && <span className="animate-pulse" style={{ color: LINKEDIN_BLUE }}>_</span>}

      {/* Year picker */}
      {(phase === 'pick-year' || phase === 'pick-month' || phase === 'launching' || phase === 'done') && (
        <div className="mt-3">
          <span className="text-neutral-400">when did you join?</span>{'\n'}
          {'\n'}
          <span className="text-neutral-500">  year </span>
          {phase === 'pick-year' && <span className="text-neutral-600">[arrow keys to select, enter to confirm]</span>}
          {'\n'}
          <div className="flex gap-1 mt-1 ml-2">
            {Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => START_YEAR + i).map((y) => (
              <span
                key={y}
                className="inline-block px-2 py-0.5 text-xs transition-all duration-150"
                style={
                  y === year
                    ? { backgroundColor: LINKEDIN_BLUE, color: '#fff' }
                    : phase !== 'pick-year'
                      ? { color: '#525252' }
                      : { color: '#737373' }
                }
              >
                {y}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Month picker */}
      {(phase === 'pick-month' || phase === 'launching' || phase === 'done') && (
        <div className="mt-3">
          <span className="text-neutral-500">  month </span>
          {phase === 'pick-month' && <span className="text-neutral-600">[arrow keys to select, enter to confirm]</span>}
          {'\n'}
          <div className="flex flex-wrap gap-1 mt-1 ml-2">
            {availableMonths.map((m) => {
              const actualIdx = MONTHS.indexOf(m)
              const isSelected = actualIdx === monthIdx
              const isPast = phase !== 'pick-month'
              return (
                <span
                  key={m}
                  className="inline-block px-2 py-0.5 text-xs transition-all duration-150"
                  style={
                    isSelected
                      ? { backgroundColor: LINKEDIN_BLUE, color: '#fff' }
                      : isPast
                        ? { color: '#525252' }
                        : { color: '#737373' }
                  }
                >
                  {m}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Launching */}
      {(phase === 'launching' || phase === 'done') && (
        <div className="mt-3">
          <span style={{ color: LINKEDIN_LIGHT }}>
            opening linkedin — {MONTHS[monthIdx]} {year}
          </span>
          {phase === 'launching' && <span className="animate-pulse" style={{ color: LINKEDIN_LIGHT }}>...</span>}
          {phase === 'done' && (
            <>
              {'\n'}
              <span className="text-neutral-500">done. complete the badge on linkedin.</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

type HistoryItem = {
  command: string
  output: string
}

const routes: Record<string, { path: string; description: string }> = {
  hackathons: { path: '/h', description: 'hackathon wins by mafia members' },
  companies: { path: '/c', description: 'companies built by the community' },
  demos: { path: '/d', description: 'demo nights & demo days' },
  contact: { path: '/#contact', description: 'get in touch' },
  home: { path: '/', description: 'main page' },
}

const staticCommands: Record<string, string> = {
  help: `available commands:
  ls           - list available pages
  cd <page>    - navigate to page
  cat <page>   - info about page
  pwd          - current location
  whoami       - who are you?
  neofetch     - system info
  linkedin     - add badge to your LinkedIn
  certification- alias for linkedin
  flex         - add your own easter egg
  clear        - clear terminal
  exit         - close terminal`,
  whoami: `a builder, obviously`,
  neofetch: `[NEOFETCH]`,
  linkedin: `[LINKEDIN]`,
  certification: `[LINKEDIN]`,
  flex: `want your own easter egg? submit a PR:
github.com/unicorn-mafia/unicorn-mafia

add yourself to staticCommands in:
src/app/_components/terminal/terminal-easter-egg.tsx

example: charlie → 🧀🕺`,
  charlie: `🧀🕺`,
  hack: `nice try 😏

but fr tho, cd hackathons to see our wins`,
}

export default function TerminalEasterEgg() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [buffer, setBuffer] = useState('')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showAscii, setShowAscii] = useState(true)
  const [linkedInActive, setLinkedInActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const getCurrentDir = () => {
    if (pathname === '/') return '~'
    if (pathname === '/h') return '~/hackathons'
    if (pathname === '/c') return '~/companies'
    if (pathname.startsWith('/d')) return '~/demos'
    return '~' + pathname
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K toggles terminal from anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) {
          setIsOpen(false)
          setBuffer('')
          setHistory([])
          setCommandHistory([])
          setHistoryIndex(-1)
          setShowAscii(true)
          setInput('')
        } else {
          setIsOpen(true)
          setBuffer('')
        }
        return
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false)
          setBuffer('')
          setHistory([])
          setCommandHistory([])
          setHistoryIndex(-1)
          setShowAscii(true)
          setInput('')
        }
        return
      }

      const target = e.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return
      }

      const key = e.key.toLowerCase()
      if (key.length === 1 && /[a-z]/.test(key)) {
        const newBuffer = (buffer + key).slice(-4)
        setBuffer(newBuffer)

        if (newBuffer === 'code') {
          e.preventDefault()
          // Navigate to home first since 'd' in 'code' triggers demos page
          router.push('/')
          setIsOpen(true)
          setBuffer('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [buffer, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to prevent the triggering 'e' from being typed
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(/\s+/)
    const command = parts[0]
    const arg = parts.slice(1).join(' ')

    if (command === 'clear') {
      setHistory([])
      setShowAscii(false)
      return
    }

    if (command === 'exit') {
      setIsOpen(false)
      setBuffer('')
      setHistory([])
      setCommandHistory([])
      setHistoryIndex(-1)
      setShowAscii(true)
      return
    }

    let output = ''

    // Handle commands
    if (command === 'ls') {
      output = Object.entries(routes)
        .map(([name, info]) => `${name.padEnd(12)} ${info.description}`)
        .join('\n')
    } else if (command === 'cd') {
      if (!arg || arg === '~' || arg === '/') {
        router.push('/')
        output = 'navigating to home...'
        setTimeout(() => setIsOpen(false), 500)
      } else if (arg === '..') {
        router.back()
        output = 'going back...'
        setTimeout(() => setIsOpen(false), 500)
      } else {
        const route = routes[arg.replace('/', '')]
        if (route) {
          router.push(route.path)
          output = `navigating to ${arg}...`
          setTimeout(() => setIsOpen(false), 500)
        } else {
          output = `cd: no such directory: ${arg}\navailable: ${Object.keys(routes).join(', ')}`
        }
      }
    } else if (command === 'cat') {
      if (!arg) {
        output = 'usage: cat <page>'
      } else {
        const route = routes[arg.replace('/', '')]
        if (route) {
          output = `${arg}\n${'─'.repeat(arg.length)}\n${route.description}\npath: ${route.path}`
        } else {
          output = `cat: ${arg}: no such file or directory`
        }
      }
    } else if (command === 'pwd') {
      output = getCurrentDir()
    } else if (command === 'open') {
      if (!arg) {
        output = 'usage: open <page>'
      } else {
        const route = routes[arg.replace('/', '')]
        if (route) {
          router.push(route.path)
          output = `opening ${arg}...`
          setTimeout(() => setIsOpen(false), 500)
        } else {
          output = `open: ${arg}: not found`
        }
      }
    } else if (staticCommands[command]) {
      output = staticCommands[command]
    } else {
      output = `command not found: ${command}. type 'help' for commands.`
    }

    if (output === '[LINKEDIN]') {
      setLinkedInActive(true)
    }
    setHistory([...history, { command: cmd, output }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setCommandHistory(prev => [...prev, input])
      setHistoryIndex(-1)
      handleCommand(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const newIndex = historyIndex + 1
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-black border border-neutral-700 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border-b border-neutral-700">
          <div className="flex gap-1.5">
            <div
              className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400"
              onClick={() => setIsOpen(false)}
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-neutral-500 text-xs font-mono ml-2">unicorn-mafia:{getCurrentDir()}</span>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="p-4 font-mono text-sm h-[400px] overflow-y-auto"
        >
          {showAscii && (
            <>
              <pre className="text-white whitespace-pre overflow-x-auto text-[5px] sm:text-[7px] md:text-[9px] leading-tight mb-4">{ASCII_ART}</pre>
              <div className="text-green-400 mb-4">
                so u wanna code?
              </div>
            </>
          )}

          {/* Command history */}
          {history.map((item, i) => (
            <div key={i} className="mb-3">
              <div className="text-green-400">
                <span className="text-neutral-500">{getCurrentDir()} $</span> {item.command}
              </div>
              <div className="text-neutral-300 whitespace-pre-wrap mt-1 font-mono">
                {item.output === '[NEOFETCH]' ? (
                  <div>
                    <span style={{ color: '#EE1701' }}>__</span><span style={{ color: '#4EF9BD' }}>__</span><span style={{ color: '#3198F1' }}>__</span><span style={{ color: '#B307EB' }}>_</span><span>\)%%%%%%%%._              unicorn-mafia@london</span>{'\n'}
                    <span>`&apos;&apos;&apos;&apos;-&apos;-;   % % % % %&apos;-._         ----------------------</span>{'\n'}
                    <span>        :b) \            &apos;-.      OS: big tony</span>{'\n'}
                    <span>        : :__)&apos;    .&apos;    .&apos;       Host: halkin</span>{'\n'}
                    <span>        :.::/  &apos;.&apos;   .&apos;           Kernel: pure energy</span>{'\n'}
                    <span>        o_i/   :    ;             Uptime: since 18 mar 2025</span>{'\n'}
                    <span>               :   .&apos;             Shell: good times</span>{'\n'}
                    <span>                &apos;&apos;`               Members: 850</span>{'\n'}
                    {'\n'}
                    <span>                                  </span>
                    <span className="inline-flex gap-0">
                      <span className="inline-block w-6 h-3" style={{ backgroundColor: '#B307EB' }}></span>
                      <span className="inline-block w-6 h-3" style={{ backgroundColor: '#3198F1' }}></span>
                      <span className="inline-block w-6 h-3" style={{ backgroundColor: '#4EF9BD' }}></span>
                      <span className="inline-block w-6 h-3" style={{ backgroundColor: '#EE1701' }}></span>
                    </span>
                  </div>
                ) : item.output === '[LINKEDIN]' ? (
                  <LinkedInOutput onComplete={() => {
                    setLinkedInActive(false)
                    setTimeout(() => inputRef.current?.focus(), 100)
                  }} />
                ) : (
                  <pre>{item.output}</pre>
                )}
              </div>
            </div>
          ))}

          {/* Input line */}
          {!linkedInActive && (
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-neutral-500 mr-2">{getCurrentDir()} $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none font-mono"
              spellCheck={false}
              autoComplete="off"
            />
            <span className="text-green-400 animate-pulse">▌</span>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
