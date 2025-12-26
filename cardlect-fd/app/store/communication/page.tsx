'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="store">
      <CommunicationComponent
        currentRole="store"
        title="Store Communications"
        subtitle="Connect with super-user and finance teams"
        accentColor={{ start: 'orange', end: 'amber' }}
      />
    </DashboardLayout>
  )
}
