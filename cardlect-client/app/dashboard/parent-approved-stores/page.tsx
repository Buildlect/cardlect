"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Loader2, Store, Package, AlertCircle } from "lucide-react"
import api from "@/lib/api-client"

interface ProductRow {
  id: string
  name: string
  category?: string
  price?: number
  stock_qty?: number
}

export default function ParentApprovedStoresPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [accessError, setAccessError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get("/store/products")
        const rows: ProductRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setProducts(rows)
        setAccessError(null)
      } catch (error: any) {
        if (error?.response?.status === 403) {
          setAccessError("Store catalog is restricted for this role.")
        } else {
          setAccessError("Unable to load store catalog right now.")
        }
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    const categories = new Set(products.map((p) => p.category || "General"))
    const inStock = products.filter((p) => Number(p.stock_qty || 0) > 0).length
    const avgPrice =
      products.length > 0
        ? Math.round(products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length)
        : 0

    return {
      totalProducts: products.length,
      categories: categories.size,
      inStock,
      avgPrice,
    }
  }, [products])

  if (loading) {
    return (
      <DashboardLayout currentPage="approved-stores" role="parent">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="approved-stores" role="parent">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Approved Stores</h1>
          <p className="text-muted-foreground">Live catalog feed from store API.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Products</p><p className="text-3xl font-black mt-2">{stats.totalProducts}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Categories</p><p className="text-3xl font-black mt-2">{stats.categories}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">In Stock</p><p className="text-3xl font-black mt-2">{stats.inStock}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Avg Price</p><p className="text-3xl font-black mt-2">N{stats.avgPrice.toLocaleString()}</p></div>
        </div>

        {accessError && (
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{accessError}</span>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Catalog</h2>
          {products.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8">No products available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 border border-border rounded-xl bg-background/40">
                  <div className="flex items-center gap-2 text-primary mb-2"><Store size={14} /><span className="text-xs font-semibold">{p.category || "General"}</span></div>
                  <div className="text-sm font-semibold text-foreground">{p.name}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">N{Number(p.price || 0).toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1"><Package size={12} /> {Number(p.stock_qty || 0)} in stock</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
