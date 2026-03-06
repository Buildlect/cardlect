'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp } from 'lucide-react'
import api from '@/lib/api-client'

interface PartnerOrderRow {
  id: string
  total_amount?: number | string
  created_at?: string
  school_name?: string
}

interface SalesPoint {
  month: string
  sales: number
  customers: number
  items: number
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState<SalesPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/partners/orders?limit=200')
        const rows: PartnerOrderRow[] = Array.isArray(res.data?.data) ? res.data.data : []

        const byMonth = new Map<string, { sales: number; schools: Set<string>; items: number }>()
        rows.forEach((row) => {
          const month = row.created_at
            ? new Date(row.created_at).toLocaleString('en-US', { month: 'short' })
            : 'N/A'
          const current = byMonth.get(month) || { sales: 0, schools: new Set<string>(), items: 0 }
          current.sales += Number(row.total_amount || 0)
          current.items += 1
          if (row.school_name) current.schools.add(row.school_name)
          byMonth.set(month, current)
        })

        const normalized = Array.from(byMonth.entries()).map(([month, v]) => ({
          month,
          sales: v.sales,
          customers: v.schools.size,
          items: v.items,
        }))

        setSalesData(normalized)
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load partner sales')
        setSalesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  const totalSales = useMemo(() => salesData.reduce((sum, d) => sum + d.sales, 0), [salesData])
  const totalCustomers = useMemo(() => salesData.reduce((sum, d) => sum + d.customers, 0), [salesData])

  return (
    <DashboardLayout currentPage="sales" role="partner">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Overview</h1>
        <p className="text-muted-foreground">Track your store sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-foreground">N{(totalSales / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-foreground">{totalCustomers}</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg Monthly Sale</p>
              <p className="text-3xl font-bold text-foreground">N{salesData.length ? Math.round(totalSales / salesData.length / 1000) : 0}k</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading sales...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : salesData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sales data available.</p>
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
                <CardTitle>Orders Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="items" fill={CARDLECT_COLORS.primary.darker} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customers by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="customers" fill={CARDLECT_COLORS.success.main} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
