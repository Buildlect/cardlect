'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'

const salesData = [
  { month: 'Jan', sales: 25000, orders: 45, customers: 12 },
  { month: 'Feb', sales: 32000, orders: 58, customers: 18 },
  { month: 'Mar', sales: 28000, orders: 52, customers: 15 },
  { month: 'Apr', sales: 45000, orders: 72, customers: 25 },
  { month: 'May', sales: 52000, orders: 85, customers: 32 },
]

const categoryData = [
  { name: 'Uniforms', value: 120000, color: CARDLECT_COLORS.primary.darker },
  { name: 'Books', value: 85000, color: CARDLECT_COLORS.success.main },
  { name: 'Stationery', value: 45000, color: CARDLECT_COLORS.warning.main },
  { name: 'Shoes', value: 65000, color: CARDLECT_COLORS.info.main },
]

export default function StoreReportsPage() {
  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0)
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0)
  const avgOrderValue = Math.round(totalSales / totalOrders)

  return (
    <DashboardLayout currentPage="reports" role="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sales Reports</h1>
        <p className="text-muted-foreground">Analyze sales performance and trends</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-foreground">₦{(totalSales / 1000).toFixed(0)}k</p>
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
                <p className="text-3xl font-bold text-foreground">₦{avgOrderValue.toLocaleString()}</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
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
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₦${(value / 1000).toFixed(0)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart */}
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
    </DashboardLayout>
  )
}
