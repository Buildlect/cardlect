'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import {
  Users,
  Shield,
  Bell,
  DoorOpen,
  FileText,
  UserCheck,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'

interface MetricCard {
  title: string
  value: number
  change: string
  icon: React.ReactNode
  borderColor: string
  href?: string
}

interface ActivityItem {
  id: string
  time: string
  type: 'entry' | 'exit' | 'alert' | 'incident'
  description: string
  user?: string
  location?: string
  icon: React.ReactNode
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export default function SecurityDashboard() {
  const [refreshing, setRefreshing] = useState(false)

  const metrics: MetricCard[] = [
    {
      title: 'TOTAL STUDENTS',
      value: 1247,
      change: 'Enrolled this year',
      icon: <Users className="w-5 h-5" />,
      borderColor: `border-l-[${CARDLECT_COLORS.info.main}]`,
      href: '/admin/students'
    },
    {
      title: 'ACTIVE GATES',
      value: 8,
      change: 'All operational',
      icon: <DoorOpen className="w-5 h-5" />,
      borderColor: `border-l-[${SEMANTIC_COLORS.status.online}]`
    },
    {
      title: 'TODAY\'S ALERTS',
      value: 3,
      change: '2 resolved',
      icon: <Bell className="w-5 h-5" />,
      borderColor: `border-l-[${CARDLECT_COLORS.warning.main}]`,
      href: '/security/alerts'
    },
    {
      title: 'CURRENTLY INSIDE',
      value: 234,
      change: 'Peak: 312',
      icon: <UserCheck className="w-5 h-5" />,
      borderColor: `border-l-[${CARDLECT_COLORS.accent.main}]`
    }
  ]

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      time: '2 min ago',
      type: 'entry',
      description: 'Student entry granted',
      user: 'Alice Johnson (STU001)',
      location: 'Main Entrance',
      icon: <DoorOpen className="w-4 h-4 text-green-500" />
    },
    {
      id: '2',
      time: '5 min ago',
      type: 'alert',
      description: 'Unauthorized access attempt',
      location: 'Side Gate B',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />
    },
    {
      id: '3',
      time: '8 min ago',
      type: 'exit',
      description: 'Staff exit recorded',
      user: 'Dr. Smith (STA005)',
      location: 'Staff Exit',
      icon: <DoorOpen className="w-4 h-4 text-blue-500" />
    },
    {
      id: '4',
      time: '12 min ago',
      type: 'incident',
      description: 'Visitor check-in completed',
      user: 'John Parent',
      location: 'Visitor Center',
      icon: <FileText className="w-4 h-4 text-purple-500" />
    },
    {
      id: '5',
      time: '15 min ago',
      type: 'entry',
      description: 'Bulk entry - Class 5A',
      location: 'School Yard Gate',
      icon: <Users className="w-4 h-4 text-green-500" />
    }
  ]

  const quickActions: QuickAction[] = [
    {
      title: 'View Gate Logs',
      description: 'Monitor all access events',
      icon: <DoorOpen className="w-5 h-5" />,
      href: '/security/gate-logs',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Check Alerts',
      description: 'Review security notifications',
      icon: <Bell className="w-5 h-5" />,
      href: '/security/alerts',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: 'Visitor Management',
      description: 'Manage visitor access',
      icon: <FileText className="w-5 h-5" />,
      href: '/security/visitor-incident-log',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Pickup Authorization',
      description: 'Authorize student pickups',
      icon: <UserCheck className="w-5 h-5" />,
      href: '/security/pickup-authorization',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  // Chart data
  const accessPatternsData = [
    { time: '6 AM', entries: 12, exits: 8 },
    { time: '7 AM', entries: 45, exits: 32 },
    { time: '8 AM', entries: 89, exits: 67 },
    { time: '9 AM', entries: 156, exits: 134 },
    { time: '10 AM', entries: 98, exits: 112 },
    { time: '11 AM', entries: 76, exits: 89 },
    { time: '12 PM', entries: 123, exits: 145 },
    { time: '1 PM', entries: 87, exits: 92 },
    { time: '2 PM', entries: 65, exits: 78 },
    { time: '3 PM', entries: 134, exits: 156 },
    { time: '4 PM', entries: 167, exits: 189 },
    { time: '5 PM', entries: 198, exits: 234 },
    { time: '6 PM', entries: 45, exits: 67 }
  ]

  const alertsData = [
    { time: 'Mon', critical: 2, warning: 5, info: 12 },
    { time: 'Tue', critical: 1, warning: 3, info: 8 },
    { time: 'Wed', critical: 0, warning: 7, info: 15 },
    { time: 'Thu', critical: 3, warning: 4, info: 9 },
    { time: 'Fri', critical: 1, warning: 6, info: 11 },
    { time: 'Sat', critical: 0, warning: 2, info: 4 },
    { time: 'Sun', critical: 1, warning: 3, info: 6 }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <DashboardLayout currentPage="dashboard" role="security">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold">Security Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's an overview of your school's security status.
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className={`bg-card border border-border rounded-3xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all ${metric.href ? 'cursor-pointer' : ''}`}
                onClick={() => metric.href && (window.location.href = metric.href)}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium mb-1">
                      {metric.title}
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                      {metric.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                        {metric.icon}
                        <span className="opacity-90">{metric.change}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Access Patterns Chart */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
                Access Patterns Today
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accessPatternsData}>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ stroke: '#06B6D4', strokeWidth: 1, opacity: 0.2 }}
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        color: 'var(--foreground)'
                      }}
                      formatter={(value) => [`${value}`, '']}
                    />
                    <defs>
                      <linearGradient id="entriesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      dot={false}
                      name="Entries"
                    />
                    <Line
                      type="monotone"
                      dataKey="exits"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      name="Exits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts Over Time Chart */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
                Alerts This Week
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsData}>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        color: 'var(--foreground)'
                      }}
                    />
                    <Bar dataKey="critical" stackId="a" fill="#EF4444" />
                    <Bar dataKey="warning" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="info" stackId="a" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}