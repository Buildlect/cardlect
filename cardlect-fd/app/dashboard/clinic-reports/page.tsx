'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, Users, TrendingUp } from 'lucide-react'

const visitData = [
  { month: 'Jan', visits: 45, students: 35, treatments: 12 },
  { month: 'Feb', visits: 52, students: 42, treatments: 15 },
  { month: 'Mar', visits: 48, students: 38, treatments: 14 },
  { month: 'Apr', visits: 65, students: 50, treatments: 18 },
]

const complaintTypes = [
  { name: 'Cold & Cough', value: 25, color: CARDLECT_COLORS.primary.darker },
  { name: 'Injuries', value: 18, color: CARDLECT_COLORS.danger.main },
  { name: 'Headaches', value: 22, color: CARDLECT_COLORS.warning.main },
  { name: 'Other', value: 15, color: CARDLECT_COLORS.info.main },
]

export default function ClinicReportsPage() {
  const totalVisits = visitData.reduce((sum, d) => sum + d.visits, 0)
  const totalTreatments = visitData.reduce((sum, d) => sum + d.treatments, 0)
  const uniqueStudents = new Set(visitData.map(d => d.students)).size

  return (
    <DashboardLayout currentPage="reports" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Health Reports</h1>
        <p className="text-muted-foreground">Clinic statistics and health analytics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Visits</p>
                <p className="text-3xl font-bold text-foreground">{totalVisits}</p>
              </div>
              <Activity size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Treatments</p>
                <p className="text-3xl font-bold text-foreground">{totalTreatments}</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Students Seen</p>
                <p className="text-3xl font-bold text-foreground">50+</p>
              </div>
              <Users size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={{ r: 5 }} name="Visits" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complaintTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complaintTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Treatments Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Treatments by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="treatments" fill={CARDLECT_COLORS.primary.darker} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
