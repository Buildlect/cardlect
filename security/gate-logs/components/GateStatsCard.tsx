interface GateStatsCardProps {
  title: string
  value: string | number
  trend: string
  trendUp: boolean
  isAlert?: boolean
}

export function GateStatsCard({ title, value, trend, trendUp, isAlert = false }: GateStatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-4xl font-bold text-foreground mb-2">{value}</h3>
      <p className={`text-sm ${isAlert ? 'text-red-500' : trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </p>
    </div>
  )
}