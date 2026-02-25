'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, Plus, Search, BarChart3, Download, CheckCircle, Clock } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface CBTExam {
  id: string
  title: string
  school: string
  totalStudents: number
  completed: number
  avgScore: number
  status: 'completed' | 'in-progress' | 'pending'
  date: string
}

const examData: CBTExam[] = [
  { id: '1', title: 'WAEC Mathematics CBT', school: 'Oxford International School', totalStudents: 245, completed: 245, avgScore: 68, status: 'completed', date: '2024-02-15' },
  { id: '2', title: 'NECO English CBT', school: 'Trinity Academy', totalStudents: 250, completed: 248, avgScore: 72, status: 'completed', date: '2024-02-16' },
  { id: '3', title: 'Mock Biology CBT', school: "St. Mary's Secondary", totalStudents: 180, completed: 175, avgScore: 65, status: 'in-progress', date: '2024-02-17' },
  { id: '4', title: 'Physics Practical CBT', school: 'Oxford International School', totalStudents: 200, completed: 0, avgScore: 0, status: 'pending', date: '2024-02-20' },
]

const schoolPerformance = [
  { school: 'Oxford International', exams: 8, avgScore: 70 },
  { school: 'Trinity Academy', exams: 6, avgScore: 72 },
  { school: "St. Mary's Secondary", exams: 5, avgScore: 68 },
  { school: 'Federal College', exams: 4, avgScore: 71 },
  { school: 'Covenant School', exams: 3, avgScore: 69 },
]

export default function SuperUserExamsDashboard() {
  const [exams, setExams] = useState<CBTExam[]>(examData)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'in-progress').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + e.totalStudents, 0),
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.school.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: `${CARDLECT_COLORS.success.main}20`, text: CARDLECT_COLORS.success.main }
      case 'in-progress': return { bg: `${CARDLECT_COLORS.info.main}20`, text: CARDLECT_COLORS.info.main }
      case 'pending': return { bg: `${CARDLECT_COLORS.warning.main}20`, text: CARDLECT_COLORS.warning.main }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  return (
    <DashboardLayout currentPage="exams" role="super-user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All CBT Exams</h1>
            <p className="text-muted-foreground">Monitor CBT exams across all schools</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:shadow-lg"
            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
          >
            <Download size={18} />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Exams</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalExams}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15' }}>
                <Award size={20} style={{ color: CARDLECT_COLORS.primary.darker }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.activeExams}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.info.main + '15' }}>
                <Clock size={20} style={{ color: CARDLECT_COLORS.info.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.completedExams}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.success.main + '15' }}>
                <CheckCircle size={20} style={{ color: CARDLECT_COLORS.success.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Students</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.info.main + '15' }}>
                <Users size={20} style={{ color: CARDLECT_COLORS.info.main }} />
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">School Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={schoolPerformance}>
              <XAxis dataKey="school" stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Legend />
              <Bar dataKey="avgScore" fill={CARDLECT_COLORS.primary.darker} name="Avg Score %" />
              <Bar dataKey="exams" fill={CARDLECT_COLORS.secondary.main} name="No. of Exams" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exams List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">All Exams</h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exams or schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Exam Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">School</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Total Students</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Completed</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Avg Score</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam) => {
                  const statusColor = getStatusColor(exam.status)
                  const completionPercent = Math.round((exam.completed / exam.totalStudents) * 100)
                  return (
                    <tr key={exam.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">{exam.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{exam.school}</td>
                      <td className="px-4 py-3 text-center text-foreground">{exam.totalStudents}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-foreground font-medium">{exam.completed}/{exam.totalStudents}</span>
                        <div className="w-16 bg-border rounded-full h-1 mt-1 mx-auto" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${completionPercent}%`,
                              backgroundColor: CARDLECT_COLORS.primary.darker
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-foreground font-medium">{exam.avgScore}%</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text
                          }}
                        >
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{exam.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
