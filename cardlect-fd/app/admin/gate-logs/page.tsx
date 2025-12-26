"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const mockGateLogs = [
  {
    id: 1,
    time: "08:15",
    name: "Chioma Okonkwo",
    cardId: "CARD001",
    direction: "Entry",
    device: "Gate A",
    status: "Success",
  },
  {
    id: 2,
    time: "08:18",
    name: "Tunde Adebayo",
    cardId: "CARD002",
    direction: "Entry",
    device: "Gate B",
    status: "Success",
  },
  {
    id: 3,
    time: "08:22",
    name: "Unknown Card",
    cardId: "CARD999",
    direction: "Entry",
    device: "Gate A",
    status: "Failed",
  },
  {
    id: 4,
    time: "08:45",
    name: "Mr. Okafor",
    cardId: "STAFF001",
    direction: "Entry",
    device: "Gate A",
    status: "Success",
  },
  {
    id: 5,
    time: "14:30",
    name: "Chioma Okonkwo",
    cardId: "CARD001",
    direction: "Exit",
    device: "Gate B",
    status: "Success",
  },
]

export default function GateLogsPage() {
  const [logs, setLogs] = useState(mockGateLogs)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLogs = logs.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.cardId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout currentPage="gate-logs" role="admin">
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Gate Activity Logs</h2>
        <p className="text-muted-foreground mt-1">Monitor all entry and exit activities</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">All students entered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Invalid cards detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Peak Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">08:00 - 08:30</div>
            <p className="text-xs text-muted-foreground">Highest activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or card ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No gate activity found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Time</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Card ID</th>
                    <th className="text-left py-2 px-4">Direction</th>
                    <th className="text-left py-2 px-4">Device</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4 font-mono text-xs">{log.time}</td>
                      <td className="py-2 px-4">{log.name}</td>
                      <td className="py-2 px-4 font-mono text-xs">{log.cardId}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.direction === "Entry"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                          }`}
                        >
                          {log.direction}
                        </span>
                      </td>
                      <td className="py-2 px-4">{log.device}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === "Success"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                          }`}
                        >
                          {log.status}
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
    </DashboardLayout>
  )
}
