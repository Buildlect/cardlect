"use client"

import { useState } from 'react'
import { ShoppingCart, Package, DollarSign, TrendingUp, AlertTriangle, Bell, Zap, Clock, CheckCircle } from 'lucide-react'
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

export default function StoreOverview() {
    const [alerts] = useState([
        {
            text: 'Low stock: School Uniform (Size M)',
            icon: Package,
            color: CARDLECT_COLORS.warning.main,
            bg: '#1a1a1a',
        },
        {
            text: 'New sales record today: ₦125,000',
            icon: TrendingUp,
            color: CARDLECT_COLORS.success.main,
            bg: '#262626',
        },
        {
            text: 'Supply delivery expected at 2:00 PM',
            icon: Bell,
            color: CARDLECT_COLORS.primary.darker,
            bg: '#1a1a1a',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 35000 },
        { name: 'Tue', value: 42000 },
        { name: 'Wed', value: 38000 },
        { name: 'Thu', value: 48000 },
        { name: 'Fri', value: 52000 },
        { name: 'Sat', value: 25000 },
        { name: 'Sun', value: 18000 },
    ]

    const chartData = [
        { day: 'Mon', sales: 35000, items: 12 },
        { day: 'Tue', sales: 42000, items: 15 },
        { day: 'Wed', sales: 38000, items: 14 },
        { day: 'Thu', sales: 48000, items: 18 },
        { day: 'Fri', sales: 52000, items: 20 },
        { day: 'Sat', sales: 25000, items: 10 },
        { day: 'Sun', sales: 18000, items: 8 },
    ]

    const metrics = [
        {
            label: 'Today\'s Sales',
            value: 125400,
            change: '+15.2% from avg',
            icon: DollarSign,
            color: SEMANTIC_COLORS.financial.income,
            data: sampleData,
            tooltip: 'Total revenue from card sales today',
            prefix: '₦',
        },
        {
            label: 'Inventory Items',
            value: 245,
            change: '12 low stock',
            icon: Package,
            color: CARDLECT_COLORS.info.main,
            data: sampleData.map(d => ({ ...d, value: Math.round(d.value / 200) })),
            tooltip: 'Total unique items in school store',
        },
        {
            label: 'Daily Orders',
            value: 86,
            change: '+12 this hour',
            icon: ShoppingCart,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData.map(d => ({ ...d, value: Math.round(d.value / 500) })),
            tooltip: 'Number of completed transactions today',
        },
        {
            label: 'Gross Margin',
            value: '22%',
            change: '+1.5% this month',
            icon: TrendingUp,
            color: CARDLECT_COLORS.primary.main,
            data: sampleData,
            tooltip: 'Overall profit margin on store items',
        },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">School Store Portal</h1>
                <p className="text-muted-foreground">Manage inventory, track sales, and handle cashless card transactions from students and parents.</p>
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
                                    <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                        {metric.prefix}{typeof metric.value === 'number' ? (metric.value >= 1000 ? (metric.value / 1000).toFixed(0) + 'k' : metric.value.toLocaleString()) : metric.value}
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
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Daily Sales Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad-sales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ stroke: CARDLECT_COLORS.primary.darker, strokeWidth: 2, opacity: 0.1 }} />
                                <Area type="monotone" dataKey="sales" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} fill="url(#grad-sales)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Store Notifications</h3>
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
