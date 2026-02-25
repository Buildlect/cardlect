'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, CheckCircle, Clock, AlertCircle, BookOpen } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import {
  BarChart,
  Bar,
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

interface ChildExam {
  id: string
  childName: string
  class: string
  examTitle: string
  subject: string
  date: string
  score: number | null
  totalQuestions: number
  status: 'completed' | 'in-progress' | 'pending'
}

const childExams: ChildExam[] = [
  {
    id: '1',
    childName: 'Chioma Adeyemi',
    class: 'Class 5A',
    examTitle: 'WAEC Mathematics CBT',
    subject: 'Mathematics',
    date: '2024-02-15',
    score: 42,
    totalQuestions: 50,
    status: 'completed'
  },
  {
    id: '2',
    childName: 'Chioma Adeyemi',
    class: 'Class 5A',
    examTitle: 'NECO English CBT',
    subject: 'English',
    date: '2024-02-16',
    score: 38,
    totalQuestions: 50,
    status: 'completed'
  },
  {
    id: '3',
    childName: 'Chioma Adeyemi',
    class: 'Class 5A',
    examTitle: 'Mock Biology CBT',
    subject: 'Biology',
    date: '2024-02-17',
    score: null,
    totalQuestions: 50,
    status: 'in-progress'
  },
  {
    id: '4',
    childName: 'Tunde Adeyemi',
    class: 'Class 3B',
    examTitle: 'Primary Science Assessment',
    subject: 'Science',
    date: '2024-02-15',
    score: 35,
    totalQuestions: 40,
    status: 'completed'
  },
]

const childPerformance = [
  { name: 'Chioma', Mathematics: 84, English: 76, Biology: 0, Chemistry: 0, Physics: 0 },
  { name: 'Tunde', Mathematics: 78, English: 82, Science: 88, Social: 75, Literature: 80 },
]

const examStatistics = [
  { subject: 'Mathematics', avgScore: 75, classAvg: 68 },
  { subject: 'English', avgScore: 80, classAvg: 72 },
  { subject: 'Science', avgScore: 70, classAvg: 65 },
  { subject: 'Chemistry', avgScore: 0, classAvg: 70 },
  { subject: 'Physics', avgScore: 0, classAvg: 71 },
]

export default function ParentExamsDashboard() {
  const [exams] = useState<ChildExam[]>(childExams)

  const stats = {
    completed: exams.filter(e => e.status === 'completed').length,
    inProgress: exams.filter(e => e.status === 'in-progress').length,
    pending: exams.filter(e => e.status === 'pending').length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { color: SEMANTIC_COLORS.status.online, backgroundColor: SEMANTIC_COLORS.status.online + '20' }
      case 'in-progress': return { color: CARDLECT_COLORS.info.main, backgroundColor: CARDLECT_COLORS.info.main + '20' }
      case 'pending': return { color: CARDLECT_COLORS.warning.main, backgroundColor: CARDLECT_COLORS.warning.main + '20' }
      default: return { color: '#666666', backgroundColor: '#66666620' }
    }
  }

  const getScorePercentage = (score: number | null, total: number) => {
    if (!score) return 0
    return Math.round((score / total) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return SEMANTIC_COLORS.status.online
    if (percentage >= 70) return CARDLECT_COLORS.success.main
    if (percentage >= 60) return CARDLECT_COLORS.primary.main
    if (percentage >= 50) return CARDLECT_COLORS.warning.main
    return CARDLECT_COLORS.danger.main
  }

  const groupedByChild = exams.reduce((acc, exam) => {
    const child = acc.find(c => c.childName === exam.childName)
    if (child) {
      child.exams.push(exam)
    } else {
      acc.push({ childName: exam.childName, class: exam.class, exams: [exam] })
    }
    return acc
  }, [] as Array<{ childName: string; class: string; exams: ChildExam[] }>)

  return (
    <DashboardLayout currentPage="exams" role="parents">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Children's CBT Exams</h1>
          <p className="text-muted-foreground">Monitor your children's exam performance and progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Exams</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.completed}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.success.main + '20' }}>
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
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.info.main + '20' }}>
                <Clock size={20} style={{ color: CARDLECT_COLORS.info.main }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: CARDLECT_COLORS.warning.main + '20' }}>
                <AlertCircle size={20} style={{ color: CARDLECT_COLORS.warning.main }} />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Subject Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={examStatistics}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--foreground)" fontSize={12} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" />
                <Radar
                  name="Your Children Avg"
                  dataKey="avgScore"
                  stroke={CARDLECT_COLORS.primary.darker}
                  fill={CARDLECT_COLORS.primary.darker}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Class Average"
                  dataKey="classAvg"
                  stroke={CARDLECT_COLORS.secondary.main}
                  fill={CARDLECT_COLORS.secondary.main}
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip formatter={(value: any) => `${Number(value)}%`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {examStatistics.map((stat) => {
                const percentage = stat.avgScore
                return (
                  <div key={stat.subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{stat.subject}</span>
                      <span className="text-sm font-bold" style={{ color: getScoreColor(percentage) }}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getScoreColor(percentage)
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Children's Exams */}
        <div className="space-y-6">
          {groupedByChild.map((child) => (
            <div key={child.childName} className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {child.childName} • <span className="text-muted-foreground text-base font-normal">{child.class}</span>
              </h3>

              <div className="space-y-3">
                {child.exams.map((exam) => {
                  const statusColor = getStatusColor(exam.status)
                  const percentage = getScorePercentage(exam.score, exam.totalQuestions)
                  return (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{exam.examTitle}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{exam.subject}</span>
                          <span>•</span>
                          <span>{exam.date}</span>
                        </div>
                      </div>

                      {exam.status === 'completed' && exam.score !== null ? (
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold" style={{ color: getScoreColor(percentage) }}>
                              {percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">{exam.score}/{exam.totalQuestions}</p>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                            style={statusColor}
                          >
                            Completed
                          </span>
                        </div>
                      ) : exam.status === 'in-progress' ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={statusColor}
                        >
                          In Progress
                        </span>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={statusColor}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
