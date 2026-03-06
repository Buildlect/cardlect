"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import {
  CheckCircle,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
  Users,
  BadgeCheck,
  UserX,
  Activity,
  ArrowUp,
  ArrowDown,
  Loader2,
  Building2,
  Phone,
  Search,
  Check
} from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCards = async () => {
    setLoading(true)
    try {
      const response = await api.get('/cards')
      setCards(response.data.data)
    } catch (err) {
      console.error('Failed to fetch global cards:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
      await api.put(`/cards/${id}/lock`, { status: newStatus })
      fetchCards()
    } catch (err) {
      console.error('Status sync failed.')
    }
  }

  const filteredCards = cards.filter(c =>
    c.holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.card_uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout currentPage="cards" role="super_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="cards" role="super_admin">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Global Card Registry</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Universal hardware credential management across all nodes.</p>
          </div>
          <div className="relative group flex-1 md:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={20} />
            <input
              className="w-full bg-card border border-border rounded-2xl h-14 pl-14 pr-6 font-black outline-none focus:border-primary/50 transition-all text-sm"
              placeholder="Search by holder, UID, or institutional node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: 'Active Credentials', val: cards.filter(c => c.status === 'active').length, icon: BadgeCheck, sub: 'Hardware Verified', color: SEMANTIC_COLORS.status.online },
            { label: 'Blocked Tokens', val: cards.filter(c => c.status === 'blocked').length, icon: UserX, sub: 'Security Locked', color: SEMANTIC_COLORS.status.offline },
            { label: 'Total Issuance', val: cards.length, icon: Activity, sub: 'Lifetime Registry', color: CARDLECT_COLORS.primary.main },
            { label: 'Avg Balance', val: `₦${(cards.reduce((s, c) => s + (parseFloat(c.balance) || 0), 0) / (cards.length || 1)).toFixed(0)}`, icon: Phone, sub: 'Network Average', color: CARDLECT_COLORS.warning.main }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-8 shadow-sm group hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-all" style={{ color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.sub}</span>
              </div>
              <p className="text-3xl font-black text-foreground mb-1 tracking-tighter">{stat.val}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Card Registry Table */}
        <div className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Holder Full Identity</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Institutional Node</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">HW UID</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Security Status</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Wallet ₦</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                        {card.holder_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg tracking-tight">{card.holder_name}</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">{card.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-muted-foreground" />
                      <span className="text-sm font-black text-foreground">{card.school_name}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <code className="bg-muted rounded-xl px-3 py-1.5 text-xs font-black text-primary border border-border">
                      {card.card_uid}
                    </code>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${card.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="p-8 text-center">
                    <p className="text-lg font-black text-foreground">₦{Number(card.balance || 0).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase italic dark:text-gray-400">Available Capital</p>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline" size="icon" className="rounded-xl border-2 hover:bg-amber-500 hover:text-white transition-all"
                        title={card.status === 'active' ? 'Lock Credentials' : 'Restore Authorization'}
                        onClick={() => toggleStatus(card.id, card.status)}
                      >
                        {card.status === 'active' ? <Lock size={18} /> : <CheckCircle size={18} />}
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-primary hover:text-white transition-all" title="Replace Hardware">
                        <RefreshCw size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-red-500 hover:text-white transition-all" title="Decommission Permanently">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={40} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No matching credentials found in registry</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
