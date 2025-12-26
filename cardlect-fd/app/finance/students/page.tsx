'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface StudentWallet {
  id: string
  name: string
  admissionNo: string
  school: string
  balance: number
  transactions: number
  lastTransaction: string
  status: 'active' | 'low-balance' | 'inactive'
}

const mockStudents: StudentWallet[] = [
  { id: '1', name: 'Chioma Okonkwo', admissionNo: 'ADM001', school: 'Cambridge Academy', balance: 12500, transactions: 24, lastTransaction: '2024-01-15', status: 'active' },
  { id: '2', name: 'Tunde Adebayo', admissionNo: 'ADM002', school: 'Cambridge Academy', balance: 2500, transactions: 8, lastTransaction: '2024-01-10', status: 'low-balance' },
  { id: '3', name: 'Sarah Johnson', admissionNo: 'ADM003', school: 'Oxford Academy', balance: 18000, transactions: 32, lastTransaction: '2024-01-14', status: 'active' },
  { id: '4', name: 'Michael Chen', admissionNo: 'ADM004', school: 'Trinity Academy', balance: 5000, transactions: 12, lastTransaction: '2024-01-05', status: 'low-balance' },
]

const statusData = [
  { name: 'Active', value: 2 },
  { name: 'Low Balance', value: 2 },
  { name: 'Inactive', value: 0 },
]

const COLORS = ['#4CAF50', '#FFC107', '#F44336']

export default function StudentsWalletPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admissionNo.includes(searchTerm) ||
    s.school.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalWallets: students.length,
    totalBalance: students.reduce((sum, s) => sum + s.balance, 0),
    avgBalance: students.reduce((sum, s) => sum + s.balance, 0) / students.length,
    lowBalance: students.filter(s => s.status === 'low-balance').length,
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'low-balance': return 'text-yellow-600 bg-yellow-50'
      case 'inactive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <DashboardLayout currentPage="students" role="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Wallets</h1>
          <p className="text-muted-foreground">Monitor student wallet balances and transaction history</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Active Wallets</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.totalWallets}</div>
              <div className="text-xs text-muted-foreground mt-2">Students with active wallets</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦{(stats.totalBalance / 1000).toFixed(0)}k</div>
              <div className="text-xs text-muted-foreground mt-2">Across all students</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg Balance</div>
              <div className="text-2xl font-bold">₦{(stats.avgBalance / 1000).toFixed(1)}k</div>
              <div className="text-xs text-muted-foreground mt-2">Per student</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Low Balance</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.lowBalance}</div>
              <div className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> Needs alert
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Balance Range Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { range: '₦0-5k', count: 1 },
                  { range: '₦5k-10k', count: 1 },
                  { range: '₦10k+', count: 2 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={CARDLECT_COLORS.warning.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search student..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Student Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Admission #</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">School</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Balance</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Transactions</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{student.admissionNo}</td>
                      <td className="py-3 px-4 text-sm">{student.school}</td>
                      <td className="py-3 px-4 text-right font-semibold">₦{student.balance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">{student.transactions}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status === 'low-balance' ? 'Low Balance' : student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
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
