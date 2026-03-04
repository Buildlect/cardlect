"use client"

import { useState, useEffect } from 'react'
import { Users, Home, BookOpen, Activity, ArrowUp, ArrowDown, AlertTriangle, Cpu, RefreshCw, Loader2, Globe, TrendingUp, ShieldCheck } from 'lucide-react'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function SuperUserOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const response = await api.get('/analytics/global-overview')
                setData(response.data.data)
            } catch (err) {
                console.error('Failed to fetch global analytics:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchGlobalStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    const stats = data || {
        ecosystem: { total_schools: 0, active_schools: 0 },
        demographics: { total_users: 0, total_students: 0, total_partners: 0 },
        finance_total: 0,
        top_performing_schools: []
    }

    const metrics = [
        {
            label: 'Total Schools',
            value: stats.ecosystem.total_schools,
            change: '+2',
            icon: Home,
            color: CARDLECT_COLORS.primary.darker,
            data: [2, 3, 4, 5, 6, 7, 8],
            tooltip: 'The total number of schools registered in the system.',
        },
        {
            label: 'Active Schools',
            value: stats.ecosystem.active_schools,
            change: '+0',
            icon: Users,
            color: SEMANTIC_COLORS.status.online,
            data: [8, 7, 7, 8, 8, 9, 9],
            tooltip: 'Number of schools that have been active this week.',
        },
        {
            label: 'Total Students',
            value: stats.demographics.total_students,
            change: '+124',
            icon: BookOpen,
            color: CARDLECT_COLORS.primary.darker,
            data: [6000, 6200, 6400, 6600, 7000, 7800, stats.demographics.total_students],
            tooltip: 'Total number of students enrolled across all schools.',
        },
        {
            label: 'Global Volume (30d)',
            value: `₦${Number(stats.finance_total).toLocaleString()}`,
            change: '+15%',
            icon: TrendingUp,
            color: CARDLECT_COLORS.primary.darker,
            data: [6, 7, 9, 11, 12, 12.3, 12.5],
            tooltip: 'Total transaction volume across the ecosystem in the last 30 days.',
        },
    ]

    const scanData = [
        { day: 'Mon', scans: 40 },
        { day: 'Tue', scans: 65 },
        { day: 'Wed', scans: 48 },
        { day: 'Thu', scans: 72 },
        { day: 'Fri', scans: 55 },
        { day: 'Sat', scans: 68 },
        { day: 'Sun', scans: 75 },
    ]

    function ChartTooltip({ active, payload }: any) {
        if (!active || !payload || !payload.length) return null
        const value = payload[0].value
        return (
            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter">Infrastructure Intelligence</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Global node supervision and ecosystem health monitors.</p>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-widest text-foreground">Global Registry: 30ms Delay</span>
                </div>
            </div>

            {/* MetricsGrid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    const positive = String(metric.change).trim().startsWith('+')
                    const chartData = metric.data.map((d, idx) => ({ x: idx, y: d }))

                    return (
                        <div
                            key={i}
                            className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-primary/50 transition-all relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-4 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${positive ? 'text-green-600' : 'text-rose-600'}`}>
                                    {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {metric.change}
                                </div>
                            </div>

                            <h3 className="text-sm font-black uppercase tracking-tighter text-muted-foreground mb-1">{metric.label}</h3>
                            <p className="text-4xl font-black text-foreground tracking-tighter">{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}</p>

                            <div className="mt-8 h-12 opacity-40 group-hover:opacity-100 transition-opacity">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="x" hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="y"
                                            stroke={metric.color}
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* ScanActivityChart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Global Network Traffic</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 italic">Real-time NFC Scan Oscillations</p>
                        </div>
                        <div className="flex gap-2">
                            {['Live', '24H', '7D'].map(t => (
                                <button key={t} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Live' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={scanData}>
                                <defs>
                                    <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '12px' }}
                                    itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="scans"
                                    stroke={CARDLECT_COLORS.primary.darker}
                                    strokeWidth={4}
                                    fill="url(#scanGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Performing Schools */}
                <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm">
                    <h3 className="text-xl font-black text-foreground mb-8 tracking-tight">Top Active Nodes</h3>
                    <div className="space-y-6">
                        {stats.top_performing_schools.length > 0 ? stats.top_performing_schools.map((school: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] border border-border/50 hover:bg-muted/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-sm border border-primary/10">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground text-sm">{school.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">{school.tx_count} Transactions Today</p>
                                    </div>
                                </div>
                                <TrendingUp size={16} className="text-green-500 group-hover:scale-110 transition-transform" />
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                <Activity size={40} className="mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest">No node data detected</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-10 py-5 rounded-3xl bg-muted hover:bg-border text-[11px] font-black uppercase tracking-widest transition-all">
                        View Complete Infrastructure
                    </button>
                </div>
            </div>
        </div>
    )
}
