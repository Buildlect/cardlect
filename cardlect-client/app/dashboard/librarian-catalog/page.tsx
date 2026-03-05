"use client"

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookMarked, Search, Plus, Filter, Download, BookOpen, Trash2, Edit } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Book {
    id: string
    title: string
    author: string
    isbn: string
    category: string
    copies: number
    available: number
    location: string
    status: 'available' | 'low-stock' | 'out-of-stock'
}

const mockBooks: Book[] = [
    { id: '1', title: 'Advanced Mathematics', author: 'Dr. James Wilson', isbn: '978-1-23456-789-0', category: 'Mathematics', copies: 15, available: 8, location: 'Shelf A1', status: 'available' },
    { id: '2', title: 'English Literature Essentials', author: 'Prof. Sarah Anderson', isbn: '978-1-23456-789-1', category: 'English', copies: 20, available: 5, location: 'Shelf B3', status: 'low-stock' },
    { id: '3', title: 'Physics Principles', author: 'Dr. Robert Brown', isbn: '978-1-23456-789-2', category: 'Physics', copies: 12, available: 0, location: 'Shelf C2', status: 'out-of-stock' },
    { id: '4', title: 'Chemistry Experiments', author: 'Prof. Emma Davis', isbn: '978-1-23456-789-3', category: 'Chemistry', copies: 18, available: 14, location: 'Shelf C4', status: 'available' },
    { id: '5', title: 'Biology Fundamentals', author: 'Dr. Michael Green', isbn: '978-1-23456-789-4', category: 'Biology', copies: 22, available: 19, location: 'Shelf D1', status: 'available' },
]

export default function LibrarianCatalogPage() {
    const [books, setBooks] = useState(mockBooks)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.isbn.includes(searchTerm)
    )

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'available': return { color: '#10B981', bg: '#DCFCE7' }
            case 'low-stock': return { color: '#F59E0B', bg: '#FEF3C7' }
            case 'out-of-stock': return { color: '#EF4444', bg: '#FEE2E2' }
            default: return { color: '#6B7280', bg: '#F3F4F6' }
        }
    }

    return (
        <DashboardLayout currentPage="catalog" role="staff" customRole="librarian">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Library Catalog</h1>
                        <p className="text-muted-foreground">Manage books, inventory and classification</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download size={18} /> Export
                        </Button>
                        <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white gap-2">
                            <Plus size={18} /> Add New Book
                        </Button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search by title, author or ISBN..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter size={18} /> Filters
                    </Button>
                </div>

                {/* Catalog Table */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="py-3 px-4 text-sm font-semibold">Book Title</th>
                                        <th className="py-3 px-4 text-sm font-semibold">Author</th>
                                        <th className="py-3 px-4 text-sm font-semibold">Category</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-center">Copies</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-center">Available</th>
                                        <th className="py-3 px-4 text-sm font-semibold">Location</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-center">Status</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map((book) => {
                                        const styles = getStatusStyles(book.status)
                                        return (
                                            <tr key={book.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <BookOpen size={20} className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{book.title}</div>
                                                            <div className="text-xs text-muted-foreground">ISBN: {book.isbn}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm">{book.author}</td>
                                                <td className="py-4 px-4 text-sm">{book.category}</td>
                                                <td className="py-4 px-4 text-sm text-center font-medium">{book.copies}</td>
                                                <td className="py-4 px-4 text-sm text-center font-bold text-green-600">{book.available}</td>
                                                <td className="py-4 px-4 text-sm">{book.location}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span
                                                        className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                        style={{ color: styles.color, backgroundColor: styles.bg }}
                                                    >
                                                        {book.status.replace('-', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
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
