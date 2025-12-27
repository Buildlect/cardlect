'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Store, MapPin, Phone } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface StoreLocation {
  id: string
  name: string
  address: string
  phone: string
  city: string
  status: 'open' | 'closed'
  staff: number
}

const mockStores: StoreLocation[] = [
  { id: '1', name: 'Downtown Branch', address: '123 Main Street', phone: '08012345678', city: 'Lagos', status: 'open', staff: 8 },
  { id: '2', name: 'Lekki Store', address: '456 Lekki Road', phone: '08087654321', city: 'Lagos', status: 'open', staff: 6 },
  { id: '3', name: 'Victoria Island Hub', address: '789 VI Road', phone: '08098765432', city: 'Lagos', status: 'open', staff: 10 },
  { id: '4', name: 'Ibadan Branch', address: '321 Ring Road', phone: '08055555555', city: 'Ibadan', status: 'closed', staff: 4 },
]

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStores = mockStores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openStores = mockStores.filter(s => s.status === 'open').length
  const totalStaff = mockStores.reduce((sum, s) => sum + s.staff, 0)

  return (
    <DashboardLayout currentPage="stores" role="approved-stores">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Store Locations</h1>
        <p className="text-muted-foreground">Manage your store branches and locations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-foreground">{mockStores.length}</p>
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
              <p className="text-xs text-muted-foreground mb-1">Total Staff</p>
              <p className="text-3xl font-bold text-foreground">{totalStaff}</p>
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
                    <span>{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{store.staff} staff members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
