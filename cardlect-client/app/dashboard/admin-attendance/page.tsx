"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"
import { Loader2, Calendar, Users, Clock, AlertTriangle, TrendingUp } from "lucide-react"

export default function AttendancePage() {
  const [stats, setStats] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, trendsRes] = await Promise.all([
        api.get('/analytics/attendance/aggregate'),
        api.get('/analytics/attendance/trends')
      ])
      setStats(statsRes.data.data)
      setTrends(trendsRes.data.data.map((d: any) => ({
        date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        present: parseInt(d.present_count || 0)
      })))
    } catch (err) {
      console.error('Failed to fetch attendance data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading || !stats) {
    return (
      <DashboardLayout currentPage="attendance" role="school_admin">
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const attendanceRate = stats.total_students > 0
    ? ((parseInt(stats.present) + parseInt(stats.late)) / parseInt(stats.total_students) * 100).toFixed(1)
    : "0"

  return (
    <DashboardLayout currentPage="attendance" role="school_admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground">Attendance Analytics</h2>
          <p className="text-muted-foreground mt-1 tracking-tight">Real-time presence monitoring and historical trend mapping.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-primary/10 shadow-sm overflow-hidden group">
            <CardHeader className="pb-2 bg-primary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Presence Rate</CardTitle>
                <TrendingUp size={16} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black text-primary">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Today's verified scan rate</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Absenteeism</CardTitle>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black text-red-500">{stats.absent}</div>
              <p className="text-xs text-muted-foreground mt-1">Confirmed pending</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Late Arrivals</CardTitle>
                <Clock size={16} className="text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black text-amber-500">{stats.late}</div>
              <p className="text-xs text-muted-foreground mt-1">Post 8:00 AM scans</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Total Registry</CardTitle>
                <Users size={16} className="text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black text-foreground">{stats.total_students}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled active students</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-border shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">7-Day Presence Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Historical scan frequency across the current week</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                    />
                    <Bar
                      dataKey="present"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    >
                      {trends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === trends.length - 1 ? CARDLECT_COLORS.primary.darker : CARDLECT_COLORS.primary.main + '80'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary / Status */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Authentication Nodes Online</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">NFC Gateways Synchronized</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-border/50">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Backup Registry in Sync</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-primary to-primary-darker p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <Calendar className="mb-4 opacity-50" size={32} />
                <h3 className="text-xl font-black mb-2">Automated Reports</h3>
                <p className="text-primary-foreground/80 text-xs leading-relaxed">
                  Generate detailed PDF/Excel attendance manifests for any selected date range.
                </p>
                <button className="mt-6 w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all">
                  Generate Today's Manifest
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
