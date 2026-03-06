"use client"

import { useState, useEffect } from 'react'
import { Users, BookOpen, Clock, CheckCircle, TrendingUp, Bell, FileText, Plus, BarChart3, Eye, Loader2 } from 'lucide-react'
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
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function TeacherOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attendanceRes, trendsRes, examsRes] = await Promise.all([
                    api.get('/analytics/attendance/aggregate'),
                    api.get('/analytics/attendance/trends'),
                    api.get('/exams?limit=4'),
                ])
                setData({
                    attendance: attendanceRes.data.data,
                    trends: trendsRes.data.data,
                    exams: examsRes.data.data?.exams || [],
                })
            } catch (err) {
                console.error('Failed to fetch teacher data:', err)
                // Set empty fallback so UI still renders
                setData({ attendance: null, trends: [], exams: [] })
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

    const att = data?.attendance
    const totalStudents = parseInt(att?.total_students || '0')
    const presentToday = parseInt(att?.present || '0')
    const absentToday = parseInt(att?.absent || '0')
    const attendanceRate = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) + '%' : '0%'

    // Format trends for chart
    const chartData = (data?.trends || []).map((t: any) => ({
        day: new Date(t.date).toLocaleDateString('en-NG', { weekday: 'short' }),
        present: parseInt(t.present_count || '0'),
    }))

    const fallbackSparkline = [
        { x: 0, y: 10 }, { x: 1, y: 15 }, { x: 2, y: 12 },
        { x: 3, y: 18 }, { x: 4, y: 16 }, { x: 5, y: 20 }, { x: 6, y: 22 }
    ]

    const metrics = [
        {
            label: 'Total Students',
            value: totalStudents.toLocaleString(),
            change: 'Across all classes',
            icon: Users,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Total students enrolled in your school',
        },
        {
            label: 'Present Today',
            value: presentToday.toLocaleString(),
            change: attendanceRate + ' present',
            icon: CheckCircle,
            color: CARDLECT_COLORS.success.main,
            tooltip: 'Students present today',
        },
        {
            label: 'Absent Today',
            value: absentToday.toLocaleString(),
            change: 'Need follow-up',
            icon: Clock,
            color: CARDLECT_COLORS.warning.main,
            tooltip: 'Students absent today',
        },
        {
            label: 'Active Exams',
            value: data?.exams?.length || 0,
            change: 'This term',
            icon: FileText,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Exams scheduled or in progress',
        },
    ]

    const alerts = [
        { text: 'Mark attendance for your classes today', icon: Clock, color: CARDLECT_COLORS.warning.main },
        { text: 'New assignments pending review', icon: FileText, color: CARDLECT_COLORS.primary.darker },
        { text: 'Parent-teacher meeting scheduled', icon: Users, color: CARDLECT_COLORS.success.main },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
                <p className="text-muted-foreground">Manage classes, track student performance, and communicate with parents.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon

                    return (
                        <div
                            key={i}
                            className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
                        >
                            {/* Tooltip */}
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

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Attendance Trend Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">7-Day Attendance Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ day: 'No data', present: 0 }]}>
                                <defs>
                                    <linearGradient id="grad-attendance" x1="0" y1="0" x2="0" y2="1">
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
                                <Area
                                    type="monotone"
                                    dataKey="present"
                                    stroke={CARDLECT_COLORS.primary.darker}
                                    strokeWidth={2.5}
                                    fill="url(#grad-attendance)"
                                    isAnimationActive={true}
                                    name="Present"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Notifications</h3>
                    <div className="space-y-4">
                        {alerts.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group"
                                >
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
                </div>
            </div>

            {/* Exams Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">CBT Exams</h2>
                    <button
                        style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                        className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus size={18} />
                        Create Exam
                    </button>
                </div>

                {data?.exams?.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-3xl">
                        <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-muted-foreground font-medium">No exams scheduled yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">Create an exam to see it listed here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {data.exams.map((exam: any) => (
                            <div
                                key={exam.id}
                                className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div
                                            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                                            className="p-3 rounded-xl flex items-center justify-center text-white"
                                        >
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                                            <p className="text-sm text-muted-foreground">{exam.term} · {exam.session}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${new Date(exam.start_date) < new Date()
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-blue-500/20 text-blue-400'
                                            }`}
                                    >
                                        {new Date(exam.start_date) < new Date() ? 'Past' : 'Upcoming'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-background/50 rounded-xl">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Max Score</p>
                                        <p className="text-2xl font-bold text-foreground">{exam.max_score}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                        <p className="text-2xl font-bold text-foreground">{exam.duration_minutes}m</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                                        className="flex-1 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye size={18} />
                                        View Results
                                    </button>
                                    <button
                                        style={{ borderColor: CARDLECT_COLORS.primary.darker, color: CARDLECT_COLORS.primary.darker }}
                                        className="flex-1 border-2 font-semibold py-2.5 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <BarChart3 size={18} />
                                        Analytics
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
