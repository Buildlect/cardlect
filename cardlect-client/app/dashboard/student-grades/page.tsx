'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { Search, TrendingUp, Award, BookOpen, Loader2 } from 'lucide-react'
import api from '@/lib/api-client'

export default function StudentGradesPage() {
  const [results, setResults] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedExam, setExpandedExam] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsRes = await api.get('/exams?limit=20')
        const examList: any[] = examsRes.data.data?.exams || []
        setExams(examList)

        // Fetch results for each completed exam
        const allResults: any[] = []
        await Promise.all(
          examList
            .filter((e: any) => new Date(e.start_date) <= new Date())
            .slice(0, 5)
            .map(async (e: any) => {
              try {
                const res = await api.get(`/exams/${e.id}/results`)
                const data: any[] = res.data.data || []
                allResults.push(...(Array.isArray(data) ? data : []).map((r: any) => ({ ...r, exam_title: e.title })))
              } catch (_) { }
            })
        )
        setResults(allResults)
      } catch (err) {
        console.error('Failed to fetch grades:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredExams = exams.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + parseFloat(String(r.score || '0')), 0) / results.length)
    : 0

  const getGrade = (score: number, max: number = 100) => {
    const pct = (score / max) * 100
    if (pct >= 90) return { grade: 'A', color: CARDLECT_COLORS.success.main }
    if (pct >= 80) return { grade: 'B', color: CARDLECT_COLORS.primary.darker }
    if (pct >= 70) return { grade: 'C', color: CARDLECT_COLORS.warning.main }
    if (pct >= 60) return { grade: 'D', color: '#f97316' }
    return { grade: 'F', color: CARDLECT_COLORS.danger.main }
  }

  const distribution = [
    { name: 'A (90-100)', value: results.filter(r => (parseFloat(r.score) / parseFloat(r.max_score || '100')) * 100 >= 90).length, color: CARDLECT_COLORS.success.main },
    { name: 'B (80-89)', value: results.filter(r => { const pct = (parseFloat(r.score) / parseFloat(r.max_score || '100')) * 100; return pct >= 80 && pct < 90 }).length, color: CARDLECT_COLORS.primary.darker },
    { name: 'C (70-79)', value: results.filter(r => { const pct = (parseFloat(r.score) / parseFloat(r.max_score || '100')) * 100; return pct >= 70 && pct < 80 }).length, color: CARDLECT_COLORS.warning.main },
    { name: 'F (<70)', value: results.filter(r => (parseFloat(r.score) / parseFloat(r.max_score || '100')) * 100 < 70).length, color: CARDLECT_COLORS.danger.main },
  ].filter(d => d.value > 0)

  return (
    <DashboardLayout currentPage="grades" role="student">
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">Academic Grades</h1>
          <p className="text-muted-foreground">Track your exam results and academic performance.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: CARDLECT_COLORS.primary.darker },
                { label: 'Exams Taken', value: exams.filter(e => new Date(e.start_date) <= new Date()).length, icon: Award, color: CARDLECT_COLORS.success.main },
                { label: 'Upcoming Exams', value: exams.filter(e => new Date(e.start_date) > new Date()).length, icon: BookOpen, color: CARDLECT_COLORS.warning.main },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-foreground">{s.value}</p>
                      </div>
                      <Icon size={24} color={s.color} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Charts */}
            {distribution.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-5 text-foreground">Grade Distribution</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distribution} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {distribution.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Search + Exam List */}
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              {filteredExams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen size={40} className="opacity-20 mb-3" />
                  <p className="text-muted-foreground font-medium">No exams found.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredExams.map((exam) => {
                    const myResult = results.find(r => r.exam_id === exam.id || r.exam_title === exam.title)
                    const score = myResult ? parseFloat(myResult.score) : null
                    const g = score !== null ? getGrade(score, parseFloat(exam.max_score || '100')) : null
                    const isPast = new Date(exam.start_date) <= new Date()

                    return (
                      <div
                        key={exam.id}
                        onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                        className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{exam.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{exam.term} · {exam.session} · {exam.duration_minutes}m</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {!isPast && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">Upcoming</span>
                            )}
                            {g && (
                              <div className="text-2xl font-black px-4 py-2 rounded-xl text-white" style={{ backgroundColor: g.color }}>
                                {g.grade}
                              </div>
                            )}
                            {isPast && !g && (
                              <span className="text-xs text-muted-foreground">No result</span>
                            )}
                          </div>
                        </div>

                        {expandedExam === exam.id && myResult && (
                          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Score</p>
                              <p className="text-lg font-bold text-foreground">{myResult.score}/{exam.max_score}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Percentage</p>
                              <p className="text-lg font-bold" style={{ color: g?.color }}>
                                {((parseFloat(myResult.score) / parseFloat(exam.max_score || '100')) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Date</p>
                              <p className="text-lg font-bold text-foreground">{new Date(exam.start_date).toLocaleDateString('en-NG')}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
