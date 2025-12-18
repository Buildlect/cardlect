import React from 'react'

type Props = {
  title: string
  value: string | number
  icon?: React.ReactNode
  accentColor?: string
}

export function StatsCard({ title, value, icon, accentColor = 'bg-primary' }: Props) {
  return (
    <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>

        <div className={`p-3 rounded-xl text-white ${accentColor}`}>
          {icon ?? <svg className="w-6 h-6" />}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
