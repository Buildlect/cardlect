"use client"

import { useMemo, useRef, useState } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, Users, CreditCard, X } from "lucide-react"

const attendanceReport = [
  { month: "Jan", rate: 92, class: "Grade 1" },
  { month: "Feb", rate: 94, class: "Grade 1" },
  { month: "Mar", rate: 91, class: "Grade 2" },
  { month: "Apr", rate: 95, class: "Grade 2" },
  { month: "May", rate: 93, class: "Grade 3" },
]

const walletUsage = [
  { category: "Lunch", value: 45, fill: "#ff5c1c" },
  { category: "Library", value: 20, fill: "#ff8c42" },
  { category: "Events", value: 18, fill: "#ffa960" },
  { category: "Medical", value: 17, fill: "#ffc280" },
]

const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function toCSV(data: Record<string, any>[]) {
  if (!data || data.length === 0) return ""
  const keys = Object.keys(data[0])
  const header = keys.join(",")
  const rows = data.map((row) =>
    keys
      .map((k) => {
        const v = row[k] ?? ""
        const escaped = String(v).replace(/"/g, '""')
        return `"${escaped}"`
      })
      .join(",")
  )
  return [header, ...rows].join("\n")
}

function downloadFile(content: string | Blob, filename: string, mime = "text/csv") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime + ";charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function openPrintWindow(html: string) {
  const newWin = window.open("", "_blank", "noopener,noreferrer")
  if (!newWin) return
  newWin.document.open()
  newWin.document.write(html)
  newWin.document.close()
  // give browser a moment to render
  setTimeout(() => {
    newWin.focus()
    newWin.print()
    // we don't automatically close to let user decide
  }, 500)
}

export default function ReportsPage() {
  const printableRef = useRef<HTMLDivElement | null>(null)

  // Filters
  const [startMonth, setStartMonth] = useState<string>("Jan")
  const [endMonth, setEndMonth] = useState<string>("May")
  const [selectedClass, setSelectedClass] = useState<string>("All")
  const [selectedWalletCategory, setSelectedWalletCategory] = useState<string>("All")

  const classOptions = useMemo(() => ["All", ...Array.from(new Set(attendanceReport.map((a) => a.class)))], [])
  const walletCategories = useMemo(() => ["All", ...walletUsage.map((w) => w.category)], [])

  const filteredAttendance = useMemo(() => {
    const startIdx = monthsOrder.indexOf(startMonth)
    const endIdx = monthsOrder.indexOf(endMonth)
    const min = Math.min(startIdx, endIdx)
    const max = Math.max(startIdx, endIdx)
    return attendanceReport.filter((r) => {
      const idx = monthsOrder.indexOf(r.month)
      if (idx < 0) return false
      if (idx < min || idx > max) return false
      if (selectedClass !== "All" && r.class !== selectedClass) return false
      return true
    })
  }, [startMonth, endMonth, selectedClass])

  const filteredWallet = useMemo(() => {
    if (selectedWalletCategory === "All") return walletUsage
    return walletUsage.filter((w) => w.category === selectedWalletCategory)
  }, [selectedWalletCategory])

  // Generic exports
  function handleExportCSV(data: Record<string, any>[], filename = "report.csv") {
    const csv = toCSV(data)
    downloadFile(csv, filename, "text/csv")
  }

  function handleExportJSON(data: Record<string, any>[], filename = "report.json") {
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, filename, "application/json")
  }

  function handleExportPDF(contentTitle = "Report") {
    // Build printable HTML from the printableRef or simple representation
    let inner = ""
    if (printableRef.current) {
      inner = printableRef.current.innerHTML
    } else {
      inner = `<h1>${contentTitle}</h1>`
    }
    const html = `
      <html>
        <head>
          <title>${contentTitle}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #111; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            h1 { font-size: 20px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          ${inner}
        </body>
      </html>
    `
    openPrintWindow(html)
  }

  // Quick exports
  function exportAttendanceCSVQuick() {
    handleExportCSV(filteredAttendance, `attendance_${startMonth}_to_${endMonth}.csv`)
  }
  function exportWalletCSVQuick() {
    handleExportCSV(filteredWallet, `wallet_${selectedWalletCategory}.csv`)
  }
  function exportGateActivityCSVQuick() {
    // placeholder sample for gate activity
    const sampleGate = [
      { time: "08:00", event: "Entry", count: 320 },
      { time: "12:00", event: "Exit", count: 310 },
    ]
    handleExportCSV(sampleGate, "gate_activity.csv")
  }
  function exportStudentListCSVQuick() {
    const sampleStudents = [
      { id: "S001", name: "Alice Johnson", class: "Grade 1" },
      { id: "S002", name: "Bob Smith", class: "Grade 2" },
    ]
    handleExportCSV(sampleStudents, "student_list.csv")
  }

  // Helpers for filter behavior: keep start <= end by auto-adjusting the other value
  function onStartMonthChange(v: string) {
    setStartMonth(v)
    const newStartIdx = monthsOrder.indexOf(v)
    const currentEndIdx = monthsOrder.indexOf(endMonth)
    if (newStartIdx > currentEndIdx) {
      setEndMonth(v)
    }
  }
  function onEndMonthChange(v: string) {
    setEndMonth(v)
    const newEndIdx = monthsOrder.indexOf(v)
    const currentStartIdx = monthsOrder.indexOf(startMonth)
    if (newEndIdx < currentStartIdx) {
      setStartMonth(v)
    }
  }

  const isDefaultFilters =
    startMonth === "Jan" && endMonth === "May" && selectedClass === "All" && selectedWalletCategory === "All"

  return (
    <DashboardLayout currentPage="reports" role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Reports & Analytics</h2>
            <p className="text-muted-foreground mt-1">Generate and export school reports</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => handleExportCSV(filteredAttendance, `attendance_${startMonth}_to_${endMonth}.csv`)}
            >
              <Download size={18} /> Export CSV
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 gap-2"
              onClick={() => handleExportPDF("Reports & Analytics PDF Export")}
            >
              <Download size={18} /> Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Start Month */}
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Calendar size={14} /> Start Month
                  </label>
                  <div className="relative">
                    <select
                      value={startMonth}
                      onChange={(e) => onStartMonthChange(e.target.value)}
                      className="w-full border bg-card rounded-md px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {monthsOrder.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>

                {/* End Month */}
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Calendar size={14} /> End Month
                  </label>
                  <div className="relative">
                    <select
                      value={endMonth}
                      onChange={(e) => onEndMonthChange(e.target.value)}
                      className="w-full border bg-card rounded-md px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {monthsOrder.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Calendar size={16} />
                    </div>
                  </div>
                </div>

                {/* Class (searchable via datalist) */}
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <Users size={14} /> Class
                  </label>
                  <input
                    list="class-options"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border bg-card rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="All or type to search..."
                  />
                  <datalist id="class-options">
                    {classOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                {/* Wallet Category */}
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                    <CreditCard size={14} /> Wallet Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedWalletCategory}
                      onChange={(e) => setSelectedWalletCategory(e.target.value)}
                      className="w-full border bg-card rounded-md px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {walletCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <CreditCard size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active filters summary / chips */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground mr-2">Active Filters:</span>

                  <button
                    className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                    title="Selected months"
                  >
                    {startMonth} — {endMonth}
                  </button>

                  {selectedClass !== "All" && (
                    <button
                      className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      onClick={() => setSelectedClass("All")}
                    >
                      <span>{selectedClass}</span>
                      <X size={14} />
                    </button>
                  )}

                  {selectedWalletCategory !== "All" && (
                    <button
                      className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm"
                      onClick={() => setSelectedWalletCategory("All")}
                    >
                      <span>{selectedWalletCategory}</span>
                      <X size={14} />
                    </button>
                  )}

                  {isDefaultFilters && <span className="text-xs text-muted-foreground ml-2">No filters applied</span>}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground mr-2">Results: <strong>{filteredAttendance.length}</strong></div>
                  <Button
                    onClick={() => {
                      setStartMonth("Jan")
                      setEndMonth("May")
                      setSelectedClass("All")
                      setSelectedWalletCategory("All")
                    }}
                    variant="outline"
                    disabled={isDefaultFilters}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAttendance.length
                  ? Math.round(filteredAttendance.reduce((s, r) => s + r.rate, 0) / filteredAttendance.length) + "%"
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Selected range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">School-wide</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,195</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div ref={printableRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#ff5c1c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Usage by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredWallet}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ payload, value }: any) => `${payload?.category}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredWallet.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Export Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                onClick={exportAttendanceCSVQuick}
              >
                <Download size={24} />
                <span className="text-sm">Attendance Report</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                onClick={exportWalletCSVQuick}
              >
                <Download size={24} />
                <span className="text-sm">Wallet Summary</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                onClick={exportGateActivityCSVQuick}
              >
                <Download size={24} />
                <span className="text-sm">Gate Activity</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 bg-transparent"
                onClick={exportStudentListCSVQuick}
              >
                <Download size={24} />
                <span className="text-sm">Student List</span>
              </Button>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => handleExportJSON(filteredAttendance, `attendance_${startMonth}_to_${endMonth}.json`)}
              >
                Download Attendance (JSON)
              </Button>
              <Button variant="ghost" onClick={() => handleExportPDF("Filtered Reports")}>
                Print / Export PDF (Print dialog)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
