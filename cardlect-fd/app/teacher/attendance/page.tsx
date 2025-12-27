'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, CheckCircle2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AttendanceRecord {
  id: string
  studentName: string
  studentId: string
  present: number
  absent: number
  percentage: number
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentName: 'Chioma Okonkwo', studentId: 'S001', present: 18, absent: 2, percentage: 90 },
  { id: '2', studentName: 'Tunde Adebayo', studentId: 'S002', present: 19, absent: 1, percentage: 95 },
  { id: '3', studentName: 'Sarah Johnson', studentId: 'S003', present: 17, absent: 3, percentage: 85 },
  { id: '4', studentName: 'Michael Chen', studentId: 'S004', present: 20, absent: 0, percentage: 100 },
]

const monthlyAttendance = [
  { week: 'Week 1', attendance: 92, target: 95 },
  { week: 'Week 2', attendance: 88, target: 95 },
  { week: 'Week 3', attendance: 91, target: 95 },
  { week: 'Week 4', attendance: 94, target: 95 },
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(mockAttendance)
  const [selectedClass, setSelectedClass] = useState('10A')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAttendance = attendance.filter(a =>
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || a.studentId.includes(searchTerm)
  )

  const stats = {
    classAverage: (filteredAttendance.reduce((sum, a) => sum + a.percentage, 0) / filteredAttendance.length || 0).toFixed(1),
    present: filteredAttendance.reduce((sum, a) => sum + a.present, 0),
    absent: filteredAttendance.reduce((sum, a) => sum + a.absent, 0),
    perfect: filteredAttendance.filter(a => a.percentage === 100).length,
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
    if (percentage >= 85) return { color: CARDLECT_COLORS.primary.darker, backgroundColor: `${CARDLECT_COLORS.primary.darker}20` }
    if (percentage >= 75) return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20` }
    return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
  }

  return (
    <DashboardLayout currentPage="attendance" role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Track student attendance and engagement</p>
          </div>
          <Button variant="outline">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Class Average</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.classAverage}%</div>
              <div className="text-xs text-muted-foreground mt-2">Current month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Perfect Attendance</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.perfect}</div>
              <div className="text-xs text-muted-foreground mt-2">100% present</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Present</div>
              <div className="text-2xl font-bold">{stats.present}</div>
              <div className="text-xs text-muted-foreground mt-2">This period</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Absent</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.absent}</div>
              <div className="text-xs text-muted-foreground mt-2">This period</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke={CARDLECT_COLORS.info.main} strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#999" strokeDasharray="5 5" />
              </LineChart>
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

        {/* Attendance Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Student Name</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">ID</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Present</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Absent</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{record.studentName}</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">{record.studentId}</td>
                      <td className="py-3 px-4 text-center font-semibold" style={{ color: CARDLECT_COLORS.success.main }}>{record.present}</td>
                      <td className="py-3 px-4 text-center font-semibold" style={{ color: CARDLECT_COLORS.warning.main }}>{record.absent}</td>
                      <td className="py-3 px-4 text-center">
                        <span style={{ ...getAttendanceColor(record.percentage), padding: '0.75rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {record.percentage}%
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
