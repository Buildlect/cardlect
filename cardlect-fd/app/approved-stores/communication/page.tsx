'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="approved-stores">
      <CommunicationComponent
        currentRole="approved-stores"
        title="Store Communications"
        subtitle="Connect with super-user, finance, and store partners"
        accentColor={{ start: 'amber', end: 'yellow' }}
      />
    </DashboardLayout>
  )
}
