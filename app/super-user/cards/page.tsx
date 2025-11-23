'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
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
  Activity
} from 'lucide-react'

interface Card {
  id: string
  holderName: string
  type: 'student' | 'parent' | 'staff' | 'visitor'
  school: string
  status: 'active' | 'inactive' | 'blocked'
  lastUsed: string
  cardNumber: string
}

// --- Metric Card Component (Same as your Hardware updated design) ---
const MetricCard = ({
  label,
  value,
  icon: Icon,
  color
}: {
  label: string
  value: any
  icon: any
  color: string
}) => (
  <div className="relative rounded-2xl p-6 bg-card border border-border shadow-sm hover:shadow-lg transition-all backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl bg-${color}/10`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div className={`absolute right-4 top-4 w-3 h-3 rounded-full bg-${color} shadow-lg shadow-${color}/40`} />
    </div>

    <p className="text-muted-foreground text-sm mt-4">{label}</p>
    <p className={`text-4xl font-bold mt-1 text-${color}`}>{value}</p>
  </div>
)

export default function CardsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cards, setCards] = useState<Card[]>([
    { id: 'card-001', holderName: 'Sarah Johnson', type: 'student', school: 'Cambridge Academy', status: 'active', lastUsed: '5 minutes ago', cardNumber: '****2847' },
    { id: 'card-002', holderName: 'Michael Chen', type: 'student', school: 'Cambridge Academy', status: 'active', lastUsed: '1 hour ago', cardNumber: '****5392' },
    { id: 'card-003', holderName: 'Emma Rodriguez', type: 'parent', school: 'Oxford High School', status: 'active', lastUsed: '2 hours ago', cardNumber: '****1045' },
    { id: 'card-004', holderName: 'David Kumar', type: 'staff', school: 'Trinity Prep', status: 'inactive', lastUsed: '1 week ago', cardNumber: '****7823' },
    { id: 'card-005', holderName: 'Visitor Pass', type: 'visitor', school: 'Cambridge Academy', status: 'blocked', lastUsed: '3 days ago', cardNumber: '****0912' },
  ])

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id))
  }

  const toggleStatus = (id: string) => {
    setCards(cards.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-primary/10 text-primary'
      case 'parent': return 'bg-blue-500/10 text-blue-600'
      case 'staff': return 'bg-green-500/10 text-green-600'
      case 'visitor': return 'bg-yellow-500/10 text-yellow-600'
      default: return 'bg-secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-primary" />
      case 'inactive': return <Lock className="w-4 h-4 text-muted-foreground" />
      case 'blocked': return <XCircle className="w-4 h-4 text-destructive" />
      default: return null
    }
  }

  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="cards" />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">

            {/* --- Header Section --- */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Global Cards Management</h1>
                <p className="text-muted-foreground">Manage all student, parent, staff, and visitor cards</p>
              </div>

              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                New Card
              </button>
            </div>

            {/* --- Modern Metric Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <MetricCard
                label="Total Cards"
                value={cards.length}
                icon={Users}
                color="foreground"
              />
              <MetricCard
                label="Active"
                value={cards.filter(c => c.status === 'active').length}
                icon={BadgeCheck}
                color="green-500"
              />
              <MetricCard
                label="Inactive"
                value={cards.filter(c => c.status === 'inactive').length}
                icon={Activity}
                color="blue-500"
              />
              <MetricCard
                label="Blocked"
                value={cards.filter(c => c.status === 'blocked').length}
                icon={UserX}
                color="red-500"
              />
            </div>

            {/* --- Table --- */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Holder</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">School</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Used</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cards.map((card, idx) => (
                      <tr
                        key={card.id}
                        className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{card.holderName}</td>

                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{card.cardNumber}</td>

                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(card.type)}`}>
                            {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-foreground">{card.school}</td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(card.status)}
                            <span className="text-sm text-foreground capitalize">{card.status}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">{card.lastUsed}</td>

                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-secondary/50 rounded transition-all" title="Replace">
                              <RefreshCw size={16} />
                            </button>

                            <button className="p-1 hover:bg-secondary/50 rounded transition-all" onClick={() => toggleStatus(card.id)} title="Toggle Lock">
                              <Lock size={16} />
                            </button>

                            <button className="p-1 hover:bg-secondary/50 rounded transition-all" onClick={() => deleteCard(card.id)} title="Delete">
                              <Trash2 size={16} className="text-destructive" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
