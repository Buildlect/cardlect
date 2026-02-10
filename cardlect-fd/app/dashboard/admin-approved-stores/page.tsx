'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Store, TrendingUp, Users, DollarSign, MapPin, Star, Clock, CheckCircle, AlertCircle, Edit2, Trash2, Plus } from 'lucide-react'
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

interface ApprovedStore {
  id: string
  name: string
  location: string
  category: string
  status: 'active' | 'pending' | 'inactive'
  monthlyTransactions: number
  monthlyVolume: number
  rating: number
  cardUsersThisMonth: number
  approvalDate: string
  contact: string
}

export default function AdminApprovedStoresPage() {
  const [approvedStores] = useState<ApprovedStore[]>([
    {
      id: '1',
      name: 'BrightSnacks Cafeteria',
      location: 'Oxford International School - Lagos',
      category: 'Food & Beverage',
      status: 'active',
      monthlyTransactions: 2156,
      monthlyVolume: 185000,
      rating: 4.8,
      cardUsersThisMonth: 1248,
      approvalDate: '2023-06-15',
      contact: '0701-234-5678',
    },
    {
      id: '2',
      name: 'Tech Hub Store',
      location: 'Trinity Academy - Abuja',
      category: 'Electronics & Books',
      status: 'active',
      monthlyTransactions: 1654,
      monthlyVolume: 142000,
      rating: 4.5,
      cardUsersThisMonth: 856,
      approvalDate: '2023-08-22',
      contact: '0801-567-8901',
    },
    {
      id: '3',
      name: 'Uniform & Sports Hub',
      location: "St. Mary's Secondary - Ibadan",
      category: 'School Supplies',
      status: 'active',
      monthlyTransactions: 1324,
      monthlyVolume: 128000,
      rating: 4.6,
      cardUsersThisMonth: 624,
      approvalDate: '2023-09-10',
      contact: '0704-891-2345',
    },
    {
      id: '4',
      name: 'Premium Bookshop',
      location: 'Mainland Academy - Lagos',
      category: 'Books & Stationery',
      status: 'pending',
      monthlyTransactions: 856,
      monthlyVolume: 68000,
      rating: 4.3,
      cardUsersThisMonth: 412,
      approvalDate: '2024-01-05',
      contact: '0705-123-4567',
    },
  ])

  const monthlyData = [
    { month: 'Sep', volume: 420000, transactions: 4520, users: 2100 },
    { month: 'Oct', volume: 480000, transactions: 5120, users: 2340 },
    { month: 'Nov', volume: 520000, transactions: 5680, users: 2620 },
    { month: 'Dec', volume: 580000, transactions: 6200, users: 2900 },
    { month: 'Jan', volume: 455000, transactions: 4850, users: 2728 },
  ]

  const storePerformance = [
    { name: 'Food & Beverage', value: 185000, color: CARDLECT_COLORS.primary.darker },
    { name: 'Electronics & Books', value: 142000, color: CARDLECT_COLORS.primary.main },
    { name: 'School Supplies', value: 128000, color: CARDLECT_COLORS.info.main },
    { name: 'Books & Stationery', value: 68000, color: CARDLECT_COLORS.secondary.main },
  ]

  const stats = {
    totalStores: approvedStores.length,
    activeStores: approvedStores.filter(s => s.status === 'active').length,
    pendingApprovals: approvedStores.filter(s => s.status === 'pending').length,
    totalMonthlyVolume: approvedStores.reduce((sum, s) => sum + s.monthlyVolume, 0),
    totalCardUsers: approvedStores.reduce((sum, s) => sum + s.cardUsersThisMonth, 0),
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: SEMANTIC_COLORS.status.online, bg: '#10B98120', text: 'Active' }
      case 'pending':
        return { color: CARDLECT_COLORS.warning.main, bg: '#FFC10720', text: 'Pending' }
      case 'inactive':
        return { color: CARDLECT_COLORS.danger.main, bg: '#F4433620', text: 'Inactive' }
      default:
        return { color: '#9E9E9E', bg: '#9E9E9E20', text: 'Unknown' }
    }
  }

  return (
    <DashboardLayout currentPage="approved-stores" role="admin">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores Management</h1>
            <p className="text-muted-foreground">Monitor and manage partner stores authorized for student/parent card transactions.</p>
          </div>
          <button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
            <Plus size={20} />
            Approve New Store
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Total Stores</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalStores}</p>
          <p className="text-xs text-muted-foreground mt-2">{stats.activeStores} active</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Monthly Volume</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>₦{(stats.totalMonthlyVolume / 1000).toFixed(0)}k</p>
          <p className="text-xs text-muted-foreground mt-2">+8% from last month</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Card Users</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.secondary.main }}>{stats.totalCardUsers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Active this month</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Pending</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.pendingApprovals}</p>
          <p className="text-xs text-muted-foreground mt-2">Awaiting approval</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Avg Rating</p>
          <p className="text-3xl font-bold text-foreground">4.5★</p>
          <p className="text-xs text-muted-foreground mt-2">Based on transactions</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Volume Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">Monthly Transaction Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="grad-stores" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#grad-stores)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Category Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">By Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={storePerformance} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                  {storePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(0)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-5 text-foreground">All Approved Stores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Store</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Category</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Status</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Monthly Volume</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Transactions</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Rating</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedStores.map((store) => {
                const statusBadge = getStatusBadge(store.status)
                return (
                  <tr key={store.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-foreground font-semibold">{store.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{store.location}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground text-xs">{store.category}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusBadge.color }} />
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-foreground font-semibold">₦{(store.monthlyVolume / 1000).toFixed(0)}k</td>
                    <td className="py-4 px-4 text-foreground text-xs">{store.monthlyTransactions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-foreground text-xs">
                      <span style={{ color: CARDLECT_COLORS.warning.main }}>★ {store.rating}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
                        </button>
                        {store.status === 'pending' ? (
                          <button className="p-2 hover:bg-green-500/10 rounded-lg transition-colors" style={{ color: SEMANTIC_COLORS.status.online }} title="Approve">
                            <CheckCircle size={16} />
                          </button>
                        ) : (
                          <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors" style={{ color: CARDLECT_COLORS.danger.main }} title="Deactivate">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
