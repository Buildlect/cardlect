'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp } from 'lucide-react'

const salesData = [
  { month: 'Jan', sales: 150000, customers: 25, items: 120 },
  { month: 'Feb', sales: 185000, customers: 32, items: 145 },
  { month: 'Mar', sales: 165000, customers: 28, items: 135 },
  { month: 'Apr', sales: 220000, customers: 42, items: 180 },
]

export default function SalesPage() {
  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0)
  const totalCustomers = salesData.reduce((sum, d) => sum + d.customers, 0)

  return (
    <DashboardLayout currentPage="sales" role="approved-stores">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Overview</h1>
        <p className="text-muted-foreground">Track your store sales performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-foreground">₦{(totalSales / 1000000).toFixed(1)}M</p>
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
              <p className="text-3xl font-bold text-foreground">₦{Math.round(totalSales / 4 / 1000)}k</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
                <Line type="monotone" dataKey="sales" stroke={CARDLECT_COLORS.primary.darker} strokeWidth={2} dot={{ r: 5 }} name="Sales (₦)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items Sold</CardTitle>
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

      {/* Customers Chart */}
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
    </DashboardLayout>
  )
}
