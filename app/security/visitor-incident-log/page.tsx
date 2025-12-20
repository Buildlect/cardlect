'use client'

import { useState } from 'react'
import { LayoutShell } from "@/components/Security/layout.shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserCheck,
  Clock,
  Download,
  Search,
  Calendar,
  X,
  ChevronDown,
  Plus
} from 'lucide-react'

interface VisitorLog {
  id: string
  date: string
  visitorName: string
  purpose: string
  checkInTime: string
  checkOutTime: string | null
  status: 'checked_in' | 'checked_out' | 'expected'
}

interface StatCard {
  title: string
  value: number
  change: string
  icon: React.ReactNode
  borderColor: string
}

export default function VisitorIncidentLog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([
    {
      id: '1',
      date: '2024-12-18',
      visitorName: 'John Smith',
      purpose: 'Parent-Teacher Meeting',
      checkInTime: '09:00 AM',
      checkOutTime: '10:30 AM',
      status: 'checked_out'
    },
    {
      id: '2',
      date: '2024-12-18',
      visitorName: 'Sarah Johnson',
      purpose: 'School Tour',
      checkInTime: '10:15 AM',
      checkOutTime: null,
      status: 'checked_in'
    },
    {
      id: '3',
      date: '2024-12-18',
      visitorName: 'Michael Brown',
      purpose: 'Maintenance',
      checkInTime: '08:30 AM',
      checkOutTime: '12:00 PM',
      status: 'checked_out'
    },
    {
      id: '4',
      date: '2024-12-18',
      visitorName: 'Emily Davis',
      purpose: 'Interview',
      checkInTime: '02:00 PM',
      checkOutTime: null,
      status: 'expected'
    },
    {
      id: '5',
      date: '2024-12-18',
      visitorName: 'David Wilson',
      purpose: 'Delivery',
      checkInTime: '11:00 AM',
      checkOutTime: '11:15 AM',
      status: 'checked_out'
    }
  ])
  const [newEntry, setNewEntry] = useState({
    visitorName: '',
    purpose: '',
    checkInTime: '',
    checkOutTime: '',
    status: 'checked_in' as VisitorLog['status']
  })

  const handleExportLogs = () => {
    const csvContent = generateCSVContent()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    link.href = url
    link.download = `visitor-incident-logs-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateCSVContent = () => {
    const headers = ['Date', 'Visitor Name', 'Purpose', 'Check-in Time', 'Check-out Time', 'Status']
    const rows = [
      headers.join(','),
      ...visitorLogs.map(log => [
        `"${log.date}"`,
        `"${log.visitorName}"`,
        `"${log.purpose}"`,
        `"${log.checkInTime}"`,
        `"${log.checkOutTime || 'N/A'}"`,
        `"${log.status}"`
      ].join(','))
    ]
    return rows.join('\n')
  }

  const stats: StatCard[] = [
    {
      title: 'TOTAL VISITORS TODAY',
      value: 24,
      change: '+12% from yesterday',
      icon: <Users className="w-5 h-5" />,
      borderColor: 'border-l-primary'
    },
    {
      title: 'CURRENTLY CHECKED IN',
      value: 8,
      change: '3 expected soon',
      icon: <UserCheck className="w-5 h-5" />,
      borderColor: 'border-l-green-500'
    },
    {
      title: 'AVERAGE VISIT TIME',
      value: 45,
      change: 'minutes',
      icon: <Clock className="w-5 h-5" />,
      borderColor: 'border-l-purple-500'
    },
    {
      title: 'INCIDENTS REPORTED',
      value: 2,
      change: 'This week',
      icon: <UserCheck className="w-5 h-5" />, // Could use a different icon for incidents
      borderColor: 'border-l-destructive'
    }
  ]


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'text-green-500'
      case 'checked_out':
        return 'text-gray-500'
      case 'expected':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-green-500/10'
      case 'checked_out':
        return 'bg-gray-500/10'
      case 'expected':
        return 'bg-blue-500/10'
      default:
        return 'bg-gray-500/10'
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'Checked In'
      case 'checked_out':
        return 'Checked Out'
      case 'expected':
        return 'Expected'
      default:
        return status
    }
  }

  const handleAddEntry = () => {
    if (!newEntry.visitorName.trim() || !newEntry.purpose.trim() || !newEntry.checkInTime) {
      alert('Please fill in all required fields (Visitor Name, Purpose, Check-in Time)')
      return
    }

    const entry: VisitorLog = {
      id: `LOG${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      visitorName: newEntry.visitorName.trim(),
      purpose: newEntry.purpose.trim(),
      checkInTime: newEntry.checkInTime,
      checkOutTime: newEntry.checkOutTime || null,
      status: newEntry.status
    }

    setVisitorLogs(prev => [entry, ...prev])
    setNewEntry({
      visitorName: '',
      purpose: '',
      checkInTime: '',
      checkOutTime: '',
      status: 'checked_in'
    })
    setShowAddEntry(false)
    alert('Entry added successfully!')
  }

  return (
    <LayoutShell currentPage="visitor-incident-log">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Visitor & Incident Log</h1>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowAddEntry(!showAddEntry)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {showAddEntry ? 'Cancel' : 'Add Entry'}
                </Button>
                <Button onClick={handleExportLogs} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Export Logs
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Track visitor check-ins, check-outs, and security incidents.
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
                  placeholder="Search by visitor name, purpose, or ID..."
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
                  Purpose: All
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

          {/* Add Entry Form */}
          {showAddEntry && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Entry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Visitor Name *
                  </label>
                  <Input
                    placeholder="Enter visitor name"
                    value={newEntry.visitorName}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, visitorName: e.target.value }))}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Purpose *
                  </label>
                  <Input
                    placeholder="Enter visit purpose"
                    value={newEntry.purpose}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, purpose: e.target.value }))}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={newEntry.status}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, status: e.target.value as VisitorLog['status'] }))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="expected">Expected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-in Time *
                  </label>
                  <Input
                    type="time"
                    value={newEntry.checkInTime}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, checkInTime: e.target.value }))}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-out Time
                  </label>
                  <Input
                    type="time"
                    value={newEntry.checkOutTime}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddEntry} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Visitor Log Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Date</div>
              <div className="col-span-3">Visitor Name</div>
              <div className="col-span-2">Purpose</div>
              <div className="col-span-2">Check-in Time</div>
              <div className="col-span-2">Check-out Time</div>
              <div className="col-span-1">Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
              {visitorLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors items-center"
                >
                  {/* Date */}
                  <div className="col-span-2 text-sm">
                    <div className="text-foreground">{new Date(log.date).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>

                  {/* Visitor Name */}
                  <div className="col-span-3">
                    <div className="font-medium text-sm text-foreground">{log.visitorName}</div>
                    <div className="text-xs text-muted-foreground">ID: {log.id}</div>
                  </div>

                  {/* Purpose */}
                  <div className="col-span-2 text-sm text-foreground">{log.purpose}</div>

                  {/* Check-in Time */}
                  <div className="col-span-2 text-sm text-foreground">{log.checkInTime}</div>

                  {/* Check-out Time */}
                  <div className="col-span-2 text-sm text-foreground">
                    {log.checkOutTime || <span className="text-muted-foreground">-</span>}
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(log.status)} ${getStatusColor(log.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'checked_in' ? 'bg-green-500' : log.status === 'checked_out' ? 'bg-muted-foreground' : 'bg-blue-500'}`} />
                      {formatStatus(log.status)}
                    </div>
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