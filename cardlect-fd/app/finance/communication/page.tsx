'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="finance">
      <CommunicationComponent
        currentRole="finance"
        title="Finance Communications"
        subtitle="Connect with admin, super-user, and parents"
        accentColor={{ start: 'amber', end: 'yellow' }}
      />
    </DashboardLayout>
  )
}
