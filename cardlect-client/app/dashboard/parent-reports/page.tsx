'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Download, FileText, Loader2, Users, BarChart3, BookOpen, Activity } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import api from '@/lib/api-client'

export default function ReportsPage() {
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [childData, setChildData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)

  // Fetch children linked to parent
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/users/children')
        const kids: any[] = res.data.data || []
        setChildren(kids)
        if (kids.length > 0) setSelectedChild(kids[0].id)
      } catch (err) {
        console.error('Failed to fetch children:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchChildren()
  }, [])

  // Fetch child-specific data when child selection changes
  useEffect(() => {
    if (!selectedChild) return
    const fetchChildData = async () => {
      setDataLoading(true)
      try {
        const [attendanceRes, examsRes, walletRes] = await Promise.all([
          api.get(`/analytics/attendance/student/${selectedChild}`),
          api.get('/exams?limit=10'),
          api.get('/wallets/transactions?limit=10'),
        ])
        setChildData({
          attendance: attendanceRes.data.data,
          exams: examsRes.data.data?.exams || [],
          transactions: walletRes.data.data || [],
        })
      } catch (err) {
        console.error('Failed to fetch child data:', err)
        setChildData(null)
      } finally {
        setDataLoading(false)
      }
    }
    fetchChildData()
  }, [selectedChild])

  const att = childData?.attendance
  const attSummary = att?.summary
  const recentAttendance = att?.recent_logs || []
  const exams = childData?.exams || []

  // Attendance chart from recent logs
  const attendanceChart = recentAttendance.slice(0, 7).reverse().map((log: any) => ({
    date: new Date(log.date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' }),
    status: log.status === 'present' ? 1 : 0,
  }))

  return (
    <DashboardLayout currentPage="reports" role="parent">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">View and download children's academic and activity reports.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Child selector */}
            {children.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {children.map((child: any) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${selectedChild === child.id
                        ? 'text-white border-transparent'
                        : 'border-border hover:bg-muted'
                      }`}
                    style={selectedChild === child.id ? { backgroundColor: CARDLECT_COLORS.primary.darker } : undefined}
                  >
                    {child.full_name}
                  </button>
                ))}
              </div>
            )}

            {children.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-3xl">
                <Users size={40} className="opacity-20 mb-3" />
                <p className="text-muted-foreground font-medium">No children linked to your account yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Contact the school to link your children.</p>
              </div>
            ) : dataLoading ? (
              <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Attendance Rate</p>
                    <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>
                      {attSummary?.percentage ?? '—'}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{attSummary?.attended_days ?? 0} of {attSummary?.total_days ?? 0} days present</p>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Exams</p>
                    <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{exams.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">This term</p>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Recent Transactions</p>
                    <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{childData?.transactions?.length ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Wallet activity</p>
                  </div>
                </div>

                {/* Attendance chart */}
                {attendanceChart.length > 0 && (
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-5 text-foreground">Recent Attendance</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceChart} barSize={24}>
                          <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis hide domain={[0, 1]} />
                          <Tooltip
                            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                            formatter={(v: any) => [v === 1 ? 'Present' : 'Absent', '']}
                          />
                          <Bar dataKey="status" fill={CARDLECT_COLORS.primary.darker} radius={[4, 4, 0, 0]} name="Attendance" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Report cards */}
                <h2 className="text-xl font-semibold text-foreground">Available Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Attendance Summary', type: 'attendance', icon: Activity, color: CARDLECT_COLORS.success.main },
                    { title: 'Academic Performance', type: 'academic', icon: BookOpen, color: CARDLECT_COLORS.primary.darker },
                    { title: 'Wallet Activity Report', type: 'wallet', icon: BarChart3, color: CARDLECT_COLORS.warning.main },
                  ].map((report, i) => {
                    const Icon = report.icon
                    return (
                      <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: report.color + '20' }}>
                              <Icon size={20} color={report.color} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{report.title}</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {children.find(c => c.id === selectedChild)?.full_name || 'Selected Child'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">Generated on demand</p>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
