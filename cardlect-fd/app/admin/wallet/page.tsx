"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, X } from "lucide-react"
import DashboardLayout from '@/components/DashboardLayout/layout'

type Wallet = {
  id: number
  name: string
  balance: number
  lastTransaction: string
  date: string
  status: "Good" | "Low" | "Empty"
}

const mockWalletData: Wallet[] = [
  { id: 1, name: "Chioma Okonkwo", balance: 5000, lastTransaction: "Lunch - ₦500", date: "2024-01-19", status: "Good" },
  {
    id: 2,
    name: "Tunde Adebayo",
    balance: 3500,
    lastTransaction: "Library - ₦300",
    date: "2024-01-19",
    status: "Good",
  },
  { id: 3, name: "Amara Nwankwo", balance: 800, lastTransaction: "Event - ₦200", date: "2024-01-18", status: "Low" },
  { id: 4, name: "Seun Akinbami", balance: 0, lastTransaction: "N/A", date: "2024-01-17", status: "Empty" },
]

export default function WalletPage() {
  const [wallets, setWallets] = useState<Wallet[]>(mockWalletData)
  const [searchTerm, setSearchTerm] = useState("")
  const [showTopup, setShowTopup] = useState(false)
  const [topupData, setTopupData] = useState({ studentName: "", amount: "" })
  const [topupLoading, setTopupLoading] = useState(false)
  const [topupMessage, setTopupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [modalTopupAmount, setModalTopupAmount] = useState("")
  const [modalLoading, setModalLoading] = useState(false)

  const filteredWallets = wallets.filter((w) => w.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalWalletValue = wallets.reduce((sum, w) => sum + w.balance, 0)

  function openWalletModal(wallet: Wallet) {
    setSelectedWallet(wallet)
    setModalTopupAmount("")
    setShowDetailsModal(true)
  }

  function closeWalletModal() {
    setSelectedWallet(null)
    setShowDetailsModal(false)
    setModalTopupAmount("")
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return new Date().toISOString().slice(0, 10)
    return dateStr
  }

  function computeStatus(balance: number): Wallet["status"] {
    if (balance <= 0) return "Empty"
    if (balance < 1000) return "Low"
    return "Good"
  }

  function handleModalTopup() {
    if (!selectedWallet) return
    const amt = parseFloat(modalTopupAmount)
    
    // Validate amount
    if (!modalTopupAmount.trim()) {
      alert('Please enter an amount')
      return
    }
    if (isNaN(amt)) {
      alert('Please enter a valid number')
      return
    }
    if (amt <= 0) {
      alert('Amount must be greater than 0')
      return
    }
    if (amt < 1000) {
      alert('Minimum amount is ₦1,000')
      return
    }

    setModalLoading(true)
    // Simulate API call
    setTimeout(() => {
      setWallets((prev) =>
        prev.map((w) =>
          w.id === selectedWallet.id
            ? {
                ...w,
                balance: w.balance + amt,
                lastTransaction: `Top Up - ₦${amt.toLocaleString()}`,
                date: new Date().toISOString().slice(0, 10),
                status: computeStatus(w.balance + amt),
              }
            : w
        )
      )

      setSelectedWallet((s) =>
        s
          ? {
              ...s,
              balance: s.balance + amt,
              lastTransaction: `Top Up - ₦${amt.toLocaleString()}`,
              date: new Date().toISOString().slice(0, 10),
              status: computeStatus(s.balance + amt),
            }
          : s
      )

      setModalLoading(false)
      setModalTopupAmount("")
      alert(`Top-up of ₦${amt.toLocaleString()} successful!`)
    }, 800)
  }

  return (
    <DashboardLayout currentPage="wallet" role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Wallet Management</h2>
            <p className="text-muted-foreground mt-1">Manage student wallet balances and transactions</p>
          </div>
          <Button onClick={() => setShowTopup(!showTopup)} className="bg-primary hover:bg-accent/90 gap-2">
            <Plus size={18} /> Top Up
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Wallet Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalWalletValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallets.filter((w) => w.balance > 0).length}</div>
              <p className="text-xs text-muted-foreground">With positive balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Low Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{wallets.filter((w) => w.balance < 1000 && w.balance > 0).length}</div>
              <p className="text-xs text-muted-foreground">Below ₦1,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Up Form */}
        {showTopup && (
          <>
            {topupMessage && (
              <div style={{ backgroundColor: topupMessage.type === 'success' ? '#10b98120' : '#ef444420', borderLeft: `4px solid ${topupMessage.type === 'success' ? '#10b981' : '#ef4444'}` }} className="rounded p-4 mb-6">
                <p style={{ color: topupMessage.type === 'success' ? '#10b981' : '#ef4444' }} className="font-medium">{topupMessage.text}</p>
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Top Up Student Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Student Name/ID"
                    value={topupData.studentName}
                    onChange={(e) => setTopupData({ ...topupData, studentName: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Amount (₦)"
                    value={topupData.amount}
                    onChange={(e) => setTopupData({ ...topupData, amount: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      onClick={() => {
                        if (!topupData.studentName.trim()) {
                          alert('Please enter student name')
                          return
                        }
                        const amt = parseFloat(topupData.amount)
                        if (!topupData.amount.trim() || isNaN(amt)) {
                          alert('Please enter a valid amount')
                          return
                        }
                        if (amt <= 0) {
                          alert('Amount must be greater than 0')
                          return
                        }
                        if (amt < 1000) {
                          alert('Minimum amount is ₦1,000')
                          return
                        }
                        
                        const found = wallets.find(w => w.name.toLowerCase() === topupData.studentName.toLowerCase())
                        if (!found) {
                          alert(`Student "${topupData.studentName}" not found`)
                          return
                        }
                        
                        setTopupLoading(true)
                        setTimeout(() => {
                          setWallets((prev) =>
                            prev.map((w) =>
                              w.name.toLowerCase() === topupData.studentName.toLowerCase()
                                ? {
                                    ...w,
                                    balance: w.balance + amt,
                                    lastTransaction: `Top Up - ₦${amt.toLocaleString()}`,
                                    date: new Date().toISOString().slice(0, 10),
                                    status: computeStatus(w.balance + amt),
                                  }
                                : w
                            )
                          )
                          setTopupLoading(false)
                          setTopupMessage({ type: 'success', text: `Top-up of ₦${amt.toLocaleString()} successful!` })
                          setTopupData({ studentName: "", amount: "" })
                          setTimeout(() => setTopupMessage(null), 3000)
                        }, 800)
                      }}
                      disabled={topupLoading}
                    >
                      {topupLoading ? 'Processing...' : 'Top Up'}
                    </Button>
                    <Button onClick={() => setShowTopup(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Wallets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Wallets ({filteredWallets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredWallets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No wallets found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Student Name</th>
                      <th className="text-left py-2 px-4">Balance</th>
                      <th className="text-left py-2 px-4">Last Transaction</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWallets.map((wallet) => (
                      <tr
                        key={wallet.id}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => openWalletModal(wallet)}
                      >
                        <td className="py-2 px-4">{wallet.name}</td>
                        <td className="py-2 px-4 font-semibold">₦{wallet.balance.toLocaleString()}</td>
                        <td className="py-2 px-4 text-sm text-muted-foreground">{wallet.lastTransaction}</td>
                        <td className="py-2 px-4 text-sm">{wallet.date}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              wallet.status === "Good"
                                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                                : wallet.status === "Low"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                            }`}
                          >
                            {wallet.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              openWalletModal(wallet)
                            }}
                          >
                            Top Up
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Modal */}
        {showDetailsModal && selectedWallet && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            onClick={closeWalletModal}
          >
            <div
              className="bg-card rounded-lg w-11/12 max-w-xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 p-1 rounded hover:bg-muted"
                onClick={closeWalletModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-semibold mb-2">{selectedWallet.name}</h3>
              <p className="text-2xl font-bold mb-2">₦{selectedWallet.balance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mb-4">Last: {selectedWallet.lastTransaction} • {formatDate(selectedWallet.date)}</p>

              <div className="mb-4">
                <label className="block text-sm mb-1">Top Up Amount (₦)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={modalTopupAmount}
                  onChange={(e) => setModalTopupAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={closeWalletModal} disabled={modalLoading}>Close</Button>
                <Button onClick={handleModalTopup} disabled={modalLoading}>
                  {modalLoading ? 'Processing...' : 'Apply Top Up'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
