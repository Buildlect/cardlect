"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Download, TrendingUp, Users, DollarSign, Calendar, Clock, Plus, Loader2, Globe, BarChart3, PieChartIcon, Activity } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'3' | '6' | '12'>('6')

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await api.get('/analytics/global-overview')
      setData(response.data.data)
    } catch (err) {
      console.error('Failed to fetch global analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <DashboardLayout currentPage="analytics" role="super_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const stats = data || {
    ecosystem: { total_schools: 0, active_schools: 0 },
    demographics: { total_users: 0, total_students: 0, total_partners: 0 },
    finance_total: 0,
    top_performing_schools: []
  }

  const metricCards = [
    {
      title: 'Global Volume (30d)',
      value: `₦${Number(stats.finance_total).toLocaleString()}`,
      icon: <DollarSign size={24} />,
      color: CARDLECT_COLORS.primary.darker,
      sub: 'Across all nodes'
    },
    {
      title: 'Active Schools',
      value: stats.ecosystem.active_schools,
      icon: <Globe size={24} />,
      color: SEMANTIC_COLORS.status.online,
      sub: `${stats.ecosystem.total_schools} total registered`
    },
    {
      title: 'Total Students',
      value: stats.demographics.total_students.toLocaleString(),
      icon: <Users size={24} />,
      color: CARDLECT_COLORS.primary.main,
      sub: 'Ecosystem-wide population'
    },
    {
      title: 'Partner Density',
      value: stats.demographics.total_partners,
      icon: <Activity size={24} />,
      color: CARDLECT_COLORS.warning.main,
      sub: 'Integrated merchants'
    }
  ]

  const COLORS = [CARDLECT_COLORS.primary.darker, CARDLECT_COLORS.primary.main, CARDLECT_COLORS.warning.main, CARDLECT_COLORS.danger.main]

  const pieData = [
    { name: 'Students', value: stats.demographics.total_students },
    { name: 'Partners', value: stats.demographics.total_partners },
    { name: 'Other', value: stats.demographics.total_users - stats.demographics.total_students - stats.demographics.total_partners }
  ].filter(d => d.value > 0)

  return (
    <DashboardLayout currentPage="analytics" role="super_admin">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Longitudinal Intelligence</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Ecosystem-wide data auditing and performance analysis.</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-card border border-border rounded-2xl h-14 px-6 font-black outline-none focus:border-primary/50 transition-all text-sm uppercase tracking-widest"
            >
              <option value="3">Quarterly Audit</option>
              <option value="6">Semiannual Logic</option>
              <option value="12">Annual Retrospective</option>
            </select>
            <button
              className="bg-primary hover:bg-primary-darker text-white rounded-2xl h-14 px-8 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
              onClick={() => window.print()}
            >
              <Download size={20} /> Export Audit
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metricCards.map((c, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-8 shadow-sm group hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-all" style={{ color: c.color }}>
                  {c.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{c.sub}</span>
              </div>
              <p className="text-3xl font-black text-foreground mb-1 tracking-tighter">{c.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{c.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demographic Distribution */}
          <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <PieChartIcon className="text-primary" size={24} />
              <h3 className="text-xl font-black text-foreground tracking-tight">Ecosystem Composition</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-10">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-black uppercase text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-foreground">{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Ranking */}
          <div className="lg:col-span-2 bg-card border border-border rounded-[3rem] p-10 shadow-sm group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-primary" size={24} />
                <h3 className="text-2xl font-black text-foreground tracking-tight">Node Transaction Volume</h3>
              </div>
              <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} /> Top 5 Nodes
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.top_performing_schools}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '12px' }}
                    cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                  />
                  <Bar
                    dataKey="tx_count"
                    fill={CARDLECT_COLORS.primary.darker}
                    radius={[12, 12, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-10 p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-card rounded-2xl shadow-sm">
                  <Globe className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-black text-foreground text-sm uppercase tracking-tighter">Aggregated Network Intensity</p>
                  <p className="text-xs text-muted-foreground font-bold">Volume distributed across {stats.ecosystem.active_schools} active institutional nodes.</p>
                </div>
              </div>
              <button className="whitespace-nowrap bg-white dark:bg-card border border-border px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">
                Inspect Global Hierarchy
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
