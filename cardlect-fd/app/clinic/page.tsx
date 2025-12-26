'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, ClipboardList, AlertTriangle, CheckCircle, TrendingUp, Bell, Activity, Calendar } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function ClinicDashboard() {
  const [alerts] = useState([
    {
      text: 'Vaccination schedule: Class 4A tomorrow',
      icon: Calendar,
      color: '#3B82F6',
      bg: '#1a1a1a',
    },
    {
      text: 'Medical supplies: Low stock alert',
      icon: AlertTriangle,
      color: '#EF4444',
      bg: '#262626',
    },
    {
      text: 'Health report: Available for download',
      icon: CheckCircle,
      color: '#10B981',
      bg: '#1a1a1a',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 15 },
    { name: 'Tue', value: 18 },
    { name: 'Wed', value: 12 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 16 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ]

  const chartData = [
    { day: 'Mon', visits: 15, vaccinated: 8 },
    { day: 'Tue', visits: 18, vaccinated: 10 },
    { day: 'Wed', visits: 12, vaccinated: 6 },
    { day: 'Thu', visits: 22, vaccinated: 14 },
    { day: 'Fri', visits: 16, vaccinated: 9 },
    { day: 'Sat', visits: 0, vaccinated: 0 },
    { day: 'Sun', visits: 0, vaccinated: 0 },
  ]

  const metrics = [
    {
      label: 'Total Visits',
      value: 83,
      change: '+12% this week',
      icon: Users,
      color: '#3B82F6',
      data: sampleData,
      tooltip: 'Total clinic visits this week',
    },
    {
      label: 'Students Treated',
      value: 68,
      change: '+8 today',
      icon: CheckCircle,
      color: '#10B981',
      data: sampleData,
      tooltip: 'Students treated this week',
    },
    {
      label: 'Pending Cases',
      value: 5,
      change: '2 follow-ups needed',
      icon: ClipboardList,
      color: '#F59E0B',
      data: sampleData,
      tooltip: 'Cases requiring follow-up',
    },
    {
      label: 'Health Score',
      value: '88%',
      change: '+4% from last month',
      icon: TrendingUp,
      color: '#8B5CF6',
      data: sampleData,
      tooltip: 'Overall student health score',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Clinic Dashboard</h1>
        <p className="text-muted-foreground">Monitor student health, clinic visits, and medical records.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          const chartData = metric.data.map((d, idx) => ({ x: idx, y: d.value }))

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
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                      +
                      <span className="opacity-90">{metric.change}</span>
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
                    <XAxis dataKey="x" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        return (
                          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                            {payload[0].value}
                          </div>
                        )
                      }}
                      cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      activeDot={{ r: 3, stroke: metric.color, strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">trend</div>
            </div>
          )
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Weekly Visits */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Weekly Clinic Visits
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-clinic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                />
                <YAxis hide />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null
                    return (
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                        {payload[0].value} visits
                      </div>
                    )
                  }}
                  cursor={{ stroke: '#3B82F6', strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#grad-clinic)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinic Alerts */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">
            Alerts
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
                  <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                    <Icon size={20} color={a.color} />

                    {/* Pulse dot */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
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
