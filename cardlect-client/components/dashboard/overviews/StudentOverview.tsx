"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Clock, Award, TrendingUp, Bell, CheckCircle, Wallet, Loader2 } from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface WalletData {
    balance: number | string
}

interface WalletTransaction {
    id: string
    type?: string
    category?: string
    amount?: number | string
    created_at?: string
}

export default function StudentOverview() {
    const [wallet, setWallet] = useState<WalletData | null>(null)
    const [transactions, setTransactions] = useState<WalletTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [walletAccessDenied, setWalletAccessDenied] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const [walletResult, transResult] = await Promise.allSettled([
                api.get('/wallets/me'),
                api.get('/wallets/transactions?limit=5'),
            ])

            if (walletResult.status === 'fulfilled') {
                setWallet(walletResult.value?.data?.data || null)
            } else {
                const status = walletResult.reason?.response?.status
                if (status === 403) {
                    setWalletAccessDenied(true)
                } else {
                    console.error('Failed to fetch wallet:', walletResult.reason)
                }
                setWallet(null)
            }

            if (transResult.status === 'fulfilled') {
                const txRows = Array.isArray(transResult.value?.data?.data) ? transResult.value.data.data : []
                setTransactions(txRows)
            } else {
                const status = transResult.reason?.response?.status
                if (status !== 403) {
                    console.error('Failed to fetch transactions:', transResult.reason)
                }
                setTransactions([])
            }

            setLoading(false)
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

    const sampleData = [
        { name: 'Mon', value: 95 },
        { name: 'Tue', value: 88 },
        { name: 'Wed', value: 92 },
        { name: 'Thu', value: 85 },
        { name: 'Fri', value: 98 },
    ]

    const metrics = [
        {
            label: 'Wallet Balance',
            value: wallet ? `N${Number(wallet.balance || 0).toLocaleString()}` : 'N0.00',
            change: walletAccessDenied ? 'Module not enabled' : 'Live balance',
            icon: Wallet,
            color: CARDLECT_COLORS.success.main,
            data: sampleData,
            tooltip: 'Your current spending money',
        },
        {
            label: 'Attendance',
            value: '98%',
            change: 'Active student',
            icon: Clock,
            color: SEMANTIC_COLORS.status.online,
            data: sampleData,
            tooltip: 'Attendance rate this term',
        },
        {
            label: 'Assignments',
            value: 0,
            change: 'No pending',
            icon: BookOpen,
            color: CARDLECT_COLORS.info.main,
            data: sampleData,
            tooltip: 'Tasks requiring your attention',
        },
        {
            label: 'CBT Results',
            value: 'B+',
            change: 'Math Grade',
            icon: Award,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Last exam performance',
        },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
                <p className="text-muted-foreground">Track your academic progress and manage your smart card wallet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    const chartData = metric.data.map((d, idx) => ({ x: idx, y: d.value }))

                    return (
                        <div
                            key={i}
                            className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-muted-foreground text-xs font-medium mb-1">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                        {metric.value}
                                    </p>
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
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="x" hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
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
                    <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">Recent Wallet Transactions</h3>

                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No recent transactions recorded.</p>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-border/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <TrendingUp size={18} className={tx.type === 'deposit' ? '' : 'rotate-180'} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground capitalize">{tx.category || tx.type}</p>
                                            <p className="text-xs text-muted-foreground">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-foreground'}`}>
                                        {tx.type === 'deposit' ? '+' : '-'} N{Number(tx.amount || 0).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">School Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-background/30 transition-all hover:shadow-lg cursor-pointer">
                            <div className="p-3 bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                <Bell size={20} className="text-orange-500" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
                            </div>
                            <span className="text-sm text-foreground font-medium">Smart Card ID Active</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-background/30 transition-all hover:shadow-lg cursor-pointer">
                            <div className="p-3 bg-card rounded-xl flex items-center justify-center shadow-md relative">
                                <CheckCircle size={20} className="text-green-500" />
                            </div>
                            <span className="text-sm text-foreground font-medium">In School</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
