'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 160500, expected: 165000 },
  { month: 'Feb', revenue: 152000, expected: 160000 },
  { month: 'Mar', revenue: 165000, expected: 165000 },
  { month: 'Apr', revenue: 158000, expected: 160000 },
  { month: 'May', revenue: 172000, expected: 170000 },
  { month: 'Jun', revenue: 168000, expected: 165000 },
]

const reports = [
  { id: '1', name: 'Monthly Revenue Report', period: 'June 2024', type: 'Revenue', schools: 45, revenue: 2850000 },
  { id: '2', name: 'Payment Collection Analysis', period: 'Q2 2024', type: 'Collections', schools: 45, revenue: 8500000 },
  { id: '3', name: 'School Performance Dashboard', period: 'June 2024', type: 'Performance', schools: 45, revenue: 2180500 },
  { id: '4', name: 'Wallet Usage Summary', period: 'June 2024', type: 'Wallet', schools: 45, revenue: 1250000 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')

  return (
    <DashboardLayout currentPage="reports" role="finance">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground">Comprehensive financial analytics and reports</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 transition-opacity">
            <Download size={18} /> Export All
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {['1month', '3months', '6months', '1year'].map((period) => (
            <Button 
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === '1month' && 'Last 30 Days'}
              {period === '3months' && 'Last 3 Months'}
              {period === '6months' && 'Last 6 Months'}
              {period === '1year' && 'Last Year'}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦968.5M</div>
              <div className="text-xs mt-2" style={{ color: CARDLECT_COLORS.success.main }}>↑ 8.5% vs last period</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg per School</div>
              <div className="text-2xl font-bold">₦21.5M</div>
              <div className="text-xs text-muted-foreground mt-2">Across 45 schools</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Collection Rate</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>94.2%</div>
              <div className="text-xs text-muted-foreground mt-2">↑ 2.1% improvement</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Outstanding</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>₦57.3M</div>
              <div className="text-xs mt-2" style={{ color: CARDLECT_COLORS.warning.main }}>Requires follow-up</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CARDLECT_COLORS.warning.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CARDLECT_COLORS.warning.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke={CARDLECT_COLORS.warning.main} fillOpacity={1} fill="url(#colorRevenue)" />
                <Line type="monotone" dataKey="expected" stroke="#999" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <FileText className="text-muted-foreground mt-1" size={24} />
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.period}</p>
                        <p className="text-xs text-muted-foreground mt-1">{report.schools} schools • ₦{(report.revenue/1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
