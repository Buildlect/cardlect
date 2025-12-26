'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LogIn,
  LogOut,
  Shield,
  Users,
  Download,
  Search,
  Calendar,
  X,
  ChevronDown,
  RefreshCw
} from 'lucide-react'

interface GateLog {
  id: string
  time: string
  userName: string
  userId: string
  gateLocation: string
  accessType: 'entry' | 'exit'
  status: 'granted' | 'denied' | 'pending'
}

interface StatCard {
  title: string
  value: number
  change: string
  icon: React.ReactNode
  borderColor: string
}

export default function GateLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const handleExportLogs = () => {
    const csvContent = generateCSVContent()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    link.href = url
    link.download = `gate-logs-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateCSVContent = () => {
    const headers = ['Time', 'User Name', 'User ID', 'Gate Location', 'Access Type', 'Status']
    const rows = [
      headers.join(','),
      ...gateLogs.map(log => [
        `"${log.time}"`,
        `"${log.userName}"`,
        `"${log.userId}"`,
        `"${log.gateLocation}"`,
        `"${log.accessType}"`,
        `"${log.status}"`
      ].join(','))
    ]
    return rows.join('\n')
  }

  const stats: StatCard[] = [
    {
      title: 'TOTAL ENTRIES TODAY',
      value: 156,
      change: '+23% from yesterday',
      icon: <LogIn className="w-5 h-5" />,
      borderColor: 'border-l-green-500'
    },
    {
      title: 'TOTAL EXITS TODAY',
      value: 142,
      change: '98% completion rate',
      icon: <LogOut className="w-5 h-5" />,
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'ACCESS DENIED',
      value: 3,
      change: 'This week',
      icon: <Shield className="w-5 h-5" />,
      borderColor: 'border-l-red-500'
    },
    {
      title: 'ACTIVE USERS',
      value: 28,
      change: 'Currently on premises',
      icon: <Users className="w-5 h-5" />,
      borderColor: 'border-l-purple-500'
    }
  ]

  const gateLogs: GateLog[] = [
    {
      id: '1',
      time: '08:30 AM',
      userName: 'Alice Johnson',
      userId: 'STU001',
      gateLocation: 'Main Entrance',
      accessType: 'entry',
      status: 'granted'
    },
    {
      id: '2',
      time: '08:45 AM',
      userName: 'Bob Smith',
      userId: 'STU002',
      gateLocation: 'Side Gate A',
      accessType: 'entry',
      status: 'granted'
    },
    {
      id: '3',
      time: '09:00 AM',
      userName: 'Charlie Brown',
      userId: 'STA001',
      gateLocation: 'Staff Entrance',
      accessType: 'entry',
      status: 'denied'
    },
    {
      id: '4',
      time: '09:15 AM',
      userName: 'Diana Prince',
      userId: 'STU003',
      gateLocation: 'Main Entrance',
      accessType: 'exit',
      status: 'granted'
    },
    {
      id: '5',
      time: '09:30 AM',
      userName: 'Eve Wilson',
      userId: 'STU004',
      gateLocation: 'Library Exit',
      accessType: 'exit',
      status: 'pending'
    },
    {
      id: '6',
      time: '09:45 AM',
      userName: 'Frank Miller',
      userId: 'STA002',
      gateLocation: 'Gym Entrance',
      accessType: 'entry',
      status: 'granted'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'text-green-500'
      case 'denied':
        return 'text-red-500'
      case 'pending':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'granted':
        return 'bg-green-500/10'
      case 'denied':
        return 'bg-red-500/10'
      case 'pending':
        return 'bg-yellow-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'granted':
        return 'Granted'
      case 'denied':
        return 'Denied'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  const formatAccessType = (type: string) => {
    return type === 'entry' ? 'Entry' : 'Exit'
  }

  return (
    <DashboardLayout currentPage="gate-logs" role="security">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Gate Logs</h1>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button onClick={handleExportLogs} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Export Logs
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Real-time monitoring of gate access and security events.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`bg-card border-l-4 ${stat.borderColor} border border-border rounded-lg p-6 hover:bg-secondary/40 transition-colors`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-muted-foreground text-xs font-medium tracking-wide">
                    {stat.title}
                  </div>
                  <div className="text-muted-foreground">{stat.icon}</div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or gate location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  Status: All
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  Gate: All
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  Access Type: All
                  <ChevronDown className="w-4 h-4" />
                </button>
                {statusFilter && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg text-sm text-primary">
                    Status: {formatStatus(statusFilter)}
                    <button
                      onClick={() => setStatusFilter('')}
                      className="hover:bg-primary/30 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  <Calendar className="w-4 h-4" />
                  Date: Today
                </button>
              </div>
            </div>
          </div>

          {/* Gate Logs Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Time</div>
              <div className="col-span-3">User/Student</div>
              <div className="col-span-2">Gate Location</div>
              <div className="col-span-2">Access Type</div>
              <div className="col-span-3">Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {gateLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors items-center"
                >
                  {/* Time */}
                  <div className="col-span-2 text-sm">
                    <div className="text-foreground">{log.time}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>

                  {/* User/Student */}
                  <div className="col-span-3">
                    <div className="font-medium text-sm text-foreground">{log.userName}</div>
                    <div className="text-xs text-muted-foreground">ID: {log.userId}</div>
                  </div>

                  {/* Gate Location */}
                  <div className="col-span-2 text-sm text-foreground">{log.gateLocation}</div>

                  {/* Access Type */}
                  <div className="col-span-2 text-sm">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${log.accessType === 'entry' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-600'
                      }`}>
                      {log.accessType === 'entry' ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                      {formatAccessType(log.accessType)}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(log.status)} ${getStatusColor(log.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'granted' ? 'bg-green-500' : log.status === 'denied' ? 'bg-destructive' : 'bg-yellow-500'
                        }`} />
                      {formatStatus(log.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}