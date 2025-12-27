'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, Star } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Partner {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  rating: number
  sales: number
}

const mockPartners: Partner[] = [
  { id: '1', name: 'Northern Supplies Ltd', type: 'Distributor', status: 'active', rating: 4.8, sales: 450000 },
  { id: '2', name: 'Quality Books Inc', type: 'Publisher', status: 'active', rating: 4.5, sales: 320000 },
  { id: '3', name: 'Uniform Makers Co', type: 'Manufacturer', status: 'active', rating: 4.7, sales: 280000 },
  { id: '4', name: 'Stationery World', type: 'Retailer', status: 'inactive', rating: 4.2, sales: 150000 },
]

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPartners = mockPartners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activePartners = mockPartners.filter(p => p.status === 'active').length

  return (
    <DashboardLayout currentPage="partners" role="approved-stores">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Partners</h1>
        <p className="text-muted-foreground">Manage your supply chain partners</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active Partners</p>
                <p className="text-3xl font-bold text-foreground">{activePartners}</p>
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
                <p className="text-3xl font-bold text-foreground">{mockPartners.length}</p>
              </div>
              <Star size={24} style={{ color: CARDLECT_COLORS.warning.main }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
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
          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.type}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: partner.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }}
                  >
                    {partner.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-semibold text-foreground">{partner.rating} ⭐</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sales</p>
                    <p className="font-semibold text-foreground">₦{(partner.sales / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <button
                      className="px-3 py-1 text-sm font-medium text-white rounded"
                      style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                    >
                      View
                    </button>
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
