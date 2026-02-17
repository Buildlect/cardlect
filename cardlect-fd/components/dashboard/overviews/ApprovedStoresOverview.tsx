"use client"

import { useState } from 'react'
import { Store, TrendingUp, ShoppingCart, Users, DollarSign, BarChart3, Bell, MapPin, Building2, Clock, AlertTriangle, CheckCircle, Eye, EyeOff, TrendingDown, Settings } from 'lucide-react'
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
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

interface PartnerSchool {
    id: string
    name: string
    location: string
    region: string
    activeCards: number
    lastTransaction: string
    totalTransactions: number
    monthlyVolume: number
    status: 'active' | 'inactive'
    contractEndDate: string
    commission: number
}

interface Transaction {
    id: string
    schoolName: string
    studentName: string
    amount: number
    date: string
    time: string
    category: string
    status: 'completed' | 'pending' | 'failed'
}

interface ApprovedStore {
    id: string
    name: string
    location: string
    category: string
    rating: number
    totalSales: number
    thisMonthSales: number
    operatingHours: string
    phone: string
    status: 'active' | 'inactive'
}

export default function ApprovedStoresOverview() {
    const [partnerSchools] = useState<PartnerSchool[]>([
        {
            id: '1',
            name: 'Oxford International School',
            location: 'Lagos',
            region: 'South-West',
            activeCards: 1248,
            lastTransaction: '2 min ago',
            totalTransactions: 4532,
            monthlyVolume: 45000,
            status: 'active',
            contractEndDate: '2024-12-31',
            commission: 2.5,
        },
        {
            id: '2',
            name: 'Trinity Academy',
            location: 'Abuja',
            region: 'North-Central',
            activeCards: 856,
            lastTransaction: '15 min ago',
            totalTransactions: 3214,
            monthlyVolume: 32000,
            status: 'active',
            contractEndDate: '2024-11-30',
            commission: 2.5,
        },
        {
            id: '3',
            name: "St. Mary's Secondary",
            location: 'Ibadan',
            region: 'South-West',
            activeCards: 624,
            lastTransaction: '1 hour ago',
            totalTransactions: 2156,
            monthlyVolume: 28000,
            status: 'active',
            contractEndDate: '2024-10-31',
            commission: 3.0,
        },
    ])

    const [approvedStores] = useState<ApprovedStore[]>([
        {
            id: '1',
            name: 'BrightSnacks Cafeteria',
            location: 'Oxford International School - Lagos',
            category: 'Food & Beverage',
            rating: 4.8,
            totalSales: 2450000,
            thisMonthSales: 185000,
            operatingHours: '6:30 AM - 4:30 PM',
            phone: '0701-234-5678',
            status: 'active',
        },
        {
            id: '2',
            name: 'Tech Hub Store',
            location: 'Trinity Academy - Abuja',
            category: 'Electronics & Books',
            rating: 4.5,
            totalSales: 1890000,
            thisMonthSales: 142000,
            operatingHours: '8:00 AM - 5:00 PM',
            phone: '0801-567-8901',
            status: 'active',
        },
        {
            id: '3',
            name: 'Uniform & Sports Hub',
            location: "St. Mary's Secondary - Ibadan",
            category: 'School Supplies',
            rating: 4.6,
            totalSales: 1650000,
            thisMonthSales: 128000,
            operatingHours: '7:00 AM - 4:00 PM',
            phone: '0704-891-2345',
            status: 'active',
        },
    ])

    const [selectedSchoolId, setSelectedSchoolId] = useState(partnerSchools[0].id)
    const selectedSchool = partnerSchools.find(s => s.id === selectedSchoolId) || partnerSchools[0]

    const [recentTransactions] = useState<Transaction[]>([
        {
            id: '1',
            schoolName: 'Oxford International School',
            studentName: 'Chioma Adeyemi',
            amount: 2500,
            date: '2024-01-15',
            time: '12:45 PM',
            category: 'Food & Beverage',
            status: 'completed',
        },
        {
            id: '2',
            schoolName: 'Trinity Academy',
            studentName: 'Amadi Okafor',
            amount: 5000,
            date: '2024-01-15',
            time: '1:20 PM',
            category: 'Electronics & Books',
            status: 'completed',
        },
        {
            id: '3',
            schoolName: "St. Mary's Secondary",
            studentName: 'Jennifer Ekpo',
            amount: 3500,
            date: '2024-01-15',
            time: '2:10 PM',
            category: 'School Supplies',
            status: 'completed',
        },
        {
            id: '4',
            schoolName: 'Oxford International School',
            studentName: 'Ahmed Hassan',
            amount: 4200,
            date: '2024-01-15',
            time: '2:45 PM',
            category: 'Food & Beverage',
            status: 'pending',
        },
    ])

    const [alerts] = useState([
        {
            text: 'Settlement payment processed: ₦125,000',
            icon: CheckCircle,
            color: SEMANTIC_COLORS.status.online,
            severity: 'success',
        },
        {
            text: 'New payment from Oxford School received: ₦45,000',
            icon: DollarSign,
            color: SEMANTIC_COLORS.financial.income,
            severity: 'success',
        },
        {
            text: 'Account verification completed',
            icon: CheckCircle,
            color: SEMANTIC_COLORS.status.online,
            severity: 'success',
        },
    ])

    const sampleData = [
        { name: 'Mon', value: 45000 },
        { name: 'Tue', value: 52000 },
        { name: 'Wed', value: 48000 },
        { name: 'Thu', value: 58000 },
        { name: 'Fri', value: 62000 },
        { name: 'Sat', value: 35000 },
        { name: 'Sun', value: 28000 },
    ]

    const chartData = [
        { day: 'Mon', transactions: 156, volume: 45000, schools: 3 },
        { day: 'Tue', transactions: 182, volume: 52000, schools: 3 },
        { day: 'Wed', transactions: 168, volume: 48000, schools: 3 },
        { day: 'Thu', transactions: 204, volume: 58000, schools: 3 },
        { day: 'Fri', transactions: 218, volume: 62000, schools: 3 },
        { day: 'Sat', transactions: 123, volume: 35000, schools: 2 },
        { day: 'Sun', transactions: 98, volume: 28000, schools: 2 },
    ]

    const storePerformance = [
        { name: 'BrightSnacks Cafeteria', value: 185000, color: CARDLECT_COLORS.primary.darker },
        { name: 'Tech Hub Store', value: 142000, color: CARDLECT_COLORS.primary.main },
        { name: 'Uniform & Sports Hub', value: 128000, color: CARDLECT_COLORS.info.main },
    ]

    const metrics = [
        {
            label: 'Account Balance',
            value: 125400,
            change: '+₦8,500 this week',
            icon: DollarSign,
            color: SEMANTIC_COLORS.financial.income,
            data: sampleData,
            tooltip: 'Your current account balance',
            prefix: '₦',
        },
        {
            label: 'Partner Schools',
            value: partnerSchools.length,
            change: '+1 pending approval',
            icon: Building2,
            color: CARDLECT_COLORS.primary.darker,
            data: sampleData,
            tooltip: 'Number of schools using your store',
        },
        {
            label: 'Card Users This Month',
            value: 2728,
            change: '+124 this week',
            icon: Users,
            color: CARDLECT_COLORS.secondary.main,
            data: sampleData,
            tooltip: 'Unique card users transacting with you',
        },
        {
            label: 'Monthly Volume',
            value: 328000,
            change: '+15% from last month',
            icon: TrendingUp,
            color: SEMANTIC_COLORS.status.online,
            data: sampleData,
            tooltip: 'Total transaction volume this month',
            prefix: '₦',
        },
    ]

    const getTransactionStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return SEMANTIC_COLORS.status.online
            case 'pending': return CARDLECT_COLORS.warning.main
            case 'failed': return CARDLECT_COLORS.danger.main
            default: return CARDLECT_COLORS.primary.main
        }
    }

    const getTransactionStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Completed'
            case 'pending': return 'Pending'
            case 'failed': return 'Failed'
            default: return 'Unknown'
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores Portal</h1>
                <p className="text-muted-foreground">Manage partner schools, approved stores, and track transactions from students/parents using your store.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, i) => {
                    const Icon = metric.icon
                    const chartData = metric.data.map((d, idx) => ({ x: idx, y: d.value }))

                    return (
                        <div
                            key={i}
                            className="relative group overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                            role="group"
                            aria-label={`${metric.label} metric card`}
                        >
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                <div className="bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap font-medium">
                                    {metric.tooltip}
                                </div>
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold mb-1 uppercase tracking-wide">{metric.label}</p>
                                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                                        {metric.prefix}{typeof metric.value === 'number' ? (metric.value >= 1000 ? (metric.value / 1000).toFixed(1) + 'k' : metric.value.toLocaleString()) : metric.value}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp size={14} style={{ color: SEMANTIC_COLORS.status.online }} />
                                        <span className="inline-flex items-center text-xs font-semibold" style={{ color: SEMANTIC_COLORS.status.online }}>
                                            {metric.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm">
                                    <Icon size={24} color={metric.color} />
                                </div>
                            </div>

                            <div className="mt-4 relative z-10 h-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} aria-hidden>
                                        <XAxis dataKey="x" hide />
                                        <YAxis hide domain={['dataMin', 'dataMax']} />
                                        <Tooltip cursor={false} />
                                        <Line type="monotone" dataKey="y" stroke={metric.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground">Partner Schools Network</h2>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors" style={{ color: CARDLECT_COLORS.primary.darker }}>
                        <Settings size={16} />
                        <span className="text-sm font-medium">Manage Partners</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {partnerSchools.map((school) => (
                        <button
                            key={school.id}
                            onClick={() => setSelectedSchoolId(school.id)}
                            className={`p-5 rounded-2xl border-2 transition-all text-left ${selectedSchoolId === school.id ? 'border-2 bg-card/80' : 'border-border hover:border-border/70'}`}
                            style={selectedSchoolId === school.id ? { borderColor: CARDLECT_COLORS.primary.darker } : {}}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '20', color: CARDLECT_COLORS.primary.darker }}>🏫</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground text-sm">{school.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin size={12} className="text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">{school.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                                <p><span className="font-semibold">Active Cards:</span> {school.activeCards.toLocaleString()}</p>
                                <p><span className="font-semibold">Total Txns:</span> {school.totalTransactions.toLocaleString()}</p>
                                <p><span className="font-semibold">Monthly:</span> ₦{school.monthlyVolume.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: SEMANTIC_COLORS.status.online + '20', color: SEMANTIC_COLORS.status.online }}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEMANTIC_COLORS.status.online }} />
                                    {school.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                {selectedSchoolId === school.id && <span className="text-xs font-semibold" style={{ color: CARDLECT_COLORS.primary.darker }}>✓ Selected</span>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold mb-5 text-foreground">Weekly Transaction Trends</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad-volume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(1)}k`} />
                                <Area type="monotone" dataKey="volume" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={3} fill="url(#grad-volume)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <h3 className="text-lg font-bold mb-5 text-foreground">Store Performance</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={storePerformance} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ₦${(value / 1000).toFixed(0)}k`} outerRadius={100} fill="#8884d8" dataKey="value">
                                    {storePerformance.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(1)}k`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
