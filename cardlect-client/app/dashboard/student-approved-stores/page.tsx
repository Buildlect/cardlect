'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Store, MapPin, DollarSign, TrendingUp, ShoppingCart, CheckCircle, StarIcon, Clock, AlertCircle } from 'lucide-react'
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

interface ApprovedStore {
  id: string
  name: string
  location: string
  category: string
  rating: number
  operatingHours: string
  acceptedCards: boolean
  specialOffers: string
}

interface StudentTransaction {
  id: string
  store: string
  amount: number
  date: string
  time: string
  category: string
  status: 'completed' | 'pending'
}

export default function StudentApprovedStoresPage() {
  const [approvedStores] = useState<ApprovedStore[]>([
    {
      id: '1',
      name: 'BrightSnacks Cafeteria',
      location: 'Inside your school',
      category: 'Food & Beverage',
      rating: 4.8,
      operatingHours: '6:30 AM - 4:30 PM',
      acceptedCards: true,
      specialOffers: '10% off on Fridays',
    },
    {
      id: '2',
      name: 'Tech Hub Store',
      location: 'Next to library',
      category: 'Electronics & Books',
      rating: 4.5,
      operatingHours: '8:00 AM - 5:00 PM',
      acceptedCards: true,
      specialOffers: 'Student discount available',
    },
    {
      id: '3',
      name: 'Uniform & Sports Hub',
      location: 'School campus',
      category: 'School Supplies',
      rating: 4.6,
      operatingHours: '7:00 AM - 4:00 PM',
      acceptedCards: true,
      specialOffers: 'Bulk discounts',
    },
  ])

  const [studentTransactions] = useState<StudentTransaction[]>([
    {
      id: '1',
      store: 'BrightSnacks Cafeteria',
      amount: 2500,
      date: '2024-01-15',
      time: '12:45 PM',
      category: 'Lunch',
      status: 'completed',
    },
    {
      id: '2',
      store: 'Tech Hub Store',
      amount: 5000,
      date: '2024-01-14',
      time: '3:15 PM',
      category: 'Books',
      status: 'completed',
    },
    {
      id: '3',
      store: 'BrightSnacks Cafeteria',
      amount: 1500,
      date: '2024-01-12',
      time: '1:20 PM',
      category: 'Snacks',
      status: 'completed',
    },
    {
      id: '4',
      store: 'Tech Hub Store',
      amount: 3200,
      date: '2024-01-10',
      time: '2:45 PM',
      category: 'Notebook & Pen',
      status: 'completed',
    },
  ])

  const spendingTrend = [
    { day: 'Mon', amount: 2500 },
    { day: 'Tue', amount: 1800 },
    { day: 'Wed', amount: 5000 },
    { day: 'Thu', amount: 2200 },
    { day: 'Fri', amount: 3500 },
  ]

  const spendByCategory = [
    { name: 'Food & Beverage', value: 8500, color: CARDLECT_COLORS.primary.darker },
    { name: 'Books & Stationery', value: 8200, color: CARDLECT_COLORS.primary.main },
    { name: 'Supplies', value: 3200, color: CARDLECT_COLORS.info.main },
  ]

  const stats = {
    totalStores: approvedStores.length,
    thisWeekSpending: 15000,
    thisMonthSpending: 19900,
    avgPerTransaction: Math.round(19900 / 4),
    transactionCount: studentTransactions.length,
  }

  return (
    <DashboardLayout currentPage="approved-stores" role="students">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores Near You</h1>
          <p className="text-muted-foreground">Find stores where you can use your card and track your spending across school.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Available Stores</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalStores}</p>
          <p className="text-xs text-muted-foreground mt-2">All accept your card</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">This Week</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>₦{(stats.thisWeekSpending / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground mt-2">Total spent</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">This Month</p>
          <p className="text-3xl font-bold" style={{ color: SEMANTIC_COLORS.financial.income }}>₦{(stats.thisMonthSpending / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground mt-2">Total spent</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Avg Transaction</p>
          <p className="text-3xl font-bold text-foreground">₦{stats.avgPerTransaction.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Per visit</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Spending Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">Weekly Spending Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient id="grad-spending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: any) => `₦${Number(value).toLocaleString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={3}
                  fill="url(#grad-spending)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">By Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendByCategory} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                  {spendByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₦${(Number(value) / 1000).toFixed(1)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Approved Stores Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Available at Your School</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvedStores.map((store) => (
            <div key={store.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{store.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{store.category}</p>
                </div>
                <div className="flex items-center" style={{ color: CARDLECT_COLORS.warning.main }}>
                  ★ {store.rating}
                </div>
              </div>

              <div className="space-y-2 mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin size={14} />
                  <span>{store.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>{store.operatingHours}</span>
                </div>
              </div>

              <div className="mb-4">
                {store.specialOffers && (
                  <div className="flex items-center gap-2 text-xs" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '20', color: CARDLECT_COLORS.primary.darker, padding: '8px 12px', borderRadius: '8px' }}>
                    <TrendingUp size={14} />
                    <span className="font-semibold">{store.specialOffers}</span>
                  </div>
                )}
              </div>

              {store.acceptedCards && (
                <div className="flex items-center justify-center gap-2 p-2 rounded-lg" style={{ backgroundColor: SEMANTIC_COLORS.status.online + '20' }}>
                  <CheckCircle size={16} style={{ color: SEMANTIC_COLORS.status.online }} />
                  <span className="text-xs font-semibold" style={{ color: SEMANTIC_COLORS.status.online }}>Card Accepted</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-4 text-foreground">Your Recent Spending</h3>
        <div className="space-y-3">
          {studentTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{txn.store}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{txn.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{txn.date} @ {txn.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">₦{txn.amount.toLocaleString()}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1" style={{ backgroundColor: SEMANTIC_COLORS.status.online + '20', color: SEMANTIC_COLORS.status.online }}>
                  ✓ Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
