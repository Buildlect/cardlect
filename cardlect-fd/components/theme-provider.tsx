'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = (localStorage.getItem('theme') as Theme) || 'dark'
    setThemeState(stored)
    applyTheme(stored)
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    let shouldBeDark = newTheme === 'dark'

    if (newTheme === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    html.classList.toggle('dark', shouldBeDark)
    setIsDark(shouldBeDark)
  }

  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
    }
  }

  // Prevent rendering children until mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
