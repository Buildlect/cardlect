"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggleMobile() {
  const { isDark, setTheme } = useTheme()

  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-secondary rounded-lg transition-all"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
