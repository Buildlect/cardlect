"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, BarChart3, Plus, Search, Download, CheckCircle, Clock, Loader2, AlertCircle, FileText } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from "@/lib/api-client"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Exam {
  id: string
  title: string
  subject: string
  total_students: number
  completed_count: number
  avg_score: number
  status: 'completed' | 'ongoing' | 'scheduled'
  exam_date: string
}

const scoreDistribution = [
  { range: 'A (80-100)', count: 45, fill: CARDLECT_COLORS.primary.darker },
  { range: 'B (70-79)', count: 120, fill: CARDLECT_COLORS.primary.main },
  { range: 'C (60-69)', count: 85, fill: CARDLECT_COLORS.secondary.main },
  { range: 'D (50-59)', count: 25, fill: CARDLECT_COLORS.warning.main },
  { range: 'F (0-49)', count: 15, fill: CARDLECT_COLORS.danger.main },
]

export default function AdminExamsDashboard() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchExams = async () => {
    setLoading(true)
    try {
      const response = await api.get('/exams')
      setExams(response.data.data)
    } catch (err) {
      console.error('Failed to fetch exams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'ongoing').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + (e.total_students || 0), 0),
    avgScore: exams.length > 0
      ? Math.round(exams.reduce((sum, e) => sum + (e.avg_score || 0), 0) / exams.length)
      : 0,
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'ongoing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
      case 'scheduled': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <DashboardLayout currentPage="exams" role="school_admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">CBT Command Center</h1>
            <p className="text-muted-foreground mt-1 font-medium">Coordinate, monitor, and audit Computer Based Testing across the institution.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-xl border-2 font-bold px-6 h-12">
              <Download size={18} className="mr-2" /> Export Audit
            </Button>
            <Button className="bg-primary hover:bg-primary-darker text-white rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20">
              <Plus size={20} className="mr-2" /> Define New Exam
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Registrations', val: stats.totalExams, icon: Award, col: CARDLECT_COLORS.primary.main },
            { label: 'Live Sessions', val: stats.activeExams, icon: Clock, col: '#3b82f6' },
            { label: 'Finalized', val: stats.completedExams, icon: CheckCircle, col: '#10b981' },
            { label: 'Examinees', val: stats.totalStudents, icon: Users, col: CARDLECT_COLORS.info.main },
            { label: 'Org. Mastery', val: `${stats.avgScore}%`, icon: TrendingUp, col: CARDLECT_COLORS.secondary.main }
          ].map((s, i) => (
            <Card key={i} className="border-border shadow-sm group hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: s.col + '15' }}>
                  <s.icon size={24} style={{ color: s.col }} />
                </div>
                <p className="text-2xl font-black text-foreground">{s.val}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black italic">Institutional Performance Heatmap</CardTitle>
                <BarChart3 size={18} className="text-primary opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'W1', score: 62 }, { name: 'W2', score: 68 }, { name: 'W3', score: 65 },
                    { name: 'W4', score: 72 }, { name: 'W5', score: 70 }, { name: 'Current', score: 75 }
                  ]}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="score" stroke={CARDLECT_COLORS.primary.main} strokeWidth={3} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black italic">Aggregate Grade Distribution</CardTitle>
                <PieChart size={18} className="text-primary opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%" cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {scoreDistribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{d.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams List */}
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-black">Examination Roster</CardTitle>
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl bg-muted/30 border-border"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/10 border-b border-border">
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Assessment Detail</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-center">Enrollment</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-center">Finalized</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-center">Mean Success</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-center">Phase</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-right">Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredExams.map((exam) => {
                    const completionRate = Math.round((exam.completed_count / (exam.total_students || 1)) * 100)
                    return (
                      <tr key={exam.id} className="hover:bg-muted/10 transition-colors group cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-foreground leading-tight">{exam.title}</p>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{exam.subject}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center text-sm font-bold">{exam.total_students}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="w-20 bg-muted/50 rounded-full h-2 overflow-hidden border border-border">
                              <div
                                className="h-full bg-primary transition-all duration-700"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground">{completionRate}% Ready</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black text-foreground">{exam.avg_score || 0}%</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${getStatusStyle(exam.status)}`}>
                            {exam.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-xs font-bold text-foreground">{new Date(exam.exam_date).toLocaleDateString()}</p>
                          <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tight">Standard Zulu Time</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredExams.length === 0 && (
            <div className="p-32 text-center">
              <AlertCircle size={64} className="mx-auto text-muted-foreground opacity-10 mb-6" />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-sm italic">Assessment registry is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
