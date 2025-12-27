'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, Package, TrendingUp } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  minStock: number
  price: number
  category: string
  lastRestocked: string
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Uniform - Size M', sku: 'UNI-M-001', quantity: 45, minStock: 20, price: 2500, category: 'Uniforms', lastRestocked: '2024-01-05' },
  { id: '2', name: 'Books - Mathematics 101', sku: 'BK-MATH-001', quantity: 8, minStock: 15, price: 3500, category: 'Books', lastRestocked: '2023-12-28' },
  { id: '3', name: 'Notebooks - Pack of 10', sku: 'NB-PK10-001', quantity: 120, minStock: 50, price: 1200, category: 'Stationery', lastRestocked: '2024-01-10' },
  { id: '4', name: 'Pens - Blue Ballpoint', sku: 'PEN-BL-001', quantity: 250, minStock: 100, price: 150, category: 'Stationery', lastRestocked: '2024-01-12' },
  { id: '5', name: 'Shoes - Size 5', sku: 'SHOE-5-001', quantity: 12, minStock: 10, price: 4000, category: 'Shoes', lastRestocked: '2024-01-02' },
]

const chartData = [
  { category: 'Uniforms', items: 45 },
  { category: 'Books', items: 8 },
  { category: 'Stationery', items: 370 },
  { category: 'Shoes', items: 12 },
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.minStock)
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  const totalItems = mockInventory.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DashboardLayout currentPage="inventory" role="store">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage store inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                <p className="text-3xl font-bold text-foreground">{totalItems}</p>
              </div>
              <Package size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Stock Value</p>
                <p className="text-3xl font-bold text-foreground">₦{(totalValue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-foreground">{lowStockItems.length}</p>
              </div>
              <AlertTriangle size={24} style={{ color: CARDLECT_COLORS.danger.main }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="items" fill={CARDLECT_COLORS.primary.darker} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="mb-8 border-l-4" style={{ borderColor: CARDLECT_COLORS.danger.main }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} style={{ color: CARDLECT_COLORS.danger.main }} />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-danger/5 rounded">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} / {item.minStock}</p>
                  </div>
                  <span style={{ color: CARDLECT_COLORS.danger.main }} className="font-bold">Reorder Now</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Items</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground">Name</th>
                  <th className="text-left py-3 text-muted-foreground">SKU</th>
                  <th className="text-left py-3 text-muted-foreground">Quantity</th>
                  <th className="text-left py-3 text-muted-foreground">Price</th>
                  <th className="text-left py-3 text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-foreground">{item.name}</td>
                    <td className="py-3 text-muted-foreground">{item.sku}</td>
                    <td className="py-3 text-foreground font-medium">{item.quantity}</td>
                    <td className="py-3 text-foreground">₦{item.price.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{
                          backgroundColor: item.quantity <= item.minStock ? CARDLECT_COLORS.danger.main : CARDLECT_COLORS.success.main
                        }}
                      >
                        {item.quantity <= item.minStock ? 'Low' : 'Okay'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
