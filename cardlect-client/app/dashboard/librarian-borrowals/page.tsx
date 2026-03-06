"use client"

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Search, Plus, User, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Borrowal {
    id: string
    studentName: string
    admissionNo: string
    bookTitle: string
    borrowDate: string
    dueDate: string
    returnDate?: string
    status: 'borrowed' | 'returned' | 'overdue'
}

interface BorrowalRow {
    id: string
    user_name?: string
    admission_number?: string
    book_title?: string
    borrowed_at?: string
    due_date?: string
    returned_at?: string
    status?: string
}

export default function LibrarianBorrowalsPage() {
    const [borrowals, setBorrowals] = useState<Borrowal[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        const fetchBorrowals = async () => {
            setLoading(true)
            setErrorMessage(null)
            try {
                const res = await api.get('/library/transactions')
                const rows: BorrowalRow[] = Array.isArray(res.data?.data) ? res.data.data : []
                setBorrowals(rows.map((row) => ({
                    id: row.id,
                    studentName: row.user_name || 'Unknown Student',
                    admissionNo: row.admission_number || 'N/A',
                    bookTitle: row.book_title || 'Untitled Book',
                    borrowDate: row.borrowed_at ? new Date(row.borrowed_at).toLocaleDateString() : 'N/A',
                    dueDate: row.due_date ? new Date(row.due_date).toLocaleDateString() : 'N/A',
                    returnDate: row.returned_at ? new Date(row.returned_at).toLocaleDateString() : undefined,
                    status: (row.status === 'returned' || row.status === 'overdue') ? row.status : 'borrowed',
                })))
            } catch (error: unknown) {
                const apiError = error as { response?: { data?: { error?: string } }; message?: string }
                setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load borrowals')
                setBorrowals([])
            } finally {
                setLoading(false)
            }
        }

        fetchBorrowals()
    }, [])

    const filteredBorrowals = useMemo(() => borrowals.filter(b =>
        b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.admissionNo.includes(searchTerm)
    ), [borrowals, searchTerm])

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'returned': return { color: '#10B981', bg: '#DCFCE7', icon: CheckCircle2 }
            case 'borrowed': return { color: '#3B82F6', bg: '#DBEAFE', icon: Clock }
            case 'overdue': return { color: '#EF4444', bg: '#FEE2E2', icon: AlertCircle }
            default: return { color: '#6B7280', bg: '#F3F4F6', icon: Clock }
        }
    }

    const handleMarkReturned = async (id: string) => {
        setUpdatingId(id)
        try {
            await api.post(`/library/return/${id}`)
            setBorrowals((prev) => prev.map((b) => (
                b.id === id
                    ? { ...b, status: 'returned', returnDate: new Date().toLocaleDateString() }
                    : b
            )))
        } catch (error: unknown) {
            const apiError = error as { response?: { data?: { error?: string } }; message?: string }
            alert(apiError?.response?.data?.error || apiError?.message || 'Failed to mark as returned')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <DashboardLayout currentPage="borrowals" role="staff" customRole="librarian">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Borrowals & Returns</h1>
                        <p className="text-muted-foreground">Track book lending, due dates and student history</p>
                    </div>
                    <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white gap-2" disabled>
                        <Plus size={18} /> Record New Borrowal
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <Card className="bg-blue-50/30 border-blue-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Currently Borrowed</div>
                                    <div className="text-2xl font-bold text-blue-700">{borrowals.filter(b => b.status === 'borrowed').length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50/30 border-red-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Overdue Books</div>
                                    <div className="text-2xl font-bold text-red-700">{borrowals.filter(b => b.status === 'overdue').length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50/30 border-green-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Returned</div>
                                    <div className="text-2xl font-bold text-green-700">{borrowals.filter(b => b.status === 'returned').length}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search by student name, admission number or book title..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Card>
                    <CardContent className="pt-6">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading borrowals...</p>
                        ) : errorMessage ? (
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        ) : filteredBorrowals.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No borrowal records found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="py-3 px-4 text-sm font-semibold">Student</th>
                                            <th className="py-3 px-4 text-sm font-semibold">Book Title</th>
                                            <th className="py-3 px-4 text-sm font-semibold">Borrowed On</th>
                                            <th className="py-3 px-4 text-sm font-semibold">Due Date</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-center">Status</th>
                                            <th className="py-3 px-4 text-sm font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBorrowals.map((b) => {
                                            const styles = getStatusStyles(b.status)
                                            const StatusIcon = styles.icon
                                            return (
                                                <tr key={b.id} className="border-b hover:bg-muted/30 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                <User size={16} />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-sm">{b.studentName}</div>
                                                                <div className="text-[10px] text-muted-foreground">{b.admissionNo}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen size={14} className="text-muted-foreground" />
                                                            <span className="text-sm font-medium">{b.bookTitle}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-muted-foreground">{b.borrowDate}</td>
                                                    <td className="py-4 px-4 text-sm font-medium">{b.dueDate}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <div
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                                            style={{ color: styles.color, backgroundColor: styles.bg }}
                                                        >
                                                            <StatusIcon size={12} />
                                                            {b.status.toUpperCase()}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        {b.status !== 'returned' ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs h-8 border-primary text-primary hover:bg-primary/5"
                                                                disabled={updatingId === b.id}
                                                                onClick={() => handleMarkReturned(b.id)}
                                                            >
                                                                {updatingId === b.id ? 'Updating...' : 'Mark Returned'}
                                                            </Button>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Returned on {b.returnDate}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
