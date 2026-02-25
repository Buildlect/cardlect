'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
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
  ArrowDown
} from 'lucide-react'

interface Card {
  id: string
  holderName: string
  type: 'student' | 'parent' | 'staff' | 'visitor'
  school: string
  status: 'active' | 'inactive' | 'blocked'
  lastUsed: string
  cardNumber: string // masked (alphanumeric) for list
  rawCardNumber?: string // full alphanumeric for details (optional)
}

// Metric Card: more detailed and professional layout
const MetricCard = ({
  label,
  value,
  icon: Icon,
  bgClass,
  textClass,
  dotClass,
  subtitle,
  delta
}: {
  label: string
  value: any
  icon: any
  bgClass: string
  textClass: string
  dotClass: string
  subtitle?: string
  delta?: number // positive => up, negative => down, 0/undefined => neutral
}) => {
  const trend = delta === undefined ? 'neutral' : (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral')
  const trendClass =
    trend === 'up' ? 'text-green-600 bg-green-50' :
    trend === 'down' ? 'text-red-600 bg-red-50' :
    'text-muted-foreground bg-muted/10'

  return (
    <div className="relative rounded-2xl p-6 bg-white/80 dark:bg-card border border-border shadow-sm hover:shadow-lg transition-all backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <Icon className={`w-6 h-6 ${textClass}`} />
        </div>
        <div className={`absolute right-4 top-4 w-3 h-3 rounded-full ${dotClass} shadow-lg`} />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-3">
          <p className={`text-3xl md:text-4xl font-bold ${textClass}`}>{value}</p>

          {delta !== undefined && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${trendClass}`}>
              {trend === 'up' && <ArrowUp className="w-3 h-3" />}
              {trend === 'down' && <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(delta)}%</span>
            </span>
          )}
        </div>

        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}

        {/* Simple inline sparkline (static example) */}
        <div className="mt-3">
          <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.2"
              points="0,16 12,12 24,9 36,11 48,7 60,10 72,6 84,8 96,4 100,6"
              className="text-muted-foreground"
            />
            <polyline
              fill="none"
              stroke={trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280'}
              strokeWidth="2"
              points="0,16 12,12 24,9 36,11 48,7 60,10 72,6 84,8 96,4 100,6"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function CardsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [cards, setCards] = useState<Card[]>([
    // include rawCardNumber so details can show full number
    { id: 'card-001', holderName: 'Sarah Johnson', type: 'student', school: 'Cambridge Academy', status: 'active', lastUsed: '5 minutes ago', cardNumber: '****2847', rawCardNumber: '411111112847' },
    { id: 'card-002', holderName: 'Michael Chen', type: 'student', school: 'Cambridge Academy', status: 'active', lastUsed: '1 hour ago', cardNumber: '****5392', rawCardNumber: '555555555392' },
    { id: 'card-003', holderName: 'Emma Rodriguez', type: 'parent', school: 'Oxford High School', status: 'active', lastUsed: '2 hours ago', cardNumber: '****1045', rawCardNumber: '4242424241045' },
    { id: 'card-004', holderName: 'David Kumar', type: 'staff', school: 'Trinity Prep', status: 'inactive', lastUsed: '1 week ago', cardNumber: '****7823', rawCardNumber: '400012347823' },
    { id: 'card-005', holderName: 'Visitor Pass', type: 'visitor', school: 'Cambridge Academy', status: 'blocked', lastUsed: '3 days ago', cardNumber: '****0912', rawCardNumber: '3782822490912' },
  ])

  // modal state + form
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [form, setForm] = useState({
    holderName: '',
    cardNumber: '', // user-entered full alphanumeric number (or grouped)
    type: 'student' as Card['type'],
    school: '',
    status: 'active' as Card['status']
  })
  const [formError, setFormError] = useState<string | null>(null)

  const resetForm = () => {
    setForm({
      holderName: '',
      cardNumber: '',
      type: 'student',
      school: '',
      status: 'active'
    })
    setFormError(null)
  }

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
      case 'student': return { backgroundColor: `${CARDLECT_COLORS.primary.main}20`, color: CARDLECT_COLORS.primary.main }
      case 'parent': return { backgroundColor: `${CARDLECT_COLORS.info.main}20`, color: CARDLECT_COLORS.info.main }
      case 'staff': return { backgroundColor: `${CARDLECT_COLORS.success.main}20`, color: CARDLECT_COLORS.success.main }
      case 'visitor': return { backgroundColor: `${CARDLECT_COLORS.warning.main}20`, color: CARDLECT_COLORS.warning.main }
      default: return { backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }
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

  const openAdd = () => {
    resetForm()
    setIsAddOpen(true)
  }

  const closeAdd = () => {
    setIsAddOpen(false)
    setFormError(null)
  }

  const openDetails = (card: Card) => {
    setSelectedCard(card)
  }

  const closeDetails = () => {
    setSelectedCard(null)
  }

  const handleFormChange = (k: keyof typeof form, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  const handleAddSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    // simple validation
    if (!form.holderName.trim() || !form.cardNumber.trim() || !form.school.trim()) {
      setFormError('Please fill in all required fields.')
      return
    }

    const cleaned = form.cardNumber.replace(/[^a-zA-Z0-9]/g, '')
    const newCard: Card = {
      id: `card-${Date.now()}`,
      holderName: form.holderName.trim(),
      type: form.type,
      school: form.school.trim(),
      status: form.status,
      lastUsed: 'Just now',
      // masked for the list
      cardNumber: `****${cleaned.slice(-4)}`,
      // store raw number for details
      rawCardNumber: cleaned
    }

    setCards(prev => [newCard, ...prev])
    closeAdd()
    resetForm()
  }

  return (
    <DashboardLayout currentPage="cards" role="super-user">
    <div className="flex h-screen bg-white text-slate-900 dark:bg-background dark:text-foreground">
        <main className="flex-1 overflow-auto">
          <div className="p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Global Cards Management</h1>
                <p className="text-muted-foreground">Manage all student, parent, staff, and visitor cards</p>
              </div>

              <button aria-label="Create new card" onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
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
                subtitle="All issued cards in the system"
                delta={3} // example: +3% vs previous period
              />
              <MetricCard
                label="Active"
                value={metrics.active}
                icon={BadgeCheck}
                bgClass={`bg-[${CARDLECT_COLORS.success.main}]/10`}
                textClass={`text-[${CARDLECT_COLORS.success.main}]`}
                dotClass={`bg-[${CARDLECT_COLORS.success.main}]`}
                subtitle="Cards currently enabled and in use"
                delta={5}
              />
              <MetricCard
                label="Inactive"
                value={metrics.inactive}
                icon={Activity}
                bgClass={`bg-[${CARDLECT_COLORS.info.main}]/10`}
                textClass={`text-[${CARDLECT_COLORS.info.main}]`}
                dotClass={`bg-[${CARDLECT_COLORS.info.main}]`}
                subtitle="Temporarily disabled cards"
                delta={-2}
              />
              <MetricCard
                label="Blocked"
                value={metrics.blocked}
                icon={UserX}
                bgClass={`bg-[${CARDLECT_COLORS.danger.main}]/10`}
                textClass={`text-[${CARDLECT_COLORS.danger.main}]`}
                dotClass={`bg-[${CARDLECT_COLORS.danger.main}]`}
                subtitle="Cards blocked for security or policy reasons"
                delta={0}
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
                        onClick={() => openDetails(card)}
                        className={`${idx % 2 === 0 ? 'even:bg-gray-50 dark:even:bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all cursor-pointer`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{card.holderName}</td>

                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{card.cardNumber}</td>

                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs font-medium" style={getTypeColor(card.type)}>
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
                            <button
                              aria-label="Replace card"
                              className="p-1 hover:bg-secondary/50 rounded transition-all"
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); /* replace logic */ }}
                            >
                              <RefreshCw size={16} />
                            </button>

                            <button
                              aria-label="Toggle lock"
                              className="p-1 hover:bg-secondary/50 rounded transition-all"
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleStatus(card.id) }}
                            >
                              <Lock size={16} />
                            </button>

                            <button
                              aria-label="Delete card"
                              className="p-1 hover:bg-secondary/50 rounded transition-all"
                              onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteCard(card.id) }}
                            >
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

      {/* Add Card Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center px-4 py-10 md:py-0"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeAdd} />
          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-3xl bg-white dark:bg-card rounded-2xl shadow-2xl border border-border p-6 md:p-8 transform transition-transform duration-200 ease-out"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Create New Card</h3>
                <p className="text-sm text-muted-foreground">Add a new card to the global registry</p>
              </div>
              <button type="button" onClick={closeAdd} aria-label="Close modal" className="p-2 rounded hover:bg-secondary/50 transition-all">
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">Holder Name</span>
                <input
                  value={form.holderName}
                  onChange={e => handleFormChange('holderName', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. John Doe"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">Card Number</span>
                <input
                  value={form.cardNumber}
                  onChange={e => handleFormChange('cardNumber', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-transparent font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="xxxx xxxx xxxx 1234 (alphanumeric allowed)"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">Type</span>
                <select
                  value={form.type}
                  onChange={e => handleFormChange('type', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="staff">Staff</option>
                  <option value="visitor">Visitor</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-2">School</span>
                <input
                  value={form.school}
                  onChange={e => handleFormChange('school', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. Cambridge Academy"
                  required
                />
              </label>

              <label className="flex flex-col md:col-span-2">
                <span className="text-sm text-muted-foreground mb-2">Status</span>
                <select
                  value={form.status}
                  onChange={e => handleFormChange('status', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-transparent w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </label>
            </div>

            {formError && <p className="mt-4 text-sm text-destructive">{formError}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={closeAdd} className="px-4 py-2 rounded-lg bg-secondary/20 text-foreground hover:bg-secondary/30 transition-all">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                <CheckCircle size={16} />
                Create Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Card Details Modal (compact + modernized) */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-60 flex items-start md:items-center justify-center px-4 py-10 md:py-0"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeDetails} />
          <div
            className="relative z-10 w-full max-w-xl mx-auto bg-white dark:bg-card rounded-xl shadow-lg border border-border p-5 md:p-6 transform transition-transform duration-200 ease-out overflow-auto"
            style={{ maxHeight: '80vh' }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <BadgeCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{selectedCard.holderName}</h3>
                  <p className="text-xs text-muted-foreground">Card details • {selectedCard.school}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleStatus(selectedCard.id)
                    const updated = cards.find(c => c.id === selectedCard.id) || null
                    setSelectedCard(updated)
                  }}
                  aria-label="Toggle status"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/10 hover:bg-secondary/20 transition text-sm"
                >
                  {selectedCard.status === 'active' ? <Lock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  <span className="sr-only">{selectedCard.status === 'active' ? 'Disable' : 'Enable'}</span>
                </button>

                <button
                  onClick={() => {
                    deleteCard(selectedCard.id)
                    closeDetails()
                  }}
                  aria-label="Delete card"
                  className="inline-flex items-center justify-center p-2 rounded-md bg-red-50 text-destructive hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button onClick={closeDetails} className="p-2 rounded hover:bg-secondary/50 transition-all">
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Card ID</p>
                <pre className="bg-muted/5 rounded-md p-2 text-xs font-mono overflow-x-auto">{selectedCard.id}</pre>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Card Number</p>
                {/* show full number if available, formatted in groups of 4 */}
                <pre className="bg-muted/5 rounded-md p-2 text-xs font-mono">
                  {selectedCard.rawCardNumber
                    ? selectedCard.rawCardNumber.replace(/[^a-zA-Z0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()
                    : selectedCard.cardNumber}
                </pre>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Holder</p>
                <div className="text-sm text-foreground">{selectedCard.holderName}</div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Type</p>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={getTypeColor(selectedCard.type)}>
                    {selectedCard.type.charAt(0).toUpperCase() + selectedCard.type.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">School</p>
                <div className="text-sm">{selectedCard.school}</div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(selectedCard.status)}
                  <span className="capitalize">{selectedCard.status}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Last Used</p>
                <div className="text-sm text-muted-foreground">{selectedCard.lastUsed}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeDetails} className="px-3 py-1.5 rounded-md bg-secondary/10 hover:bg-secondary/20 text-sm transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
