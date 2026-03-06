'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, TrendingUp } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Order {
  id: string
  orderId: string
  school: string
  items: number
  total: number
  date: string
  status: string
}

interface PartnerOrderRow {
  id: string
  order_id?: string
  school_name?: string
  items_count?: number | string
  total_amount?: number | string
  created_at?: string
  status?: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return CARDLECT_COLORS.warning.main
    case 'confirmed':
    case 'processing':
      return CARDLECT_COLORS.info.main
    case 'shipped':
      return CARDLECT_COLORS.primary.darker
    case 'delivered':
    case 'completed':
      return CARDLECT_COLORS.success.main
    case 'failed':
    case 'cancelled':
      return CARDLECT_COLORS.danger.main
    default:
      return CARDLECT_COLORS.primary.darker
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/partners/orders')
        const rows: PartnerOrderRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setOrders(
          rows.map((row) => ({
            id: row.id,
            orderId: row.order_id || row.id,
            school: row.school_name || 'Unknown School',
            items: Number(row.items_count || 1),
            total: Number(row.total_amount || 0),
            date: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A',
            status: String(row.status || 'pending').toLowerCase(),
          })),
        )
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load partner orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.school.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [orders, searchQuery],
  )

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <DashboardLayout currentPage="orders" role="partner">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage school orders and transactions</p>
      </div>

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
                <p className="text-3xl font-bold text-foreground">N{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>
                {pendingOrders}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          ) : (
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
                          <p className="font-semibold text-foreground">N{order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-semibold text-foreground">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">N{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
