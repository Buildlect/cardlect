'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, Plus, Search, BarChart3, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
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

interface TeacherExam {
  id: string
  title: string
  class: string
  subject: string
  totalStudents: number
  completed: number
  avgScore: number
  status: 'completed' | 'in-progress' | 'pending'
  date: string
  duration: string
}

const teacherExams: TeacherExam[] = [
  {
    id: '1',
    title: 'Mathematics CBT - Class 5A',
    class: 'Class 5A',
    subject: 'Mathematics',
    totalStudents: 45,
    completed: 45,
    avgScore: 68,
    status: 'completed',
    date: '2024-02-15',
    duration: '150 minutes'
  },
  {
    id: '2',
    title: 'English CBT - Class 5A',
    class: 'Class 5A',
    subject: 'English',
    totalStudents: 45,
    completed: 44,
    avgScore: 72,
    status: 'completed',
    date: '2024-02-16',
    duration: '120 minutes'
  },
  {
    id: '3',
    title: 'Physics CBT - Class 6A',
    class: 'Class 6A',
    subject: 'Physics',
    totalStudents: 48,
    completed: 35,
    avgScore: 65,
    status: 'in-progress',
    date: '2024-02-17',
    duration: '150 minutes'
  },
  {
    id: '4',
    title: 'Chemistry Practical CBT',
    class: 'Class 5A & 6A',
    subject: 'Chemistry',
    totalStudents: 93,
    completed: 0,
    avgScore: 0,
    status: 'pending',
    date: '2024-02-20',
    duration: '120 minutes'
  }
]

const classPerformance = [
  { class: 'Class 5A', avgScore: 70, students: 45 },
  { class: 'Class 5B', avgScore: 68, students: 42 },
  { class: 'Class 6A', avgScore: 72, students: 48 },
  { class: 'Class 6B', avgScore: 71, students: 46 },
]

const scoreDistributionData = [
  { month: 'Jan', Class5A: 68, Class5B: 65, Class6A: 72 },
  { month: 'Feb', Class5A: 70, Class5B: 68, Class6A: 73 },
  { month: 'Mar', Class5A: 72, Class5B: 70, Class6A: 75 },
]

export default function TeacherExamsDashboard() {
  const [exams] = useState<TeacherExam[]>(teacherExams)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'in-progress').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + e.totalStudents, 0),
  }

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: `${CARDLECT_COLORS.success.main}20`, text: CARDLECT_COLORS.success.main }
      case 'in-progress': return { bg: `${CARDLECT_COLORS.primary.darker}20`, text: CARDLECT_COLORS.primary.darker }
      case 'pending': return { bg: `${CARDLECT_COLORS.warning.main}20`, text: CARDLECT_COLORS.warning.main }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  return (
    <DashboardLayout currentPage="exams" role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CBT Exams Management</h1>
            <p className="text-muted-foreground">Create, manage, and monitor CBT exams for your classes</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:shadow-lg"
            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Create Exam</span>
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
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.activeExams}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.primary.darker + '15' }}>
                <Clock size={20} style={{ color: CARDLECT_COLORS.primary.darker }} />
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Class Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformance}>
                <XAxis dataKey="class" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: any) => `${Number(value)}%`}
                />
                <Bar dataKey="avgScore" fill={CARDLECT_COLORS.primary.darker} name="Avg Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Trend */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreDistributionData}>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }}
                  formatter={(value: any) => `${Number(value)}%`}
                />
                <Legend />
                <Line type="monotone" dataKey="Class5A" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2.5} />
                <Line type="monotone" dataKey="Class6A" stroke={CARDLECT_COLORS.secondary.main} strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exams List */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">My Exams</h3>
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
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Class</th>
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
                      <td className="px-4 py-3 text-muted-foreground">{exam.class}</td>
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
