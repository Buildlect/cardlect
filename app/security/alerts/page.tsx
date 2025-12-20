'use client'

import { useState } from 'react'
import { LayoutShell } from "@/app/security/components/layout.shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShieldAlert,
  UserX,
  AlertTriangle,
  CheckCircle,
  History,
  Download,
  Search,
  Calendar,
  X,
  DoorOpen,
  CreditCard,
  WifiOff,
  Book,
  ChevronDown
} from 'lucide-react'

type AlertSeverity = "critical" | "warning" | "system" | "info"

interface Alert {
  id: string
  severity: AlertSeverity
  time: string
  alertType: string
  description: string
  subject: {
    name: string
    id: string
    avatar?: string
  } | null
  source: string
  icon: React.ReactNode
}

interface StatCard {
  title: string
  value: number
  change: string
  icon: React.ReactNode
  borderColor: string
}

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Unresolved')

  const handleExportLogs = () => {
    const csvContent = generateCSVContent()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    link.href = url
    link.download = `security-alerts-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateCSVContent = () => {
    const headers = ['Time', 'Severity', 'Alert Type', 'Description', 'Subject Name', 'Subject ID', 'Source']
    const rows = [
      headers.join(','),
      ...alerts.map(alert => [
        `"${alert.time}"`,
        `"${alert.severity.toUpperCase()}"`,
        `"${alert.alertType}"`,
        `"${alert.description.replace(/"/g, '""')}"`,
        `"${alert.subject?.name || 'N/A'}"`,
        `"${alert.subject?.id || 'N/A'}"`,
        `"${alert.source}"`
      ].join(','))
    ]
    return rows.join('\n')
  }

  const stats: StatCard[] = [
    {
      title: 'CRITICAL BREACHES',
      value: 2,
      change: '+1 since 9am',
      icon: <ShieldAlert className="w-5 h-5" />,
      borderColor: 'border-l-red-500'
    },
    {
      title: 'UNAUTHORIZED PICKUPS',
      value: 1,
      change: 'No change',
      icon: <UserX className="w-5 h-5" />,
      borderColor: 'border-l-orange-500'
    },
    {
      title: 'SYSTEM WARNINGS',
      value: 5,
      change: '+2 new',
      icon: <AlertTriangle className="w-5 h-5" />,
      borderColor: 'border-l-yellow-500'
    },
    {
      title: 'RESOLVED TODAY',
      value: 14,
      change: '94% Resolution Rate',
      icon: <CheckCircle className="w-5 h-5" />,
      borderColor: 'border-l-emerald-500'
    }
  ]

  const alerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      time: '10:02 AM',
      alertType: 'Unauthorized Pickup',
      description: 'Unregistered guardian attempted checkout',
      subject: {
        name: 'Sarah Jenkins',
        id: '#88321',
        avatar: 'https://i.pravatar.cc/150?u=sarah'
      },
      source: 'Gate B-North',
      icon: <UserX className="w-4 h-4" />
    },
    {
      id: '2',
      severity: 'critical',
      time: '09:48 AM',
      alertType: 'Forced Entry',
      description: 'Door forced open without badge scan',
      subject: null,
      source: 'Library Rear Exit',
      icon: <DoorOpen className="w-4 h-4" />
    },
    {
      id: '3',
      severity: 'warning',
      time: '09:15 AM',
      alertType: 'Payment Failed',
      description: 'Insufficient funds multiple attempts',
      subject: {
        name: 'Michael Chen',
        id: '#99210',
        avatar: 'https://i.pravatar.cc/150?u=michael'
      },
      source: 'Cafeteria Term 2',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      id: '4',
      severity: 'system',
      time: '08:55 AM',
      alertType: 'Reader Offline',
      description: 'Device not responding to heartbeats',
      subject: null,
      source: 'Gym Entrance',
      icon: <WifiOff className="w-4 h-4" />
    },
    {
      id: '5',
      severity: 'info',
      time: '08:30 AM',
      alertType: 'Overdue Material',
      description: 'Book not returned after 14 days',
      subject: {
        name: 'Mr. A. Silva',
        id: '#77654',
        avatar: 'https://i.pravatar.cc/150?u=silva'
      },
      source: 'Main Library',
      icon: <Book className="w-4 h-4" />
    }
  ]

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500'
      case 'warning':
        return 'text-orange-500'
      case 'system':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getSeverityBg = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10'
      case 'warning':
        return 'bg-orange-500/10'
      case 'system':
        return 'bg-yellow-500/10'
      case 'info':
        return 'bg-blue-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <LayoutShell currentPage="alerts">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">System Alerts</h1>
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <History className="w-4 h-4" />
                  View History
                </Button>
                <Button onClick={handleExportLogs} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Export Logs
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Real-time monitoring for security breaches, payments, and access control.
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
                  placeholder="Search by ID, name, or alert type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  Severity: All
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  Source: All
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg text-sm text-primary">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter('')}
                    className="hover:bg-primary/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/80 transition-colors text-foreground">
                  <Calendar className="w-4 h-4" />
                  Date: Today
                </button>
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Severity</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-3">Alert Type</div>
              <div className="col-span-2">Subject</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors items-center"
                >
                  {/* Severity */}
                  <div className="col-span-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getSeverityBg(alert.severity)} ${getSeverityColor(alert.severity)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${alert.severity === 'critical' ? 'bg-destructive' : alert.severity === 'warning' ? 'bg-orange-500' : alert.severity === 'system' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      {alert.severity.toUpperCase()}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="col-span-1 text-sm">
                    <div className="text-foreground">{alert.time}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>

                  {/* Alert Type */}
                  <div className="col-span-3">
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 ${getSeverityColor(alert.severity)}`}>
                        {alert.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{alert.alertType}</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="col-span-2">
                    {alert.subject ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {getInitials(alert.subject.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{alert.subject.name}</div>
                          <div className="text-xs text-muted-foreground">{alert.subject.id}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Unknown Subject</div>
                    )}
                  </div>

                  {/* Source */}
                  <div className="col-span-2 text-sm text-foreground">{alert.source}</div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center gap-2">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                      {alert.severity === 'critical' ? 'Investigate' : alert.severity === 'warning' ? 'Notify' : 'Reset'}
                    </Button>
                    <button className="p-1 hover:bg-secondary/80 rounded transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  )
}