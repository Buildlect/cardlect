'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, TrendingUp, MessageSquare } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

const mockCustomers: Customer[] = [
  { id: '1', name: 'Chioma Okonkwo', email: 'chioma@email.com', phone: '08012345678', purchases: 12, totalSpent: 45000, lastPurchase: '2024-01-10', status: 'active' },
  { id: '2', name: 'Tunde Adebayo', email: 'tunde@email.com', phone: '08087654321', purchases: 8, totalSpent: 28000, lastPurchase: '2024-01-08', status: 'active' },
  { id: '3', name: 'Amara Obi', email: 'amara@email.com', phone: '08098765432', purchases: 5, totalSpent: 15000, lastPurchase: '2023-12-20', status: 'inactive' },
  { id: '4', name: 'Jamal Hassan', email: 'jamal@email.com', phone: '08055555555', purchases: 20, totalSpent: 95000, lastPurchase: '2024-01-12', status: 'active' },
  { id: '5', name: 'Efe Okoro', email: 'efe@email.com', phone: '08077777777', purchases: 3, totalSpent: 8000, lastPurchase: '2024-01-05', status: 'active' },
]

const chartData = [
  { month: 'Jan', sales: 12, customers: 5 },
  { month: 'Feb', sales: 15, customers: 7 },
  { month: 'Mar', sales: 18, customers: 9 },
  { month: 'Apr', sales: 22, customers: 12 },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  const filteredCustomers = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCustomers = mockCustomers.length
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <DashboardLayout currentPage="customers" role="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
        <p className="text-muted-foreground">Manage and track your customers</p>
      </div>

      {/* Stats */}
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
                <p className="text-3xl font-bold text-foreground">₦{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <MessageSquare size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer List */}
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
                    style={{ backgroundColor: customer.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }}
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
                        <p className="font-semibold text-foreground">₦{customer.totalSpent.toLocaleString()}</p>
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
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
