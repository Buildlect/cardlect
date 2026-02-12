'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { DollarSign, TrendingUp, AlertTriangle, Check, CreditCard, BarChart3, Bell, Calendar } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
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

export default function FinanceDashboard() {
  const [alerts] = useState([
    {
      text: 'Invoice #2024-156 due today',
      icon: AlertTriangle,
      color: '#EF4444',
      bg: '#1a1a1a',
    },
    {
      text: 'Payment received: $5,000',
      icon: Check,
      color: '#10B981',
      bg: '#262626',
    },
    {
      text: 'Financial report available',
      icon: BarChart3,
      color: '#3B82F6',
      bg: '#1a1a1a',
    },
    {
      text: 'Partner store payments settled',
      icon: Check,
      color: '#10B981',
      bg: '#262626',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 8500 },
    { name: 'Tue', value: 9200 },
    { name: 'Wed', value: 8800 },
    { name: 'Thu', value: 9800 },
    { name: 'Fri', value: 10500 },
    { name: 'Sat', value: 9500 },
    { name: 'Sun', value: 8900 },
  ]

  const chartData = [
    { day: 'Mon', income: 15000, expenses: 8500 },
    { day: 'Tue', income: 16200, expenses: 9200 },
    { day: 'Wed', income: 15800, expenses: 8800 },
    { day: 'Thu', income: 17000, expenses: 9800 },
    { day: 'Fri', income: 18500, expenses: 10500 },
    { day: 'Sat', income: 12000, expenses: 9500 },
    { day: 'Sun', income: 11500, expenses: 8900 },
  ]

  const invoiceData = [
    { month: 'Jan', invoiced: 120000, collected: 115000 },
    { month: 'Feb', invoiced: 135000, collected: 132000 },
    { month: 'Mar', invoiced: 128000, collected: 128000 },
    { month: 'Apr', invoiced: 142000, collected: 138000 },
    { month: 'May', invoiced: 155000, collected: 151000 },
  ]

  const metrics = [
    {
      label: 'Total Revenue',
      value: 95800,
      change: '+12% this month',
      icon: TrendingUp,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Total income this month',
      prefix: '₦',
    },
    {
      label: 'Pending Payments',
      value: 12500,
      change: '8 invoices outstanding',
      icon: AlertTriangle,
      color: CARDLECT_COLORS.danger.main,
      data: sampleData,
      tooltip: 'Amount awaiting payment',
      prefix: '₦',
    },
    {
      label: 'Monthly Expenses',
      value: 45200,
      change: '-5% from last month',
      icon: CreditCard,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Total expenditure',
      prefix: '₦',
    },
    {
      label: 'Net Balance',
      value: 48300,
      change: '+18% growth',
      icon: DollarSign,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Current net balance',
      prefix: '₦',
    },
  ]

  const storeNetworkMetrics = [
    {
      label: 'Partner Store Revenue',
      value: 25400,
      change: '+8% this month',
      icon: TrendingUp,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Revenue from partner store network',
      prefix: '₦',
    },
    {
      label: 'Active Partner Stores',
      value: 12,
      change: '+2 new stores',
      icon: BarChart3,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Number of active approved partner stores',
    },
    {
      label: 'Partner Store Orders',
      value: 847,
      change: '+45 today',
      icon: CreditCard,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Total orders from partner network',
    },
    {
      label: 'Avg Store Rating',
      value: '4.7',
      change: '+0.2 this month',
      icon: BarChart3,
      color: CARDLECT_COLORS.primary.darker,
      data: sampleData,
      tooltip: 'Average partner store rating',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="finance">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Finance Dashboard</h1>
        <p className="text-muted-foreground">Manage school finances, invoices, revenue tracking, and partner store settlements.</p>
      </div>

      {/* School Finance Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">School Financial Overview</h2>
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
                    {metric.prefix}{(typeof metric.value === 'number' ? Math.round(metric.value / 1000) : metric.value)}
                    {typeof metric.value === 'number' && metric.value >= 1000 ? 'k' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${metric.color === '#EF4444' ? 'text-red-400' : 'text-green-400'}`}>
                      {metric.color === '#EF4444' ? '!' : '+'}
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
                            ${(payload[0].value / 1000).toFixed(1)}k
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
      </div>

      {/* Partner Store Network Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Approved Partner Store Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeNetworkMetrics.map((metric, i) => {
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
                      {metric.prefix}{(typeof metric.value === 'number' ? Math.round(metric.value / 1000) : metric.value)}
                      {typeof metric.value === 'number' && metric.value >= 1000 ? 'k' : ''}
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
                              {metric.prefix}{(payload[0].value / 1000).toFixed(1)}k
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
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Income vs Expenses */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Income vs Expenses
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
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
                        ${(payload[0].value / 1000).toFixed(1)}k
                      </div>
                    )
                  }}
                  cursor={{ stroke: CARDLECT_COLORS.primary.darker, strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={2}
                  fill="url(#grad-income)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Alerts */}
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
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full" />
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
