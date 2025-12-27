'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Eye, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Payment {
  id: string
  transactionId: string
  school: string
  amount: number
  date: string
  method: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
}

const mockPayments: Payment[] = [
  { id: '1', transactionId: 'TXN-2024-001', school: 'Cambridge Academy', amount: 45000, date: '2024-01-15', method: 'Bank Transfer', status: 'completed', reference: 'REF-001' },
  { id: '2', transactionId: 'TXN-2024-002', school: 'Oxford Academy', amount: 38500, date: '2024-01-14', method: 'Card Payment', status: 'completed', reference: 'REF-002' },
  { id: '3', transactionId: 'TXN-2024-003', school: 'Trinity Academy', amount: 42000, date: '2024-01-13', method: 'Bank Transfer', status: 'pending', reference: 'REF-003' },
]

const monthlyData = [
  { month: 'Jan', processed: 145000, pending: 15500 },
  { month: 'Feb', processed: 152000, pending: 8000 },
  { month: 'Mar', processed: 168000, pending: 12000 },
  { month: 'Apr', processed: 158000, pending: 0 },
  { month: 'May', processed: 175000, pending: 5000 },
  { month: 'Jun', processed: 182000, pending: 3000 },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPayments = payments.filter(p =>
    p.school.toLowerCase().includes(searchTerm.toLowerCase()) || p.transactionId.includes(searchTerm)
  )

  const stats = {
    processed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    failed: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0),
    total: payments.length
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle style={{ color: CARDLECT_COLORS.success.main }} size={16} />
      case 'pending': return <Clock style={{ color: CARDLECT_COLORS.warning.main }} size={16} />
      case 'failed': return <DollarSign style={{ color: CARDLECT_COLORS.danger.main }} size={16} />
      default: return null
    }
  }

  return (
    <DashboardLayout currentPage="payments" role="finance">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground">Payment transaction history and status</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Processed</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>₦{(stats.processed / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">{payments.filter(p => p.status === 'completed').length} transactions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦{(stats.pending / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">{payments.filter(p => p.status === 'pending').length} in queue</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Failed</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.danger.main }}>₦{(stats.failed / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">0 transactions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>100%</div>
              <div className="text-xs text-muted-foreground mt-2">No failures</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="processed" fill={CARDLECT_COLORS.success.main} />
                <Bar dataKey="pending" fill={CARDLECT_COLORS.warning.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="flex gap-4">
          <Input 
            placeholder="Search by school or transaction ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline">
            <Download size={18} /> Export
          </Button>
        </div>

        {/* Payments Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">School</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{payment.transactionId}</td>
                      <td className="py-3 px-4">{payment.school}</td>
                      <td className="py-3 px-4 text-right font-semibold">₦{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{payment.method}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          {getStatusIcon(payment.status)}
                          <span className="text-xs font-semibold capitalize">{payment.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="p-1 hover:bg-secondary rounded">
                          <Eye size={16} />
                        </button>
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
