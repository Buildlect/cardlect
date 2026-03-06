'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Book } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'

interface ClassInfo {
  id: string
  name: string
  level: string
  status: 'active' | 'archived'
  schedule: string
}

interface ClassRow {
  id: string
  name?: string
  grade_level?: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/academics/classes')
        const rows: ClassRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setClasses(rows.map((row) => ({
          id: row.id,
          name: row.name || 'Unnamed Class',
          level: row.grade_level || 'N/A',
          status: 'active',
          schedule: 'Not set',
        })))
      } catch (error) {
        console.error('Failed to load classes:', error)
        setClasses([])
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = {
    totalClasses: classes.length,
    totalGrades: new Set(classes.map(c => c.level)).size,
    avgByGrade: classes.length === 0 ? 0 : Math.round(classes.length / Math.max(1, new Set(classes.map(c => c.level)).size)),
  }

  const enrollmentData = useMemo(() => {
    const byGrade: Record<string, number> = {}
    classes.forEach((cls) => {
      byGrade[cls.level] = (byGrade[cls.level] || 0) + 1
    })
    return Object.entries(byGrade).map(([grade, count]) => ({ grade, classes: count }))
  }, [classes])

  return (
    <DashboardLayout currentPage="classes" role="staff" customRole="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
            <p className="text-muted-foreground">Manage your classes and student enrollment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Classes</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.totalClasses}</div>
              <div className="text-xs text-muted-foreground mt-2">Currently assigned</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Grade Levels</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.totalGrades}</div>
              <div className="text-xs text-muted-foreground mt-2">Unique grades</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg Classes / Grade</div>
              <div className="text-2xl font-bold">{stats.avgByGrade}</div>
              <div className="text-xs text-muted-foreground mt-2">Distribution</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Distribution by Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="classes" fill={CARDLECT_COLORS.info.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading classes...</p>
        ) : (
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
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-muted-foreground">Level: </span>
                          <span className="font-medium">{cls.level}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Schedule: </span>
                          <span className="font-medium">{cls.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
