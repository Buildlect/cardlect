"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Users, TrendingUp, CheckCircle, Clock, AlertCircle, BookOpen, Loader2 } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
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
  student_name: string
  class_name: string
  title: string
  start_date: string
  student_score: number | null
  max_score: number
  status: string
}

export default function ParentExamsDashboard() {
  const [exams, setExams] = useState<ChildExam[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExams = async () => {
    setLoading(true)
    try {
      const response = await api.get('/exams/children')
      setExams(response.data.data)
    } catch (err) {
      console.error('Failed to fetch children exams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const stats = {
    completed: exams.filter(e => e.student_score !== null).length,
    pending: exams.filter(e => e.student_score === null).length,
  }

  const getStatusColor = (score: number | null) => {
    if (score !== null) return { color: SEMANTIC_COLORS.status.online, backgroundColor: SEMANTIC_COLORS.status.online + '20' }
    return { color: CARDLECT_COLORS.warning.main, backgroundColor: CARDLECT_COLORS.warning.main + '20' }
  }

  const getScorePercentage = (score: number | null, total: number) => {
    if (score === null || !total) return 0
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
    const child = acc.find(c => c.childName === exam.student_name)
    if (child) {
      child.exams.push(exam)
    } else {
      acc.push({ childName: exam.student_name, class: exam.class_name, exams: [exam] })
    }
    return acc
  }, [] as Array<{ childName: string; class: string; exams: ChildExam[] }>)

  // Performance data for chart
  const examStatistics = exams.filter(e => e.student_score !== null).map(e => ({
    subject: e.title.split(' ')[0], // rudimentary subject extraction
    avgScore: getScorePercentage(e.student_score, e.max_score),
    fullTitle: e.title
  })).slice(0, 5)

  if (loading) {
    return (
      <DashboardLayout currentPage="exams" role="parent">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="exams" role="parent">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">Academic Intelligence</h1>
            <p className="text-muted-foreground mt-1 font-medium italic">Integrated CBT results and performance analytics for all wards.</p>
          </div>
          <div className="flex bg-card border border-border rounded-2xl p-2 shadow-sm gap-4 items-center px-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Rank</p>
              <p className="text-xl font-black text-primary">TOP 5%</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <Award className="text-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex items-center justify-between group hover:border-green-500/50 transition-all">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Authenticated Results</p>
              <p className="text-4xl font-black text-foreground">{stats.completed}</p>
              <p className="text-xs font-bold text-green-600 mt-2 uppercase tracking-tighter italic">Verified by Node Admin</p>
            </div>
            <div className="p-5 rounded-[2rem] bg-green-500/10 text-green-600">
              <CheckCircle size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex items-center justify-between group hover:border-amber-500/50 transition-all">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Pending Protocols</p>
              <p className="text-4xl font-black text-foreground">{stats.pending}</p>
              <p className="text-xs font-bold text-amber-600 mt-2 uppercase tracking-tighter italic">Evaluation In-Progress</p>
            </div>
            <div className="p-5 rounded-[2rem] bg-amber-500/10 text-amber-600">
              <Clock size={32} />
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        {examStatistics.length > 0 && (
          <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm">
            <h3 className="text-2xl font-black text-foreground tracking-tight mb-10">Longitudinal Performance Curve</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={examStatistics}>
                  <PolarGrid stroke="var(--border)" opacity={0.5} />
                  <PolarAngleAxis dataKey="subject" stroke="var(--muted-foreground)" fontSize={11} fontWeight={900} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} hide />
                  <Radar
                    name="Performance"
                    dataKey="avgScore"
                    stroke={CARDLECT_COLORS.primary.darker}
                    fill={CARDLECT_COLORS.primary.darker}
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '12px' }}
                    formatter={(value: any) => [`${value}%`, 'Score Intensity']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Children's Exams */}
        <div className="space-y-12">
          {groupedByChild.length === 0 ? (
            <div className="bg-muted/10 border-2 border-dashed border-border rounded-[3rem] p-24 text-center">
              <BookOpen size={48} className="mx-auto mb-6 text-muted-foreground opacity-20" />
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-40">Zero examination records found in institutional registry</p>
            </div>
          ) : groupedByChild.map((child) => (
            <div key={child.childName} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                  {child.childName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{child.childName}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{child.class || 'Unassigned Node'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {child.exams.map((exam) => {
                  const percentage = getScorePercentage(exam.student_score, exam.max_score)
                  const scoreColor = getScoreColor(percentage)
                  return (
                    <div
                      key={exam.id}
                      className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:border-primary/50 transition-all group overflow-hidden relative"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="max-w-[70%]">
                          <h4 className="font-black text-lg text-foreground leading-tight mb-2">{exam.title}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{new Date(exam.start_date).toLocaleDateString()} • SESSION v2.4</p>
                        </div>
                        {exam.student_score !== null ? (
                          <div className="text-right">
                            <p className="text-3xl font-black leading-none" style={{ color: scoreColor }}>{percentage}%</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">{exam.student_score} / {exam.max_score}</p>
                          </div>
                        ) : (
                          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            In Review
                          </span>
                        )}
                      </div>

                      {exam.student_score !== null && (
                        <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%`, backgroundColor: scoreColor }}
                          />
                        </div>
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

