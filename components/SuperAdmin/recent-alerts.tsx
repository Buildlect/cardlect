'use client'

import { useState } from 'react'
import { AlertTriangle, Cpu, RefreshCw } from 'lucide-react'

export function RecentAlerts() {
  const [alerts] = useState([
    {
      text: 'Hardware offline',
      icon: Cpu,
      color: '#d96126',
      bg: '#1a1a1a',
    },
    {
      text: 'High fraud rate',
      icon: AlertTriangle,
      color: '#d96126',
      bg: '#262626',
    },
    {
      text: 'System update',
      icon: RefreshCw,
      color: '#d96126',
      bg: '#1a1a1a',
    },
  ])

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">
        Recent Alerts
      </h3>

      <div className="space-y-4">
        {alerts.map((a, i) => {
          const Icon = a.icon
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group"
            >
              {/* Alert Icon */}
              <div
                className="p-3  bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative"
    
              >
                <Icon size={20} color={a.color} />

                {/* Pulse dot */}
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"
                />
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
                />
              </div>

              {/* Text */}
              <span className="text-sm text-foreground font-medium tracking-tight">
                {a.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
