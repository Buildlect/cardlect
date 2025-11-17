// Updated AnalyticsPage with enhanced metric card designs matching previous style
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
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

const attendanceData = [
  { month: 'Jan', present: 85, absent: 15 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 82, absent: 18 },
  { month: 'Apr', present: 90, absent: 10 },
  { month: 'May', present: 87, absent: 13 },
]

const walletData = [
  { month: 'Jan', transactions: 2400 },
  { month: 'Feb', transactions: 2210 },
  { month: 'Mar', transactions: 2290 },
  { month: 'Apr', transactions: 2000 },
  { month: 'May', transactions: 2181 },
]

const behaviorData = [
  { name: 'Excellent', value: 45 },
  { name: 'Good', value: 35 },
  { name: 'Average', value: 15 },
  { name: 'Poor', value: 5 },
]

const COLORS = ['#ff5c1c', '#ffa145', '#ffc87a', '#ffe5c8']

export default function AnalyticsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(href) => router.push(href)}
        currentPage="analytics"
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
                <p className="text-muted-foreground">Comprehensive insights across all schools</p>
              </div>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-all">
                <Download size={18} />
                Export Report
              </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card */}
              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Avg Attendance</p>
                    <p className="text-4xl font-bold text-foreground">87%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 text-primary"><TrendingUp size={24} /></div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Total Transactions</p>
                    <p className="text-4xl font-bold text-foreground">11.1K</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-600/10 text-green-600"><DollarSign size={24} /></div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Active Users</p>
                    <p className="text-4xl font-bold text-foreground">1,250</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600"><Users size={24} /></div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Period</p>
                    <p className="text-sm text-muted-foreground">Last 6 Months</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-600/10 text-purple-600"><Calendar size={24} /></div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Attendance */}
              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis stroke="var(--color-muted-foreground)" />
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
                      data={behaviorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {behaviorData.map((entry, index) => (
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Wallet Transactions Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={walletData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis stroke="var(--color-muted-foreground)" />
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
  )
}
