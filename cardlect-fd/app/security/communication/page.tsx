'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="security">
      <CommunicationComponent
        currentRole="security"
        title="Security Communications"
        subtitle="Coordinate with admin and super-user teams"
        accentColor={{ start: 'red', end: 'rose' }}
      />
    </DashboardLayout>
  )
}
