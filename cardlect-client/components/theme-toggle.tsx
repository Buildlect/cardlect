'use client'

import { Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 ring-1 ring-input">
      <button
      onClick={() => setTheme('light')}
      className={`p-2 rounded transition-all ${
        theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
      title="Light mode"
      >
      <Sun size={18} />
      </button>
      <button
      onClick={() => setTheme('dark')}
      className={`p-2 rounded transition-all ${
        theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
      title="Dark mode"
      >
      <Moon size={18} />
      </button>
      <button
      onClick={() => setTheme('auto')}
      className={`p-2 rounded transition-all ${
        theme === 'auto' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
      title="Auto mode"
      >
      <Globe size={18} />
      </button>
    </div>
  )
}
