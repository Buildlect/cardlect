"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, AlertTriangle, Users, FileText, LogOut } from 'lucide-react'
import SecuritySidebar from './components/SecuritySidebar'
import { Header } from '@/components/SuperAdmin/header'
import { StatsCard } from './components/StatsCard'
import GateActivityChart from './components/GateActivityChart'
import RecentEventsTable from './components/RecentEventsTable'
import mock from './data/mockDashboardData'

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { alerts, gateEntries, pickupsToday, recentIncidents, gateActivity, recentEvents } = mock

  return (
    <div className="flex h-screen bg-background">
      <SecuritySidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="dashboard" />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
                <p className="text-muted-foreground">Overview of all security activities</p>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 rounded-md text-muted-foreground bg-card/40 border border-border">
                  <Bell size={18} />
                </button>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-all">
                  + Add Alert
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate__animated animate__fadeInUp">
              <StatsCard title="Active Alerts" value={alerts} icon={<AlertTriangle size={20} />} accentColor="bg-orange-500" />
              <StatsCard title="Gate Entries" value={gateEntries} icon={<FileText size={20} />} accentColor="bg-orange-600" />
              <StatsCard title="Pickups Today" value={pickupsToday} icon={<Users size={20} />} accentColor="bg-green-500" />
              <StatsCard title="Recent Incidents" value={recentIncidents} icon={<LogOut size={20} />} accentColor="bg-red-500" />
            </div>

            {/* Main content: Chart + Recent Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate__animated animate__fadeInUp">
                <h3 className="text-lg font-semibold text-foreground mb-4">Gate Activity</h3>
                <GateActivityChart data={gateActivity} />
              </div>

              <div className="rounded-2xl p-6 border border-border bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate__animated animate__fadeInUp">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Events</h3>
                <RecentEventsTable events={recentEvents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
