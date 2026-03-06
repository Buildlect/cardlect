'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, TrendingUp, MessageSquare } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  purchases: number
  totalSpent: number
  lastPurchase: string
  status: 'active' | 'inactive'
}

interface StoreCustomerRow {
  id: string
  name?: string
  email?: string
  phone?: string
  purchases?: number | string
  total_spent?: number | string
  last_purchase_at?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/store/customers')
        const rows: StoreCustomerRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setCustomers(
          rows.map((row) => ({
            id: row.id,
            name: row.name || 'Unknown Customer',
            email: row.email || 'N/A',
            phone: row.phone || 'N/A',
            purchases: Number(row.purchases || 0),
            totalSpent: Number(row.total_spent || 0),
            lastPurchase: row.last_purchase_at ? new Date(row.last_purchase_at).toLocaleDateString() : 'N/A',
            status: Number(row.purchases || 0) > 0 ? 'active' : 'inactive',
          })),
        )
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load customers')
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [customers, searchQuery],
  )

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  const chartData = useMemo(
    () =>
      customers
        .slice()
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 8)
        .map((c, idx) => ({ label: `C${idx + 1}`, spent: c.totalSpent })),
    [customers],
  )

  return (
    <DashboardLayout currentPage="customers" role="staff">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
        <p className="text-muted-foreground">Manage and track your customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Customers</p>
                <p className="text-3xl font-bold text-foreground">{totalCustomers}</p>
              </div>
              <Users size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active</p>
                <p className="text-3xl font-bold text-foreground">{activeCustomers}</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.success.main }} />
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
              <MessageSquare size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Customer Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="spent" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading customers...</p>
          ) : errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No customers found.</p>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                  className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{
                        backgroundColor:
                          customer.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main,
                      }}
                    >
                      {customer.status}
                    </span>
                  </div>

                  {expandedCustomer === customer.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-semibold text-foreground">{customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Purchases</p>
                          <p className="font-semibold text-foreground">{customer.purchases}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                          <p className="font-semibold text-foreground">N{customer.totalSpent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Purchase</p>
                          <p className="font-semibold text-foreground">{customer.lastPurchase}</p>
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
