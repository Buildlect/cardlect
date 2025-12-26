'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, Clock, AlertTriangle, MapPin, Bell, CheckCircle, TrendingUp, Calendar, ChevronDown } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SEMANTIC_COLORS } from '@/lib/cardlect-colors'

interface Child {
  id: string
  name: string
  grade: string
  avatar: string
  status: 'in-school' | 'left-school'
  lastUpdate: string
  attendance: number
}

export default function ParentsDashboard() {
  const [children] = useState<Child[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      grade: 'Grade 10',
      avatar: '👧',
      status: 'in-school',
      lastUpdate: '9:00 AM',
      attendance: 95,
    },
    {
      id: '2',
      name: 'Michael Johnson',
      grade: 'Grade 8',
      avatar: '👦',
      status: 'left-school',
      lastUpdate: '3:45 PM',
      attendance: 92,
    },
    {
      id: '3',
      name: 'Emma Johnson',
      grade: 'Grade 6',
      avatar: '👧',
      status: 'in-school',
      lastUpdate: '9:05 AM',
      attendance: 98,
    },
  ])

  const [selectedChildId, setSelectedChildId] = useState(children[0].id)
  const [showChildSelector, setShowChildSelector] = useState(false)
  
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0]
  const [alerts] = useState([
    {
      text: `${selectedChild.name} left school at 3:45 PM`,
      icon: Clock,
      color: SEMANTIC_COLORS.status.online,
      bg: '#1a1a1a',
    },
    {
      text: 'New message from teacher',
      icon: Bell,
      color: '#F59E0B',
      bg: '#262626',
    },
    {
      text: `Attendance: ${selectedChild.attendance}% this term`,
      icon: CheckCircle,
      color: SEMANTIC_COLORS.attendance.present,
      bg: '#1a1a1a',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 1 },
    { name: 'Tue', value: 1 },
    { name: 'Wed', value: 1 },
    { name: 'Thu', value: 1 },
    { name: 'Fri', value: 1 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ]

  const chartData = [
    { day: 'Mon', pickups: 1, entries: 1 },
    { day: 'Tue', pickups: 1, entries: 1 },
    { day: 'Wed', pickups: 1, entries: 1 },
    { day: 'Thu', pickups: 1, entries: 1 },
    { day: 'Fri', pickups: 1, entries: 1 },
    { day: 'Sat', pickups: 0, entries: 0 },
    { day: 'Sun', pickups: 0, entries: 0 },
  ]

  const metrics = [
    {
      label: 'Current Status',
      value: selectedChild.status === 'in-school' ? 'In School' : 'At Home',
      change: `Since ${selectedChild.lastUpdate}`,
      icon: MapPin,
      color: selectedChild.status === 'in-school' ? SEMANTIC_COLORS.status.online : SEMANTIC_COLORS.status.offline,
      data: sampleData,
      tooltip: 'Real-time status of your child',
    },
    {
      label: 'This Week Pickups',
      value: 5,
      change: '+0 pending',
      icon: Calendar,
      color: SEMANTIC_COLORS.status.online,
      data: sampleData,
      tooltip: 'Authorized pickups this week',
    },
    {
      label: 'Attendance Rate',
      value: `${selectedChild.attendance}%`,
      change: `+${selectedChild.attendance > 90 ? 2 : 0}% from last month`,
      icon: TrendingUp,
      color: selectedChild.attendance > 90 ? SEMANTIC_COLORS.status.online : '#F59E0B',
      data: sampleData,
      tooltip: 'Current attendance percentage',
    },
    {
      label: 'Pending Tasks',
      value: 2,
      change: '1 payment due',
      icon: AlertTriangle,
      color: SEMANTIC_COLORS.action.negative,
      data: sampleData,
      tooltip: 'Actions requiring attention',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="parents">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Parent Portal</h1>
        <p className="text-muted-foreground">Monitor your children's activities and school updates in real-time.</p>
      </div>

      {/* Children Selector */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <button
            onClick={() => setShowChildSelector(!showChildSelector)}
            className="w-full md:w-96 flex items-center justify-between gap-3 px-6 py-4 rounded-2xl border border-border bg-card hover:border-accent-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedChild.avatar}</span>
              <div className="text-left">
                <p className="font-semibold text-foreground">{selectedChild.name}</p>
                <p className="text-xs text-muted-foreground">{selectedChild.grade}</p>
              </div>
            </div>
            <ChevronDown
              size={20}
              className={`transition-transform ${showChildSelector ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showChildSelector && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChildId(child.id)
                    setShowChildSelector(false)
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-6 py-4 border-b border-border/50 hover:bg-background/50 transition-colors last:border-b-0 ${
                    selectedChildId === child.id ? 'bg-background/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{child.avatar}</span>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{child.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{child.grade}</p>
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            child.status === 'in-school'
                              ? 'bg-green-400'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  {selectedChildId === child.id && (
                    <div className="text-accent-primary">✓</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Children Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedChildId(child.id)
                setShowChildSelector(false)
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedChildId === child.id
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border hover:border-accent-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{child.avatar}</span>
                <div className="text-left">
                  <p className="font-medium text-foreground text-sm">{child.name}</p>
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        child.status === 'in-school'
                          ? 'bg-green-400'
                          : 'bg-gray-400'
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {child.status === 'in-school' ? 'In School' : 'At Home'}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
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
                      {metric.color === '#EF4444' ? '-' : '+'}
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
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            {selectedChild.name}'s Weekly Activity
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-activity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC407A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#EC407A" stopOpacity={0} />
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
                        {payload[0].value} entries
                      </div>
                    )
                  }}
                  cursor={{ stroke: '#EC407A', strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="entries"
                  stroke="#EC407A"
                  strokeWidth={2}
                  fill="url(#grad-activity)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
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
                  <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                    <Icon size={20} color={a.color} />

                    {/* Pulse dot */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
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
