'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Book, TrendingUp, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ClassInfo {
  id: string
  name: string
  level: string
  students: number
  capacity: number
  status: 'active' | 'archived'
  schedule: string
}

const mockClasses: ClassInfo[] = [
  { id: '1', name: 'Mathematics 10A', level: 'Grade 10', students: 35, capacity: 50, status: 'active', schedule: 'Mon, Wed, Fri - 10:00 AM' },
  { id: '2', name: 'Mathematics 10B', level: 'Grade 10', students: 38, capacity: 50, status: 'active', schedule: 'Tue, Thu - 2:00 PM' },
  { id: '3', name: 'Advanced Math 11', level: 'Grade 11', students: 28, capacity: 45, status: 'active', schedule: 'Mon, Wed, Fri - 1:00 PM' },
]

const enrollmentData = [
  { class: '10A', enrolled: 35, capacity: 50, attendance: 92 },
  { class: '10B', enrolled: 38, capacity: 50, attendance: 88 },
  { class: '11', enrolled: 28, capacity: 45, attendance: 95 },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState(mockClasses)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
    avgEnrollment: Math.round(classes.reduce((sum, c) => sum + c.students, 0) / classes.length),
  }

  return (
    <DashboardLayout currentPage="classes" role="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
            <p className="text-muted-foreground">Manage your classes and student enrollment</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Classes</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.totalClasses}</div>
              <div className="text-xs text-muted-foreground mt-2">Currently teaching</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Students</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.totalStudents}</div>
              <div className="text-xs text-muted-foreground mt-2">Across all classes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg Enrollment</div>
              <div className="text-2xl font-bold">{stats.avgEnrollment}</div>
              <div className="text-xs text-muted-foreground mt-2">Per class</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Class Enrollment vs Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill={CARDLECT_COLORS.info.main} />
                <Bar dataKey="capacity" fill={CARDLECT_COLORS.secondary.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search */}
        <Input 
          placeholder="Search classes..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        {/* Classes List */}
        <div className="space-y-4">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Book size={20} style={{ color: CARDLECT_COLORS.info.main }} />
                      <h3 className="font-semibold text-lg">{cls.name}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Level: </span>
                        <span className="font-medium">{cls.level}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Schedule: </span>
                        <span className="font-medium">{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} style={{ color: CARDLECT_COLORS.success.main }} />
                        <span className="font-medium">{cls.students}/{cls.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
