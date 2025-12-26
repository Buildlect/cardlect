'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Users, BookOpen, Clock, CheckCircle, TrendingUp, Bell, FileText, Calendar, Plus, BarChart3, Eye } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

export default function TeacherDashboard() {
  const [alerts] = useState([
    {
      text: 'Class 5A - Assignment due date tomorrow',
      icon: Clock,
      color: '#F59E0B',
      bg: '#1a1a1a',
    },
    {
      text: 'Exam papers ready for review',
      icon: FileText,
      color: '#3B82F6',
      bg: '#262626',
    },
    {
      text: 'Parent-teacher meeting scheduled',
      icon: Users,
      color: '#10B981',
      bg: '#1a1a1a',
    },
  ])

  const sampleData = [
    { name: 'Mon', value: 35 },
    { name: 'Tue', value: 36 },
    { name: 'Wed', value: 34 },
    { name: 'Thu', value: 37 },
    { name: 'Fri', value: 35 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ]

  const chartData = [
    { day: 'Mon', present: 35, absent: 2 },
    { day: 'Tue', present: 36, absent: 1 },
    { day: 'Wed', present: 34, absent: 3 },
    { day: 'Thu', present: 37, absent: 0 },
    { day: 'Fri', present: 35, absent: 2 },
    { day: 'Sat', present: 0, absent: 0 },
    { day: 'Sun', present: 0, absent: 0 },
  ]

  const performanceData = [
    { class: 'Class 5A', avg: 82, trend: '+5%' },
    { class: 'Class 5B', avg: 78, trend: '+2%' },
    { class: 'Class 6A', avg: 85, trend: '+8%' },
    { class: 'Class 6B', avg: 79, trend: '-1%' },
    { class: 'Class 6C', avg: 88, trend: '+12%' },
  ]

  const [cbtExams] = useState([
    {
      id: '1',
      title: 'Mathematics CBT - Class 5A',
      subject: 'Mathematics',
      students: 37,
      completed: 32,
      status: 'in-progress',
      avgScore: 76,
      date: '2024-02-15',
      questions: 60,
      description: 'Comprehensive math assessment for Class 5A',
    },
    {
      id: '2',
      title: 'English Language - All Classes',
      subject: 'English',
      students: 142,
      completed: 118,
      status: 'in-progress',
      avgScore: 79,
      date: '2024-02-18',
      questions: 50,
      description: 'End of term English examination',
    },
    {
      id: '3',
      title: 'Physics CBT - Class 6A',
      subject: 'Physics',
      students: 38,
      completed: 38,
      status: 'completed',
      avgScore: 82,
      date: '2024-02-12',
      questions: 45,
      description: 'Physics practical and theory assessment',
    },
    {
      id: '4',
      title: 'Biology Practice Test',
      subject: 'Biology',
      students: 35,
      completed: 28,
      status: 'pending',
      avgScore: 0,
      date: '2024-02-20',
      questions: 40,
      description: 'Practice examination for upcoming assessment',
    },
  ])

  const metrics = [
    {
      label: 'Students',
      value: 142,
      change: 'Across all classes',
      icon: Users,
      color: '#3B82F6',
      data: sampleData,
      tooltip: 'Total students taught',
    },
    {
      label: 'Attendance Today',
      value: 137,
      change: '96.5% present',
      icon: CheckCircle,
      color: '#10B981',
      data: sampleData,
      tooltip: 'Students present today',
    },
    {
      label: 'Assignments',
      value: 28,
      change: '+5 pending review',
      icon: FileText,
      color: '#F59E0B',
      data: sampleData,
      tooltip: 'Total assignments given',
    },
    {
      label: 'Avg Performance',
      value: '82%',
      change: '+3% this term',
      icon: TrendingUp,
      color: '#8B5CF6',
      data: sampleData,
      tooltip: 'Average class performance',
    },
  ]

  return (
    <DashboardLayout currentPage="dashboard" role="teacher">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Manage classes, track student performance, and communicate with parents.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon
          const chartData = metric.data.map((d, idx) => ({ x: idx, y: d.value }))

          return (
            <div
              key={i}
              className="relative group overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
              role="group"
              aria-label={`${metric.label} metric card`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                  {metric.tooltip}
                </div>
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                      +
                      <span className="opacity-90">{metric.change}</span>
                    </span>
                  </div>
                </div>

                {/* icons */}
                <div
                  className={`bg-card/50 flex items-center justify-center w-14 h-14 rounded-xl shadow-sm`}
                  aria-hidden
                  title={metric.label}
                >
                  <Icon size={24} color={metric.color} />
                </div>
              </div>

              {/* Recharts sparkline with tooltip */}
              <div className="mt-5 relative z-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} aria-hidden>
                    <XAxis dataKey="x" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        return (
                          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                            {payload[0].value}
                          </div>
                        )
                      }}
                      cursor={{ stroke: metric.color, strokeWidth: 2, opacity: 0.1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                      activeDot={{ r: 3, stroke: metric.color, strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">trend</div>
            </div>
          )
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
            Weekly Attendance
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad-attendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                />
                <YAxis hide />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null
                    return (
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                        Present: {payload[0].value}
                      </div>
                    )
                  }}
                  cursor={{ stroke: '#10B981', strokeWidth: 2, opacity: 0.1 }}
                />

                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#grad-attendance)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Notifications */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-foreground tracking-tight">
            Notifications
          </h3>

          <div className="space-y-4">
            {alerts.map((a, i) => {
              const Icon = a.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-border bg-background/30 hover:bg-background/50 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group"
                >
                  {/* Alert Icon */}
                  <div className="p-3 bg-card dark:bg-card rounded-xl flex items-center justify-center shadow-md relative">
                    <Icon size={20} color={a.color} />

                    {/* Pulse dot */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  </div>

                  {/* Text */}
                  <span className="text-sm text-foreground font-medium tracking-tight">
                    {a.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CBT Exams Management Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">CBT Exams</h2>
          <button
            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
            className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cbtExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer group"
            >
              {/* Header with status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    style={{ backgroundColor: CARDLECT_COLORS.primary.main }}
                    className="p-3 rounded-xl flex items-center justify-center text-white"
                  >
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                    <p className="text-sm text-muted-foreground">{exam.description}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    exam.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : exam.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {exam.status === 'completed'
                    ? 'Completed'
                    : exam.status === 'in-progress'
                    ? 'In Progress'
                    : 'Pending'}
                </div>
              </div>

              {/* Exam Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-background/50 rounded-xl">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{exam.students}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {exam.completed}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({Math.round((exam.completed / exam.students) * 100)}%)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Questions</p>
                  <p className="text-2xl font-bold text-foreground">{exam.questions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Score</p>
                  <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.main }}>
                    {exam.avgScore > 0 ? `${exam.avgScore}%` : '-'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                  className="flex-1 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  View Results
                </button>
                <button
                  style={{ borderColor: CARDLECT_COLORS.primary.main, color: CARDLECT_COLORS.primary.main }}
                  className="flex-1 border-2 font-semibold py-2.5 rounded-xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                >
                  <BarChart3 size={18} />
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
