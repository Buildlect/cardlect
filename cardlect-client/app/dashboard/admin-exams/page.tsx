'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, BarChart3, Plus, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface CBTExam {
  id: string
  title: string
  subject: string
  totalStudents: number
  completed: number
  pending: number
  avgScore: number
  status: 'completed' | 'in-progress' | 'pending'
  date: string
}

const examData: CBTExam[] = [
  { id: '1', title: 'WAEC Mathematics CBT', subject: 'Mathematics', totalStudents: 245, completed: 245, pending: 0, avgScore: 68, status: 'completed', date: '2024-02-15' },
  { id: '2', title: 'NECO English CBT', subject: 'English', totalStudents: 250, completed: 248, pending: 2, avgScore: 72, status: 'completed', date: '2024-02-16' },
  { id: '3', title: 'Mock Biology CBT', subject: 'Biology', totalStudents: 180, completed: 175, pending: 5, avgScore: 65, status: 'in-progress', date: '2024-02-17' },
  { id: '4', title: 'Chemistry Practical CBT', subject: 'Chemistry', totalStudents: 175, completed: 0, pending: 175, avgScore: 0, status: 'pending', date: '2024-02-18' },
]

const scoreDistribution = [
  { range: 'A (80-100)', count: 145, fill: CARDLECT_COLORS.primary.darker },
  { range: 'B (70-79)', count: 320, fill: CARDLECT_COLORS.primary.main },
  { range: 'C (60-69)', count: 185, fill: CARDLECT_COLORS.secondary.main },
  { range: 'D (50-59)', count: 45, fill: CARDLECT_COLORS.warning.main },
  { range: 'F (0-49)', count: 15, fill: CARDLECT_COLORS.danger.main },
]

const monthlyData = [
  { month: 'Jan', exams: 4, completed: 3, avgScore: 68 },
  { month: 'Feb', exams: 5, completed: 4, avgScore: 70 },
  { month: 'Mar', exams: 6, completed: 5, avgScore: 72 },
  { month: 'Apr', exams: 8, completed: 7, avgScore: 69 },
  { month: 'May', exams: 7, completed: 6, avgScore: 71 },
  { month: 'Jun', exams: 9, completed: 8, avgScore: 73 },
]

export default function AdminExamsDashboard() {
  const [exams, setExams] = useState<CBTExam[]>(examData)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'in-progress').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + e.totalStudents, 0),
    avgScore: Math.round(exams.filter(e => e.avgScore > 0).reduce((sum, e) => sum + e.avgScore, 0) / exams.filter(e => e.avgScore > 0).length),
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#d1fae5', text: SEMANTIC_COLORS.status.online }
      case 'in-progress': return { bg: '#dbeafe', text: '#3b82f6' }
      case 'pending': return { bg: '#fef3c7', text: CARDLECT_COLORS.warning.main }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  return (
    <DashboardLayout currentPage="exams" role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CBT Exams Management</h1>
            <p className="text-muted-foreground">Monitor and manage all CBT exams across the school</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
              style={{ color: CARDLECT_COLORS.primary.darker }}
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:shadow-lg"
              style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Create Exam</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-muted-foreground mb-1">Active Exams</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeExams}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Clock size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedExams}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Students Examined</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.info.main + '15' }}>
                <Users size={20} style={{ color: CARDLECT_COLORS.info.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgScore}%</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.secondary.main + '15' }}>
                <TrendingUp size={20} style={{ color: CARDLECT_COLORS.secondary.main }} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Exams Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CARDLECT_COLORS.primary.darker} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: any) => Number(value)}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={2}
                  fill="url(#colorExams)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Score Distribution */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ index }) => `${scoreDistribution[index]?.range}: ${scoreDistribution[index]?.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => Number(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exams List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">All Exams</h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exams..."
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
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Subject</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Students</th>
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
                      <td className="px-4 py-3 text-muted-foreground">{exam.subject}</td>
                      <td className="px-4 py-3 text-center text-foreground">{exam.totalStudents}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 bg-secondary rounded-full h-1.5" style={{ background: 'var(--border)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${completionPercent}%`,
                                backgroundColor: CARDLECT_COLORS.primary.darker
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">{completionPercent}%</span>
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
