'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Store, TrendingUp, ShoppingCart, Users, DollarSign, BarChart3, Bell, MapPin, Building2, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
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
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

interface PartnerSchool {
  id: string
  name: string
  logo: string
  activeCards: number
  lastTransaction: string
  totalTransactions: number
  monthlyVolume: number
}

export default function ApprovedStoresDashboard() {
  const [partnerSchools] = useState<PartnerSchool[]>([
    {
      id: '1',
      name: 'Oxford International School',
      logo: '🎓',
      activeCards: 1248,
      lastTransaction: '2 min ago',
      totalTransactions: 4532,
      monthlyVolume: 45000,
    },
    {
      id: '2',
      name: 'Trinity Academy',
      logo: '📚',
      activeCards: 856,
      lastTransaction: '15 min ago',
      totalTransactions: 3214,
      monthlyVolume: 32000,
    },
    {
      id: '3',
      name: 'St. Mary\'s Secondary',
      logo: '✝️',
      activeCards: 624,
      lastTransaction: '1 hour ago',
      totalTransactions: 2156,
      monthlyVolume: 28000,
    },
  ])

  const [selectedSchoolId, setSelectedSchoolId] = useState(partnerSchools[0].id)
  const selectedSchool = partnerSchools.find(s => s.id === selectedSchoolId) || partnerSchools[0]

  const [alerts] = useState([
    {
      text: 'Settlement payment processed: ₦125,000',
      icon: CheckCircle,
      color: SEMANTIC_COLORS.status.online,
      bg: '#1a1a1a',
    },
    {
      text: 'New payment from Oxford School received',
      icon: DollarSign,
      color: SEMANTIC_COLORS.financial.income,
      bg: '#262626',
    },
    {
      text: 'Account verification completed',
      icon: CheckCircle,
      color: SEMANTIC_COLORS.status.online,
      bg: '#1a1a1a',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 45000 },
    { name: 'Tue', value: 52000 },
    { name: 'Wed', value: 48000 },
    { name: 'Thu', value: 58000 },
    { name: 'Fri', value: 62000 },
    { name: 'Sat', value: 35000 },
    { name: 'Sun', value: 28000 },
  ]

  const chartData = [
    { day: 'Mon', transactions: 156, volume: 45000 },
    { day: 'Tue', transactions: 182, volume: 52000 },
    { day: 'Wed', transactions: 168, volume: 48000 },
    { day: 'Thu', transactions: 204, volume: 58000 },
    { day: 'Fri', transactions: 218, volume: 62000 },
    { day: 'Sat', transactions: 123, volume: 35000 },
    { day: 'Sun', transactions: 98, volume: 28000 },
  ]

  const metrics = [
    {
      label: 'Account Balance',
      value: 125400,
      change: 'Settlement cleared',
      icon: DollarSign,
      color: SEMANTIC_COLORS.financial.income,
      data: sampleData,
      tooltip: 'Your current account balance across all partner schools',
      prefix: '₦',
    },
    {
      label: 'Partner Schools',
      value: 3,
      change: '+1 this month',
      icon: Building2,
      color: CARDLECT_COLORS.primary.main,
      data: sampleData,
      tooltip: 'Number of schools using your store',
    },
    {
      label: 'Active Card Users',
      value: 2728,
      change: '+124 this week',
      icon: Users,
      color: CARDLECT_COLORS.secondary.main,
      data: sampleData,
      tooltip: 'Total students from partner schools with access to your store',
    },
    {
      label: 'This Month Volume',
      value: 328000,
      change: '+15% from last month',
      icon: TrendingUp,
      color: SEMANTIC_COLORS.status.online,
      data: sampleData,
      tooltip: 'Total transaction volume this month',
      prefix: '₦',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="approved-stores">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Store Portal</h1>
        <p className="text-muted-foreground">Manage your store account, view partner schools, and track transactions.</p>
      </div>

      {/* Partner Schools Selector */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Partner Schools Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {partnerSchools.map((school) => (
            <button
              key={school.id}
              onClick={() => setSelectedSchoolId(school.id)}
              className={`p-5 rounded-2xl border-2 transition-all text-left ${
                selectedSchoolId === school.id
                  ? `border-[${CARDLECT_COLORS.primary.main}] bg-orange-500/5`
                  : 'border-border hover:border-border/50'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{school.logo}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.activeCards.toLocaleString()} active cards</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>📊 {school.totalTransactions.toLocaleString()} total transactions</p>
                <p>💰 ₦{school.monthlyVolume.toLocaleString()} this month</p>
              </div>
              <span className="text-xs mt-2 inline-block text-muted-foreground">
                {selectedSchoolId === school.id ? '✓ Selected' : 'Click to view'}
              </span>
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
                    {metric.prefix}{typeof metric.value === 'number' ? (metric.value >= 1000 ? Math.round(metric.value / 1000) + 'k' : metric.value.toLocaleString()) : metric.value}
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
                            {metric.prefix}${payload[0].value}
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
        {/* Transaction Volume */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Weekly Transaction Volume
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-partners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0} />
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
                        ₦{(payload[0].value / 1000).toFixed(1)}k
                      </div>
                    )
                  }}
                  cursor={{ stroke: CARDLECT_COLORS.primary.main, strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke={CARDLECT_COLORS.primary.main}
                  strokeWidth={2}
                  fill="url(#grad-partners)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Alerts */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">
            Updates
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
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
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
