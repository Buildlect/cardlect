'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, Home, BookOpen, Activity, ArrowUp, ArrowDown, AlertTriangle, Cpu, RefreshCw } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

export default function Dashboard() {
  
  // MetricsGrid component
  function ChartTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) return null
    const value = payload[0].value
    return (
      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
        {typeof value === 'number' ? value.toLocaleString() : String(value)}
      </div>
    )
  }

  const metrics = [
    {
      label: 'Total Schools',
      value: 24,
      change: '+2',
      icon: Home,
      color: CARDLECT_COLORS.primary.darker,
      data: [2, 3, 4, 5, 6, 7, 8],
      tooltip: 'The total number of schools registered in the system.',
    },
    {
      label: 'Active Schools',
      value: 22,
      change: '+0',
      icon: Users,
      color: SEMANTIC_COLORS.status.online,
      data: [8, 7, 7, 8, 8, 9, 9],
      tooltip: 'Number of schools that have been active this week.',
    },
    {
      label: 'Total Students',
      value: 8462,
      change: '+124',
      icon: BookOpen,
      color: CARDLECT_COLORS.primary.darker,
      data: [6000, 6200, 6400, 6600, 7000, 7800, 8462],
      tooltip: 'Total number of students enrolled across all schools.',
    },
    {
      label: 'NFC Scans Today',
      value: 12500,
      change: '+15%',
      icon: Activity,
      color: CARDLECT_COLORS.primary.darker,
      data: [6, 7, 9, 11, 12, 12.3, 12.5],
      tooltip: 'Total number of NFC card scans recorded today.',
    },
  ]

  // ScanActivityChart data
  const scanData = [
    { day: 'Mon', scans: 40 },
    { day: 'Tue', scans: 65 },
    { day: 'Wed', scans: 48 },
    { day: 'Thu', scans: 72 },
    { day: 'Fri', scans: 55 },
    { day: 'Sat', scans: 68 },
    { day: 'Sun', scans: 75 },
  ]

  // RecentAlerts data
  const [alerts] = useState([
    {
      text: 'Hardware offline',
      icon: Cpu,
      color: CARDLECT_COLORS.primary.darker,
      bg: '#1a1a1a',
    },
    {
      text: 'High fraud rate',
      icon: AlertTriangle,
      color: CARDLECT_COLORS.primary.darker,
      bg: '#262626',
    },
    {
      text: 'System update',
      icon: RefreshCw,
      color: CARDLECT_COLORS.primary.darker,
      bg: '#1a1a1a',
    },
  ])

  return (
    <DashboardLayout currentPage="dashboard" role="super-user">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">System Admin</h1>
        <p className="text-muted-foreground">Welcome back, You are logged in as a System admin, be cautious of your session.</p>
      </div>

      {/* MetricsGrid */}
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
                  <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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

              {/* Recharts sparkline with tooltip */}
              <div className="mt-5 relative z-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} aria-hidden>
                    <defs>
                      <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={metric.color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="x" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />

                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }} />

                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      activeDot={{ r: 3, stroke: metric.color, strokeWidth: 1 }}
                      fill={`url(#grad-${i})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">trend</div>
            </div>
          )
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* ScanActivityChart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            NFC Scan Activity
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={scanData}
              >
                {/* --- X Axis --- */}
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                />

                {/* --- Y Axis hidden for clean look --- */}
                <YAxis hide />

                {/* --- Tooltip --- */}
                <Tooltip
                  cursor={{ stroke: CARDLECT_COLORS.primary.darker, strokeWidth: 1, opacity: 0.2 }}
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '10px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}`, 'Scans']}
                />

                {/* --- Gradient Fill --- */}
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                {/* --- Smooth area line --- */}
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={3}
                  fill="url(#scanGradient)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RecentAlerts */}
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
      </div>
    </DashboardLayout>
  )
}
