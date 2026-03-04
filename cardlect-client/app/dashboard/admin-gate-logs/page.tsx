"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { ShieldCheck, ShieldAlert, LogIn, LogOut, Loader2, Search, Filter, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GateLog {
  created_at: string
  action: string
  details: string
  user_name: string
  role: string
}

export default function GateLogsPage() {
  const [logs, setLogs] = useState<GateLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [snapshot, setSnapshot] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [logsRes, snapRes] = await Promise.all([
        api.get('/analytics/safety/gate-logs?limit=50'),
        api.get('/analytics/safety/snapshot')
      ])
      setLogs(logsRes.data.data)
      setSnapshot(snapRes.data.data)
    } catch (err) {
      console.error('Failed to fetch gate logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredLogs = logs.filter(
    (l) =>
      (l.user_name || "Unidentified").toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout currentPage="gate-logs" role="school_admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Access Control Logs</h2>
            <p className="text-muted-foreground mt-1 tracking-tight">Real-time gate activity and terminal audits.</p>
          </div>
          <div className="flex bg-card border border-border rounded-2xl p-2 gap-2 shadow-sm">
            <div className="px-4 py-2 text-center border-r border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Campus Occupancy</p>
              <p className="text-xl font-black text-primary">{(snapshot?.students_on_campus || 0) + (snapshot?.staff_on_campus || 0)}</p>
            </div>
            <div className="px-4 py-2 text-center border-r border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Visitors Today</p>
              <p className="text-xl font-black text-amber-500">{snapshot?.visitor_entries_today || 0}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Status</p>
              <p className="text-xl font-black text-green-500 uppercase text-[12px] pt-1 tracking-widest">{snapshot?.security_status || 'MONITORED'}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, card ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border h-12"
            />
          </div>
          <Button variant="outline" className="rounded-xl h-12 px-6 flex items-center gap-2 border-border">
            <Filter size={18} /> Filters
          </Button>
          <Button className="bg-primary hover:bg-primary-darker text-white rounded-xl h-12 px-6 flex items-center gap-2">
            <Calendar size={18} /> View History
          </Button>
        </div>

        {/* Logs Table */}
        <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Timestamp</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Entity</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Credential Type</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Movement</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Checkpoint</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLogs.map((log, idx) => {
                    const isEntry = log.action.includes('access') || log.action.includes('in');
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                              <p className="font-black text-xs">{(log.user_name || 'U').charAt(0)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{log.user_name || 'Unidentified'}</p>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">{log.role || 'Visitor'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-bold uppercase text-muted-foreground">RFID SMART-CARD</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {isEntry ? (
                              <LogIn className="text-green-500" size={16} />
                            ) : (
                              <LogOut className="text-amber-500" size={16} />
                            )}
                            <span className={`text-xs font-black uppercase ${isEntry ? 'text-green-500' : 'text-amber-500'}`}>
                              {isEntry ? 'Entry' : 'Exit'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-foreground italic">{log.details || 'Main Entrance'}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                            <ShieldCheck size={12} />
                            <span className="text-[10px] font-black uppercase">Granted</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="p-20 text-center">
                  <ShieldAlert size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground text-sm font-bold">No access logs match your query.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
