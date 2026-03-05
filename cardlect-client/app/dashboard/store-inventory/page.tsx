'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, Package, TrendingUp, Loader2, Plus } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '@/lib/api-client'
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  price: string
  category: string
  stock_quantity: number
  min_stock_level: number
  description: string
  status: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/store/products')
        setProducts(response.data.data)
      } catch (err) {
        console.error('Failed to fetch store products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredItems = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const lowStockItems = products.filter(item => item.stock_quantity <= item.min_stock_level)
  const totalValue = products.reduce((sum, item) => sum + (item.stock_quantity * parseFloat(item.price)), 0)
  const totalItemsCount = products.reduce((sum, item) => sum + item.stock_quantity, 0)

  // Chart data Preparation
  const categoryGroups = products.reduce((acc: any, item: Product) => {
    const cat = item.category || 'Uncategorized'
    acc[cat] = (acc[cat] || 0) + item.stock_quantity
    return acc
  }, {})

  const chartData = Object.keys(categoryGroups).map(cat => ({
    category: cat,
    items: categoryGroups[cat]
  }))

  return (
    <DashboardLayout currentPage="inventory" role="staff" customRole="store">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage school shop stock levels.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-darker text-white rounded-xl py-6 flex items-center gap-2">
          <Plus size={20} /> Add New Product
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Total In-Stock</p>
                  <p className="text-3xl font-extrabold text-foreground">{totalItemsCount}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Package size={24} />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Estimated Value</p>
                  <p className="text-3xl font-extrabold text-foreground">₦{totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Low Stock Alerts</p>
                  <p className="text-3xl font-extrabold text-foreground">{lowStockItems.length}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Stock Distribution by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="items" fill={CARDLECT_COLORS.primary.darker} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm overflow-hidden">
              <h3 className="text-lg font-bold text-foreground mb-4">Critical Alerts</h3>
              <div className="space-y-4">
                {lowStockItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">All stock levels are optimal.</p>
                ) : (
                  lowStockItems.slice(0, 5).map(item => (
                    <div key={item.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-red-400 font-medium">Quantity Left: {item.stock_quantity}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Stock Registry</h2>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  placeholder="Filter by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Product</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-center">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map(item => {
                    const isLow = item.stock_quantity <= item.min_stock_level
                    return (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{item.category || 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm font-bold ${isLow ? 'text-red-500' : 'text-foreground'}`}>
                            {item.stock_quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground">₦{parseFloat(item.price).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isLow ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                            }`}>
                            {isLow ? 'Low Stock' : 'Stable'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No matching products found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
