'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface MenuItem {
  label: string
  href: string
  shortcut: string
}

export const menuItems: MenuItem[] = [
  { label: 'Hackathons', href: '/h', shortcut: 'H' },
  { label: 'Companies', href: '/c', shortcut: 'C' },
  { label: 'Demos', href: '/d', shortcut: 'D' },
]

export function useKeyboardNav() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return
      }

      // Ignore if any modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return
      }

      const key = e.key.toUpperCase()

      // B to go back (but not on home page - would leave the site)
      if (key === 'B' && window.location.pathname !== '/') {
        e.preventDefault()
        router.back()
        return
      }

      const item = menuItems.find((m) => m.shortcut === key)

      if (item) {
        e.preventDefault()
        // Handle hash links for same-page scrolling
        if (item.href.startsWith('/#')) {
          const hash = item.href.slice(1) // Remove leading /
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
          window.history.pushState(null, '', item.href)
        } else {
          router.push(item.href)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
