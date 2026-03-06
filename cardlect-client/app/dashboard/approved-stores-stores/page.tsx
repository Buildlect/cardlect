'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Store, MapPin, Phone } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface StoreLocation {
  id: string
  name: string
  address: string
  phone: string
  email: string
  status: 'open' | 'closed'
}

interface PartnerSchoolRow {
  id: string
  name?: string
  address?: string
  phone_number?: string
  contact_email?: string
  status?: string
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreLocation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/partners/schools')
        const rows: PartnerSchoolRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setStores(rows.map((row) => ({
          id: row.id,
          name: row.name || 'Unnamed School',
          address: row.address || 'No address',
          phone: row.phone_number || 'N/A',
          email: row.contact_email || 'N/A',
          status: row.status === 'active' ? 'open' : 'closed',
        })))
      } catch (error) {
        console.error('Failed to load store locations:', error)
        setStores([])
      } finally {
        setLoading(false)
      }
    }
    fetchStores()
  }, [])

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openStores = stores.filter(s => s.status === 'open').length
  const totalContacts = stores.filter(s => s.phone !== 'N/A').length

  return (
    <DashboardLayout currentPage="stores" role="partner">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Store Locations</h1>
        <p className="text-muted-foreground">Manage your store branches and locations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-foreground">{stores.length}</p>
              </div>
              <Store size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Open Now</p>
                <p className="text-3xl font-bold text-foreground">{openStores}</p>
              </div>
              <MapPin size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contactable Stores</p>
              <p className="text-3xl font-bold text-foreground">{totalContacts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Stores</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading store locations...</p>
          ) : (
          <div className="space-y-3">
            {filteredStores.map((store) => (
              <div key={store.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{store.name}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: store.status === 'open' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }}
                  >
                    {store.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{store.email}</span>
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
