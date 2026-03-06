'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Search, TrendingUp, AlertCircle, Wallet, Loader2, Users } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'

export default function StudentsWalletPage() {
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/wallets?limit=100')
        setWallets(res.data.data || [])
      } catch (err) {
        console.error('Failed to fetch student wallets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = wallets.filter(w =>
    (w.user_name || w.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.admission_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalBalance = wallets.reduce((s, w) => s + parseFloat(w.balance || '0'), 0)
  const activeCt = wallets.filter(w => parseFloat(w.balance || '0') > 1000).length
  const lowBalanceCt = wallets.filter(w => parseFloat(w.balance || '0') <= 1000 && parseFloat(w.balance || '0') > 0).length
  const emptyCt = wallets.filter(w => parseFloat(w.balance || '0') === 0).length

  const pieData = [
    { name: 'Active (>₦1k)', value: activeCt, color: CARDLECT_COLORS.success.main },
    { name: 'Low Balance', value: lowBalanceCt, color: CARDLECT_COLORS.warning.main },
    { name: 'Empty', value: emptyCt, color: CARDLECT_COLORS.danger.main },
  ].filter(d => d.value > 0)

  const getBalanceBadge = (balance: string | number) => {
    const b = parseFloat(String(balance))
    if (b > 1000) return 'text-green-500 bg-green-500/10'
    if (b > 0) return 'text-amber-500 bg-amber-500/10'
    return 'text-red-500 bg-red-500/10'
  }

  return (
    <DashboardLayout currentPage="students" role="staff">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Wallets</h1>
          <p className="text-muted-foreground">Monitor and manage student wallet balances and activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Wallets</p>
            <p className="text-2xl font-bold text-foreground">{wallets.length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Balance</p>
            <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>
              ₦{totalBalance >= 1000000 ? (totalBalance / 1000000).toFixed(1) + 'M' : totalBalance >= 1000 ? (totalBalance / 1000).toFixed(0) + 'k' : totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <p className="text-xs text-muted-foreground font-medium mb-1">Low Balance</p>
            <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{lowBalanceCt}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
            <p className="text-xs text-muted-foreground font-medium mb-1">Empty Wallets</p>
            <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.danger.main }}>{emptyCt}</p>
          </div>
        </div>

        {/* Pie chart + table side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pieData.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Balance Status</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallets table */}
          <div className={`bg-card border border-border rounded-3xl shadow-sm overflow-hidden ${pieData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Search inside the panel */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search wallets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Wallet size={40} className="opacity-20 mb-3" />
                <p className="text-muted-foreground font-medium">No wallets found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase">Student</th>
                      <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase">Adm. No.</th>
                      <th className="text-right py-3 px-5 font-semibold text-muted-foreground text-xs uppercase">Balance</th>
                      <th className="text-center py-3 px-5 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((w) => (
                      <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              {(w.user_name || w.student_name || '?').charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{w.user_name || w.student_name || '—'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 font-mono text-xs text-muted-foreground">{w.admission_number || '—'}</td>
                        <td className="py-3 px-5 text-right font-bold text-foreground">₦{parseFloat(w.balance || '0').toLocaleString()}</td>
                        <td className="py-3 px-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getBalanceBadge(w.balance)}`}>
                            {parseFloat(w.balance || '0') > 1000 ? 'Active' : parseFloat(w.balance || '0') > 0 ? 'Low' : 'Empty'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
