'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, Plus, Search, Download, CheckCircle, Clock, Loader2, FileText, LayoutGrid } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CBTExam {
  id: string
  title: string
  school_name: string
  term: string
  session: string
  start_date: string
  status: string
  total_students?: number
  avg_score?: number
}

export default function SuperUserExamsDashboard() {
  const [exams, setExams] = useState<CBTExam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchExams = async () => {
    setLoading(true)
    try {
      const response = await api.get('/academic/exams')
      setExams(response.data.data)
    } catch (err) {
      console.error('Failed to fetch global exams registry:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => new Date(e.start_date) > new Date()).length, // Simplified logic for mock-like data
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + (e.total_students || 0), 0),
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const schoolPerformance = Array.from(new Set(exams.map(e => e.school_name))).map(name => {
    const schoolExams = exams.filter(e => e.school_name === name)
    return {
      school: name,
      exams: schoolExams.length,
      avgScore: Math.round(schoolExams.reduce((sum, e) => sum + (e.avg_score || 0), 0) / schoolExams.length) || 0
    }
  }).slice(0, 5)

  if (loading) {
    return (
      <DashboardLayout currentPage="exams" role="super_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="exams" role="super_admin">
      <div className="space-y-10 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Global CBT Registry</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Ecosystem-wide assessment monitoring and institutional performance audits.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] h-12 px-6">
              <Download size={16} className="mr-2" /> Global Audit Report
            </Button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'System Assessments', val: stats.totalExams, icon: Award, color: CARDLECT_COLORS.primary.main },
            { label: 'Upcoming sessions', val: stats.activeExams, icon: Clock, color: '#3b82f6' },
            { label: 'Mastery Validated', val: stats.completedExams, icon: CheckCircle, color: '#10b981' },
            { label: 'Participating students', val: stats.totalStudents, icon: Users, color: '#a855f7' }
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-[2rem] p-8 shadow-sm group hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: s.color + '15' }}>
                  <s.icon size={24} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground">{s.val}</p>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Analytical Intelligence */}
        <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
          <h3 className="text-2xl font-black text-foreground mb-10 tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-primary" /> Institutional Performance Intelligence
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolPerformance}>
                <XAxis dataKey="school" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="avgScore" fill={CARDLECT_COLORS.primary.main} radius={[10, 10, 0, 0]} name="Organizational Mastery %" barSize={40} />
                <Bar dataKey="exams" fill="#3b82f6" radius={[10, 10, 0, 0]} name="Deployment Volume" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Universal Examination Ledger */}
        <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Deployment Ledger</h3>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                className="w-full bg-muted/40 border-none rounded-2xl h-12 pl-12 font-bold"
                placeholder="Search by assessment or node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assessment Information</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Institutional Node</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Enrollment</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Phase</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Synchronization Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="group hover:bg-muted/10 transition-colors">
                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground leading-tight">{exam.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{exam.term} | {exam.session}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <p className="text-xs font-black text-foreground">{exam.school_name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5 tracking-tight">Verified Node</p>
                    </td>
                    <td className="py-6 text-center">
                      <p className="text-sm font-black text-foreground">{exam.total_students || 0}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Enrolled</p>
                    </td>
                    <td className="py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${exam.status === 'completed'
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                        {exam.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <p className="text-xs font-black text-foreground">{new Date(exam.start_date).toLocaleDateString()}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Automated Sync</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExams.length === 0 && (
            <div className="py-32 text-center">
              <Award size={64} className="mx-auto text-muted-foreground opacity-10 mb-6" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground italic">Zero assessment protocols found in global registry.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
