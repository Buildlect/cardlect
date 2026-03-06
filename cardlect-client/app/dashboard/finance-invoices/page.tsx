'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Plus, Download, Eye, Filter, Loader2, FileText, Search } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'

interface Invoice {
  id: string
  number?: string
  student_name?: string
  school?: string
  amount: number
  created_at: string
  due_date?: string
  status: 'paid' | 'pending' | 'overdue' | string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, statsRes] = await Promise.all([
          api.get('/finance/invoices?limit=50'),
          api.get('/finance/stats'),
        ])
        setInvoices(invoicesRes.data.data?.invoices || invoicesRes.data.data || [])
        setStats(statsRes.data.data)
      } catch (err) {
        console.error('Failed to fetch invoices:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredInvoices = invoices.filter(inv =>
    ((inv.student_name || inv.school || inv.number || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || inv.status === statusFilter)
  )

  const totalBilled = invoices.reduce((sum, i) => sum + parseFloat(String(i.amount)), 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(String(i.amount)), 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + parseFloat(String(i.amount)), 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + parseFloat(String(i.amount)), 0)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-500 bg-green-500/10'
      case 'pending': return 'text-amber-500 bg-amber-500/10'
      case 'overdue': return 'text-red-500 bg-red-500/10'
      default: return 'text-muted-foreground bg-muted/30'
    }
  }

  const statCards = [
    { label: 'Total Billed', value: totalBilled, color: CARDLECT_COLORS.warning.main, sub: 'All invoices' },
    { label: 'Paid', value: totalPaid, color: CARDLECT_COLORS.success.main, sub: `${invoices.filter(i => i.status === 'paid').length} invoices` },
    { label: 'Pending', value: totalPending, color: CARDLECT_COLORS.warning.main, sub: `${invoices.filter(i => i.status === 'pending').length} invoices` },
    { label: 'Overdue', value: totalOverdue, color: CARDLECT_COLORS.danger.main, sub: `${invoices.filter(i => i.status === 'overdue').length} invoices` },
  ]

  return (
    <DashboardLayout currentPage="invoices" role="staff" customRole="finance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage school invoices and billing records.</p>
          </div>
          <button
            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
            className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
          >
            <Plus size={18} /> New Invoice
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                ₦{s.value >= 1000000 ? (s.value / 1000000).toFixed(1) + 'M' : s.value >= 1000 ? (s.value / 1000).toFixed(0) + 'k' : s.value.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-xl text-sm bg-background focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={40} className="opacity-20 mb-3" />
              <p className="text-muted-foreground font-medium">{searchTerm ? 'No invoices match your search.' : 'No invoices found.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Invoice #</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Student / School</th>
                    <th className="text-right py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Issued</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Due Date</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">{invoice.number || invoice.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 px-6 text-foreground">{invoice.student_name || invoice.school || '—'}</td>
                      <td className="py-4 px-6 text-right font-semibold text-foreground">₦{parseFloat(String(invoice.amount)).toLocaleString()}</td>
                      <td className="py-4 px-6 text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString('en-NG')}</td>
                      <td className="py-4 px-6 text-muted-foreground">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-NG') : '—'}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Eye size={15} />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
