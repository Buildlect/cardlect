'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import api from '@/lib/api-client'

interface VisitRow {
  id: string
  student_name?: string
  reason?: string
  diagnosis?: string
  treatment?: string
  staff_name?: string
  created_at?: string
}

export default function Page() {
  const [visits, setVisits] = useState<VisitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/health/visits?limit=100')
        const rows: VisitRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setVisits(rows)
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load clinic visits')
        setVisits([])
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [])

  return (
    <DashboardLayout currentPage="visits" role="staff" customRole="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Visits</h1>
        <p className="text-muted-foreground">Review clinic visit records.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading visits...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clinic visits found.</p>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <Card key={v.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{v.student_name || 'Unknown Student'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Reason: {v.reason || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Diagnosis: {v.diagnosis || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Treatment: {v.treatment || 'N/A'}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>By: {v.staff_name || 'N/A'}</p>
                    <p>{v.created_at ? new Date(v.created_at).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
