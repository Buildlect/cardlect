"use client"

import { useEffect, useMemo, useState } from 'react'
import { Building2, MapPin, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface PartnerSchool {
  id: string
  name: string
  address: string
  status: string
  contactEmail: string
  phoneNumber: string
}

interface Partnership {
  id: string
  schoolName: string
  status: string
  requestedAt: string
  respondedAt?: string
}

interface PartnerSchoolRow {
  id: string
  name?: string
  address?: string
  status?: string
  contact_email?: string
  phone_number?: string
}

interface PartnershipRow {
  id: string
  school_name?: string
  status?: string
  requested_at?: string
  responded_at?: string
}

export default function ApprovedStoresOverview() {
  const [schools, setSchools] = useState<PartnerSchool[]>([])
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [schoolsRes, partnershipsRes] = await Promise.all([
          api.get('/partners/schools'),
          api.get('/partners'),
        ])

        const schoolRows: PartnerSchoolRow[] = Array.isArray(schoolsRes.data?.data) ? schoolsRes.data.data : []
        const partnershipRows: PartnershipRow[] = Array.isArray(partnershipsRes.data?.data) ? partnershipsRes.data.data : []

        setSchools(schoolRows.map((row) => ({
          id: row.id,
          name: row.name || 'Unnamed School',
          address: row.address || 'No address',
          status: row.status || 'inactive',
          contactEmail: row.contact_email || 'N/A',
          phoneNumber: row.phone_number || 'N/A',
        })))

        setPartnerships(partnershipRows.map((row) => ({
          id: row.id,
          schoolName: row.school_name || 'Unknown School',
          status: row.status || 'pending',
          requestedAt: row.requested_at || '',
          respondedAt: row.responded_at || undefined,
        })))
      } catch (err: unknown) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } }; message?: string }
        const status = axiosError?.response?.status
        const message = axiosError?.response?.data?.error || axiosError?.message || 'Failed to load partner overview'
        setError(`Partner overview failed${status ? ` (${status})` : ''}: ${message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const metrics = {
    availableSchools: schools.length,
    approvedPartnerships: partnerships.filter(p => p.status === 'approved').length,
    pendingPartnerships: partnerships.filter(p => p.status === 'pending').length,
  }

  const statusChartData = useMemo(() => ([
    { name: 'Approved', value: partnerships.filter(p => p.status === 'approved').length },
    { name: 'Pending', value: partnerships.filter(p => p.status === 'pending').length },
    { name: 'Rejected', value: partnerships.filter(p => p.status === 'rejected').length },
  ]), [partnerships])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-700 mb-2">Partner Overview Error</h2>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Approved Stores Portal</h1>
        <p className="text-muted-foreground">Partner view only: schools directory and partnership status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Available Schools</p>
          <p className="text-3xl font-bold text-foreground">{metrics.availableSchools}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Approved Partnerships</p>
          <p className="text-3xl font-bold text-foreground">{metrics.approvedPartnerships}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-foreground">{metrics.pendingPartnerships}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Partnership Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill={CARDLECT_COLORS.primary.darker} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Partnership Requests</h3>
          <div className="space-y-3 max-h-64 overflow-auto">
            {partnerships.length === 0 ? (
              <p className="text-sm text-muted-foreground">No partnership requests yet.</p>
            ) : partnerships.map((p) => (
              <div key={p.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-foreground">{p.schoolName}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{p.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Requested: {p.requestedAt ? new Date(p.requestedAt).toLocaleDateString() : 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Responded: {p.respondedAt ? new Date(p.respondedAt).toLocaleDateString() : 'Pending'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">School Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map((school) => (
            <div key={school.id} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-primary" />
                  <p className="font-semibold text-foreground text-sm">{school.name}</p>
                </div>
                <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted">{school.status}</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MapPin size={12} /> {school.address}</p>
              <p className="text-xs text-muted-foreground">{school.contactEmail}</p>
              <p className="text-xs text-muted-foreground">{school.phoneNumber}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
