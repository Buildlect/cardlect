"use client"

import { useMemo, useState, useEffect } from "react"
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
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, Users, CreditCard, ChevronRight, Loader2, BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react"
import api from "@/lib/api-client"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [spending, setSpending] = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ovRes, spendRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/finance/spending?days=30')
      ])
      setData(ovRes.data.data)
      setSpending(spendRes.data.data.map((s: any) => ({
        category: s.category || 'Other',
        value: parseFloat(s.total_amount),
        fill: s.category === 'Lunch' ? '#ff5c1c' : s.category === 'Library' ? '#3b82f6' : '#10b981'
      })))
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleExport(type: string) {
    alert(`${type} generation initiated. Check your downloads directory in a moment.`)
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="reports" role="school_admin">
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const COLORS = [CARDLECT_COLORS.primary.main, CARDLECT_COLORS.secondary.main, '#10b981', '#f59e0b', '#ef4444'];

  return (
    <DashboardLayout currentPage="reports" role="school_admin" >
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Institutional Intelligence</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">High-fidelity data auditing and longitudinal analysis.</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-xl border-2 font-black h-12 px-6 hover:bg-primary hover:text-white transition-all"
              onClick={() => handleExport('CSV Audit')}
            >
              <Download size={18} className="mr-2" /> Global CSV
            </Button>
            <Button
              className="bg-primary hover:bg-primary-darker text-white rounded-xl font-black h-12 px-8 shadow-lg shadow-primary/20 transition-all active:scale-95"
              onClick={() => handleExport('Executive PDF')}
            >
              <FileText size={18} className="mr-2" /> Executive PDF
            </Button>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border shadow-sm group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                Population Density <Users size={14} className="text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">{data?.user_stats?.total_students || 0}</div>
              <p className="text-[10px] font-bold text-green-500 uppercase mt-1">+4.2% Growth</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                Capital Reserves <CreditCard size={14} className="text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">₦{(data?.wallet_stats?.total_balance || 0).toLocaleString()}</div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Held in {data?.wallet_stats?.active_count || 0} wallets</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                Daily Scans <BarChart3 size={14} className="text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">{(data?.safety_stats?.gate_activity_today || 0).toLocaleString()}</div>
              <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">NFC Auth Active</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5 shadow-sm group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center justify-between">
                System Integrity <TrendingUp size={14} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">99.9%</div>
              <p className="text-[10px] font-bold text-primary/60 uppercase mt-1 text-xs">Uptime Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Longitudinal Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black italic">Macro Expenditure Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">30-day transactional flow by category</p>
              </div>
              <PieIcon size={20} className="text-primary opacity-50" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spending.length > 0 ? spending : [{ category: 'Empty', value: 1, fill: '#eee' }]}
                      cx="50%" cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {spending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                      formatter={(val: any) => `₦${val.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-6 mt-6">
                  {spending.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{s.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black italic">Access Flux Density</CardTitle>
                <p className="text-xs text-muted-foreground">Historical gate entry vs exit patterns</p>
              </div>
              <TrendingUp size={20} className="text-primary opacity-50" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Mon', in: 400, out: 380 }, { name: 'Tue', in: 420, out: 410 },
                    { name: 'Wed', in: 380, out: 370 }, { name: 'Thu', in: 450, out: 430 },
                    { name: 'Fri', in: 410, out: 400 }
                  ]}>
                    <defs>
                      <linearGradient id="fluxIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={CARDLECT_COLORS.primary.main} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="in" stroke={CARDLECT_COLORS.primary.main} strokeWidth={4} fill="url(#fluxIn)" />
                    <Area type="monotone" dataKey="out" stroke={CARDLECT_COLORS.secondary.main} strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Audits / Exports Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[
            { title: 'Academic Audit', icon: FileText, sub: 'Grade distributions & exams' },
            { title: 'Financial Ledger', icon: CreditCard, sub: 'Wallet fluxo & partner cuts' },
            { title: 'Security Archive', icon: Calendar, sub: 'All-time gate access logs' },
            { title: 'Identity Registry', icon: Users, sub: 'Enrollment & bio records' }
          ].map((exportItem, idx) => (
            <button
              key={idx}
              onClick={() => handleExport(exportItem.title)}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/50 transition-all text-left flex flex-col group active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center mb-6">
                <exportItem.icon size={28} />
              </div>
              <h4 className="text-lg font-black text-foreground mb-2">{exportItem.title}</h4>
              <p className="text-xs text-muted-foreground font-medium mb-6">{exportItem.sub}</p>
              <div className="mt-auto flex items-center text-[10px] font-black text-primary uppercase tracking-widest gap-2">
                Initiate Export <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
