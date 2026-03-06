"use client"

import { useState, useEffect } from 'react'
import { Activity, Bell, Heart, Thermometer, Users, AlertCircle, Clock, CheckCircle, Loader2 } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function ClinicOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [healthRes, trendsRes] = await Promise.all([
                    api.get('/analytics/health/overview'),
                    api.get('/analytics/health/trends'),
                ])
                setData({
                    health: healthRes.data.data,
                    trends: trendsRes.data.data || [],
                })
            } catch (err) {
                console.error('Failed to fetch clinic data:', err)
                setData({ health: null, trends: [] })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    const h = data?.health
    const chartData = (data?.trends || []).map((t: any) => ({
        day: new Date(t.visit_date || t.date || Date.now()).toLocaleDateString('en-NG', { weekday: 'short' }),
        visits: parseInt(t.visit_count || t.count || '0'),
    }))

    const fallbackSparkline = [
        { x: 0, y: 5 }, { x: 1, y: 9 }, { x: 2, y: 7 },
        { x: 3, y: 14 }, { x: 4, y: 11 }, { x: 5, y: 8 }, { x: 6, y: 12 }
    ]

    const metrics = [
        {
            label: 'Total Visits',
            value: (h?.total_visits ?? 0).toLocaleString(),
            change: 'All time',
            icon: Users,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Total clinic visits recorded',
        },
        {
            label: "Today's Visits",
            value: (h?.visits_today ?? 0).toLocaleString(),
            change: 'Seen today',
            icon: Activity,
            color: CARDLECT_COLORS.danger.main,
            tooltip: 'Students who visited the clinic today',
        },
        {
            label: 'Active Cases',
            value: (h?.active_cases ?? 0).toLocaleString(),
            change: 'Under observation',
            icon: AlertCircle,
            color: CARDLECT_COLORS.warning.main,
            tooltip: 'Students with ongoing health cases',
        },
        {
            label: 'Weekly Average',
            value: (h?.weekly_avg ?? '—').toString(),
            change: 'Visits per day',
            icon: Clock,
            color: SEMANTIC_COLORS.status.online,
            tooltip: 'Average daily clinic visits this week',
        },
    ]

    const alerts = [
        { text: 'Review any active health case flags', icon: Thermometer, color: CARDLECT_COLORS.danger.main },
        { text: 'Clinic supply checklist pending', icon: Bell, color: CARDLECT_COLORS.warning.main },
        { text: 'Medical records fully synced', icon: CheckCircle, color: CARDLECT_COLORS.success.main },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">School Health Hub</h1>
                <p className="text-muted-foreground">Monitor student health, manage medical records, and track clinic activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    return (
                        <div
                            key={i}
                            className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
                        >
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">{metric.tooltip}</div>
                            </div>
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-muted-foreground text-xs font-medium mb-1">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{metric.value}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400 opacity-90">{metric.change}</span>
                                    </div>
                                </div>
                                <div className="bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm">
                                    <Icon size={24} color={metric.color} />
                                </div>
                            </div>
                            <div className="mt-5 relative z-10 h-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={fallbackSparkline}>
                                        <XAxis dataKey="x" hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                        <Line type="monotone" dataKey="y" stroke={metric.color} strokeWidth={2} dot={false} isAnimationActive />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">7-Day Visit Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ day: 'No data', visits: 0 }]}>
                                <defs>
                                    <linearGradient id="grad-visits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: 11 }}
                                />
                                <Area type="monotone" dataKey="visits" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2.5} fill="url(#grad-visits)" isAnimationActive name="Visits" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Health Alerts</h3>
                    <div className="space-y-4">
                        {alerts.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg cursor-pointer group">
                                    <div className="p-3 bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                        <Icon size={20} color={a.color} />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                                    </div>
                                    <span className="text-sm text-foreground font-medium tracking-tight">{a.text}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
