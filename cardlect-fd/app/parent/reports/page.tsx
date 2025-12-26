'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3 } from 'lucide-react'
import { ROLE_COLORS, CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

interface Report {
  id: string
  title: string
  period: string
  child: string
  type: 'academic' | 'attendance' | 'wallet'
  date: string
}

const mockReports: Report[] = [
  { id: '1', title: 'Academic Performance Report', period: 'January 2024', child: 'Sarah', type: 'academic', date: '2024-01-15' },
  { id: '2', title: 'Attendance Summary', period: 'January 2024', child: 'Sarah', type: 'attendance', date: '2024-01-15' },
  { id: '3', title: 'Wallet Activity Report', period: 'January 2024', child: 'Sarah', type: 'wallet', date: '2024-01-15' },
  { id: '4', title: 'Academic Performance Report', period: 'January 2024', child: 'Michael', type: 'academic', date: '2024-01-15' },
]

const academicData = [
  { subject: 'Mathematics', score: 85 },
  { subject: 'English', score: 88 },
  { subject: 'Science', score: 82 },
  { subject: 'History', score: 80 },
  { subject: 'PE', score: 90 },
]

const attendanceData = [
  { week: 'Week 1', rate: 92 },
  { week: 'Week 2', rate: 88 },
  { week: 'Week 3', rate: 95 },
  { week: 'Week 4', rate: 90 },
]

export default function ReportsPage() {
  const [selectedChild, setSelectedChild] = useState('Sarah')
  const [selectedReportType, setSelectedReportType] = useState('academic')

  const filteredReports = mockReports.filter(r =>
    r.child === selectedChild && r.type === selectedReportType
  )

  return (
    <DashboardLayout currentPage="reports" role="parents">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">View and download children's academic and activity reports</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <select 
            value={selectedChild} 
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="Sarah">Sarah Johnson</option>
            <option value="Michael">Michael Johnson</option>
            <option value="Emma">Emma Johnson</option>
          </select>
          <select 
            value={selectedReportType} 
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="academic">Academic</option>
            <option value="attendance">Attendance</option>
            <option value="wallet">Wallet Activity</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Academic Average</div>
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-xs text-muted-foreground mt-2">Current term</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Attendance Rate</div>
              <div className="text-2xl font-bold text-green-600">91%</div>
              <div className="text-xs text-muted-foreground mt-2">This month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Reports Generated</div>
              <div className="text-2xl font-bold" style={{ color: ROLE_COLORS.parents.main }}>12</div>
              <div className="text-xs text-muted-foreground mt-2">This year</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {selectedReportType === 'academic' && (
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={academicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill={CARDLECT_COLORS.info.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {selectedReportType === 'attendance' && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke={CARDLECT_COLORS.success.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: ROLE_COLORS.parents.main + '20' }}>
                        <FileText style={{ color: ROLE_COLORS.parents.main }} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.period}</p>
                        <p className="text-xs text-muted-foreground mt-2">Generated {new Date(report.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
