'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CARDLECT_COLORS, ROLE_COLORS } from '@/lib/cardlect-colors'
import { BookOpen, Users, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react'

const cbtExamsData = [
  { id: '1', title: 'WAEC Mathematics CBT', subject: 'Mathematics', students: 245, completed: 210, pending: 35, avgScore: 68, status: 'completed' },
  { id: '2', title: 'NECO English CBT', subject: 'English', students: 250, completed: 248, pending: 2, avgScore: 72, status: 'completed' },
  { id: '3', title: 'Mock Biology CBT', subject: 'Biology', students: 180, completed: 175, pending: 5, avgScore: 65, status: 'in-progress' },
  { id: '4', title: 'Chemistry Practical CBT', subject: 'Chemistry', students: 175, completed: 0, pending: 175, avgScore: 0, status: 'pending' },
]

const monthlyExamData = [
  { month: 'Jan', exams: 4, completed: 3, avgScore: 68 },
  { month: 'Feb', exams: 5, completed: 4, avgScore: 70 },
  { month: 'Mar', exams: 6, completed: 5, avgScore: 72 },
  { month: 'Apr', exams: 8, completed: 7, avgScore: 69 },
  { month: 'May', exams: 7, completed: 6, avgScore: 71 },
  { month: 'Jun', exams: 9, completed: 8, avgScore: 73 },
]

const scoreDistribution = [
  { range: 'A (80-100)', count: 145 },
  { range: 'B (70-79)', count: 320 },
  { range: 'C (60-69)', count: 185 },
  { range: 'D (50-59)', count: 45 },
  { range: 'F (0-49)', count: 15 },
]

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9E9E9E']

export default function ExamOfficerDashboard() {
  const [exams, setExams] = useState(cbtExamsData)

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'in-progress').length,
    completedExams: exams.filter(e => e.status === 'completed').length,
    totalStudents: exams.reduce((sum, e) => sum + e.students, 0),
    avgScore: Math.round(exams.filter(e => e.avgScore > 0).reduce((sum, e) => sum + e.avgScore, 0) / exams.filter(e => e.avgScore > 0).length),
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <DashboardLayout currentPage="dashboard" role="exam-officer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exam Officer Dashboard</h1>
            <p className="text-muted-foreground">Manage CBT exams, monitor student performance, and analyze results</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 transition-opacity">
            <BookOpen size={18} /> Create Exam
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Exams</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.totalExams}</div>
              <div className="text-xs text-muted-foreground mt-2">This term</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Active Exams</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.activeExams}</div>
              <div className="text-xs mt-2" style={{ color: CARDLECT_COLORS.primary.darker }}>In progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completedExams}</div>
              <div className="text-xs text-muted-foreground mt-2">Fully graded</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Students Examined</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.totalStudents}</div>
              <div className="text-xs text-muted-foreground mt-2">Total entries</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Average Score</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.avgScore}%</div>
              <div className="text-xs text-muted-foreground mt-2">Across all exams</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Exam Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyExamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exams" fill={CARDLECT_COLORS.primary.darker} />
                  <Bar dataKey="completed" fill={CARDLECT_COLORS.success.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.range}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Exams */}
        <Card>
          <CardHeader>
            <CardTitle>CBT Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exam.title}</h3>
                      <p className="text-sm text-muted-foreground">{exam.subject}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(exam.status)}`}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Students</span>
                      <div className="font-semibold text-lg">{exam.students}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed</span>
                      <div className="font-semibold text-green-600">{exam.completed}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pending</span>
                      <div className="font-semibold text-yellow-600">{exam.pending}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Score</span>
                      <div className="font-semibold">{exam.avgScore}%</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(exam.completed / exam.students) * 100}%`, backgroundColor: CARDLECT_COLORS.success.main }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Results</Button>
                    <Button variant="outline" size="sm">Manage</Button>
                    <Button variant="outline" size="sm"><Download size={16} /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
