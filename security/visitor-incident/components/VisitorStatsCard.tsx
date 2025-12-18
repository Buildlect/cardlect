import { ReactNode } from 'react'

interface VisitorStatsCardProps {
  title: string
  value: number
  icon: ReactNode
  trend: string
  trendUp?: boolean
  urgent?: boolean
}

export function VisitorStatsCard({ title, value, icon, trend, trendUp, urgent }: VisitorStatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-foreground">{value}</h3>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          {icon}
        </div>
      </div>
      <p className={`text-sm ${urgent ? 'text-red-500' : trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
        {trend}
      </p>
    </div>
  )
}