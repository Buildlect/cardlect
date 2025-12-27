'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { Search, TrendingUp, Award, AlertCircle } from 'lucide-react'

interface Grade {
  subject: string
  score: number
  grade: string
  status: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement'
  teacher: string
}

const mockGrades: Grade[] = [
  { subject: 'Mathematics', score: 85, grade: 'A', status: 'excellent', teacher: 'Mr. Johnson' },
  { subject: 'English Language', score: 78, grade: 'B+', status: 'good', teacher: 'Ms. Williams' },
  { subject: 'Physics', score: 92, grade: 'A', status: 'excellent', teacher: 'Dr. Davis' },
  { subject: 'Chemistry', score: 88, grade: 'A', status: 'excellent', teacher: 'Mr. Brown' },
  { subject: 'Biology', score: 81, grade: 'B', status: 'good', teacher: 'Ms. Martinez' },
  { subject: 'History', score: 75, grade: 'B', status: 'satisfactory', teacher: 'Mr. Wilson' },
]

const chartData = [
  { term: 'Term 1', average: 82, english: 78, maths: 85, science: 88 },
  { term: 'Term 2', average: 84, english: 80, maths: 87, science: 90 },
  { term: 'Term 3', average: 86, english: 83, maths: 90, science: 92 },
]

const gradeDistribution = [
  { name: 'A (90-100)', value: 3, color: CARDLECT_COLORS.success.main },
  { name: 'B (80-89)', value: 2, color: CARDLECT_COLORS.primary.darker },
  { name: 'C (70-79)', value: 1, color: CARDLECT_COLORS.warning.main },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return CARDLECT_COLORS.success.main
    case 'good': return CARDLECT_COLORS.primary.darker
    case 'satisfactory': return CARDLECT_COLORS.warning.main
    default: return CARDLECT_COLORS.danger.main
  }
}

export default function StudentGradesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)

  const filteredGrades = mockGrades.filter(g =>
    g.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const averageScore = Math.round(
    mockGrades.reduce((sum, g) => sum + g.score, 0) / mockGrades.length
  )

  return (
    <DashboardLayout currentPage="grades" role="students">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Academic Grades</h1>
        <p className="text-muted-foreground">Track your subject grades and academic performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                <p className="text-3xl font-bold text-foreground">{averageScore}%</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Subjects</p>
                <p className="text-3xl font-bold text-foreground">{mockGrades.length}</p>
              </div>
              <Award size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Grade A Count</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <AlertCircle size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="term" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: `1px solid ${CARDLECT_COLORS.primary.darker}` }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke={CARDLECT_COLORS.primary.darker}
                  strokeWidth={2}
                  dot={{ fill: CARDLECT_COLORS.primary.darker, r: 5 }}
                  name="Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Grades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subject Grades</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredGrades.map((grade) => (
              <div
                key={grade.subject}
                onClick={() => setExpandedSubject(expandedSubject === grade.subject ? null : grade.subject)}
                className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{grade.subject}</h3>
                    <p className="text-sm text-muted-foreground">{grade.teacher}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-2xl font-bold text-white px-4 py-2 rounded-lg"
                      style={{ backgroundColor: getStatusColor(grade.status) }}
                    >
                      {grade.grade}
                    </div>
                  </div>
                </div>

                {expandedSubject === grade.subject && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className="text-lg font-semibold text-foreground">{grade.score}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-lg font-semibold capitalize" style={{ color: getStatusColor(grade.status) }}>
                          {grade.status.replace('-', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                        <p className="text-lg font-semibold text-foreground">{grade.teacher.split(' ')[0]}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Class Average</p>
                        <p className="text-lg font-semibold text-foreground">82%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
