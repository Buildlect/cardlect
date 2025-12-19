'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { Download, TrendingUp, Users, DollarSign, Calendar, Clock, Plus } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { LayoutShell } from '@/components/SuperAdmin/layout.shell'

const attendanceData = [
  { month: 'Jan', present: 85, absent: 15 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 82, absent: 18 },
  { month: 'Apr', present: 90, absent: 10 },
  { month: 'May', present: 87, absent: 13 },
  { month: 'Jun', present: 86, absent: 14 },
  { month: 'Jul', present: 89, absent: 11 },
  { month: 'Aug', present: 84, absent: 16 },
  { month: 'Sep', present: 91, absent: 9 },
  { month: 'Oct', present: 88, absent: 12 },
  { month: 'Nov', present: 90, absent: 10 },
  { month: 'Dec', present: 92, absent: 8 }
]

const walletData = [
  { month: 'Jan', transactions: 2400 },
  { month: 'Feb', transactions: 2210 },
  { month: 'Mar', transactions: 2290 },
  { month: 'Apr', transactions: 2000 },
  { month: 'May', transactions: 2181 },
  { month: 'Jun', transactions: 2300 },
  { month: 'Jul', transactions: 2500 },
  { month: 'Aug', transactions: 2100 },
  { month: 'Sep', transactions: 2650 },
  { month: 'Oct', transactions: 2400 },
  { month: 'Nov', transactions: 2550 },
  { month: 'Dec', transactions: 2700 }
]

const behaviorData = [
  { name: 'Excellent', value: 45 },
  { name: 'Good', value: 35 },
  { name: 'Average', value: 15 },
  { name: 'Poor', value: 5 }
]

const COLORS = ['#ff5c1c', '#ffa145', '#ffc87a', '#ffe5c8']

function formatCSVRow(cols: (string | number | null | undefined)[]) {
  return cols
    .map((c) => {
      const v = c ?? ''
      const s = String(v)
      if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
      return s
    })
    .join(',')
}

function buildCSVContent({
  attendance,
  wallet,
  behavior,
  filters
}: {
  attendance: typeof attendanceData
  wallet: typeof walletData
  behavior: typeof behaviorData
  filters: { school: string; period: string }
}) {
  const rows: string[] = []
  rows.push(formatCSVRow([`Report (School: ${filters.school}, Period: last ${filters.period} months)`]))
  rows.push('')

  rows.push(formatCSVRow(['Attendance Trends']))
  rows.push(formatCSVRow(['Month', 'Present', 'Absent']))
  attendance.forEach((r) => {
    rows.push(formatCSVRow([r.month, r.present, r.absent]))
  })
  rows.push('')

  rows.push(formatCSVRow(['Wallet Transactions Over Time']))
  rows.push(formatCSVRow(['Month', 'Transactions']))
  wallet.forEach((r) => {
    rows.push(formatCSVRow([r.month, r.transactions]))
  })
  rows.push('')

  rows.push(formatCSVRow(['Behavior Distribution']))
  rows.push(formatCSVRow(['Name', 'Value']))
  behavior.forEach((r) => {
    rows.push(formatCSVRow([r.name, r.value]))
  })

  return rows.join('\r\n')
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Filters
  const [period, setPeriod] = useState<'3' | '6' | '12'>('6')
  const [school, setSchool] = useState<'All' | 'School A' | 'School B'>('All')
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  // simulate school multipliers
  const schoolMultiplier = useMemo(() => {
    switch (school) {
      case 'School A':
        return { present: 1.02, transactions: 1.15, users: 1.1 }
      case 'School B':
        return { present: 0.98, transactions: 0.9, users: 0.9 }
      default:
        return { present: 1, transactions: 1, users: 1 }
    }
  }, [school])

  // Filtered datasets (slice last N months and apply multipliers)
  const monthsCount = Number(period)
  const filteredAttendance = useMemo(() => {
    const slice = attendanceData.slice(-monthsCount).map((r) => {
      const present = Math.min(100, Math.max(0, Math.round(r.present * schoolMultiplier.present)))
      const absent = Math.max(0, 100 - present)
      return { ...r, present, absent }
    })
    return slice
  }, [monthsCount, schoolMultiplier])

  const filteredWallet = useMemo(() => {
    return walletData.slice(-monthsCount).map((r) => {
      return { ...r, transactions: Math.round(r.transactions * schoolMultiplier.transactions) }
    })
  }, [monthsCount, schoolMultiplier])

  const filteredBehavior = useMemo(() => {
    // keep behavior static but could be adjusted similarly
    return behaviorData
  }, [])

  // Derived metrics
  const avgAttendance = useMemo(() => {
    if (filteredAttendance.length === 0) return 0
    return filteredAttendance.reduce((s, r) => s + r.present, 0) / filteredAttendance.length
  }, [filteredAttendance])

  const totalTransactions = useMemo(() => {
    return filteredWallet.reduce((s, r) => s + r.transactions, 0)
  }, [filteredWallet])

  const activeUsers = useMemo(() => {
    // simulated base active users per month
    const base = 1250
    const avgMultiplier = schoolMultiplier.users
    return Math.round(base * avgMultiplier)
  }, [schoolMultiplier])

  const avgLateness = useMemo(() => {
    // derive lateness from absent percentage (simulated)
    if (filteredAttendance.length === 0) return 0
    const avgAbsent = filteredAttendance.reduce((s, r) => s + r.absent, 0) / filteredAttendance.length
    // assume a proportion of absent are late instead of absent
    return +(avgAbsent * 0.35).toFixed(1)
  }, [filteredAttendance])

  const newRegistrations = useMemo(() => {
    // simulate: a small portion of transactions are new registrations
    return Math.round(totalTransactions * 0.02)
  }, [totalTransactions])

  const monthlyRevenue = useMemo(() => {
    // simulate revenue: transactions * avg fee
    const avgFee = 2.5
    return +(totalTransactions * avgFee).toFixed(2)
  }, [totalTransactions])

  const handleExportCSV = () => {
    const csv = buildCSVContent({
      attendance: filteredAttendance,
      wallet: filteredWallet,
      behavior: filteredBehavior,
      filters: { school, period }
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-')
    a.href = url
    a.download = `cardlect-report-${school.toLowerCase().replace(/\s+/g, '-')}-${period}m-${timestamp}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Optionally filter the metric cards (e.g., show only active)
  const metricCards = [
    {
      title: 'Avg Attendance',
      value: `${avgAttendance.toFixed(1)}%`,
      icon: <TrendingUp size={24} className="text-primary" />,
      bg: 'bg-primary/10 text-primary'
    },
    {
      title: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      icon: <DollarSign size={24} className="text-green-600" />,
      bg: 'bg-green-600/10 text-green-600'
    },
    {
      title: 'Active Users',
      value: activeUsers.toLocaleString(),
      icon: <Users size={24} className="text-blue-600" />,
      bg: 'bg-blue-600/10 text-blue-600'
    },
    {
      title: 'Period',
      value: `${period} months`,
      icon: <Calendar size={24} className="text-purple-600" />,
      bg: 'bg-purple-600/10 text-purple-600'
    },
    {
      title: 'Avg Lateness',
      value: `${avgLateness}%`,
      icon: <Clock size={20} className="text-amber-600" />,
      bg: 'bg-amber-600/10 text-amber-600'
    },
    {
      title: 'New Registrations',
      value: newRegistrations.toLocaleString(),
      icon: <Plus size={20} className="text-emerald-600" />,
      bg: 'bg-emerald-600/10 text-emerald-600'
    },
    {
      title: 'Monthly Revenue',
      value: `N${Number(monthlyRevenue).toLocaleString()}`,
      icon: <DollarSign size={20} className="text-pink-600" />,
      bg: 'bg-pink-600/10 text-pink-600'
    }
  ].filter((_, i) => {
    if (!showOnlyActive) return true
    // a simple "active" heuristic: keep cards 0..3
    return i < 4
  })

  return (
    <LayoutShell currentPage="analytics">
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {/* Header + Filters */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-border bg-card"
                  >
                    <option>All</option>
                    <option>School A</option>
                    <option>School B</option>
                  </select>
                  
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border border-border bg-card"
                  >
                    <option value="3">Last 3 months</option>
                    <option value="6">Last 6 months</option>
                    <option value="12">Last 12 months</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showOnlyActive}
                      onChange={(e) => setShowOnlyActive(e.target.checked)}
                      className="accent-primary"
                    />
                    Only core metrics
                  </label>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-all"
                  >
                    <Download size={18} />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {metricCards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">{c.title}</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">{c.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${c.bg}`}>{c.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Attendance */}
                <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Attendance Trends</h3>
                    <p className="text-sm text-muted-foreground">{school} · Last {period} months</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredAttendance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#ff5c1c" strokeWidth={3} />
                      <Line type="monotone" dataKey="absent" stroke="#999" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Behavior Chart */}
                <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Behavior Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={filteredBehavior}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {filteredBehavior.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Wallet */}
              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Wallet Transactions Over Time</h3>
                  <p className="text-sm text-muted-foreground">Est. revenue: ${monthlyRevenue.toLocaleString()}</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredWallet}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                    <Legend />
                    <Bar dataKey="transactions" fill="#ff5c1c" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </LayoutShell>
  )
}
