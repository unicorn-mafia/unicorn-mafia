'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ASCII_ART = `██╗   ██╗███╗   ██╗██╗ ██████╗ ██████╗ ██████╗ ███╗   ██╗    ███╗   ███╗ █████╗ ███████╗██╗ █████╗
██║   ██║████╗  ██║██║██╔════╝██╔═══██╗██╔══██╗████╗  ██║    ████╗ ████║██╔══██╗██╔════╝██║██╔══██╗
██║   ██║██╔██╗ ██║██║██║     ██║   ██║██████╔╝██╔██╗ ██║    ██╔████╔██║███████║█████╗  ██║███████║
██║   ██║██║╚██╗██║██║██║     ██║   ██║██╔══██╗██║╚██╗██║    ██║╚██╔╝██║██╔══██║██╔══╝  ██║██╔══██║
╚██████╔╝██║ ╚████║██║╚██████╗╚██████╔╝██║  ██║██║ ╚████║    ██║ ╚═╝ ██║██║  ██║██║     ██║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝`

/**
 * Generate LinkedIn Add to Profile URL for community membership badge
 */
function generateLinkedInUrl(): string {
  const now = new Date()
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: 'Community Member',
    issueYear: now.getFullYear().toString(),
    issueMonth: (now.getMonth() + 1).toString(),
    certUrl: 'https://unicrnmafia.com',
    organizationId: '108478332', // Unicorn Mafia LinkedIn company ID
  })
  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

function LinkedInOutput() {
  useEffect(() => {
    // Small delay before opening to let the user see the message
    const timer = setTimeout(() => {
      window.open(generateLinkedInUrl(), '_blank')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <span className="text-[#0A66C2]">🦄 adding unicorn mafia badge to linkedin...</span>{'\n'}
      {'\n'}
      <span className="text-neutral-400">opening linkedin in new tab...</span>{'\n'}
      <span className="text-neutral-400">select your join date on linkedin to complete.</span>{'\n'}
      {'\n'}
      <span className="text-neutral-500">tip: use current month or when you actually joined</span>
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
                    <span>        o_i/   :    ;             Uptime: since apr 2025</span>{'\n'}
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
                  <LinkedInOutput />
                ) : (
                  <pre>{item.output}</pre>
                )}
              </div>
            </div>
          ))}

          {/* Input line */}
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
        </div>
      </div>
    </div>
  )
}
