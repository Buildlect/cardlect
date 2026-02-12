'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Eye, Filter } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Invoice {
  id: string
  number: string
  school: string
  amount: number
  date: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
}

const mockInvoices: Invoice[] = [
  { id: '1', number: 'INV-2024-001', school: 'Cambridge Academy', amount: 45000, date: '2024-01-15', dueDate: '2024-02-15', status: 'paid' },
  { id: '2', number: 'INV-2024-002', school: 'Oxford Academy', amount: 38500, date: '2024-01-20', dueDate: '2024-02-20', status: 'pending' },
  { id: '3', number: 'INV-2024-003', school: 'Trinity Academy', amount: 42000, date: '2024-01-10', dueDate: '2024-02-10', status: 'overdue' },
  { id: '4', number: 'INV-2024-004', school: 'St. Mary\'s Secondary', amount: 35000, date: '2024-01-25', dueDate: '2024-02-25', status: 'pending' },
]

const chartData = [
  { month: 'Jan', billed: 160500, paid: 145000, pending: 15500 },
  { month: 'Feb', billed: 152000, paid: 152000, pending: 0 },
  { month: 'Mar', billed: 165000, paid: 140000, pending: 25000 },
  { month: 'Apr', billed: 158000, paid: 158000, pending: 0 },
  { month: 'May', billed: 172000, paid: 155000, pending: 17000 },
  { month: 'Jun', billed: 168000, paid: 168000, pending: 0 },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredInvoices = invoices.filter(inv =>
    (inv.school.toLowerCase().includes(searchTerm.toLowerCase()) || inv.number.includes(searchTerm)) &&
    (statusFilter === 'all' || inv.status === statusFilter)
  )

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
      case 'pending': return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20` }
      case 'overdue': return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
      default: return { color: '#6B7280', backgroundColor: '#F3F4F6' }
    }
  }

  return (
    <DashboardLayout currentPage="invoices" role="finance">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground">Manage school invoices and billing</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 transition-opacity">
            <Plus size={18} /> New Invoice
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Billed</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦{(stats.total / 1000).toFixed(0)}k</div>
              <div className="text-xs mt-2" style={{ color: CARDLECT_COLORS.success.main }}>↑ 12% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Paid</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>₦{(stats.paid / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">{((stats.paid / stats.total) * 100).toFixed(0)}% collection rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦{(stats.pending / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">{invoices.filter(i => i.status === 'pending').length} invoices</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Overdue</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.danger.main }}>₦{(stats.overdue / 1000).toFixed(0)}k</div>
              <div className="text-xs mt-2" style={{ color: CARDLECT_COLORS.danger.main }}>{invoices.filter(i => i.status === 'overdue').length} invoices</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="billed" stroke={CARDLECT_COLORS.warning.main} strokeWidth={2} />
                <Line type="monotone" dataKey="paid" stroke={CARDLECT_COLORS.success.main} strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke={CARDLECT_COLORS.info.main} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filters & Search */}
        <div className="flex gap-4 flex-wrap">
          <Input 
            placeholder="Search invoices..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="outline">
            <Filter size={18} /> More Filters
          </Button>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Invoice #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">School</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Due Date</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{invoice.number}</td>
                      <td className="py-3 px-4">{invoice.school}</td>
                      <td className="py-3 px-4 text-right font-semibold">₦{invoice.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span style={{ ...getStatusColor(invoice.status), padding: '0.75rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="p-1 hover:bg-secondary rounded">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 hover:bg-secondary rounded">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
