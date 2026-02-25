"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BookOpen, Users, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react'

interface Book {
    id: string
    title: string
    author: string
    isbn: string
    copies: number
    available: number
    category: string
    status: 'available' | 'low-stock' | 'out-of-stock'
}

const mockBooks: Book[] = [
    { id: '1', title: 'Advanced Mathematics', author: 'Dr. James Wilson', isbn: '978-1-23456-789-0', copies: 15, available: 8, category: 'Mathematics', status: 'available' },
    { id: '2', title: 'English Literature Essentials', author: 'Prof. Sarah Anderson', isbn: '978-1-23456-789-1', copies: 20, available: 5, category: 'English', status: 'low-stock' },
    { id: '3', title: 'Physics Principles', author: 'Dr. Robert Brown', isbn: '978-1-23456-789-2', copies: 12, available: 0, category: 'Physics', status: 'out-of-stock' },
    { id: '4', title: 'Chemistry Experiments', author: 'Prof. Emma Davis', isbn: '978-1-23456-789-3', copies: 18, available: 14, category: 'Chemistry', status: 'available' },
    { id: '5', title: 'Biology Fundamentals', author: 'Dr. Michael Green', isbn: '978-1-23456-789-4', copies: 22, available: 19, category: 'Biology', status: 'available' },
]

const borrowalData = [
    { month: 'Jan', borrowed: 145, returned: 140, overdue: 5 },
    { month: 'Feb', borrowed: 168, returned: 162, overdue: 6 },
    { month: 'Mar', borrowed: 192, returned: 185, overdue: 7 },
    { month: 'Apr', borrowed: 210, returned: 205, overdue: 5 },
    { month: 'May', borrowed: 198, returned: 192, overdue: 6 },
    { month: 'Jun', borrowed: 225, returned: 218, overdue: 7 },
]

export default function LibrarianOverview() {
    const [books, setBooks] = useState(mockBooks)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        totalBooks: books.length,
        totalCopies: books.reduce((sum, b) => sum + b.copies, 0),
        available: books.reduce((sum, b) => sum + b.available, 0),
        outOfStock: books.filter(b => b.status === 'out-of-stock').length,
        avgUtilization: Math.round(((books.reduce((sum, b) => sum + b.copies - b.available, 0)) / books.reduce((sum, b) => sum + b.copies, 0)) * 100),
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'text-green-600 bg-green-50'
            case 'low-stock': return 'text-yellow-600 bg-yellow-50'
            case 'out-of-stock': return 'text-red-600 bg-red-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Library Management</h1>
                    <p className="text-muted-foreground">Manage library inventory, track borrowals, and student reading history</p>
                </div>
                <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 transition-opacity">
                    <Plus size={18} /> Add Book
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Books</div>
                        <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.totalBooks}</div>
                        <div className="text-xs text-muted-foreground mt-2">Titles in catalog</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Copies</div>
                        <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.totalCopies}</div>
                        <div className="text-xs text-muted-foreground mt-2">Physical copies</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Available Now</div>
                        <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                        <div className="text-xs text-muted-foreground mt-2">Ready to borrow</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Out of Stock</div>
                        <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
                        <div className="text-xs text-muted-foreground mt-2">Need restocking</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Utilization Rate</div>
                        <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.avgUtilization}%</div>
                        <div className="text-xs text-muted-foreground mt-2">Books in use</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Borrowal Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={borrowalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="borrowed" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} />
                            <Line type="monotone" dataKey="returned" stroke={CARDLECT_COLORS.success.main} strokeWidth={2} />
                            <Line type="monotone" dataKey="overdue" stroke={CARDLECT_COLORS.danger.main} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Book Inventory */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Book Inventory</CardTitle>
                        <Input
                            placeholder="Search books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-xs"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold">Author</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Total</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Available</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Borrowed</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className="border-b hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">{book.title}</td>
                                        <td className="py-3 px-4 text-sm">{book.author}</td>
                                        <td className="py-3 px-4 text-center font-semibold">{book.copies}</td>
                                        <td className="py-3 px-4 text-center text-green-600 font-semibold">{book.available}</td>
                                        <td className="py-3 px-4 text-center text-blue-600 font-semibold">{book.copies - book.available}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.status)}`}>
                                                {book.status === 'out-of-stock' ? 'Out' : book.status === 'low-stock' ? 'Low' : 'Ok'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
