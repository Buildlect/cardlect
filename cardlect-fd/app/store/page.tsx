'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { ShoppingCart, TrendingUp, AlertTriangle, Package, DollarSign, Barcode, Bell, Clock } from 'lucide-react'
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

export default function StoreDashboard() {
  const [alerts] = useState([
    {
      text: 'Stock Alert: Uniforms low',
      icon: AlertTriangle,
      color: '#EF4444',
      bg: '#1a1a1a',
    },
    {
      text: 'New order received: 50 items',
      icon: ShoppingCart,
      color: '#10B981',
      bg: '#262626',
    },
    {
      text: 'Vendor payment due tomorrow',
      icon: Clock,
      color: '#F59E0B',
      bg: '#1a1a1a',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 2500 },
    { name: 'Tue', value: 3200 },
    { name: 'Wed', value: 2800 },
    { name: 'Thu', value: 3800 },
    { name: 'Fri', value: 4200 },
    { name: 'Sat', value: 1500 },
    { name: 'Sun', value: 1200 },
  ]

  const chartData = [
    { day: 'Mon', sales: 2500, inventory: 45 },
    { day: 'Tue', sales: 3200, inventory: 38 },
    { day: 'Wed', sales: 2800, inventory: 42 },
    { day: 'Thu', sales: 3800, inventory: 35 },
    { day: 'Fri', sales: 4200, inventory: 28 },
    { day: 'Sat', sales: 1500, inventory: 26 },
    { day: 'Sun', sales: 1200, inventory: 25 },
  ]

  const metrics = [
    {
      label: 'Daily Sales',
      value: 19300,
      change: '+22% this week',
      icon: TrendingUp,
      color: '#10B981',
      data: sampleData,
      tooltip: 'Total sales revenue',
      prefix: '$',
    },
    {
      label: 'Items Sold',
      value: 342,
      change: '+15% from last week',
      icon: ShoppingCart,
      color: '#3B82F6',
      data: sampleData,
      tooltip: 'Total items sold',
    },
    {
      label: 'Stock Items',
      value: 258,
      change: '12 items low in stock',
      icon: Package,
      color: '#F59E0B',
      data: sampleData,
      tooltip: 'Current inventory count',
    },
    {
      label: 'Revenue',
      value: 68000,
      change: '+8% this month',
      icon: DollarSign,
      color: '#8B5CF6',
      data: sampleData,
      tooltip: 'Monthly revenue',
      prefix: '$',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Store Management</h1>
        <p className="text-muted-foreground">Monitor inventory, sales, and store operations in real-time.</p>
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
                    {metric.prefix}{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${metric.color === '#EF4444' ? 'text-red-400' : 'text-green-400'}`}>
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
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Sales & Inventory Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-sales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
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
                        Sales: ${payload[0].value}
                      </div>
                    )
                  }}
                  cursor={{ stroke: '#10B981', strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#grad-sales)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Alerts */}
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
