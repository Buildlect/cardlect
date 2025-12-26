"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, BookOpen, Clock, Wallet, CreditCard, FileText, UserPlus } from "lucide-react"
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

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()

  const handleNavigate = (href: string, pageId: string) => {
    setCurrentPage(pageId)
    router.push(href)
  }

  // Sample sparkline data
  const sampleSeries = [
    { name: "Mon", value: 60 },
    { name: "Tue", value: 75 },
    { name: "Wed", value: 68 },
    { name: "Thu", value: 82 },
    { name: "Fri", value: 71 },
    { name: "Sat", value: 85 },
    { name: "Sun", value: 78 },
  ]

  const metrics: Metric[] = [
    {
      icon: Users,
      label: "Total Students",
      value: "1,248",
      change: "+12%",
      colorClass: "from-blue-400 to-blue-600",
      colorHex: "#3b82f6",
      data: sampleSeries,
    },
    {
      icon: Users,
      label: "Total Staff",
      value: "45",
      change: "+2%",
      colorClass: "from-green-400 to-green-600",
      colorHex: "#22c55e",
      data: sampleSeries.map((d) => ({ ...d, value: Math.round(d.value / 4) })),
    },
    {
      icon: BookOpen,
      label: "Active Classes",
      value: "24",
      change: "0%",
      colorClass: "from-violet-400 to-violet-600",
      colorHex: "#a855f7",
      data: sampleSeries.map((d, i) => ({ ...d, value: 20 + (i % 3) * 2 })),
    },
    {
      icon: CreditCard,
      label: "Active Cards",
      value: "1,180",
      change: "+8%",
      colorClass: "from-orange-400 to-orange-600",
      colorHex: "#f97316",
      data: sampleSeries.map((d) => ({ ...d, value: d.value + 20 })),
    },
    {
      icon: Clock,
      label: "Attendance Today",
      value: "92%",
      change: "+4%",
      colorClass: "from-amber-400 to-amber-600",
      colorHex: "#f59e0b",
      data: sampleSeries.map((d) => ({ ...d, value: Math.round((d.value / 100) * 92) })),
    },
    {
      icon: Wallet,
      label: "Wallet Balance",
      value: "₦45,230",
      change: "+15%",
      colorClass: "from-emerald-400 to-emerald-600",
      colorHex: "#10b981",
      data: sampleSeries.map((d, i) => ({ ...d, value: 300 + i * 20 })),
    },
  ]

  // Overview data for the larger chart
  const overviewData = [
    { name: "Jan", students: 1000, cards: 900 },
    { name: "Feb", students: 1050, cards: 920 },
    { name: "Mar", students: 1075, cards: 940 },
    { name: "Apr", students: 1100, cards: 980 },
    { name: "May", students: 1120, cards: 1020 },
    { name: "Jun", students: 1150, cards: 1080 },
    { name: "Jul", students: 1170, cards: 1100 },
    { name: "Aug", students: 1200, cards: 1120 },
    { name: "Sep", students: 1225, cards: 1140 },
    { name: "Oct", students: 1248, cards: 1160 },
    { name: "Nov", students: 1260, cards: 1170 },
    { name: "Dec", students: 1280, cards: 1180 },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="admin">
      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            const positive = metric.change.startsWith("+")
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
                      {metric.change} from last month
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
                        content={<CustomTooltip color={metric.colorHex} unit={metric.label === "Wallet Balance" ? "₦" : ""} />}
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
              <h2 className="text-xl font-bold text-foreground">Overview</h2>
              <div className="text-sm text-muted-foreground">Monthly trend</div>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
                      <stop offset="60%" stopColor="#2563eb" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.26} />
                      <stop offset="60%" stopColor="#f97316" stopOpacity={0.07} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
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
                    tickFormatter={(v) => numberFormatter(v as number)}
                  />
                  <Tooltip content={<CustomTooltip color="#2563eb" />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ color: "var(--muted-foreground)", fontSize: 13 }}
                    iconType="circle"
                  />

                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#2563eb"
                    fill="url(#gradStudents)"
                    strokeWidth={2.5}
                    name="Students"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#2563eb" }}
                    isAnimationActive
                    animationDuration={900}
                  />
                  <Area
                    type="monotone"
                    dataKey="cards"
                    stroke="#f97316"
                    fill="url(#gradCards)"
                    strokeWidth={2.5}
                    name="Active Cards"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#f97316" }}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-in-out"
                    opacity={0.98}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-2">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mb-4">Common admin tasks</p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleNavigate("/admin/students", "students")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Manage Students</p>
                    <p className="text-xs text-muted-foreground">Add, edit, or view records</p>
                  </div>
                  <Users size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/staffs", "staffs")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Manage Staff</p>
                    <p className="text-xs text-muted-foreground">Add or edit staff profiles</p>
                  </div>
                  <UserPlus size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/classes", "classes")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Manage Classes</p>
                    <p className="text-xs text-muted-foreground">Create or modify class schedules</p>
                  </div>
                  <BookOpen size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/attendance", "attendance")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">View Attendance</p>
                    <p className="text-xs text-muted-foreground">Track daily attendance</p>
                  </div>
                  <Clock size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/reports", "reports")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">View Reports</p>
                    <p className="text-xs text-muted-foreground">Export or view analytics</p>
                  </div>
                  <FileText size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/wallet", "wallet")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Manage Wallet</p>
                    <p className="text-xs text-muted-foreground">Balances & transactions (₦)</p>
                  </div>
                  <Wallet size={18} className="text-primary" />
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/admin/cards", "cards")}
                className="w-full p-3 text-left rounded-lg bg-border/20 hover:scale-[1.01] transition transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Manage Cards</p>
                    <p className="text-xs text-muted-foreground">View or lock cards</p>
                  </div>
                  <CreditCard size={18} className="text-primary" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
