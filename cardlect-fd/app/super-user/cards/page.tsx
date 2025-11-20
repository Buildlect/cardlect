'use client'

import { useCallback, useMemo, useState } from 'react'
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

// Metric Card: accept explicit class strings to avoid invalid dynamic tailwind interpolation
const MetricCard = ({
  label,
  value,
  icon: Icon,
  bgClass,
  textClass,
  dotClass
}: {
  label: string
  value: any
  icon: any
  bgClass: string // e.g. 'bg-green-500/10'
  textClass: string // e.g. 'text-green-600'
  dotClass: string // e.g. 'bg-green-600'
}) => (
  <div className="relative rounded-2xl p-6 bg-white/80 dark:bg-card border border-border shadow-sm hover:shadow-lg transition-all backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${bgClass}`}>
        <Icon className={`w-6 h-6 ${textClass}`} />
      </div>
      <div className={`absolute right-4 top-4 w-3 h-3 rounded-full ${dotClass} shadow-lg`} />
    </div>

    <p className="text-muted-foreground text-sm mt-4">{label}</p>
    <p className={`text-4xl font-bold mt-1 ${textClass}`}>{value}</p>
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

  // callbacks use functional updates for safety and memoization
  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }, [])

  const toggleStatus = useCallback((id: string) => {
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    )
  }, [])

  // return combined classes for type badges (keeps usage simple)
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-primary/10 text-primary'
      case 'parent': return 'bg-blue-500/10 text-blue-600'
      case 'staff': return 'bg-green-500/10 text-green-600'
      case 'visitor': return 'bg-yellow-500/10 text-yellow-600'
      default: return 'bg-secondary/10 text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'inactive': return <Lock className="w-4 h-4 text-muted-foreground" />
      case 'blocked': return <XCircle className="w-4 h-4 text-destructive" />
      default: return null
    }
  }

  // memoized metrics to avoid repeated filtering on each render
  const metrics = useMemo(() => ({
    total: cards.length,
    active: cards.filter(c => c.status === 'active').length,
    inactive: cards.filter(c => c.status === 'inactive').length,
    blocked: cards.filter(c => c.status === 'blocked').length
  }), [cards])

  return (
    // improved light/dark root classes for consistent contrast
    <div className="flex h-screen bg-white text-slate-900 dark:bg-background dark:text-foreground">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="cards" />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Global Cards Management</h1>
                <p className="text-muted-foreground">Manage all student, parent, staff, and visitor cards</p>
              </div>

              <button aria-label="Create new card" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                New Card
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <MetricCard
                label="Total Cards"
                value={metrics.total}
                icon={Users}
                bgClass="bg-foreground/10"
                textClass="text-foreground"
                dotClass="bg-foreground"
              />
              <MetricCard
                label="Active"
                value={metrics.active}
                icon={BadgeCheck}
                bgClass="bg-green-500/10"
                textClass="text-green-600"
                dotClass="bg-green-600"
              />
              <MetricCard
                label="Inactive"
                value={metrics.inactive}
                icon={Activity}
                bgClass="bg-blue-500/10"
                textClass="text-blue-600"
                dotClass="bg-blue-600"
              />
              <MetricCard
                label="Blocked"
                value={metrics.blocked}
                icon={UserX}
                bgClass="bg-red-500/10"
                textClass="text-red-600"
                dotClass="bg-red-600"
              />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-lg overflow-hidden dark:bg-card">
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
                        className={`${idx % 2 === 0 ? 'even:bg-gray-50 dark:even:bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}
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
                            <button aria-label="Replace card" className="p-1 hover:bg-secondary/50 rounded transition-all">
                              <RefreshCw size={16} />
                            </button>

                            <button aria-label="Toggle lock" className="p-1 hover:bg-secondary/50 rounded transition-all" onClick={() => toggleStatus(card.id)}>
                              <Lock size={16} />
                            </button>

                            <button aria-label="Delete card" className="p-1 hover:bg-secondary/50 rounded transition-all" onClick={() => deleteCard(card.id)}>
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
