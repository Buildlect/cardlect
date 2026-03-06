"use client"

import { useState, useEffect } from 'react'
import { BookOpen, FileText, Users, Award, CheckCircle, AlertCircle, Bell, Loader2 } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function ExamOfficerOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examsRes, gradeDistRes] = await Promise.all([
                    api.get('/exams?limit=10'),
                    api.get('/analytics/academic/distribution'),
                ])
                setData({
                    exams: examsRes.data.data?.exams || [],
                    distribution: gradeDistRes.data.data || [],
                })
            } catch (err) {
                console.error('Failed to fetch exam officer data:', err)
                setData({ exams: [], distribution: [] })
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

    const exams = data?.exams || []
    const distribution = data?.distribution || []

    // Derived stats
    const totalExams = exams.length
    const upcomingExams = exams.filter((e: any) => new Date(e.start_date) > new Date()).length
    const pastExams = exams.filter((e: any) => new Date(e.start_date) <= new Date()).length

    // Format distribution for bar chart
    const chartData = distribution.length > 0
        ? distribution.map((d: any) => ({ range: d.grade || d.range, count: parseInt(d.count || '0') }))
        : [
            { range: 'F (0–39)', count: 0 },
            { range: 'E (40–49)', count: 0 },
            { range: 'D (50–59)', count: 0 },
            { range: 'C (60–69)', count: 0 },
            { range: 'B (70–84)', count: 0 },
            { range: 'A (85–100)', count: 0 },
        ]

    const fallbackSparkline = [
        { x: 0, y: 75 }, { x: 1, y: 80 }, { x: 2, y: 78 },
        { x: 3, y: 85 }, { x: 4, y: 88 }, { x: 5, y: 84 }, { x: 6, y: 90 }
    ]

    const metrics = [
        {
            label: 'Total Exams',
            value: totalExams.toLocaleString(),
            change: 'In system',
            icon: BookOpen,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Total exams created in the system',
        },
        {
            label: 'Upcoming',
            value: upcomingExams.toLocaleString(),
            change: 'Scheduled',
            icon: CheckCircle,
            color: SEMANTIC_COLORS.status.online,
            tooltip: 'Exams yet to take place',
        },
        {
            label: 'Completed',
            value: pastExams.toLocaleString(),
            change: 'Past exams',
            icon: Award,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Exams that have already taken place',
        },
        {
            label: 'Total Results',
            value: distribution.reduce((s: number, d: any) => s + parseInt(d.count || '0'), 0).toLocaleString(),
            change: 'Graded entries',
            icon: FileText,
            color: CARDLECT_COLORS.primary.main,
            tooltip: 'Total exam result entries recorded',
        },
    ]

    const alerts = [
        { text: 'Grade pending results on time', icon: CheckCircle, color: CARDLECT_COLORS.success.main },
        { text: 'Upcoming exams require invigilation', icon: AlertCircle, color: CARDLECT_COLORS.warning.main },
        { text: 'New exam schedule notification sent', icon: Bell, color: CARDLECT_COLORS.primary.darker },
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
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Score Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    cursor={{ fill: 'var(--muted)/10' }}
                                />
                                <Bar dataKey="count" fill={CARDLECT_COLORS.primary.darker} radius={[6, 6, 0, 0]} name="Students" />
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
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg cursor-pointer group">
                                    <div className="p-3 bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                        <Icon size={20} color={a.color} />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                    </div>
                                    <span className="text-sm text-foreground font-medium tracking-tight">{a.text}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Upcoming exams list */}
                    {exams.filter((e: any) => new Date(e.start_date) > new Date()).length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Next Up</h4>
                            <div className="space-y-2">
                                {exams
                                    .filter((e: any) => new Date(e.start_date) > new Date())
                                    .slice(0, 3)
                                    .map((exam: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-muted-foreground" />
                                                <span className="text-xs font-medium text-foreground truncate max-w-[130px]">{exam.title}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(exam.start_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
