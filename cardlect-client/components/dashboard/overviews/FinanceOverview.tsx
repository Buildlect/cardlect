"use client"

import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, CreditCard, ArrowUp, ArrowDown, Bell, DollarSign, Download, Loader2, FileText } from 'lucide-react'
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

export default function FinanceOverview() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [financeRes, overviewRes, invoicesRes] = await Promise.all([
                    api.get('/analytics/finance/overview'),
                    api.get('/analytics/overview'),
                    api.get('/finance/invoices?limit=4'),
                ])
                setData({
                    finance: financeRes.data.data,
                    overview: overviewRes.data.data,
                    invoices: invoicesRes.data.data?.invoices || [],
                })
            } catch (err) {
                console.error('Failed to fetch finance data:', err)
                setData({ finance: null, overview: null, invoices: [] })
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

    const fin = data?.finance
    const ov = data?.overview
    // finance.analytics returns { wallets: {...}, invoices: {...} }
    const totalWalletBalance = parseFloat(fin?.wallets?.total_held_in_wallets || '0')
    const totalInvoicesCollected = parseFloat(fin?.invoices?.total_collected || '0')
    const totalOutstanding = parseFloat(fin?.invoices?.total_outstanding || '0')
    const pendingInvoices = parseInt(fin?.invoices?.total_invoices || '0')
    // Today's volume from admin overview endpoint
    const todayVolume = parseFloat(ov?.finance?.today_transaction_volume || '0')
    const todayCount = parseInt(ov?.finance?.today_transaction_count || '0')
    const trend7d = ov?.finance?.volume_trend_7d || []

    // Format chart data
    const chartData = trend7d.map((t: any) => ({
        day: new Date(t.date).toLocaleDateString('en-NG', { weekday: 'short' }),
        revenue: parseFloat(t.daily_volume || '0'),
    }))

    const fallbackSparkline = [
        { x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 2 },
        { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 7 }
    ]

    const metrics = [
        {
            label: 'Total in Wallets',
            value: totalWalletBalance,
            change: `${fin?.wallets?.total_active_wallets || 0} active wallets`,
            icon: DollarSign,
            color: SEMANTIC_COLORS.financial.income,
            tooltip: 'Total balance held across all student wallets',
            prefix: '₦',
            isPositive: true,
        },
        {
            label: "Today's Volume",
            value: todayVolume,
            change: `${todayCount} txns today`,
            icon: Wallet,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Transaction volume recorded today',
            prefix: '₦',
            isPositive: true,
        },
        {
            label: 'Invoices Collected',
            value: totalInvoicesCollected,
            change: `₦${totalOutstanding.toLocaleString()} outstanding`,
            icon: CreditCard,
            color: CARDLECT_COLORS.warning.main,
            tooltip: 'Tuition and fee invoices paid so far',
            prefix: '₦',
            isPositive: true,
        },
        {
            label: 'Total Invoices',
            value: pendingInvoices,
            change: 'All time',
            icon: TrendingUp,
            color: CARDLECT_COLORS.primary.darker,
            tooltip: 'Total invoices issued to date',
            isPositive: true,
        },
    ]

    const alerts = [
        { text: 'Review pending invoices', icon: Bell, color: CARDLECT_COLORS.warning.main },
        { text: 'Monthly reconciliation ready', icon: CreditCard, color: CARDLECT_COLORS.primary.darker },
        { text: 'Partner settlement due', icon: TrendingUp, color: CARDLECT_COLORS.success.main },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Financial Controller</h1>
                <p className="text-muted-foreground">Monitor school revenue, track wallet transactions, and manage invoices.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    const rawValue = metric.value

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
                                    <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                        {metric.prefix}
                                        {typeof rawValue === 'number'
                                            ? rawValue >= 1000000 ? (rawValue / 1000000).toFixed(1) + 'M'
                                                : rawValue >= 1000 ? (rawValue / 1000).toFixed(0) + 'k'
                                                    : rawValue.toLocaleString()
                                            : rawValue}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${metric.isPositive ? 'text-green-400' : 'text-amber-400'}`}>
                                            {metric.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                            <span className="opacity-90">{metric.change}</span>
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

            {/* Charts + Recent Invoices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-foreground tracking-tight">7-Day Transaction Volume</h3>
                        <button className="p-2 hover:bg-background/80 rounded-lg text-muted-foreground">
                            <Download size={18} />
                        </button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ day: 'No data', revenue: 0 }]}>
                                <defs>
                                    <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={SEMANTIC_COLORS.financial.income} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={SEMANTIC_COLORS.financial.income} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                    formatter={(v: any) => [`₦${parseFloat(v).toLocaleString()}`, 'Volume']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke={SEMANTIC_COLORS.financial.income} strokeWidth={2} fill="url(#grad-revenue)" isAnimationActive />
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
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg cursor-pointer group">
                                    <div className="p-3 bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                        <Icon size={20} color={a.color} />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
                                    </div>
                                    <span className="text-sm text-foreground font-medium tracking-tight">{a.text}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Recent invoices section */}
                    {data?.invoices?.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Recent Invoices</h4>
                            <div className="space-y-2">
                                {data.invoices.slice(0, 3).map((inv: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted-foreground" />
                                            <span className="text-xs text-foreground truncate max-w-[120px]">{inv.number || inv.id}</span>
                                        </div>
                                        <span className={`text-xs font-bold ${inv.status === 'paid' ? 'text-green-500' : inv.status === 'overdue' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {inv.status}
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
