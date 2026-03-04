"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, X, Loader2, Wallet, AlertCircle } from "lucide-react"
import DashboardLayout from '@/components/DashboardLayout/layout'
import api from '@/lib/api-client'

interface WalletRecord {
  user_id: string
  name: string
  balance: string
  role: string
  admission_number?: string
  employee_id?: string
  updated_at: string
}

interface WalletAnalytics {
  total_value: string
  total_wallets: string
  low_balance_count: string
}

export default function WalletPage() {
  const [wallets, setWallets] = useState<WalletRecord[]>([])
  const [analytics, setAnalytics] = useState<WalletAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [showTopup, setShowTopup] = useState(false)
  const [topupData, setTopupData] = useState({ userId: "", amount: "" })
  const [topupLoading, setTopupLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletsRes, analyticsRes] = await Promise.all([
          api.get('/wallets'),
          api.get('/wallets/analytics')
        ])
        setWallets(walletsRes.data.data)
        setAnalytics(analyticsRes.data.data)
      } catch (err) {
        console.error('Failed to fetch wallet data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredWallets = wallets.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.admission_number && w.admission_number.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleTopup = async () => {
    if (!topupData.userId || !topupData.amount) return
    setTopupLoading(true)
    try {
      await api.post(`/wallets/${topupData.userId}/top-up`, {
        amount: parseFloat(topupData.amount),
        description: 'Admin Deposit'
      })

      // Refresh
      const [walletsRes, analyticsRes] = await Promise.all([
        api.get('/wallets'),
        api.get('/wallets/analytics')
      ])
      setWallets(walletsRes.data.data)
      setAnalytics(analyticsRes.data.data)

      setShowTopup(false)
      setTopupData({ userId: "", amount: "" })
      alert('Top-up successful!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Top-up failed')
    } finally {
      setTopupLoading(false)
    }
  }

  return (
    <DashboardLayout currentPage="wallet">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Smart Wallet Management</h2>
            <p className="text-muted-foreground mt-1">Operational oversight of student and staff smart card balances.</p>
          </div>
          <Button onClick={() => setShowTopup(!showTopup)} className="bg-primary hover:bg-primary-darker text-white rounded-xl py-6 px-8 flex items-center gap-2">
            <Plus size={20} /> New Top-up
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Total System Liquidity</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-foreground">₦{parseFloat(analytics?.total_value || '0').toLocaleString()}</p>
                  <div className="p-3 bg-primary/10 rounded-xl text-primary"><Wallet size={24} /></div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Active Wallets</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-foreground">{analytics?.total_wallets || '0'}</p>
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Plus size={24} /></div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Low Balance Warnings</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black text-red-500">{analytics?.low_balance_count || '0'}</p>
                  <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><AlertCircle size={24} /></div>
                </div>
              </div>
            </div>

            {/* Top Up Form */}
            {showTopup && (
              <Card className="border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4">
                <CardHeader>
                  <CardTitle>Execute Administrative Deposit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      className="bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm"
                      value={topupData.userId}
                      onChange={(e) => setTopupData({ ...topupData, userId: e.target.value })}
                    >
                      <option value="">Select Student/Staff</option>
                      {wallets.map(w => (
                        <option key={w.user_id} value={w.user_id}>
                          {w.name} ({w.role}) - {w.admission_number || w.employee_id}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Amount (₦)"
                      value={topupData.amount}
                      onChange={(e) => setTopupData({ ...topupData, amount: e.target.value })}
                      className="rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary-darker text-white rounded-xl"
                        onClick={handleTopup}
                        disabled={topupLoading || !topupData.userId || !topupData.amount}
                      >
                        {topupLoading ? 'Processing...' : 'Confirm Deposit'}
                      </Button>
                      <Button onClick={() => setShowTopup(false)} variant="outline" className="flex-1 rounded-xl">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wallets Registry */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-foreground">Smart Wallet Registry</h2>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">User Entity</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">System ID</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Balance</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Health Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredWallets.map((wallet) => {
                      const bal = parseFloat(wallet.balance)
                      const isLow = bal < 1000
                      const sId = wallet.admission_number || wallet.employee_id || 'N/A'
                      return (
                        <tr key={wallet.user_id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-foreground">{wallet.name}</p>
                            <p className="text-[10px] text-primary font-bold uppercase">{wallet.role}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{sId}</td>
                          <td className="px-6 py-4 text-sm font-black text-foreground">₦{bal.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isLow ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                              }`}>
                              {isLow ? 'Low Funds' : 'Operational'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs rounded-lg hover:bg-primary hover:text-white transition-all"
                              onClick={() => {
                                setTopupData({ userId: wallet.user_id, amount: "" })
                                setShowTopup(true)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              Top Up
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredWallets.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No records found matching your search.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
