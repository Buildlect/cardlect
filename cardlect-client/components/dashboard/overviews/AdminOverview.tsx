"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, Clock, Wallet, CreditCard, FileText, UserPlus, Loader2, LogIn, ShoppingCart, MessageSquare } from "lucide-react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import { useRouter } from "next/navigation"
import api from "@/lib/api-client"

type Metric = {
    icon: any
    label: string
    value: string
    change: string
    colorClass: string
    colorHex: string
    data: { name: string; value: number }[]
}

function numberFormatter(v: number) {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
    return v.toString()
}

function CustomTooltip({ active, payload, label, color, unit }: any) {
    if (!active || !payload || !payload.length) return null
    const p = payload[0]
    return (
        <div
            style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                padding: 8,
                borderRadius: 8,
                color: "var(--foreground)",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                minWidth: 120,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: 3 }} />
                <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{label}</div>
            </div>
            <div style={{ marginTop: 6, fontWeight: 700, fontSize: 14 }}>
                {unit ?? ""}{numberFormatter(p?.value ?? 0)}
            </div>
        </div>
    )
}

export default function AdminOverview() {
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await api.get('/analytics/overview')
                setData(response.data.data)
            } catch (err) {
                console.error('Failed to fetch admin overview:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchOverview()
    }, [])

    const handleNavigate = (href: string) => {
        router.push(href)
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    // Sample sparkline data Fallback
    const fallbackSeries = [
        { name: "Mon", value: 10 },
        { name: "Tue", value: 15 },
        { name: "Wed", value: 12 },
        { name: "Thu", value: 20 },
        { name: "Fri", value: 18 },
        { name: "Sat", value: 25 },
        { name: "Sun", value: 22 },
    ]

    const volumeData = data.finance.volume_trend_7d.length > 0
        ? data.finance.volume_trend_7d.map((d: any) => ({ name: d.date, value: parseFloat(d.daily_volume) }))
        : fallbackSeries;

    const metrics: Metric[] = [
        {
            icon: Users,
            label: "Total Students",
            value: data.attendance.total_students.toLocaleString(),
            change: "Live",
            colorClass: "from-cyan-400 to-cyan-600",
            colorHex: CARDLECT_COLORS.primary.darker,
            data: fallbackSeries,
        },
        {
            icon: Clock,
            label: "Attendance Rate",
            value: data.attendance.attendance_rate,
            change: `${data.attendance.present_today} Present`,
            colorClass: "from-emerald-400 to-emerald-600",
            colorHex: CARDLECT_COLORS.primary.darker,
            data: fallbackSeries,
        },
        {
            icon: Wallet,
            label: "Today Volume",
            value: `₦${data.finance.today_transaction_volume.toLocaleString()}`,
            change: `${data.finance.today_transaction_count} Txns`,
            colorClass: "from-blue-400 to-blue-600",
            colorHex: CARDLECT_COLORS.primary.darker,
            data: volumeData,
        },
        {
            icon: LogIn,
            label: "Gate Access",
            value: data.safety.gate_access_today.toString(),
            change: "Today",
            colorClass: "from-amber-400 to-amber-600",
            colorHex: CARDLECT_COLORS.primary.darker,
            data: fallbackSeries,
        },
        {
            icon: CreditCard,
            label: "Active Pickups",
            value: data.safety.active_pickups.toString(),
            change: "Authorized",
            colorClass: "from-orange-400 to-orange-600",
            colorHex: CARDLECT_COLORS.primary.darker,
            data: fallbackSeries,
        },
    ]

    return (
        <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {metrics.map((metric, idx) => {
                    const Icon = metric.icon
                    const positive = !metric.change.includes("Down")
                    const gradientId = `sparkline-grad-${idx}`

                    return (
                        <div
                            key={idx}
                            className="bg-card p-6 rounded-xl border border-border shadow-sm transform hover:-translate-y-1 transition-transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                                    <p className="text-2xl font-extrabold text-foreground">{metric.value}</p>
                                    <p className={`text-sm mt-2 ${positive ? "text-green-500" : "text-red-500"}`}>
                                        {metric.change}
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg bg-card shadow" style={{ color: metric.colorHex }}>
                                    <Icon size={22} />
                                </div>
                            </div>

                            <div className="mt-4 h-14">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metric.data} margin={{ top: 6, right: 0, left: 0, bottom: 6 }}>
                                        <defs>
                                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={metric.colorHex} stopOpacity={0.35} />
                                                <stop offset="60%" stopColor={metric.colorHex} stopOpacity={0.12} />
                                                <stop offset="100%" stopColor={metric.colorHex} stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>

                                        <XAxis dataKey="name" hide />
                                        <YAxis hide domain={["auto", "auto"]} />

                                        <Tooltip
                                            wrapperStyle={{ outline: "none" }}
                                            cursor={false}
                                            content={<CustomTooltip color={metric.colorHex} unit={metric.label === "Today Volume" ? "₦" : ""} />}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={metric.colorHex}
                                            strokeWidth={2.2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill={`url(#${gradientId})`}
                                            activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: metric.colorHex }}
                                            dot={false}
                                            isAnimationActive={true}
                                            animationDuration={800}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Overview Chart + Quick Actions */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">Transaction Volume</h2>
                        <div className="text-sm text-muted-foreground">7-Day Trend</div>
                    </div>

                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={volumeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.28} />
                                        <stop offset="60%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.08} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₦${numberFormatter(v as number)}`}
                                />
                                <Tooltip content={<CustomTooltip color={CARDLECT_COLORS.primary.darker} unit="₦" />} />

                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={CARDLECT_COLORS.primary.darker}
                                    fill="url(#gradVolume)"
                                    strokeWidth={2.5}
                                    name="Revenue"
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: CARDLECT_COLORS.primary.darker }}
                                    isAnimationActive
                                    animationDuration={900}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold text-foreground mb-2">Recent Partners</h3>
                    <p className="text-sm text-muted-foreground mb-4">Transactions today</p>

                    <div className="space-y-4">
                        {data.partners.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No partner activity recorded today.</p>
                        ) : (
                            data.partners.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-border/10">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.txn_count} transactions</p>
                                    </div>
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <ShoppingCart size={14} className="text-primary" />
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="pt-4 border-t border-border/50">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Quick Links</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => handleNavigate("/dashboard/admin-students")} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                                    <Users size={14} /> <span>Manage Students</span>
                                </button>
                                <button onClick={() => handleNavigate("/dashboard/admin-wallet")} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                                    <Wallet size={14} /> <span>Wallet Operations</span>
                                </button>
                                <button onClick={() => handleNavigate("/dashboard/communication")} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                                    <MessageSquare size={14} /> <span>Announcements</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
