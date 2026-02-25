"use client"

import { useState } from 'react'
import { Wallet, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, Bell, DollarSign, Download, PieChart as PieChartIcon } from 'lucide-react'
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
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

export default function FinanceOverview() {
    const [alerts] = useState([
        {
            text: 'Monthly revenue target achieved (+15%)',
            icon: TrendingUp,
            color: CARDLECT_COLORS.success.main,
            bg: '#1a1a1a',
        },
        {
            text: 'Pending vendor payment: Stationery Store',
            icon: Bell,
            color: CARDLECT_COLORS.warning.main,
            bg: '#262626',
        },
        {
            text: 'System update: Automated reconciliation ready',
            icon: CreditCard,
            color: CARDLECT_COLORS.primary.darker,
            bg: '#1a1a1a',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 450000 },
        { name: 'Tue', value: 520000 },
        { name: 'Wed', value: 480000 },
        { name: 'Thu', value: 580000 },
        { name: 'Fri', value: 620000 },
        { name: 'Sat', value: 350000 },
        { name: 'Sun', value: 280000 },
    ]

    const chartData = [
        { day: 'Mon', revenue: 450000, expense: 120000, profit: 330000 },
        { day: 'Tue', revenue: 520000, expense: 150000, profit: 370000 },
        { day: 'Wed', revenue: 480000, expense: 110000, profit: 370000 },
        { day: 'Thu', revenue: 580000, expense: 200000, profit: 380000 },
        { day: 'Fri', revenue: 620000, expense: 180000, profit: 440000 },
        { day: 'Sat', revenue: 350000, expense: 80000, profit: 270000 },
        { day: 'Sun', revenue: 280000, expense: 50000, profit: 230000 },
    ]

    const metrics = [
        {
            label: 'Monthly Revenue',
            value: 3245600,
            change: '+12.5%',
            icon: DollarSign,
            color: SEMANTIC_COLORS.financial.income,
            data: sampleData,
            tooltip: 'Total tuition and card revenue this month',
            prefix: '₦',
        },
        {
            label: 'Monthly Expenses',
            value: 846200,
            change: '-5.2%',
            icon: Wallet,
            color: SEMANTIC_COLORS.financial.expense,
            data: sampleData.map(d => ({ ...d, value: d.value * 0.3 })),
            tooltip: 'Operational costs for current month',
            prefix: '₦',
        },
        {
            label: 'Pending Invoices',
            value: 42,
            change: '+8 this week',
            icon: CreditCard,
            color: CARDLECT_COLORS.warning.main,
            data: sampleData.map(d => ({ ...d, value: d.value * 0.1 })),
            tooltip: 'Outstanding tuition payments',
        },
        {
            label: 'Net Margin',
            value: '72%',
            change: '+3.1%',
            icon: TrendingUp,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Overall financial profitability',
        },
    ]

    const [recentInvoices] = useState([
        { id: '1', student: 'Chioma Adeyemi', amount: 156000, status: 'paid', date: '2024-02-10' },
        { id: '2', student: 'Amadi Okafor', amount: 142000, status: 'pending', date: '2024-02-12' },
        { id: '3', student: 'Jennifer Ekpo', amount: 156000, status: 'paid', date: '2024-02-08' },
        { id: '4', student: 'Ahmed Hassan', amount: 84000, status: 'overdue', date: '2024-01-30' },
    ])

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Financial Controller</h1>
                <p className="text-muted-foreground">Monitor school revenue, track expenses, and manage automated card settlement reconciliation.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    const positive =
                        String(metric.change).trim().startsWith('+') &&
                        !String(metric.change).includes('-')
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
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-rose-400'}`}>
                                            {positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                            <span className="opacity-90">{metric.change}</span>
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
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (!active || !payload || !payload.length) return null
                                                return (
                                                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                                                        ₦{payload[0].value.toLocaleString()}
                                                    </div>
                                                )
                                            }}
                                            cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="y"
                                            stroke={metric.color}
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={true}
                                            activeDot={{ r: 3, stroke: metric.color, strokeWidth: 1 }}
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
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-foreground tracking-tight">Revenue vs Expenses</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-background/80 rounded-lg text-muted-foreground"><Download size={18} /></button>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={SEMANTIC_COLORS.financial.income} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={SEMANTIC_COLORS.financial.income} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ stroke: SEMANTIC_COLORS.financial.income, strokeWidth: 1, opacity: 0.2 }} />
                                <Area type="monotone" dataKey="revenue" stroke={SEMANTIC_COLORS.financial.income} strokeWidth={2} fill="url(#grad-revenue)" isAnimationActive />
                                <Area type="monotone" dataKey="expense" stroke={SEMANTIC_COLORS.financial.expense} strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">Finance Alerts</h3>
                    <div className="space-y-4">
                        {alerts.map((a, i) => {
                            const Icon = a.icon
                            return (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group">
                                    <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                        <Icon size={20} color={a.color} />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
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
