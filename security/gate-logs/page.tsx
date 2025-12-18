'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SecuritySidebar from '../dashboard/components/SecuritySidebar'
import { Header } from '@/components/SuperAdmin/header'
import { GateStatsCard } from './components/GateStatsCard'
import { GateLogRow } from './components/GateLogRow'
import { mockGateLogs, mockGateStats } from './data/mockGateLogsData'
import { MagnifyingGlassIcon, CalendarIcon, PrinterIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function GateLogsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('Today')
  const [userFilter, setUserFilter] = useState('All Users')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalEntries = 1245

  const filteredLogs = mockGateLogs.filter(log => {
    if (searchQuery && !log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.user.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (userFilter !== 'All Users' && log.role !== userFilter) return false
    if (statusFilter !== 'All Statuses' && log.status !== statusFilter) return false
    return true
  })

  const totalPages = Math.ceil(totalEntries / itemsPerPage)
  const startEntry = (currentPage - 1) * itemsPerPage + 1
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries)

  return (
    <div className="flex h-screen bg-background">
      <SecuritySidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        onNavigate={(href) => router.push(href)} 
        currentPage="gate-logs" 
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">Gate Activity Logs</h1>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <p className="text-muted-foreground">
                  Real-time monitoring and historical records of campus entry/exit.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary/50 transition-colors">
                  <PrinterIcon className="w-4 h-4" />
                  Print
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GateStatsCard
                title="TOTAL ENTRIES TODAY"
                value={mockGateStats.totalEntriesToday.value.toLocaleString()}
                trend={mockGateStats.totalEntriesToday.trend}
                trendUp={mockGateStats.totalEntriesToday.trendUp}
              />
              <GateStatsCard
                title="ACTIVE ALERTS"
                value={mockGateStats.activeAlerts.value}
                trend={mockGateStats.activeAlerts.trend}
                trendUp={mockGateStats.activeAlerts.trendUp}
                isAlert={true}
              />
              <GateStatsCard
                title="PEAK TRAFFIC TIME"
                value={mockGateStats.peakTrafficTime.value}
                trend={mockGateStats.peakTrafficTime.trend}
                trendUp={mockGateStats.peakTrafficTime.trendUp}
              />
            </div>

            {/* Filters Section */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[300px] relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Name, ID, or Vehicle Plate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Date Filter */}
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
                  Date: {dateFilter}
                  <CalendarIcon className="w-4 h-4" />
                </button>

                {/* User Type Filter */}
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>All Users</option>
                  <option>Student</option>
                  <option>Staff</option>
                  <option>Visitor</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>All Statuses</option>
                  <option>Granted</option>
                  <option>Denied</option>
                </select>
              </div>
            </div>

            {/* Gate Logs Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Gate Location
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Event
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <GateLogRow
                        key={log.id}
                        log={log}
                        onAction={(id) => console.log('Action for', id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{startEntry}-{endEntry}</span> of{' '}
                  <span className="font-medium text-foreground">{totalEntries.toLocaleString()}</span> entries
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-border text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <span className="px-2 text-muted-foreground">...</span>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}