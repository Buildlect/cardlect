import { ReactNode } from 'react'

interface AlertStatsCardProps {
  title: string
  value: number
  icon: ReactNode
  trend: string
  trendUp: boolean
  borderColor: string
}

export function AlertStatsCard({ title, value, icon, trend, trendUp, borderColor }: AlertStatsCardProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 relative overflow-hidden ${borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs">
        {trendUp && <span className="text-red-500">↗</span>}
        <span className={trendUp ? 'text-red-500' : 'text-muted-foreground'}>{trend}</span>
      </div>
    </div>
  )
}