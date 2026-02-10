'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Store, TrendingUp, Users, DollarSign, Globe, BarChart3, CheckCircle, Plus, Edit2, Shield } from 'lucide-react'
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

interface SchoolStores {
  schoolName: string
  schoolId: string
  region: string
  storeCount: number
  monthlyVolume: number
  activeUsers: number
  status: 'active' | 'inactive'
}

export default function SuperUserApprovedStoresPage() {
  const [schoolStores] = useState<SchoolStores[]>([
    {
      schoolName: 'Oxford International School',
      schoolId: 'OIS-001',
      region: 'South-West',
      storeCount: 3,
      monthlyVolume: 245000,
      activeUsers: 1248,
      status: 'active',
    },
    {
      schoolName: 'Trinity Academy',
      schoolId: 'TA-002',
      region: 'North-Central',
      storeCount: 2,
      monthlyVolume: 180000,
      activeUsers: 856,
      status: 'active',
    },
    {
      schoolName: "St. Mary's Secondary",
      schoolId: 'SMS-003',
      region: 'South-West',
      storeCount: 1,
      monthlyVolume: 128000,
      activeUsers: 624,
      status: 'active',
    },
    {
      schoolName: 'Mainland Academy',
      schoolId: 'MA-004',
      region: 'South-South',
      storeCount: 2,
      monthlyVolume: 92000,
      activeUsers: 412,
      status: 'inactive',
    },
  ])

  const regionData = [
    { region: 'South-West', stores: 4, volume: 373000, users: 1872 },
    { region: 'North-Central', stores: 2, volume: 180000, users: 856 },
    { region: 'South-South', stores: 2, volume: 92000, users: 412 },
    { region: 'North-West', stores: 1, volume: 45000, users: 128 },
  ]

  const trendData = [
    { month: 'Sep', stores: 6, volume: 456000, growth: 0 },
    { month: 'Oct', volume: 520000, growth: 14 },
    { month: 'Nov', volume: 580000, growth: 12 },
    { month: 'Dec', volume: 645000, growth: 11 },
    { month: 'Jan', volume: 690000, growth: 7 },
  ]

  const stats = {
    totalSchools: schoolStores.length,
    activeSchools: schoolStores.filter(s => s.status === 'active').length,
    totalStores: schoolStores.reduce((sum, s) => sum + s.storeCount, 0),
    totalVolume: schoolStores.reduce((sum, s) => sum + s.monthlyVolume, 0),
    totalUsers: schoolStores.reduce((sum, s) => sum + s.activeUsers, 0),
  }

  const regionPerformance = [
    { name: 'South-West', value: 373000, color: CARDLECT_COLORS.primary.darker },
    { name: 'North-Central', value: 180000, color: CARDLECT_COLORS.primary.main },
    { name: 'South-South', value: 92000, color: CARDLECT_COLORS.info.main },
    { name: 'North-West', value: 45000, color: CARDLECT_COLORS.secondary.main },
  ]

  return (
    <DashboardLayout currentPage="approved-stores" role="super-user">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores Network</h1>
            <p className="text-muted-foreground">Monitor approved stores across all schools, manage partnerships, and track system-wide performance.</p>
          </div>
          <button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
            <Plus size={20} />
            New Partnership
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Schools</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalSchools}</p>
          <p className="text-xs text-muted-foreground mt-2">{stats.activeSchools} active</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Total Stores</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.totalStores}</p>
          <p className="text-xs text-muted-foreground mt-2">Approved & active</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Monthly Volume</p>
          <p className="text-3xl font-bold" style={{ color: SEMANTIC_COLORS.financial.income }}>₦{(stats.totalVolume / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground mt-2">+7% this month</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Card Users</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.secondary.main }}>{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Across network</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Avg Volume/School</p>
          <p className="text-3xl font-bold text-foreground">₦{(stats.totalVolume / stats.totalSchools / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground mt-2">Per school monthly</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Growth Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">Network Growth Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad-network" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(0)}k`}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={3}
                  fill="url(#grad-network)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">By Region</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionPerformance} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                  {regionPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(0)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Schools with Stores Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-5 text-foreground">Schools & Stores Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">School</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Region</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Stores</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Monthly Volume</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Card Users</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Status</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schoolStores.map((school) => (
                <tr key={school.schoolId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-foreground font-semibold">{school.schoolName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{school.schoolId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-muted-foreground" />
                      {school.region}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '20', color: CARDLECT_COLORS.primary.darker }}>
                      <Store size={12} />
                      {school.storeCount}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-foreground font-semibold">₦{(school.monthlyVolume / 1000).toFixed(0)}k</td>
                  <td className="py-4 px-4 text-foreground text-xs">{school.activeUsers.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: school.status === 'active' ? `${CARDLECT_COLORS.success.main}33` : `${CARDLECT_COLORS.danger.main}33`, color: school.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: school.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }} />
                      {school.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                        <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="View Details">
                        <BarChart3 size={16} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
