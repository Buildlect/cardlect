'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, TrendingUp } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Order {
  id: string
  orderId: string
  school: string
  items: number
  total: number
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}

const mockOrders: Order[] = [
  { id: '1', orderId: 'ORD-001', school: 'St. Paul College', items: 5, total: 45000, date: '2024-01-12', status: 'delivered' },
  { id: '2', orderId: 'ORD-002', school: 'Lagos Academy', items: 3, total: 28000, date: '2024-01-10', status: 'shipped' },
  { id: '3', orderId: 'ORD-003', school: 'Sunshine School', items: 8, total: 65000, date: '2024-01-08', status: 'confirmed' },
  { id: '4', orderId: 'ORD-004', school: 'Bright Future Academy', items: 2, total: 15000, date: '2024-01-05', status: 'pending' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return CARDLECT_COLORS.warning.main
    case 'confirmed': return CARDLECT_COLORS.info.main
    case 'shipped': return CARDLECT_COLORS.primary.darker
    case 'delivered': return CARDLECT_COLORS.success.main
    default: return CARDLECT_COLORS.primary.darker
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = mockOrders.filter(o =>
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.school.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length

  return (
    <DashboardLayout currentPage="orders" role="approved-stores">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage school orders and shipments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
              </div>
              <ShoppingCart size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">₦{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{pendingOrders}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{order.orderId}</h3>
                    <p className="text-sm text-muted-foreground">{order.school}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                {expandedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-semibold text-foreground">{order.items}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold text-foreground">₦{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-semibold text-foreground">₦{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
