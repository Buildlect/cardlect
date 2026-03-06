"use client"

import { useState, useEffect } from 'react'
import { Shield, Users, LogIn, Bell, Zap, Loader2, DoorOpen, AlertTriangle } from 'lucide-react'
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

export default function SecurityOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [snapshotRes, gateTrendRes] = await Promise.all([
                    api.get('/analytics/safety/snapshot'),
                    api.get('/analytics/safety/trends'),
                ])
                setData({
                    snapshot: snapshotRes.data.data,
                    trend: gateTrendRes.data.data || [],
                })
            } catch (err) {
                console.error('Failed to fetch security data:', err)
                setData({ snapshot: null, trend: [] })
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

    const snap = data?.snapshot
    const chartData = (data?.trend || []).map((t: any) => ({
        day: new Date(t.day).toLocaleDateString('en-NG', { weekday: 'short' }),
        entries: parseInt(t.entries || '0'),
    }))

    const fallbackSparkline = [
        { x: 0, y: 40 }, { x: 1, y: 60 }, { x: 2, y: 50 },
        { x: 3, y: 70 }, { x: 4, y: 65 }, { x: 5, y: 80 }, { x: 6, y: 75 }
    ]

    const metrics = [
        {
            label: 'Students on Campus',
            value: (snap?.students_on_campus ?? 0).toLocaleString(),
            change: 'Currently inside',
            icon: Users,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Students recorded on campus right now',
        },
        {
            label: 'Staff on Campus',
            value: (snap?.staff_on_campus ?? 0).toLocaleString(),
            change: 'Checked in',
            icon: Shield,
            color: SEMANTIC_COLORS.status.online,
            tooltip: 'Staff members currently on campus',
        },
        {
            label: 'Visitor Entries Today',
            value: (snap?.visitor_entries_today ?? 0).toLocaleString(),
            change: 'Authorized visits',
            icon: DoorOpen,
            color: CARDLECT_COLORS.secondary.main,
            tooltip: 'Total visitor entries today',
        },
        {
            label: 'Gate Activity Today',
            value: (snap?.gate_activity_today ?? 0).toLocaleString(),
            change: 'NFC events',
            icon: Zap,
            color: CARDLECT_COLORS.primary.main,
            tooltip: 'Total NFC gate access events today',
        },
    ]

    const alerts = [
        { text: 'Gate system fully operational', icon: Shield, color: CARDLECT_COLORS.success.main },
        { text: 'Monitor unauthorized after-hours activity', icon: Bell, color: CARDLECT_COLORS.warning.main },
        { text: 'Check pickup authorizations for today', icon: AlertTriangle, color: CARDLECT_COLORS.danger.main },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Security Hub</h1>
                <p className="text-muted-foreground">Monitor school gates, track student/staff movement, and manage authorized pickups in real-time.</p>
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
                                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                                    {metric.tooltip}
                                </div>
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-muted-foreground text-xs font-medium mb-1">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{metric.value}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400 opacity-90">
                                            {metric.change}
                                        </span>
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
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">7-Day Gate Activity Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ day: 'No data', entries: 0 }]}>
                                <defs>
                                    <linearGradient id="grad-entries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: 11 }}
                                    itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="entries" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2.5} fill="url(#grad-entries)" isAnimationActive={true} name="Entries" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Live Security Alerts</h3>
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
