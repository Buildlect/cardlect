'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import {
  Plus,
  Eye,
  Pause,
  Play,
  X,
  Users,
  UserCheck,
  BookOpen,
  Settings,
  Activity,
  TrendingUp,
  Cpu,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

/* ------------------------------
   Types
   ------------------------------ */
interface School {
  id: string
  name: string
  subdomain: string
  status: 'active' | 'disabled' | 'pending'
  students: number
  staff: number
  cardUsage: number
  walletActivity: 'high' | 'medium' | 'low'
  totalTransactions: number
  attendance: number
  lastActivity: string
}

interface SchoolDetails extends School {
  staffList: Array<{ id: string; name: string; role: string; email: string }>
  studentList: Array<{ id: string; name: string; class: string; cardStatus: string }>
  recentActivities: Array<{ id: string; type: string; description: string; time: string }>
}

/* ------------------------------
   Small presentational components
   (memoized where appropriate)
   ------------------------------ */

const BRAND = {
  orange: '#d96126',
  bgDark: '#151517',
}

/* Stat card used in top summary */
function StatCard({ title, value, hint, Icon }: { title: string; value: React.ReactNode; hint?: string; Icon?: React.ComponentType<any> }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground text-sm">{title}</p>
        {Icon && <Icon size={18} className="text-primary" />}
      </div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl md:text-3xl font-extrabold text-foreground">{value}</div>
      </div>
      {hint && <p className="text-primary text-xs mt-2">{hint}</p>}
    </div>
  )
}

/* Row for each school in the table */
const SchoolRow = React.memo(function SchoolRow({
  school,
  onView,
  onToggle,
}: {
  school: School
  onView: (s: School) => void
  onToggle: (id: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary'
      case 'disabled':
        return 'px-2 py-1 rounded text-xs font-medium bg-destructive/10 text-destructive'
      case 'pending':
        return 'px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-600'
      default:
        return 'px-2 py-1 rounded text-xs font-medium bg-secondary'
    }
  }

  return (
    <tr className="group hover:bg-secondary/40 transition-colors">
      <td className="px-6 py-4 text-sm text-foreground font-medium">{school.name}</td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{school.subdomain}.cardlect.io</td>
      <td className="px-6 py-4">
        <span className={getStatusColor(school.status)}>
          {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-center text-foreground">{school.students}</td>
      <td className="px-6 py-4 text-sm text-center text-foreground">{school.staff}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-24 bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${school.cardUsage}%` }} />
          </div>
          <span className="text-xs text-foreground">{school.cardUsage}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-center text-foreground font-medium">{school.attendance}%</td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center gap-2 justify-center">
          <button onClick={() => onView(school)} className="p-2 hover:bg-secondary/50 rounded transition-colors" title="View Details" aria-label={`View ${school.name}`}>
            <Eye size={16} className="text-primary" />
          </button>
          <button onClick={() => onToggle(school.id)} className="p-2 hover:bg-secondary/50 rounded transition-colors" title={school.status === 'active' ? 'Deactivate' : 'Activate'}>
            {school.status === 'active' ? <Pause size={16} className="text-yellow-600" /> : <Play size={16} className="text-green-600" />}
          </button>
        </div>
      </td>
    </tr>
  )
}, (prev, next) => {
  // shallow compare id & status & students/staff 
  return (
    prev.school.id === next.school.id &&
    prev.school.status === next.school.status &&
    prev.school.students === next.school.students &&
    prev.school.staff === next.school.staff &&
    prev.school.cardUsage === next.school.cardUsage &&
    prev.school.attendance === next.school.attendance
  )
})

/* modal for school details */
function SchoolModal({ school, onClose, onToggle }: { school: SchoolDetails; onClose: () => void; onToggle: (id: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">{school.name}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => onToggle(school.id)} className={`px-3 py-2 rounded-lg text-sm font-medium ${school.status === 'active' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
              {school.status === 'active' ? 'Deactivate School' : 'Activate School'}
            </button>
            <button onClick={onClose} className="p-2 rounded hover:bg-secondary/50" aria-label="Close details">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{school.students}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Staff Members</p>
              <p className="text-2xl font-bold text-foreground">{school.staff}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Attendance Rate</p>
              <p className="text-2xl font-bold text-primary">{school.attendance}%</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Card Usage</p>
              <p className="text-2xl font-bold text-primary">{school.cardUsage}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><UserCheck size={18} className="text-primary" /> Staff Members ({school.staffList.length})</h3>
              <div className="space-y-2">
                {school.staffList.map((s) => (
                  <div key={s.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Users size={18} className="text-primary" /> Recent Students ({school.studentList.length})</h3>
              <div className="space-y-2">
                {school.studentList.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Class: {s.class}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.cardStatus === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                      {s.cardStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Activity size={18} className="text-primary" /> Recent Activities</h3>
            <div className="space-y-2">
              {school.recentActivities.map((a) => (
                <div key={a.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-foreground">{a.description}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition">Configure Features</button>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition">Manage Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------
   Main page component
   ------------------------------ */

export default function SchoolsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<SchoolDetails | null>(null)
  const [schools, setSchools] = useState<School[]>([
    { id: '1', name: 'Cambridge Academy', subdomain: 'cambridge', status: 'active', students: 450, staff: 45, cardUsage: 92, walletActivity: 'high', totalTransactions: 2850, attendance: 94, lastActivity: '2 mins ago' },
    { id: '2', name: 'Oxford High School', subdomain: 'oxford', status: 'active', students: 320, staff: 35, cardUsage: 78, walletActivity: 'medium', totalTransactions: 1920, attendance: 87, lastActivity: '5 mins ago' },
    { id: '3', name: 'Trinity Prep', subdomain: 'trinity', status: 'active', students: 280, staff: 28, cardUsage: 65, walletActivity: 'low', totalTransactions: 1340, attendance: 91, lastActivity: '12 mins ago' },
    { id: '4', name: 'Westfield College', subdomain: 'westfield', status: 'pending', students: 0, staff: 0, cardUsage: 0, walletActivity: 'low', totalTransactions: 0, attendance: 0, lastActivity: 'N/A' },
    { id: '5', name: 'Riverside Academy', subdomain: 'riverside', status: 'disabled', students: 200, staff: 20, cardUsage: 45, walletActivity: 'low', totalTransactions: 980, attendance: 45, lastActivity: '3 days ago' },
  ])

  /* ------------------------------
     Memoized totals & derived values
     ------------------------------ */
  const totals = useMemo(() => {
    const totalSchools = schools.length
    const totalStudents = schools.reduce((s, x) => s + x.students, 0)
    const totalTransactions = schools.reduce((s, x) => s + x.totalTransactions, 0)
    const activeCount = schools.filter((s) => s.status === 'active').length
    const avgCardUsage = Math.round(
      schools.filter((s) => s.status === 'active').reduce((acc, cur) => acc + cur.cardUsage, 0) /
        Math.max(1, schools.filter((s) => s.status === 'active').length)
    )

    return { totalSchools, totalStudents, totalTransactions, activeCount, avgCardUsage }
  }, [schools])

  /* ------------------------------
     Stable callbacks
     ------------------------------ */
  const openSchoolDetails = useCallback((school: School) => {
    const schoolDetails: SchoolDetails = {
      ...school,
      staffList: [
        { id: '1', name: 'Mr. John Smith', role: 'Principal', email: 'john@cambridge.edu' },
        { id: '2', name: 'Mrs. Sarah Johnson', role: 'Vice Principal', email: 'sarah@cambridge.edu' },
        { id: '3', name: 'Mr. Michael Chen', role: 'IT Manager', email: 'michael@cambridge.edu' },
      ],
      studentList: [
        { id: '1', name: 'Alice Johnson', class: '10A', cardStatus: 'active' },
        { id: '2', name: 'Bob Chen', class: '10B', cardStatus: 'active' },
        { id: '3', name: 'Carol Davis', class: '11A', cardStatus: 'pending' },
      ],
      recentActivities: [
        { id: '1', type: 'gate', description: '450 students scanned at gate', time: '2 mins ago' },
        { id: '2', type: 'wallet', description: 'Wallet transaction: $2,450', time: '5 mins ago' },
        { id: '3', type: 'attendance', description: 'Attendance recorded: 94%', time: '8 mins ago' },
      ],
    }
    setSelectedSchool(schoolDetails)
  }, [])

  const toggleStatus = useCallback((id: string) => {
    setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'disabled' : 'active' } : s)))
  }, [])


  /* ------------------------------
     Small helpers
     ------------------------------ */
  const getWalletActivityColor = useCallback((activity: string) => {
    switch (activity) {
      case 'high':
        return 'text-primary'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-muted-foreground'
      default:
        return 'text-foreground'
    }
  }, [])

  /* ------------------------------
     Render
     ------------------------------ */
  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} onNavigate={(href) => router.push(href)} currentPage="schools" />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Schools Management</h1>
                <p className="text-muted-foreground mt-1">Manage all schools in the Cardlect ecosystem</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                  <Plus size={18} />
                  Add School
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Schools" value={totals.totalSchools} hint={`${totals.activeCount} active`} Icon={Activity} />
              <StatCard title="Total Students" value={totals.totalStudents.toLocaleString()} hint="Across all schools" Icon={Users} />
              <StatCard title="Avg Card Usage" value={`${totals.avgCardUsage}%`} hint="System-wide average" Icon={TrendingUp} />
              <StatCard title="Transactions Today" value={totals.totalTransactions.toLocaleString()} hint="All activity" Icon={Activity} />
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">School</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Subdomain</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Students</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Staff</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Usage</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Attendance</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {schools.map((school) => (
                      <SchoolRow key={school.id} school={school} onView={openSchoolDetails} onToggle={toggleStatus} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedSchool && <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} onToggle={toggleStatus} />}
    </div>
  )
}
