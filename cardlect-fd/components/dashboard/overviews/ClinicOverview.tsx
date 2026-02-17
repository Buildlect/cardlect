"use client"

import { useState } from 'react'
import { Activity, Bell, Heart, Thermometer, User, Users, AlertCircle, Clock, CheckCircle } from 'lucide-react'
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
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

export default function ClinicOverview() {
    const [alerts] = useState([
        {
            text: 'Student A12: High temperature alert',
            icon: Thermometer,
            color: CARDLECT_COLORS.danger.main,
            bg: '#1a1a1a',
        },
        {
            text: 'Clinic supply restock needed: First-aid kits',
            icon: Bell,
            color: CARDLECT_COLORS.warning.main,
            bg: '#262626',
        },
        {
            text: 'Medical records update completed for Grade 10',
            icon: CheckCircle,
            color: CARDLECT_COLORS.success.main,
            bg: '#1a1a1a',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 12 },
        { name: 'Tue', value: 18 },
        { name: 'Wed', value: 15 },
        { name: 'Thu', value: 25 },
        { name: 'Fri', value: 20 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 0 },
    ]

    const chartData = [
        { day: 'Mon', visits: 12, medications: 5 },
        { day: 'Tue', visits: 18, medications: 8 },
        { day: 'Wed', visits: 15, medications: 6 },
        { day: 'Thu', visits: 25, medications: 12 },
        { day: 'Fri', visits: 20, medications: 9 },
        { day: 'Sat', visits: 0, medications: 0 },
        { day: 'Sun', visits: 0, medications: 0 },
    ]

    const metrics = [
        {
            label: 'Daily Visits',
            value: 20,
            change: '+15% from yesterday',
            icon: Users,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Total students visited clinic today',
        },
        {
            label: 'Critical Cases',
            value: 2,
            change: '-1 from morning',
            icon: AlertCircle,
            color: CARDLECT_COLORS.danger.main,
            data: sampleData.map(d => ({ ...d, value: Math.round(d.value / 4) })),
            tooltip: 'Cases requiring immediate attention',
        },
        {
            label: 'Medications Given',
            value: 9,
            change: '+2 this hour',
            icon: Heart,
            color: CARDLECT_COLORS.secondary.main,
            data: sampleData.map(d => ({ ...d, value: Math.round(d.value / 2) })),
            tooltip: 'Students currently on medication',
        },
        {
            label: 'Avg Recovery Time',
            value: '45m',
            change: '-5m this week',
            icon: Clock,
            color: SEMANTIC_COLORS.status.online,
            data: sampleData,
            tooltip: 'Average time spent in clinic',
        },
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
                    const chartData = metric.data.map((d, idx) => ({ x: idx, y: d.value }))

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
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                                            +<span className="opacity-90">{metric.change}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className={`bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm`}>
                                    <Icon size={24} color={metric.color} />
                                </div>
                            </div>

                            <div className="mt-5 relative z-10 h-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} aria-hidden>
                                        <XAxis dataKey="x" hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                        <Tooltip cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }} />
                                        <Line type="monotone" dataKey="y" stroke={metric.color} strokeWidth={2} dot={false} isAnimationActive={true} activeDot={{ r: 3, stroke: metric.color, strokeWidth: 1 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Clinic Visits Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad-visits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ stroke: CARDLECT_COLORS.primary.darker, strokeWidth: 2, opacity: 0.1 }} />
                                <Area type="monotone" dataKey="visits" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} fill="url(#grad-visits)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Immediate Alerts</h3>
                    <div className="space-y-4">
                        {alerts.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group">
                                    <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
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
