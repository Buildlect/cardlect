'use client'

import { useState } from 'react'
import { LayoutShell } from "@/components/Security/layout.shell"
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
      borderColor: 'border-l-blue-500',
      href: '/admin/students'
    },
    {
      title: 'ACTIVE GATES',
      value: 8,
      change: 'All operational',
      icon: <DoorOpen className="w-5 h-5" />,
      borderColor: 'border-l-green-500'
    },
    {
      title: 'TODAY\'S ALERTS',
      value: 3,
      change: '2 resolved',
      icon: <Bell className="w-5 h-5" />,
      borderColor: 'border-l-yellow-500',
      href: '/security/alerts'
    },
    {
      title: 'CURRENTLY INSIDE',
      value: 234,
      change: 'Peak: 312',
      icon: <UserCheck className="w-5 h-5" />,
      borderColor: 'border-l-purple-500'
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
    <LayoutShell currentPage="dashboard">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className={`bg-card border-l-4 ${metric.borderColor} border border-border rounded-lg p-6 hover:bg-secondary/40 transition-colors ${metric.href ? 'cursor-pointer' : ''}`}
                onClick={() => metric.href && (window.location.href = metric.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-muted-foreground text-xs font-medium tracking-wide">
                    {metric.title}
                  </div>
                  <div className="text-muted-foreground">{metric.icon}</div>
                </div>
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.change}</div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Access Patterns Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Access Patterns Today</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accessPatternsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="time"
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="entries"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      name="Entries"
                      dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="exits"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Exits"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts Over Time Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Alerts This Week</h2>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar
                      dataKey="critical"
                      stackId="a"
                      fill="#EF4444"
                      name="Critical"
                    />
                    <Bar
                      dataKey="warning"
                      stackId="a"
                      fill="#F59E0B"
                      name="Warning"
                    />
                    <Bar
                      dataKey="info"
                      stackId="a"
                      fill="#3B82F6"
                      name="Info"
                    />
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
    </LayoutShell >
  )
}