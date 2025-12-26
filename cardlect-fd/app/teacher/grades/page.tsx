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
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
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
              <div className="text-2xl font-bold text-green-600">{stats.highest}%</div>
              <div className="text-xs text-muted-foreground mt-2">Outstanding performance</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Lowest Score</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.lowest}%</div>
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
                      <td className="py-3 px-4 text-center">{grade.quiz1}%</td>
                      <td className="py-3 px-4 text-center">{grade.quiz2}%</td>
                      <td className="py-3 px-4 text-center">{grade.midterm}%</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">-</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(grade.average)}`}>
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
      </div>
    </DashboardLayout>
  )
}
