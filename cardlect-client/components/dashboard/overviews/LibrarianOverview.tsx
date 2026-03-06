"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Users, CheckCircle, AlertCircle, Plus, Search, BarChart3, Loader2 } from 'lucide-react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function LibrarianOverview() {
    const [books, setBooks] = useState<any[]>([])
    const [summary, setSummary] = useState<any>(null)
    const [topBooks, setTopBooks] = useState<any[]>([])
    const [trends, setTrends] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, summaryRes, topBooksRes, trendsRes] = await Promise.all([
                    api.get('/library/books?limit=50'),
                    api.get('/analytics/library/summary'),
                    api.get('/analytics/library/top-books'),
                    api.get('/analytics/library/trends'),
                ])
                setBooks(booksRes.data.data || [])
                setSummary(summaryRes.data.data)
                setTopBooks(topBooksRes.data.data || [])
                setTrends(trendsRes.data.data || [])
            } catch (err) {
                console.error('Failed to fetch library data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    const filteredBooks = books.filter(b =>
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (available: number, copies: number) => {
        if (available === 0) return 'text-red-500 bg-red-500/10'
        if (available <= copies * 0.25) return 'text-amber-500 bg-amber-500/10'
        return 'text-green-500 bg-green-500/10'
    }

    const getStatusLabel = (available: number, copies: number) => {
        if (available === 0) return 'Out'
        if (available <= copies * 0.25) return 'Low'
        return 'OK'
    }

    // Format trends for chart
    const chartData = trends.map((t: any) => ({
        month: new Date(t.week || t.date || Date.now()).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
        borrowed: parseInt(t.borrow_count || t.borrowed || '0'),
        returned: parseInt(t.return_count || t.returned || '0'),
    }))

    const statCards = [
        { label: 'Total Books', value: summary?.total_books ?? books.length, color: CARDLECT_COLORS.warning.main, sub: 'Titles in catalog' },
        { label: 'Total Copies', value: summary?.total_copies ?? 0, color: CARDLECT_COLORS.primary.darker, sub: 'Physical copies' },
        { label: 'Currently Borrowed', value: summary?.currently_borrowed ?? 0, color: CARDLECT_COLORS.info?.main ?? '#3b82f6', sub: 'In circulation' },
        { label: 'Overdue', value: summary?.overdue_count ?? 0, color: CARDLECT_COLORS.danger.main, sub: 'Need follow-up' },
        { label: 'Available Now', value: summary?.available_copies ?? 0, color: CARDLECT_COLORS.success.main, sub: 'Ready to borrow' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Library Management</h1>
                    <p className="text-muted-foreground mt-1">Manage library inventory, track borrowals, and student reading history.</p>
                </div>
                <button
                    style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                    className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
                >
                    <Plus size={18} /> Add Book
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Borrowal Trend */}
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-5 text-foreground">Borrowal Activity</h3>
                    <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartData.length > 0 ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                                    <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="borrowed" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={false} name="Borrowed" />
                                    <Line type="monotone" dataKey="returned" stroke={CARDLECT_COLORS.success.main} strokeWidth={2} dot={false} name="Returned" />
                                </LineChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No borrowal data</div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Books */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Most Borrowed</h3>
                    {topBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm text-center">
                            <BarChart3 size={32} className="opacity-20 mb-2" />
                            No borrowal records yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topBooks.slice(0, 5).map((book: any, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-black text-muted-foreground w-4 shrink-0">{i + 1}</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-primary shrink-0">{book.borrow_count}x</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Book Inventory Table */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Book Inventory</h3>
                    <div className="relative max-w-xs w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                    </div>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <BookOpen size={40} className="opacity-20 mb-3" />
                        <p className="text-muted-foreground font-medium">
                            {searchTerm ? 'No books match your search.' : 'No books in the library catalog yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Title</th>
                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Author</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Total</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Available</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Borrowed</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book: any) => {
                                    const total = parseInt(book.total_copies || book.copies || '0')
                                    const avail = parseInt(book.available_copies || book.available || '0')
                                    const borrowed = total - avail
                                    return (
                                        <tr key={book.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-4 font-medium text-foreground">{book.title}</td>
                                            <td className="py-3 px-4 text-muted-foreground">{book.author}</td>
                                            <td className="py-3 px-4 text-center font-semibold">{total}</td>
                                            <td className="py-3 px-4 text-center text-green-500 font-semibold">{avail}</td>
                                            <td className="py-3 px-4 text-center text-blue-500 font-semibold">{borrowed}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(avail, total)}`}>
                                                    {getStatusLabel(avail, total)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-border hover:bg-muted transition-colors">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
