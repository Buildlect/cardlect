'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Store, MapPin, DollarSign, TrendingUp, ShoppingCart, CheckCircle, Plus, Eye, Bell, CreditCard } from 'lucide-react'
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
  rating: number
  distance: string
  operatingHours: string
  acceptedCards: boolean
  lastVisit: string
}

interface ChildTransaction {
  id: string
  childName: string
  store: string
  amount: number
  date: string
  time: string
  category: string
}

export default function ParentApprovedStoresPage() {
  const [approvedStores] = useState<ApprovedStore[]>([
    {
      id: '1',
      name: 'BrightSnacks Cafeteria',
      location: 'Inside Oxford International School',
      category: 'Food & Beverage',
      rating: 4.8,
      distance: '0.5 km',
      operatingHours: '6:30 AM - 4:30 PM (Weekdays)',
      acceptedCards: true,
      lastVisit: 'Today, 12:45 PM',
    },
    {
      id: '2',
      name: 'Tech Hub Store',
      location: 'Inside Trinity Academy',
      category: 'Electronics & Books',
      rating: 4.5,
      distance: 'On Campus',
      operatingHours: '8:00 AM - 5:00 PM (Weekdays)',
      acceptedCards: true,
      lastVisit: 'Yesterday, 2:30 PM',
    },
    {
      id: '3',
      name: 'Uniform & Sports Hub',
      location: "Inside St. Mary's Secondary",
      category: 'School Supplies',
      rating: 4.6,
      distance: 'On Campus',
      operatingHours: '7:00 AM - 4:00 PM (Weekdays)',
      acceptedCards: true,
      lastVisit: '3 days ago',
    },
  ])

  const [childTransactions] = useState<ChildTransaction[]>([
    {
      id: '1',
      childName: 'Sarah Johnson',
      store: 'BrightSnacks Cafeteria',
      amount: 2500,
      date: '2024-01-15',
      time: '12:45 PM',
      category: 'Food & Beverage',
    },
    {
      id: '2',
      childName: 'Michael Johnson',
      store: 'Tech Hub Store',
      amount: 5000,
      date: '2024-01-14',
      time: '3:15 PM',
      category: 'Books & Stationery',
    },
    {
      id: '3',
      childName: 'Emma Johnson',
      store: 'Uniform & Sports Hub',
      amount: 3500,
      date: '2024-01-12',
      time: '2:10 PM',
      category: 'School Uniforms',
    },
    {
      id: '4',
      childName: 'Sarah Johnson',
      store: 'BrightSnacks Cafeteria',
      amount: 1800,
      date: '2024-01-10',
      time: '1:20 PM',
      category: 'Food & Beverage',
    },
  ])

  const spendingData = [
    { day: 'Mon', Sarah: 2500, Michael: 0, Emma: 0 },
    { day: 'Tue', Sarah: 0, Michael: 5000, Emma: 0 },
    { day: 'Wed', Sarah: 1800, Michael: 0, Emma: 3500 },
    { day: 'Thu', Sarah: 2000, Michael: 0, Emma: 0 },
    { day: 'Fri', Sarah: 3000, Michael: 4200, Emma: 2500 },
  ]

  const spendByCategory = [
    { name: 'Food & Beverage', value: 12500, color: CARDLECT_COLORS.primary.darker },
    { name: 'Books & Stationery', value: 9200, color: CARDLECT_COLORS.primary.main },
    { name: 'School Supplies', value: 6000, color: CARDLECT_COLORS.info.main },
  ]

  const stats = {
    totalStores: approvedStores.length,
    totalSpending: childTransactions.reduce((sum, t) => sum + t.amount, 0),
    avgTransaction: Math.round(childTransactions.reduce((sum, t) => sum + t.amount, 0) / childTransactions.length),
    thisMonth: 28000,
  }

  return (
    <DashboardLayout currentPage="approved-stores" role="parents">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores & Spending</h1>
          <p className="text-muted-foreground">Monitor where your children can use their cards and track their spending at approved stores.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Approved Stores</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalStores}</p>
          <p className="text-xs text-muted-foreground mt-2">Available this month</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">This Month Spending</p>
          <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>₦{(stats.thisMonth / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground mt-2">All children combined</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Avg Transaction</p>
          <p className="text-3xl font-bold" style={{ color: SEMANTIC_COLORS.financial.income }}>₦{stats.avgTransaction.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-1">Transactions</p>
          <p className="text-3xl font-bold text-foreground">{childTransactions.length}</p>
          <p className="text-xs text-muted-foreground mt-2">This period</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Spending Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-5 text-foreground">Weekly Spending by Child</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingData}>
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
                <Legend />
                <Bar dataKey="Sarah" stackId="a" fill={CARDLECT_COLORS.primary.darker} />
                <Bar dataKey="Michael" stackId="a" fill={CARDLECT_COLORS.primary.main} />
                <Bar dataKey="Emma" stackId="a" fill={CARDLECT_COLORS.secondary.main} />
              </BarChart>
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

      {/* Approved Stores */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Available Stores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvedStores.map((store) => (
            <div key={store.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground text-sm">{store.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{store.category}</p>
                </div>
                <div className="flex items-center gap-0.5" style={{ color: CARDLECT_COLORS.warning.main }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ opacity: i < Math.floor(store.rating) ? 1 : 0.3 }}>★</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-3 pb-3 border-b border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{store.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: SEMANTIC_COLORS.status.online }} />
                  <span>{store.operatingHours}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span className="text-foreground font-semibold">{store.lastVisit}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Cards:</span>
                  {store.acceptedCards && (
                    <div className="flex items-center gap-1" style={{ color: SEMANTIC_COLORS.status.online }}>
                      <CheckCircle size={14} />
                      <span className="font-semibold">Accepted</span>
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full py-2 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15', color: CARDLECT_COLORS.primary.darker }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-4 text-foreground">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold text-xs">Child Name</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold text-xs">Store</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold text-xs">Category</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold text-xs">Amount</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold text-xs">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {childTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 text-foreground font-medium text-xs">{txn.childName}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{txn.store}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{txn.category}</td>
                  <td className="py-3 px-2 text-foreground font-semibold">₦{txn.amount.toLocaleString()}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{txn.date} @ {txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="w-full mt-4 py-2 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15', color: CARDLECT_COLORS.primary.darker }}>
          View All Transactions →
        </button>
      </div>
    </DashboardLayout>
  )
}
