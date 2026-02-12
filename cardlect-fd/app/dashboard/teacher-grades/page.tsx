'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Plus } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Grade {
  studentId: string
  name: string
  class: string
  quiz1: number
  quiz2: number
  midterm: number
  final: number
  average: number
}

const mockGrades: Grade[] = [
  { studentId: 'S001', name: 'Chioma Okonkwo', class: '10A', quiz1: 85, quiz2: 88, midterm: 82, final: 0, average: 85 },
  { studentId: 'S002', name: 'Tunde Adebayo', class: '10A', quiz1: 92, quiz2: 95, midterm: 90, final: 0, average: 92 },
  { studentId: 'S003', name: 'Sarah Johnson', class: '10B', quiz1: 78, quiz2: 81, midterm: 80, final: 0, average: 80 },
  { studentId: 'S004', name: 'Michael Chen', class: '10B', quiz1: 88, quiz2: 90, midterm: 87, final: 0, average: 88 },
]

const gradeDistribution = [
  { range: 'A (90-100)', count: 1 },
  { range: 'B (80-89)', count: 2 },
  { range: 'C (70-79)', count: 1 },
]

export default function GradesPage() {
  const [grades, setGrades] = useState(mockGrades)
  const [selectedClass, setSelectedClass] = useState('10A')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingGrade, setEditingGrade] = useState<{ studentId: string; type: 'quiz1' | 'quiz2' | 'midterm' | 'final' } | null>(null)
  const [editValue, setEditValue] = useState('')

  const filteredGrades = grades.filter(g =>
    g.class === selectedClass &&
    (g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.studentId.includes(searchTerm))
  )

  const stats = {
    classAverage: (filteredGrades.reduce((sum, g) => sum + g.average, 0) / filteredGrades.length || 0).toFixed(1),
    highest: Math.max(...filteredGrades.map(g => g.average), 0),
    lowest: Math.min(...filteredGrades.map(g => g.average), 100),
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
    if (score >= 80) return { color: CARDLECT_COLORS.primary.darker, backgroundColor: `${CARDLECT_COLORS.primary.darker}20` }
    if (score >= 70) return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20` }
    return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
  }

  const handleGradeEdit = (studentId: string, type: 'quiz1' | 'quiz2' | 'midterm' | 'final', currentValue: number) => {
    setEditingGrade({ studentId, type })
    setEditValue(currentValue.toString())
  }

  const handleGradeSave = () => {
    if (!editingGrade) return
    const value = parseInt(editValue)
    if (isNaN(value) || value < 0 || value > 100) {
      alert('Grade must be between 0 and 100')
      return
    }
    
    setGrades(grades.map(g => {
      if (g.studentId === editingGrade.studentId) {
        const updated = { ...g, [editingGrade.type]: value }
        // Recalculate average
        const graded = [updated.quiz1, updated.quiz2, updated.midterm, updated.final].filter(v => v > 0)
        updated.average = graded.length > 0 ? Math.round(graded.reduce((a, b) => a + b, 0) / graded.length) : updated.average
        return updated
      }
      return g
    }))
    setEditingGrade(null)
    alert('Grade updated successfully!')
  }

  return (
    <DashboardLayout currentPage="grades" role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Grades</h1>
            <p className="text-muted-foreground">Manage student grades and performance</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.info.main }} className="text-white">
            <Download size={18} /> Export
          </Button>
        </div>

        {/* Class Selector */}
        <div className="flex gap-2 flex-wrap">
          {['10A', '10B', '11'].map((cls) => (
            <Button
              key={cls}
              variant={selectedClass === cls ? 'default' : 'outline'}
              onClick={() => setSelectedClass(cls)}
            >
              Class {cls}
            </Button>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Class Average</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.classAverage}%</div>
              <div className="text-xs text-muted-foreground mt-2">{filteredGrades.length} students graded</div>
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

        {/* Chart */}
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

        {/* Search */}
        <Input 
          placeholder="Search student..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        {/* Grades Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Student Name</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Quiz 1</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Quiz 2</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Midterm</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Final</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => (
                    <tr key={grade.studentId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{grade.name}</td>
                      <td className="py-3 px-4 text-center cursor-pointer hover:bg-secondary" onClick={() => handleGradeEdit(grade.studentId, 'quiz1', grade.quiz1)} title="Click to edit">{grade.quiz1}%</td>
                      <td className="py-3 px-4 text-center cursor-pointer hover:bg-secondary" onClick={() => handleGradeEdit(grade.studentId, 'quiz2', grade.quiz2)} title="Click to edit">{grade.quiz2}%</td>
                      <td className="py-3 px-4 text-center cursor-pointer hover:bg-secondary" onClick={() => handleGradeEdit(grade.studentId, 'midterm', grade.midterm)} title="Click to edit">{grade.midterm}%</td>
                      <td className="py-3 px-4 text-center cursor-pointer hover:bg-secondary" onClick={() => handleGradeEdit(grade.studentId, 'final', grade.final === 0 ? 0 : grade.final)} title="Click to enter final grade">{grade.final === 0 ? '-' : `${grade.final}%`}</td>
                      <td className="py-3 px-4 text-center">
                        <span style={{ ...getGradeColor(grade.average), padding: '0.75rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {grade.average}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grade Edit Modal */}
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
