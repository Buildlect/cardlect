"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Input } from "@/components/ui/input"
import { Search, Lock, Unlock, Trash2 } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"

const mockCards = [
  {
    id: 1,
    cardId: "CARD001",
    holder: "Chioma Okonkwo",
    type: "Student",
    issued: "2024-01-15",
    status: "Active",
    balance: 5000,
  },
  {
    id: 2,
    cardId: "CARD002",
    holder: "Tunde Adebayo",
    type: "Student",
    issued: "2024-01-15",
    status: "Active",
    balance: 3500,
  },
  {
    id: 3,
    cardId: "CARD003",
    holder: "Mr. Okafor",
    type: "Staff",
    issued: "2024-01-10",
    status: "Blocked",
    balance: 0,
  },
]

export default function CardsPage() {
  const [cards, setCards] = useState(mockCards)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState<null | {
    id: number
    cardId: string
    holder: string
    type: string
    issued: string
    status: string
    balance: number
  }>(null)

  const filteredCards = cards.filter(
    (c) =>
      c.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.holder.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleCardStatus = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c,
      ),
    )
    // if modal is open and that card is selected, update it as well
    setSelectedCard((prev) =>
      prev && prev.id === id ? { ...prev, status: prev.status === "Active" ? "Blocked" : "Active" } : prev,
    )
  }

  const handleDeleteCard = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    if (selectedCard?.id === id) setSelectedCard(null)
  }

  const openCard = (card: {
    id: number
    cardId: string
    holder: string
    type: string
    issued: string
    status: string
    balance: number
  }) => setSelectedCard(card)
  const closeModal = () => setSelectedCard(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <DashboardLayout currentPage="cards" role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Card Management</h2>
          <p className="text-muted-foreground mt-1">Issue, manage, and block student, staff, and parent cards</p>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by card ID or holder name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cards Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cards ({filteredCards.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No cards found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Card ID</th>
                      <th className="text-left py-2 px-4">Holder</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Issued Date</th>
                      <th className="text-left py-2 px-4">Balance</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCards.map((card) => (
                      <tr
                        key={card.id}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => openCard(card)}
                      >
                        <td className="py-2 px-4 font-mono text-xs">{card.cardId}</td>
                        <td className="py-2 px-4">{card.holder}</td>
                        <td className="py-2 px-4">
                          <span style={{
                            backgroundColor: `${CARDLECT_COLORS.primary.darker}20`,
                            color: CARDLECT_COLORS.primary.darker
                          }} className="px-2 py-1 rounded text-xs font-medium">
                            {card.type}
                          </span>
                        </td>
                        <td className="py-2 px-4">{card.issued}</td>
                        <td className="py-2 px-4 font-semibold">₦{card.balance.toLocaleString()}</td>
                        <td className="py-2 px-4">
                          <span
                            style={{
                              backgroundColor: card.status === "Active" 
                                ? `${CARDLECT_COLORS.success.main}20` 
                                : `${CARDLECT_COLORS.danger.main}20`,
                              color: card.status === "Active" 
                                ? CARDLECT_COLORS.success.main 
                                : CARDLECT_COLORS.danger.main
                            }}
                            className="px-2 py-1 rounded text-xs font-medium"
                          >
                            {card.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCardStatus(card.id)
                            }}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {card.status === "Active" ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCard(card.id)
                            }}
                            className="p-1 hover:bg-muted rounded text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-md shadow-lg p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{selectedCard.holder}</h3>
                <p className="text-sm text-muted-foreground">{selectedCard.cardId}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-sm text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="font-medium">{selectedCard.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Issued</p>
                <p className="font-medium">{selectedCard.issued}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <p className="font-medium">{selectedCard.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Balance</p>
                <p className="font-medium">₦{selectedCard.balance.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  toggleCardStatus(selectedCard.id)
                }}
                style={{ 
                  backgroundColor: `${CARDLECT_COLORS.primary.darker}15`, 
                  color: CARDLECT_COLORS.primary.darker 
                }}
                className="px-3 py-1 rounded hover:opacity-80"
              >
                {selectedCard.status === "Active" ? "Block" : "Unblock"}
              </button>
              <button
                onClick={() => handleDeleteCard(selectedCard.id)}
                style={{ 
                  backgroundColor: `${CARDLECT_COLORS.danger.main}15`, 
                  color: CARDLECT_COLORS.danger.main 
                }}
                className="px-3 py-1 rounded hover:opacity-80"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
