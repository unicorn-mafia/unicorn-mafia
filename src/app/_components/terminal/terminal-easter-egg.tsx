'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ASCII_ART = `██╗   ██╗███╗   ██╗██╗ ██████╗ ██████╗ ██████╗ ███╗   ██╗    ███╗   ███╗ █████╗ ███████╗██╗ █████╗
██║   ██║████╗  ██║██║██╔════╝██╔═══██╗██╔══██╗████╗  ██║    ████╗ ████║██╔══██╗██╔════╝██║██╔══██╗
██║   ██║██╔██╗ ██║██║██║     ██║   ██║██████╔╝██╔██╗ ██║    ██╔████╔██║███████║█████╗  ██║███████║
██║   ██║██║╚██╗██║██║██║     ██║   ██║██╔══██╗██║╚██╗██║    ██║╚██╔╝██║██╔══██║██╔══╝  ██║██╔══██║
╚██████╔╝██║ ╚████║██║╚██████╗╚██████╔╝██║  ██║██║ ╚████║    ██║ ╚═╝ ██║██║  ██║██║     ██║██║  ██║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝`

type HistoryItem = {
  command: string
  output: string
}

const routes: Record<string, { path: string; description: string }> = {
  hackathons: { path: '/hackathons', description: 'hackathon wins by mafia members' },
  companies: { path: '/companies', description: 'companies built by the community' },
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
  clear        - clear terminal
  exit         - close terminal`,
  whoami: `a builder, obviously`,
  neofetch: `_______\\)%%%%%%%%._              unicorn-mafia@london
\`''''-'-;   % % % % %'-._         ----------------------
        :b) \\            '-.      OS: big tony
        : :__)'    .'    .'       Host: halkin
        :.::/  '.'   .'           Kernel: pure energy
        o_i/   :    ;             Uptime: since apr 2025
               :   .'             Shell: good times
                ''\`              Members: 850`,
  sudo: `permission denied: nice try tho`,
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
  const [showAscii, setShowAscii] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const getCurrentDir = () => {
    if (pathname === '/') return '~'
    if (pathname === '/hackathons') return '~/hackathons'
    if (pathname === '/companies') return '~/companies'
    if (pathname.startsWith('/d')) return '~/demos'
    return '~' + pathname
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false)
          setBuffer('')
          setHistory([])
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
      setShowAscii(true)
      return
    }

    if (command === 'exit') {
      setIsOpen(false)
      setBuffer('')
      setHistory([])
      setShowAscii(true)
      return
    }

    setShowAscii(false)
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
      handleCommand(input)
      setInput('')
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
          className="p-4 font-mono text-sm max-h-[60vh] overflow-y-auto"
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
              <pre className="text-neutral-300 whitespace-pre-wrap mt-1">{item.output}</pre>
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
