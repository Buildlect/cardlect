"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Input } from "@/components/ui/input"
import { Search, Lock, Unlock, Trash2, Loader2, CreditCard, ShieldCheck, ShieldAlert } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"
import { Button } from "@/components/ui/button"

interface NFC {
  id: string
  card_uid: string
  holder_name: string
  type: string
  created_at: string
  status: string
  balance: number
}

export default function CardsPage() {
  const [cards, setCards] = useState<NFC[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<null | NFC>(null)

  const fetchCards = async () => {
    setLoading(true)
    try {
      const response = await api.get('/cards')
      setCards(response.data.data)
    } catch (err) {
      console.error('Failed to fetch cards:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const filteredCards = cards.filter(
    (c) =>
      c.card_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.holder_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleCardStatus = async (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active"
    try {
      await api.put(`/cards/${cardId}/lock`, { status: newStatus })
      alert(`Card successfully ${newStatus}`)
      fetchCards()
      if (selectedCard?.id === cardId) {
        setSelectedCard(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card mapping?')) return
    // Assuming a delete endpoint exists or using lock for now
    alert('Delete functionality pending backend implementation. Card has been blocked instead.')
    toggleCardStatus(id, "active") // fallback to blocking
  }

  const openCard = (card: NFC) => setSelectedCard(card)
  const closeModal = () => setSelectedCard(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <DashboardLayout currentPage="cards" role="school_admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Smart Card Registry</h2>
            <p className="text-muted-foreground mt-1">Issue, monitor, and manage secure institutional identifiers.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <ShieldCheck className="text-green-500" size={20} />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Cards</p>
                <p className="text-lg font-black">{cards.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <ShieldAlert className="text-red-500" size={20} />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Blocked Cards</p>
                <p className="text-lg font-black">{cards.filter(c => c.status !== 'active').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Lookup by card UID or holder name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border"
            />
          </div>
          <Button className="bg-primary hover:bg-primary-darker text-white rounded-xl">
            Issue New Card
          </Button>
        </div>

        {/* Cards Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Internal Identifier</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Card Holder</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Role Type</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Issue Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Wallet Balance</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Security Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-muted/10 transition-colors group cursor-pointer"
                      onClick={() => openCard(card)}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-primary font-bold">{card.card_uid}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground">{card.holder_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-primary/10 text-primary">
                          {card.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(card.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-black text-foreground">₦{(card.balance || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${card.status === "active"
                              ? `bg-green-500/10 text-green-500`
                              : `bg-red-500/10 text-red-500`
                            }`}
                        >
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost" size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCardStatus(card.id, card.status)
                            }}
                            className="h-8 w-8 rounded-lg"
                          >
                            {card.status === "active" ? <Lock size={14} className="text-amber-500" /> : <Unlock size={14} className="text-green-500" />}
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCard(card.id)
                            }}
                            className="h-8 w-8 rounded-lg text-red-500"
                          >
                            <Trash2 size={14} />
                          </Button>
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

      {/* Modal / Detailed View */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-border bg-muted/20">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground">{selectedCard.holder_name}</h3>
                    <p className="text-sm font-mono text-primary font-bold">{selectedCard.card_uid}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Authentication Type</p>
                  <p className="font-bold text-lg capitalize">{selectedCard.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Initialization Date</p>
                  <p className="font-bold text-lg">{new Date(selectedCard.created_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Device Status</p>
                  <p className={`font-black text-lg uppercase ${selectedCard.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{selectedCard.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available Funds</p>
                  <p className="font-black text-xl text-primary">₦{(selectedCard.balance || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button
                  onClick={() => toggleCardStatus(selectedCard.id, selectedCard.status)}
                  variant="outline"
                  className={`rounded-xl px-6 border-2 font-bold ${selectedCard.status === 'active' ? 'border-amber-500/20 text-amber-500' : 'border-green-500/20 text-green-500'}`}
                >
                  {selectedCard.status === "active" ? "Lock Card" : "Unlock Card"}
                </Button>
                <Button variant="ghost" onClick={closeModal} className="rounded-xl px-6 font-bold">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
