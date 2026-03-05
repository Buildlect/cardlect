"use client"

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Search, Plus, Filter, User, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

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

const mockBorrowals: Borrowal[] = [
    { id: '1', studentName: 'Chioma Okonkwo', admissionNo: 'ADM001', bookTitle: 'Advanced Mathematics', borrowDate: '2024-05-15', dueDate: '2024-05-22', status: 'borrowed' },
    { id: '2', studentName: 'Tunde Adebayo', admissionNo: 'ADM002', bookTitle: 'English Literature Essentials', borrowDate: '2024-05-10', dueDate: '2024-05-17', returnDate: '2024-05-16', status: 'returned' },
    { id: '3', studentName: 'Sarah Johnson', admissionNo: 'ADM003', bookTitle: 'Physics Principles', borrowDate: '2024-05-01', dueDate: '2024-05-08', status: 'overdue' },
    { id: '4', studentName: 'Michael Chen', admissionNo: 'ADM004', bookTitle: 'Chemistry Experiments', borrowDate: '2024-05-12', dueDate: '2024-05-19', status: 'borrowed' },
    { id: '5', studentName: 'Amina Bello', admissionNo: 'ADM005', bookTitle: 'Biology Fundamentals', borrowDate: '2024-05-14', dueDate: '2024-05-21', status: 'borrowed' },
]

export default function LibrarianBorrowalsPage() {
    const [borrowals, setBorrowals] = useState(mockBorrowals)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredBorrowals = borrowals.filter(b =>
        b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.admissionNo.includes(searchTerm)
    )

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'returned': return { color: '#10B981', bg: '#DCFCE7', icon: CheckCircle2 }
            case 'borrowed': return { color: '#3B82F6', bg: '#DBEAFE', icon: Clock }
            case 'overdue': return { color: '#EF4444', bg: '#FEE2E2', icon: AlertCircle }
            default: return { color: '#6B7280', bg: '#F3F4F6', icon: Clock }
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
                    <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white gap-2">
                        <Plus size={18} /> Record New Borrowal
                    </Button>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    <div className="text-sm text-muted-foreground">Returned Today</div>
                                    <div className="text-2xl font-bold text-green-700">12</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search by student name, admission number or book title..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Borrowals Table */}
                <Card>
                    <CardContent className="pt-6">
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
                                                        <Button variant="outline" size="sm" className="text-xs h-8 border-primary text-primary hover:bg-primary/5">
                                                            Mark Returned
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
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
