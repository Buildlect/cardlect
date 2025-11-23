'use client'

import { Bell, Search } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  sidebarOpen: boolean
}

export function Header({ sidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search schools, devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-all">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="w-10 h-10 bg-forground rounded-full flex items-center justify-center text-primary-foreground font-bold cursor-pointer hover:bg-primary/90 transition-all">
            SA
          </div>
        </div>
      </div>
    </header>
  )
}
