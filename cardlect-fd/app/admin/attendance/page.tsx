"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LayoutShell from "@/components/Admins/layout.shell"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const attendanceData = [
  { date: "2024-01-15", present: 1100, absent: 50, late: 97 },
  { date: "2024-01-16", present: 1150, absent: 30, late: 67 },
  { date: "2024-01-17", present: 1200, absent: 20, late: 27 },
  { date: "2024-01-18", present: 1170, absent: 40, late: 37 },
  { date: "2024-01-19", present: 1180, absent: 35, late: 32 },
]

const classAttendance = [
  { class: "JSS 1A", present: 34, absent: 1, rate: "97%" },
  { class: "JSS 1B", present: 37, absent: 1, rate: "97%" },
  { class: "JSS 2A", present: 40, absent: 2, rate: "95%" },
  { class: "JSS 2B", present: 38, absent: 2, rate: "95%" },
]

export default function AttendancePage() {
  const [filterDate, setFilterDate] = useState("2024-01-19")

  return (
    <LayoutShell currentPage="attendance">
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Attendance Tracking</h2>
        <p className="text-muted-foreground mt-1">Monitor school attendance and generate reports</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">1,180 present out of 1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">35</div>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">32</div>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.8%</div>
            <p className="text-xs text-muted-foreground">Attendance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#ff5c1c" />
              <Bar dataKey="absent" fill="#e74c3c" />
              <Bar dataKey="late" fill="#f39c12" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Class Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {classAttendance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No attendance data available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Class</th>
                    <th className="text-left py-2 px-4">Present</th>
                    <th className="text-left py-2 px-4">Absent</th>
                    <th className="text-left py-2 px-4">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {classAttendance.map((c, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4 font-medium">{c.class}</td>
                      <td className="py-2 px-4 text-green-600 font-semibold">{c.present}</td>
                      <td className="py-2 px-4 text-red-600">{c.absent}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                          {c.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </LayoutShell>
  )
}
