'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Download, CheckCircle2, Loader2, Search, Users } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import api from '@/lib/api-client'

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [aggregate, setAggregate] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, aggregateRes, trendsRes] = await Promise.all([
          api.get('/users?role=student&limit=50'),
          api.get('/analytics/attendance/aggregate'),
          api.get('/analytics/attendance/trends'),
        ])
        setStudents(studentsRes.data.data || [])
        setAggregate(aggregateRes.data.data)
        setTrends(trendsRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch attendance data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStudents = parseInt(aggregate?.total_students || students.length.toString())
  const present = parseInt(aggregate?.present || '0')
  const absent = parseInt(aggregate?.absent || '0')
  const late = parseInt(aggregate?.late || '0')
  const attendanceRate = totalStudents > 0 ? ((present / totalStudents) * 100).toFixed(1) : '0'

  const chartData = trends.map((t: any) => ({
    day: new Date(t.date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' }),
    present: parseInt(t.present_count || '0'),
  }))

  const getAttendanceClass = (pct: number) => {
    if (pct >= 95) return 'text-green-500 bg-green-500/10'
    if (pct >= 80) return 'text-blue-500 bg-blue-500/10'
    if (pct >= 60) return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  const statCards = [
    { label: 'Attendance Rate', value: `${attendanceRate}%`, color: CARDLECT_COLORS.info?.main ?? '#3b82f6', sub: 'Today' },
    { label: 'Present Today', value: present, color: CARDLECT_COLORS.success.main, sub: 'Students' },
    { label: 'Absent Today', value: absent, color: CARDLECT_COLORS.warning.main, sub: 'Need follow-up' },
    { label: 'Late', value: late, color: CARDLECT_COLORS.danger.main, sub: 'Marked late' },
  ]

  return (
    <DashboardLayout currentPage="attendance" role="staff" customRole="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground mt-1">Track student attendance across your classes.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 7-Day Trend Chart */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-5 text-foreground">7-Day Attendance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.length > 0 ? chartData : [{ day: 'No data', present: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  labelStyle={{ color: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <Legend />
                <Line type="monotone" dataKey="present" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2.5} dot={false} name="Present" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search student by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Student Table */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users size={40} className="opacity-20 mb-3" />
              <p className="text-muted-foreground font-medium">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Student Name</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Admission ID</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student: any) => (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {student.full_name?.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{student.full_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground font-mono text-xs">{student.admission_number || '—'}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${student.status === 'active' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-muted/30'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                          Mark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
