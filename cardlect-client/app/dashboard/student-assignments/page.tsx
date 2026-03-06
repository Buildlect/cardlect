'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import api from '@/lib/api-client'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Assignment {
  id: string
  title?: string
  description?: string
  due_date?: string
  class_id?: string
}

export default function Page() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/academics/assignments?limit=100')
        const rows: Assignment[] = Array.isArray(res.data?.data) ? res.data.data : []
        setAssignments(rows)
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load assignments')
        setAssignments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const stats = useMemo(() => {
    const now = new Date().getTime()
    const open = assignments.filter((a) => !a.due_date || new Date(a.due_date).getTime() >= now).length
    const closed = assignments.length - open
    return { total: assignments.length, open, closed }
  }, [assignments])

  return (
    <DashboardLayout currentPage="assignments" role="student">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Assignments</h1>
        <p className="text-muted-foreground">Track your assignments and due dates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-3xl font-bold text-foreground">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Open</p><p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.open}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Closed</p><p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.closed}</p></CardContent></Card>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading assignments...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No assignments available.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">{a.title || 'Untitled Assignment'}</h3>
                <p className="text-sm text-muted-foreground mb-3">{a.description || 'No description'}</p>
                <div className="text-xs text-muted-foreground flex gap-4">
                  <span>Class: {a.class_id || 'N/A'}</span>
                  <span>Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
