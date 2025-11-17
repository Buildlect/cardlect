'use client'

import { useState } from 'react'
import { LayoutDashboard, Users, Zap, HardDrive, GitBranch, BarChart3, Settings, Bell, Search, LogOut, Menu, X } from 'lucide-react'

interface LayoutShellProps {
  children: React.ReactNode
  currentPage?: string
}

export function LayoutShell({ children, currentPage = 'Dashboard' }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', id: 'dashboard' },
    { icon: Users, label: 'Schools', href: '/schools', id: 'schools' },
    { icon: Zap, label: 'Features', href: '/features', id: 'features' },
    { icon: HardDrive, label: 'Hardware', href: '/hardware', id: 'hardware' },
    { icon: GitBranch, label: 'Cards', href: '/cards', id: 'cards' },
    { icon: BarChart3, label: 'Logs', href: '/logs', id: 'logs' },
    { icon: GitBranch, label: 'API Keys', href: '/api', id: 'api' },
    { icon: Settings, label: 'Settings', href: '/settings', id: 'settings' },
  ]

  return (
    <div className="flex h-screen bg-background dark">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <span className="text-2xl font-bold text-primary">Cardlect</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-sidebar-accent rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage.toLowerCase() === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            )
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search schools, devices..."
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-secondary rounded-lg transition-all">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
