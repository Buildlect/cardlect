import React from 'react'
import {
  Users,
  Home,
  BookOpen,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export function MetricsGrid() {
  const metrics = [
    {
      label: 'Total Schools',
      value: 24,
      change: '+2',
      icon: Home,
      color: '#d96126',
      data: [2, 3, 4, 5, 6, 7, 8],
      tooltip: 'The total number of schools registered in the system.',
    },
    {
      label: 'Active Schools',
      value: 22,
      change: '+0',
      icon: Users,
      color: '#d96126',
      data: [8, 7, 7, 8, 8, 9, 9],
      tooltip: 'Number of schools that have been active this week.',
    },
    {
      label: 'Total Students',
      value: 8462,
      change: '+124',
      icon: BookOpen,
      color: '#d96126',

      data: [6000, 6200, 6400, 6600, 7000, 7800, 8462],
      tooltip: 'Total number of students enrolled across all schools.',
    },
    {
      label: 'NFC Scans Today',
      value: 12500,
      change: '+15%',
      icon: Activity,
      color: '#d96126',
      data: [6, 7, 9, 11, 12, 12.3, 12.5],
      tooltip: 'Total number of NFC card scans recorded today.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => {
        const Icon = metric.icon
        const positive =
          String(metric.change).trim().startsWith('+') &&
          !String(metric.change).includes('-')
        const chartData = metric.data.map((d, idx) => ({ x: idx, y: d }))

        return (
          <div
            key={i}
            className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
            role="group"
            aria-label={`${metric.label} metric card`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                {metric.tooltip}
              </div>
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-muted-foreground text-xs font-medium mb-1">
                  {metric.label}
                </p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">
                  {metric.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      positive ? 'text-green-400' : 'text-rose-400'
                    }`}
                  >
                    {positive ? (
                      <ArrowUp size={14} aria-hidden />
                    ) : (
                      <ArrowDown size={14} aria-hidden />
                    )}
                    <span className="opacity-90">{metric.change}</span>
                    <span className="text-muted-foreground ml-1 text-[11px]">
                      from last week
                    </span>
                  </span>
                </div>
              </div>

              {/* icons */}
              <div
                className={`bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm`}
                aria-hidden
                title={metric.label}
              >
                <Icon size={24} color={metric.color} />
              </div>
            </div>

            {/* Recharts sparkline */}
            <div className="mt-5 relative z-10 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-1 text-xs text-muted-foreground">trend</div>
          </div>
        )
      })}
    </div>
  )
}
