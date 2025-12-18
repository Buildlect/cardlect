'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SecuritySidebar from '../dashboard/components/SecuritySidebar'
import { Header } from '@/components/SuperAdmin/header'
import { AlertStatsCard } from './components/AlertStatsCard'
import { AlertRow } from './components/AlertRow'
import { mockAlerts, mockStats } from './data/mockAlertsData'
import { ShieldExclamationIcon, UserGroupIcon, ExclamationTriangleIcon, CheckCircleIcon, MagnifyingGlassIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { X } from 'lucide-react'

export default function AlertsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('Unresolved')
  const [dateFilter, setDateFilter] = useState('Today')

  const filteredAlerts = mockAlerts.filter(alert => {
    if (statusFilter === 'Unresolved' && alert.status !== 'unresolved') return false
    if (statusFilter === 'Resolved' && alert.status !== 'resolved') return false
    if (severityFilter !== 'All' && alert.severity !== severityFilter) return false
    if (sourceFilter !== 'All' && alert.source !== sourceFilter) return false
    if (searchQuery && !alert.alertType.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alert.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen bg-background">
      <SecuritySidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        onNavigate={(href) => router.push(href)} 
        currentPage="alerts" 
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">System Alerts</h1>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <p className="text-muted-foreground">
                  Real-time monitoring for security breaches, payments, and access control.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary/50 transition-colors">
                  <ClockIcon className="w-4 h-4" />
                  View History
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Logs
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="border-l-4 border-red-500">
                <AlertStatsCard
                  title="CRITICAL BREACHES"
                  value={mockStats.criticalBreaches.value}
                  icon={<ShieldExclamationIcon className="w-5 h-5 text-red-500" />}
                  trend={mockStats.criticalBreaches.trend}
                  trendUp={mockStats.criticalBreaches.trendUp}
                  borderColor=""
                />
              </div>
              <div className="border-l-4 border-orange-500">
                <AlertStatsCard
                  title="UNAUTHORIZED PICKUPS"
                  value={mockStats.unauthorizedPickups.value}
                  icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />}
                  trend={mockStats.unauthorizedPickups.trend}
                  trendUp={mockStats.unauthorizedPickups.trendUp}
                  borderColor=""
                />
              </div>
              <div className="border-l-4 border-yellow-500">
                <AlertStatsCard
                  title="SYSTEM WARNINGS"
                  value={mockStats.systemWarnings.value}
                  icon={<ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />}
                  trend={mockStats.systemWarnings.trend}
                  trendUp={mockStats.systemWarnings.trendUp}
                  borderColor=""
                />
              </div>
              <div className="border-l-4 border-green-500">
                <AlertStatsCard
                  title="RESOLVED TODAY"
                  value={mockStats.resolvedToday.value}
                  icon={<CheckCircleIcon className="w-5 h-5 text-green-500" />}
                  trend={mockStats.resolvedToday.trend}
                  trendUp={mockStats.resolvedToday.trendUp}
                  borderColor=""
                />
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[300px] relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, or alert type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Severity: All</option>
                  <option>CRITICAL</option>
                  <option>WARNING</option>
                  <option>SYSTEM</option>
                  <option>INFO</option>
                </select>

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Source: All</option>
                  <option>Gate B-North</option>
                  <option>Library Rear Exit</option>
                  <option>Cafeteria Term 2</option>
                  <option>Gym Entrance</option>
                  <option>Library System</option>
                </select>

                {/* Status Filter Chip */}
                {statusFilter !== 'All' && (
                  <button
                    onClick={() => setStatusFilter('All')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Status: {statusFilter}
                    <X size={16} />
                  </button>
                )}

                {/* Date Filter */}
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  Date: {dateFilter}
                </button>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Time
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Alert Type
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Source
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map((alert) => (
                      <AlertRow
                        key={alert.id}
                        alert={alert}
                        onInvestigate={(id) => console.log('Investigate', id)}
                        onNotify={(id) => console.log('Notify', id)}
                        onReset={(id) => console.log('Reset', id)}
                        onDismiss={(id) => console.log('Dismiss', id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAlerts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No alerts found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}