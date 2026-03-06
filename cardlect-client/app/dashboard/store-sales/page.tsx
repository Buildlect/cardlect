'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import api from '@/lib/api-client'

interface StoreOrderRow {
  id: string
  total_amount?: number | string
  status?: string
  created_at?: string
}

export default function Page() {
  const [orders, setOrders] = useState<StoreOrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/store/orders?limit=200')
        const rows: StoreOrderRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setOrders(rows)
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load sales history')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const salesData = useMemo(() => {
    const byMonth = new Map<string, { sales: number; orders: number }>()
    orders.forEach((o) => {
      const month = o.created_at ? new Date(o.created_at).toLocaleString('en-US', { month: 'short' }) : 'N/A'
      const current = byMonth.get(month) || { sales: 0, orders: 0 }
      current.sales += Number(o.total_amount || 0)
      current.orders += 1
      byMonth.set(month, current)
    })
    return Array.from(byMonth.entries()).map(([month, v]) => ({ month, sales: v.sales, orders: v.orders }))
  }, [orders])

  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0), [orders])
  const completedOrders = useMemo(() => orders.filter((o) => String(o.status || '').toLowerCase() === 'completed').length, [orders])

  return (
    <DashboardLayout currentPage="sales" role="staff" customRole="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales</h1>
        <p className="text-muted-foreground">Manage and monitor store sales performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Total Sales</p><p className="text-3xl font-bold text-foreground">N{(totalSales / 1000).toFixed(0)}k</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Total Orders</p><p className="text-3xl font-bold text-foreground">{orders.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-1">Completed Orders</p><p className="text-3xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{completedOrders}</p></CardContent></Card>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading sales...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : salesData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sales data found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Orders by Month</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill={CARDLECT_COLORS.info.main} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
