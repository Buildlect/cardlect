'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Download, CheckCircle, Clock, AlertCircle, Eye, Loader2, ArrowUpDown, Search } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/wallets/transactions?limit=50')
        setTransactions(res.data.data || [])
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = transactions.filter(t =>
    (t.description || t.reference || t.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalVolume = transactions.reduce((sum, t) => sum + parseFloat(String(t.amount || '0')), 0)
  const completed = transactions.filter(t => t.status === 'completed' || t.status === 'success')
  const pending = transactions.filter(t => t.status === 'pending')
  const failed = transactions.filter(t => t.status === 'failed')

  const getStatusEl = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-green-500 bg-green-500/10"><CheckCircle size={12} />Completed</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-amber-500 bg-amber-500/10"><Clock size={12} />Pending</span>
      case 'failed':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-red-500 bg-red-500/10"><AlertCircle size={12} />Failed</span>
      default:
        return <span className="text-xs text-muted-foreground capitalize">{status}</span>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'topup': return 'text-green-500'
      case 'purchase': return 'text-red-500'
      case 'reversal': return 'text-amber-500'
      default: return 'text-muted-foreground'
    }
  }

  const statCards = [
    { label: 'Total Volume', value: totalVolume, color: CARDLECT_COLORS.primary.darker, sub: `${transactions.length} transactions`, prefix: '₦' },
    { label: 'Completed', value: completed.reduce((s, t) => s + parseFloat(String(t.amount || '0')), 0), color: CARDLECT_COLORS.success.main, sub: `${completed.length} txns`, prefix: '₦' },
    { label: 'Pending', value: pending.reduce((s, t) => s + parseFloat(String(t.amount || '0')), 0), color: CARDLECT_COLORS.warning.main, sub: `${pending.length} txns`, prefix: '₦' },
    { label: 'Failed', value: failed.reduce((s, t) => s + parseFloat(String(t.amount || '0')), 0), color: CARDLECT_COLORS.danger.main, sub: `${failed.length} txns`, prefix: '₦' },
  ]

  return (
    <DashboardLayout currentPage="payments" role="staff">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">Wallet transaction history and payment records.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {s.prefix}{s.value >= 1000000 ? (s.value / 1000000).toFixed(1) + 'M' : s.value >= 1000 ? (s.value / 1000).toFixed(0) + 'k' : s.value.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by type, reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ArrowUpDown size={40} className="opacity-20 mb-3" />
              <p className="text-muted-foreground font-medium">No transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Reference</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Description</th>
                    <th className="text-right py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Date</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    <th className="text-center py-4 px-6 font-semibold text-muted-foreground text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn) => (
                    <tr key={txn.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{txn.reference || txn.id?.slice(0, 12)}</td>
                      <td className={`py-4 px-6 capitalize font-medium ${getTypeColor(txn.type)}`}>{txn.type || '—'}</td>
                      <td className="py-4 px-6 text-foreground">{txn.description || '—'}</td>
                      <td className="py-4 px-6 text-right font-bold text-foreground">₦{parseFloat(String(txn.amount)).toLocaleString()}</td>
                      <td className="py-4 px-6 text-muted-foreground">{new Date(txn.created_at).toLocaleDateString('en-NG')}</td>
                      <td className="py-4 px-6 text-center">{getStatusEl(txn.status)}</td>
                      <td className="py-4 px-6 text-center">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Eye size={15} />
                        </button>
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
