'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, Star } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Partner {
  id: string
  schoolName: string
  status: string
  requestedAt: string
  respondedAt?: string
}

interface PartnershipRow {
  id: string
  school_name?: string
  status?: string
  requested_at?: string
  responded_at?: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get('/partners')
        const rows: PartnershipRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setPartners(rows.map((row) => ({
          id: row.id,
          schoolName: row.school_name || 'Unknown School',
          status: row.status || 'pending',
          requestedAt: row.requested_at || '',
          respondedAt: row.responded_at || undefined,
        })))
      } catch (error) {
        console.error('Failed to load partnerships:', error)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  const filteredPartners = partners.filter(p =>
    p.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const approvedPartners = partners.filter(p => p.status === 'approved').length

  return (
    <DashboardLayout currentPage="partners" role="partner">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Partners</h1>
        <p className="text-muted-foreground">Manage your supply chain partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Approved Partnerships</p>
                <p className="text-3xl font-bold text-foreground">{approvedPartners}</p>
              </div>
              <Users size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Partners</p>
                <p className="text-3xl font-bold text-foreground">{partners.length}</p>
              </div>
              <Star size={24} style={{ color: CARDLECT_COLORS.warning.main }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Partners</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading partnerships...</p>
          ) : (
            <div className="space-y-3">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{partner.schoolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested {partner.requestedAt ? new Date(partner.requestedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{
                        backgroundColor:
                          partner.status === 'approved'
                            ? CARDLECT_COLORS.success.main
                            : partner.status === 'rejected'
                              ? CARDLECT_COLORS.danger.main
                              : CARDLECT_COLORS.warning.main,
                      }}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Response Date</p>
                      <p className="font-semibold text-foreground">
                        {partner.respondedAt ? new Date(partner.respondedAt).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Partnership ID</p>
                      <p className="font-semibold text-foreground">{partner.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
