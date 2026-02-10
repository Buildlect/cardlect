'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface StudentExam {
  id: string
  title: string
  subject: string
  date: string
  time: string
  duration: string
  totalQuestions: number
  status: 'available' | 'in-progress' | 'completed'
  score: number | null
}

const studentExams: StudentExam[] = [
  {
    id: '1',
    title: 'WAEC Mathematics CBT',
    subject: 'Mathematics',
    date: '2024-02-15',
    time: '10:00 AM',
    duration: '150 minutes',
    totalQuestions: 50,
    status: 'completed',
    score: 42
  },
  {
    id: '2',
    title: 'NECO English CBT',
    subject: 'English',
    date: '2024-02-16',
    time: '2:00 PM',
    duration: '120 minutes',
    totalQuestions: 50,
    status: 'completed',
    score: 38
  },
  {
    id: '3',
    title: 'Mock Biology CBT',
    subject: 'Biology',
    date: '2024-02-17',
    time: '10:00 AM',
    duration: '150 minutes',
    totalQuestions: 50,
    status: 'in-progress',
    score: null
  },
  {
    id: '4',
    title: 'Chemistry Practical CBT',
    subject: 'Chemistry',
    date: '2024-02-20',
    time: '2:00 PM',
    duration: '120 minutes',
    totalQuestions: 40,
    status: 'available',
    score: null
  }
]

const performanceData = [
  { subject: 'Mathematics', score: 84, class_avg: 68 },
  { subject: 'English', score: 76, class_avg: 72 },
  { subject: 'Biology', score: 0, class_avg: 65 },
  { subject: 'Chemistry', score: 0, class_avg: 70 },
  { subject: 'Physics', score: 88, class_avg: 71 },
]

export default function StudentExamsDashboard() {
  const [exams] = useState<StudentExam[]>(studentExams)

  const stats = {
    completed: exams.filter(e => e.status === 'completed').length,
    inProgress: exams.filter(e => e.status === 'in-progress').length,
    available: exams.filter(e => e.status === 'available').length,
    avgScore: exams.filter(e => e.score !== null && e.score > 0).length > 0
      ? Math.round(exams.filter(e => e.score !== null && e.score > 0).reduce((sum, e) => sum + (e.score || 0), 0) / exams.filter(e => e.score !== null && e.score > 0).length)
      : 0,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={18} style={{ color: CARDLECT_COLORS.success.main }} />
      case 'in-progress': return <Clock size={18} style={{ color: CARDLECT_COLORS.info.main }} />
      case 'available': return <BookOpen size={18} style={{ color: CARDLECT_COLORS.warning.main }} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: `${CARDLECT_COLORS.success.main}26`, text: CARDLECT_COLORS.success.main }
      case 'in-progress': return { bg: `${CARDLECT_COLORS.info.main}26`, text: CARDLECT_COLORS.info.main }
      case 'available': return { bg: `${CARDLECT_COLORS.warning.main}26`, text: CARDLECT_COLORS.warning.main }
      default: return { bg: 'var(--muted)', text: 'var(--muted-foreground)' }
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return CARDLECT_COLORS.primary.main
    if (score >= 80) return SEMANTIC_COLORS.status.online
    if (score >= 70) return CARDLECT_COLORS.success.main
    if (score >= 60) return CARDLECT_COLORS.primary.main
    if (score >= 50) return CARDLECT_COLORS.warning.main
    return CARDLECT_COLORS.danger.main
  }

  return (
    <DashboardLayout currentPage="exams" role="students">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My CBT Exams</h1>
          <p className="text-muted-foreground">View your exam results and upcoming examinations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.completed}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${CARDLECT_COLORS.success.main}19` }}>
                <CheckCircle size={20} style={{ color: CARDLECT_COLORS.success.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${CARDLECT_COLORS.info.main}19` }}>
                <Clock size={20} style={{ color: CARDLECT_COLORS.info.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.available}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${CARDLECT_COLORS.warning.main}19` }}>
                <BookOpen size={20} style={{ color: CARDLECT_COLORS.warning.main }} />
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
                <Award size={20} style={{ color: CARDLECT_COLORS.secondary.main }} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--foreground)" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" />
              <Radar name="Your Score" dataKey="score" stroke={CARDLECT_COLORS.primary.darker} fill={CARDLECT_COLORS.primary.darker} fillOpacity={0.6} />
              <Radar name="Class Average" dataKey="class_avg" stroke={CARDLECT_COLORS.secondary.main} fill={CARDLECT_COLORS.secondary.main} fillOpacity={0.3} />
              <Legend />
              <Tooltip formatter={(value: any) => `${Number(value)}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Exams Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">All Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const statusColor = getStatusColor(exam.status)
              return (
                <div key={exam.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-foreground text-lg">{exam.title}</h4>
                        {getStatusIcon(exam.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{exam.subject}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text
                      }}
                    >
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-border text-sm text-muted-foreground">
                    <p><span className="font-medium">Date:</span> {exam.date}</p>
                    <p><span className="font-medium">Time:</span> {exam.time}</p>
                    <p><span className="font-medium">Duration:</span> {exam.duration}</p>
                    <p><span className="font-medium">Questions:</span> {exam.totalQuestions}</p>
                  </div>

                  {exam.status === 'completed' && exam.score !== null ? (
                    <div className="text-center py-3" style={{ backgroundColor: getScoreColor(exam.score) + '15' }}>
                      <p className="text-3xl font-bold" style={{ color: getScoreColor(exam.score) }}>
                        {exam.score}/{exam.totalQuestions}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round((exam.score / exam.totalQuestions) * 100)}%
                      </p>
                    </div>
                  ) : exam.status === 'in-progress' ? (
                    <div className="text-center py-3" style={{ backgroundColor: `${CARDLECT_COLORS.info.main}26` }}>
                      <p className="text-sm font-medium" style={{ color: CARDLECT_COLORS.info.main }}>Exam in Progress</p>
                      <button className="mt-2 px-4 py-1 rounded-lg text-white text-sm" style={{ backgroundColor: CARDLECT_COLORS.info.main }}>
                        Continue Exam
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full py-2 rounded-lg text-white font-medium text-sm transition-all"
                      style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                    >
                      Start Exam
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
