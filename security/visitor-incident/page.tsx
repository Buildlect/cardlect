'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SecuritySidebar from '../dashboard/components/SecuritySidebar'
import { Header } from '@/components/SuperAdmin/header'
import { VisitorStatsCard } from './components/VisitorStatsCard'
import { VisitorRow } from './components/VisitorRow'
import { mockVisitors, mockVisitorStats } from './data/mockVisitorData'
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export default function VisitorIncidentPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'visitor' | 'incident'>('visitor')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('Today')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const totalResults = 115

  const filteredVisitors = mockVisitors.filter(visitor => {
    if (searchQuery && !visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !visitor.type.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter !== 'All' && visitor.status !== statusFilter) return false
    return true
  })

  const handleSelectVisitor = (id: string) => {
    setSelectedVisitors(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <SecuritySidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        onNavigate={(href) => router.push(href)} 
        currentPage="visitor-incident" 
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span className="hover:text-foreground cursor-pointer">Home</span>
              <span>/</span>
              <span className="hover:text-foreground cursor-pointer">Security</span>
              <span>/</span>
              <span className="text-foreground">Logs</span>
            </div>

            {/* Page Header with Search */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Visitor & Incident Log</h1>
              
              <div className="relative w-96">
                <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <VisitorStatsCard
                title="Current Visitors"
                value={mockVisitorStats.currentVisitors.value}
                icon={<UserGroupIcon className="w-6 h-6 text-blue-500" />}
                trend={mockVisitorStats.currentVisitors.trend}
                trendUp={mockVisitorStats.currentVisitors.trendUp}
              />
              <VisitorStatsCard
                title="Total Check-ins"
                value={mockVisitorStats.totalCheckIns.value}
                icon={<ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-500" />}
                trend={mockVisitorStats.totalCheckIns.trend}
                trendUp={mockVisitorStats.totalCheckIns.trendUp}
              />
              <VisitorStatsCard
                title="Open Incidents"
                value={mockVisitorStats.openIncidents.value}
                icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-500" />}
                trend={mockVisitorStats.openIncidents.trend}
                urgent={mockVisitorStats.openIncidents.urgent}
              />
              <VisitorStatsCard
                title="Resolved Today"
                value={mockVisitorStats.resolvedToday.value}
                icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
                trend={mockVisitorStats.resolvedToday.trend}
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab('visitor')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'visitor'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Visitor Log
                {activeTab === 'visitor' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('incident')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'incident'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Incident Reports
                {activeTab === 'incident' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  {dateFilter}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  Status: {statusFilter}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground hover:bg-secondary/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Type
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  Report Incident
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <UserPlusIcon className="w-4 h-4" />
                  Check-In Visitor
                </button>
              </div>
            </div>

            {/* Visitor Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr>
                      <th className="py-4 px-4 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-2 focus:ring-primary"
                        />
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Visitor
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Host & Purpose
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Check-out
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
                    {filteredVisitors.map((visitor) => (
                      <VisitorRow
                        key={visitor.id}
                        visitor={visitor}
                        selected={selectedVisitors.includes(visitor.id)}
                        onSelect={handleSelectVisitor}
                        onAction={(id) => console.log('Action for', id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">1-5</span> of{' '}
                  <span className="font-medium text-foreground">{totalResults}</span> results
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  {[1, 2].map((page) => (
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

                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-secondary/50">
                    12
                  </button>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary/50 transition-colors"
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