'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="super-user">
      <CommunicationComponent
        currentRole="super-user"
        title="Super User Communications"
        subtitle="Connect with all system users and administrators"
        accentColor={{ start: 'orange', end: 'amber' }}
      />
    </DashboardLayout>
  )
}
