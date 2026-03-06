"use client"

import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, ClipboardList, AlertTriangle, CheckCircle, TrendingUp, Bell, Calendar, Loader2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
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
import api from '@/lib/api-client'

interface HealthOverview {
  total_visits?: string | number
  visits_today?: string | number
  critical_records_count?: string | number
}

interface HealthTrendRow {
  date: string
  visit_count: string | number
}

interface ReasonRow {
  reason: string
  count: string | number
}

interface VisitRow {
  id: string
  reason?: string
  notes?: string
  created_at?: string
}

export default function ClinicDashboard() {
  const [overview, setOverview] = useState<HealthOverview>({})
  const [trends, setTrends] = useState<HealthTrendRow[]>([])
  const [reasons, setReasons] = useState<ReasonRow[]>([])
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [overviewRes, trendsRes, reasonsRes, visitsRes] = await Promise.allSettled([
        api.get('/analytics/health/overview'),
        api.get('/analytics/health/trends'),
        api.get('/analytics/health/reasons'),
        api.get('/health/visits?limit=6'),
      ])

      setOverview(
        overviewRes.status === 'fulfilled' ? (overviewRes.value.data?.data || {}) : {},
      )
      setTrends(
        trendsRes.status === 'fulfilled' && Array.isArray(trendsRes.value.data?.data)
          ? trendsRes.value.data.data
          : [],
      )
      setReasons(
        reasonsRes.status === 'fulfilled' && Array.isArray(reasonsRes.value.data?.data)
          ? reasonsRes.value.data.data
          : [],
      )
      setVisits(
        visitsRes.status === 'fulfilled' && Array.isArray(visitsRes.value.data?.data)
          ? visitsRes.value.data.data
          : [],
      )

      setLoading(false)
    }

    fetchData()
  }, [])

  const chartData = useMemo(
    () =>
      trends.map((t) => ({
        day: (t.date || '').slice(5),
        visits: Number(t.visit_count || 0),
      })),
    [trends],
  )

  const topReason = reasons[0]

  const metrics = [
    {
      label: 'Total Visits',
      value: Number(overview.total_visits || 0),
      change: `${Number(overview.visits_today || 0)} today`,
      icon: Users,
      color: CARDLECT_COLORS.primary.darker,
      data: chartData,
      tooltip: 'Total clinic visits in records',
    },
    {
      label: 'Critical Records',
      value: Number(overview.critical_records_count || 0),
      change: 'Monitor closely',
      icon: AlertTriangle,
      color: CARDLECT_COLORS.danger.main,
      data: chartData,
      tooltip: 'Students with medical conditions/allergies',
    },
    {
      label: 'Primary Reason',
      value: topReason ? topReason.reason : 'N/A',
      change: topReason ? `${Number(topReason.count || 0)} cases` : 'No reasons yet',
      icon: ClipboardList,
      color: CARDLECT_COLORS.warning.main,
      data: chartData,
      tooltip: 'Most common visit reason',
    },
    {
      label: 'Trend Direction',
      value: chartData.length > 1 && chartData[chartData.length - 1].visits >= chartData[0].visits ? 'Up' : 'Stable',
      change: 'From recent days',
      icon: TrendingUp,
      color: CARDLECT_COLORS.success.main,
      data: chartData,
      tooltip: 'Recent clinic load trend',
    },
  ]

  if (loading) {
    return (
      <DashboardLayout currentPage="dashboard" role="staff" customRole="clinic">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="dashboard" role="staff" customRole="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Clinic Dashboard</h1>
        <p className="text-muted-foreground">Monitor student health, clinic visits, and medical records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          const spark = metric.data.length > 0 ? metric.data.map((d, idx) => ({ x: idx, y: d.visits })) : [{ x: 0, y: 0 }]

          return (
            <div
              key={i}
              className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
              role="group"
              aria-label={`${metric.label} metric card`}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                  {metric.tooltip}
                </div>
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">{metric.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                      <span className="opacity-90">{metric.change}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm" aria-hidden title={metric.label}>
                  <Icon size={24} color={metric.color} />
                </div>
              </div>

              <div className="mt-5 relative z-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spark} aria-hidden>
                    <XAxis dataKey="x" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }} />
                    <Line type="monotone" dataKey="y" stroke={metric.color} strokeWidth={2} dot={false} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Clinic Visit Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : [{ day: 'N/A', visits: 0 }]}>
                <defs>
                  <linearGradient id="grad-clinic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={2}
                  fill="url(#grad-clinic)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">
            Recent Alerts
          </h3>

          <div className="space-y-4">
            {(visits.length > 0 ? visits : [{ id: 'fallback', reason: 'No recent clinic entries', created_at: new Date().toISOString() }]).slice(0, 3).map((v, i) => {
              const icon = i % 2 === 0 ? Bell : Calendar
              const Icon = icon
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                    <Icon size={20} color={i % 2 === 0 ? '#3B82F6' : '#10B981'} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  </div>

                  <span className="text-sm text-foreground font-medium tracking-tight">
                    {v.reason || 'Clinic update'}
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
