"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Award, Clock, CheckCircle, AlertCircle, BookOpen, Loader2 } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import {
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
  school_name: string
  start_date: string
  duration_minutes: number
  max_score: number
  student_score: number | null
  student_grade: string | null
}

export default function StudentExamsDashboard() {
  const [exams, setExams] = useState<StudentExam[]>([])
  const [loading, setLoading] = useState(true)

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
    completed: exams.filter(e => e.student_score !== null).length,
    available: exams.filter(e => e.student_score === null).length, // simplified
    avgScore: exams.filter(e => e.student_score !== null).length > 0
      ? Math.round(exams.filter(e => e.student_score !== null).reduce((sum, e) => sum + ((e.student_score || 0) / e.max_score * 100), 0) / exams.filter(e => e.student_score !== null).length)
      : 0,
  }

  const getStatus = (exam: StudentExam) => {
    if (exam.student_score !== null) return 'completed'
    return 'available'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={18} style={{ color: CARDLECT_COLORS.success.main }} />
      case 'available': return <BookOpen size={18} style={{ color: CARDLECT_COLORS.warning.main }} />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: `${CARDLECT_COLORS.success.main}26`, text: CARDLECT_COLORS.success.main }
      case 'available': return { bg: `${CARDLECT_COLORS.warning.main}26`, text: CARDLECT_COLORS.warning.main }
      default: return { bg: 'var(--muted)', text: 'var(--muted-foreground)' }
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return SEMANTIC_COLORS.status.online
    if (percentage >= 70) return CARDLECT_COLORS.success.main
    if (percentage >= 60) return CARDLECT_COLORS.primary.main
    if (percentage >= 50) return CARDLECT_COLORS.warning.main
    return CARDLECT_COLORS.danger.main
  }

  const performanceData = exams.filter(e => e.student_score !== null).map(e => ({
    subject: e.title.split(' ')[0],
    score: Math.round((e.student_score || 0) / e.max_score * 100)
  })).slice(0, 5)

  if (loading) {
    return (
      <DashboardLayout currentPage="exams" role="student">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="exams" role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tighter">My Academic Protocols</h1>
          <p className="text-muted-foreground font-medium">Verify your results and access authorized CBT sessions.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Completed</p>
              <p className="text-3xl font-black text-foreground">{stats.completed}</p>
            </div>
            <div className="p-4 rounded-2xl bg-success/10 text-success">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Upcoming</p>
              <p className="text-3xl font-black text-foreground">{stats.available}</p>
            </div>
            <div className="p-4 rounded-2xl bg-warning/10 text-warning">
              <BookOpen size={24} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Global Intensity</p>
              <p className="text-3xl font-black text-foreground">{stats.avgScore}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Award size={24} />
            </div>
          </div>
        </div>

        {/* Performance Radar */}
        {performanceData.length > 0 && (
          <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-xl font-black text-foreground tracking-tight mb-8 uppercase text-[10px] opacity-40">Intelligence Vector</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--foreground)" fontSize={10} fontWeight={900} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} hide />
                  <Radar
                    name="My Performance"
                    dataKey="score"
                    stroke={CARDLECT_COLORS.primary.darker}
                    fill={CARDLECT_COLORS.primary.darker}
                    fillOpacity={0.5}
                  />
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Exams Grid */}
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-black text-foreground tracking-tighter">Authorized Examination Node</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.length === 0 ? (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-3xl opacity-30">
                <BookOpen size={48} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No Active Sessions in Registry</p>
              </div>
            ) : exams.map((exam) => {
              const status = getStatus(exam)
              const statusColor = getStatusColor(status)
              const percentage = exam.student_score !== null ? Math.round((exam.student_score / exam.max_score) * 100) : 0

              return (
                <div key={exam.id} className="bg-card border border-border rounded-[2rem] p-8 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    {getStatusIcon(status)}
                  </div>
                  <div className="pr-12">
                    <h4 className="font-black text-xl text-foreground tracking-tight mb-1">{exam.title}</h4>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{exam.school_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6 text-xs font-bold text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest opacity-60">System Date</span>
                      <span className="text-foreground">{new Date(exam.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest opacity-60">Session Limit</span>
                      <span className="text-foreground">{exam.duration_minutes} mins</span>
                    </div>
                  </div>

                  {status === 'completed' ? (
                    <div className="flex items-center justify-between p-6 rounded-2xl" style={{ backgroundColor: getScoreColor(percentage) + '15' }}>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Evaluation Result</p>
                        <p className="text-4xl font-black" style={{ color: getScoreColor(percentage) }}>{percentage}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-foreground">{exam.student_score} / {exam.max_score}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase mt-1">Grade: {exam.student_grade || 'E'}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="w-full py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                    >
                      Initialize Session
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

