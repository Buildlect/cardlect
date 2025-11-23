'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { MetricsGrid } from '@/components/SuperAdmin/metrics-grid'
import { ScanActivityChart } from '@/components/SuperAdmin/scan-activity-chart'
import { RecentAlerts } from '@/components/SuperAdmin/recent-alerts'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="dashboard" />
      
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">System Admin</h1>
              <p className="text-muted-foreground">Welcome back, You are logged in as a System admin, be cautious of your session.</p>
            </div>

            <MetricsGrid />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <ScanActivityChart />
              </div>
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
