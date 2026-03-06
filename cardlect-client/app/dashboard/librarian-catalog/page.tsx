"use client"

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, Download, BookOpen } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

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

interface LibraryBookRow {
  id: string
  title?: string
  author?: string
  isbn?: string
  category?: string
  total_copies?: number | string
  available_copies?: number | string
  location?: string
}

export default function LibrarianCatalogPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/library/books', { params: { q: searchTerm || undefined } })
        const rows: LibraryBookRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setBooks(rows.map((row) => {
          const total = Number(row.total_copies || 0)
          const available = Number(row.available_copies || 0)
          const status: Book['status'] = available <= 0 ? 'out-of-stock' : available <= Math.max(1, Math.floor(total * 0.25)) ? 'low-stock' : 'available'
          return {
            id: row.id,
            title: row.title || 'Untitled',
            author: row.author || 'Unknown',
            isbn: row.isbn || 'N/A',
            category: row.category || 'Uncategorized',
            copies: total,
            available,
            location: row.location || 'N/A',
            status,
          }
        }))
      } catch (error) {
        console.error('Failed to load books:', error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [searchTerm])

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

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading books...</p>
            ) : (
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
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => {
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
