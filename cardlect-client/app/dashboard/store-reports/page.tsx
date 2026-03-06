'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'
import api from '@/lib/api-client'

interface StoreOrderRow {
  id: string
  total_amount?: number | string
  status?: string
  created_at?: string
}

interface ProductRow {
  id: string
  category?: string
  price?: number | string
}

export default function StoreReportsPage() {
  const [orders, setOrders] = useState<StoreOrderRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const [orderRes, productRes] = await Promise.all([
          api.get('/store/orders?limit=300'),
          api.get('/store/products?limit=500'),
        ])
        const orderRows: StoreOrderRow[] = Array.isArray(orderRes.data?.data) ? orderRes.data.data : []
        const productRows: ProductRow[] = Array.isArray(productRes.data?.data) ? productRes.data.data : []
        setOrders(orderRows)
        setProducts(productRows)
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load reports')
        setOrders([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const salesData = useMemo(() => {
    const byMonth = new Map<string, { sales: number; orders: number; customers: number }>()
    orders.forEach((o) => {
      const month = o.created_at ? new Date(o.created_at).toLocaleString('en-US', { month: 'short' }) : 'N/A'
      const current = byMonth.get(month) || { sales: 0, orders: 0, customers: 0 }
      current.sales += Number(o.total_amount || 0)
      current.orders += 1
      current.customers += 1
      byMonth.set(month, current)
    })
    return Array.from(byMonth.entries()).map(([month, v]) => ({ month, sales: v.sales, orders: v.orders, customers: v.customers }))
  }, [orders])

  const categoryData = useMemo(() => {
    const byCategory = new Map<string, number>()
    products.forEach((p) => {
      const category = p.category || 'uncategorized'
      const current = byCategory.get(category) || 0
      byCategory.set(category, current + Number(p.price || 0))
    })
    const palette = [CARDLECT_COLORS.primary.darker, CARDLECT_COLORS.success.main, CARDLECT_COLORS.warning.main, CARDLECT_COLORS.info.main, CARDLECT_COLORS.accent.main]
    return Array.from(byCategory.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
  }, [products])

  const totalSales = useMemo(() => salesData.reduce((sum, d) => sum + d.sales, 0), [salesData])
  const totalOrders = useMemo(() => salesData.reduce((sum, d) => sum + d.orders, 0), [salesData])
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0

  return (
    <DashboardLayout currentPage="reports" role="staff" customRole="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Reports</h1>
        <p className="text-muted-foreground">Analyze sales performance and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-foreground">N{(totalSales / 1000).toFixed(0)}k</p>
              </div>
              <DollarSign size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
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
                <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-foreground">N{avgOrderValue.toLocaleString()}</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reports...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : salesData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No report data available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={{ r: 5 }} name="Sales (N)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No category data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name }) => `${name}`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="orders" fill={CARDLECT_COLORS.primary.darker} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
