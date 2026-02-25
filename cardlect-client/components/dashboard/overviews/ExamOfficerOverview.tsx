"use client"

import { useState } from 'react'
import { BookOpen, FileText, Users, Award, TrendingUp, Bell, Zap, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
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

export default function ExamOfficerOverview() {
    const [alerts] = useState([
        {
            text: 'English CBT - All results uploaded',
            icon: CheckCircle,
            color: CARDLECT_COLORS.success.main,
            bg: '#1a1a1a',
        },
        {
            text: 'Pending review: Physics practical scores',
            icon: AlertCircle,
            color: CARDLECT_COLORS.warning.main,
            bg: '#262626',
        },
        {
            text: 'New exam schedule released',
            icon: Bell,
            color: CARDLECT_COLORS.primary.darker,
            bg: '#1a1a1a',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 85 },
        { name: 'Tue', value: 88 },
        { name: 'Wed', value: 92 },
        { name: 'Thu', value: 85 },
        { name: 'Fri', value: 98 },
        { name: 'Sat', value: 90 },
        { name: 'Sun', value: 87 },
    ]

    const metrics = [
        {
            label: 'Exams Today',
            value: 12,
            change: '+2 from yesterday',
            icon: BookOpen,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Number of active CBT exams today',
        },
        {
            label: 'Avg Score',
            value: '78%',
            change: '+5% this term',
            icon: Award,
            color: SEMANTIC_COLORS.status.online,
            data: sampleData,
            tooltip: 'Average score across all classes',
        },
        {
            label: 'Total Candidates',
            value: 842,
            change: '+124 new',
            icon: Users,
            color: CARDLECT_COLORS.info.main,
            data: sampleData,
            tooltip: 'Total students participating in exams',
        },
        {
            label: 'Papers Graded',
            value: '2.5k',
            change: '+450 this week',
            icon: CheckCircle,
            color: CARDLECT_COLORS.primary.main,
            data: sampleData,
            tooltip: 'Total exams processed and graded',
        },
    ]

    const chartData = [
        { range: '0-20', count: 12 },
        { range: '21-40', count: 45 },
        { range: '41-60', count: 156 },
        { range: '61-80', count: 342 },
        { range: '81-100', count: 287 },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Exam & Assessments</h1>
                <p className="text-muted-foreground">Manage CBT examinations, oversee results, and monitor student academic performance.</p>
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
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Score Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill={CARDLECT_COLORS.primary.darker} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Exam Alerts</h3>
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
