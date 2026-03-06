'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'

interface ClassOption {
  id: string
  name: string
}

interface GradeRow {
  id: string
  student_id: string
  student_name?: string
  admission_number?: string
  assignment_id: string
  assignment_title?: string
  class_id?: string
  class_name?: string
  score?: number | string
  remarks?: string
  graded_at?: string
}

interface Grade {
  id: string
  studentId: string
  name: string
  admissionNo: string
  classId: string
  className: string
  assignmentId: string
  assignmentTitle: string
  score: number
  remarks: string
  gradedAt: string
}

export default function GradesPage() {
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingGrade, setEditingGrade] = useState<{ id: string; studentId: string; assignmentId: string; remarks: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const [classRes, gradeRes] = await Promise.all([
          api.get('/academics/classes'),
          api.get('/academics/grades'),
        ])

        const classRows: Array<{ id: string; name?: string }> = Array.isArray(classRes.data?.data) ? classRes.data.data : []
        setClasses(classRows.map((c) => ({ id: c.id, name: c.name || c.id })))

        const gradeRows: GradeRow[] = Array.isArray(gradeRes.data?.data) ? gradeRes.data.data : []
        setGrades(
          gradeRows.map((row) => ({
            id: row.id,
            studentId: row.student_id,
            name: row.student_name || 'Unknown Student',
            admissionNo: row.admission_number || 'N/A',
            classId: row.class_id || 'unknown',
            className: row.class_name || 'Unknown Class',
            assignmentId: row.assignment_id,
            assignmentTitle: row.assignment_title || 'Untitled Assignment',
            score: Number(row.score || 0),
            remarks: row.remarks || '',
            gradedAt: row.graded_at ? new Date(row.graded_at).toLocaleDateString() : 'N/A',
          })),
        )
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load grades')
        setClasses([])
        setGrades([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      const classMatch = selectedClass === 'all' || g.classId === selectedClass
      const searchMatch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.admissionNo.includes(searchTerm)
      return classMatch && searchMatch
    })
  }, [grades, searchTerm, selectedClass])

  const stats = useMemo(() => {
    if (filteredGrades.length === 0) {
      return { classAverage: '0.0', highest: 0, lowest: 0 }
    }
    const scores = filteredGrades.map((g) => g.score)
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
    return {
      classAverage: avg.toFixed(1),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    }
  }, [filteredGrades])

  const gradeDistribution = useMemo(() => {
    const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    filteredGrades.forEach((g) => {
      if (g.score >= 90) buckets.A += 1
      else if (g.score >= 80) buckets.B += 1
      else if (g.score >= 70) buckets.C += 1
      else if (g.score >= 60) buckets.D += 1
      else buckets.F += 1
    })
    return [
      { range: 'A (90-100)', count: buckets.A },
      { range: 'B (80-89)', count: buckets.B },
      { range: 'C (70-79)', count: buckets.C },
      { range: 'D (60-69)', count: buckets.D },
      { range: 'F (<60)', count: buckets.F },
    ]
  }, [filteredGrades])

  const getGradeColor = (score: number) => {
    if (score >= 90) return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
    if (score >= 80) return { color: CARDLECT_COLORS.primary.darker, backgroundColor: `${CARDLECT_COLORS.primary.darker}20` }
    if (score >= 70) return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20` }
    return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
  }

  const handleGradeEdit = (grade: Grade) => {
    setEditingGrade({ id: grade.id, studentId: grade.studentId, assignmentId: grade.assignmentId, remarks: grade.remarks })
    setEditValue(grade.score.toString())
  }

  const handleGradeSave = async () => {
    if (!editingGrade) return
    const value = parseFloat(editValue)
    if (Number.isNaN(value) || value < 0 || value > 100) {
      alert('Grade must be between 0 and 100')
      return
    }

    try {
      await api.post('/academics/record-grade', {
        studentId: editingGrade.studentId,
        assignmentId: editingGrade.assignmentId,
        score: value,
        remarks: editingGrade.remarks,
      })

      setGrades((prev) => prev.map((g) => (g.id === editingGrade.id ? { ...g, score: value } : g)))
      setEditingGrade(null)
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: string } }; message?: string }
      alert(apiError?.response?.data?.error || apiError?.message || 'Failed to save grade')
    }
  }

  return (
    <DashboardLayout currentPage="grades" role="staff" customRole="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Grades</h1>
            <p className="text-muted-foreground">Manage student grades and performance</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.info.main }} className="text-white" disabled>
            <Download size={18} /> Export
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant={selectedClass === 'all' ? 'default' : 'outline'} onClick={() => setSelectedClass('all')}>
            All Classes
          </Button>
          {classes.map((cls) => (
            <Button
              key={cls.id}
              variant={selectedClass === cls.id ? 'default' : 'outline'}
              onClick={() => setSelectedClass(cls.id)}
            >
              {cls.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Class Average</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.classAverage}%</div>
              <div className="text-xs text-muted-foreground mt-2">{filteredGrades.length} grades</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Highest Score</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.highest}%</div>
              <div className="text-xs text-muted-foreground mt-2">Outstanding performance</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Lowest Score</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.lowest}%</div>
              <div className="text-xs text-muted-foreground mt-2">Needs improvement</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={CARDLECT_COLORS.info.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Input
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading grades...</p>
            ) : errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : filteredGrades.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grade records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Class</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Assignment</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold">Score</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold">Graded On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade) => (
                      <tr key={grade.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          <div>{grade.name}</div>
                          <div className="text-xs text-muted-foreground">{grade.admissionNo}</div>
                        </td>
                        <td className="py-3 px-4">{grade.className}</td>
                        <td className="py-3 px-4">{grade.assignmentTitle}</td>
                        <td
                          className="py-3 px-4 text-center cursor-pointer hover:bg-secondary"
                          onClick={() => handleGradeEdit(grade)}
                          title="Click to edit"
                        >
                          <span
                            style={{ ...getGradeColor(grade.score), padding: '0.75rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}
                          >
                            {grade.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{grade.gradedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {editingGrade && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setEditingGrade(null)}>
            <div className="bg-white dark:bg-card rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">Edit Grade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Grade (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-foreground bg-background text-lg font-semibold text-center"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleGradeSave} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="flex-1 text-white py-2 rounded hover:opacity-90">Save</button>
                <button onClick={() => setEditingGrade(null)} className="flex-1 border rounded py-2 hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
