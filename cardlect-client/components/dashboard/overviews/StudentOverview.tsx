"use client"

import { useState } from 'react'
import { BookOpen, Clock, Award, Users, TrendingUp, Bell, Zap, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react'
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

export default function StudentOverview() {
    const [alerts] = useState([
        {
            text: 'Upcoming exam: Math on Friday',
            icon: BookOpen,
            color: '#3B82F6',
            bg: '#1a1a1a',
        },
        {
            text: 'Assignment due: Science Project',
            icon: Zap,
            color: '#F59E0B',
            bg: '#262626',
        },
        {
            text: 'New resources added to portal',
            icon: Bell,
            color: '#10B981',
            bg: '#1a1a1a',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 95 },
        { name: 'Tue', value: 88 },
        { name: 'Wed', value: 92 },
        { name: 'Thu', value: 85 },
        { name: 'Fri', value: 98 },
        { name: 'Sat', value: 90 },
        { name: 'Sun', value: 87 },
    ]

    const chartData = [
        { day: 'Mon', grade: 85, attendance: 100 },
        { day: 'Tue', grade: 88, attendance: 95 },
        { day: 'Wed', grade: 92, attendance: 100 },
        { day: 'Thu', grade: 85, attendance: 100 },
        { day: 'Fri', grade: 95, attendance: 100 },
        { day: 'Sat', grade: 90, attendance: 0 },
        { day: 'Sun', grade: 87, attendance: 0 },
    ]

    const metrics = [
        {
            label: 'Current GPA',
            value: '3.8',
            change: '+0.2 this term',
            icon: Award,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Your current Grade Point Average',
        },
        {
            label: 'Attendance',
            value: '98%',
            change: '+1% this week',
            icon: Clock,
            color: SEMANTIC_COLORS.status.online,
            data: sampleData,
            tooltip: 'Attendance rate this term',
        },
        {
            label: 'Assignments',
            value: 12,
            change: '+2 completed',
            icon: BookOpen,
            color: CARDLECT_COLORS.info.main,
            data: sampleData,
            tooltip: 'Total assignments this term',
        },
        {
            label: 'Study Groups',
            value: 5,
            change: 'Math, Science, English...',
            icon: Users,
            color: CARDLECT_COLORS.primary.main,
            data: sampleData,
            tooltip: 'Active study groups',
        },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
                <p className="text-muted-foreground">Track your academic performance and stay updated with school activities.</p>
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
                                    <LineChart data={chartData}>
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
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Weekly Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad-performance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ stroke: CARDLECT_COLORS.primary.darker, strokeWidth: 2, opacity: 0.1 }} />
                                <Area type="monotone" dataKey="grade" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} fill="url(#grad-performance)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Updates</h3>
                    <div className="space-y-4">
                        {alerts.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group">
                                    <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                        <Icon size={20} color={a.color} />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
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
