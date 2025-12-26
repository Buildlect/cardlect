'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="clinic">
      <CommunicationComponent
        currentRole="clinic"
        title="Clinic Communications"
        subtitle="Connect with admin, super-user, parents, and students"
        accentColor={{ start: 'red', end: 'rose' }}
      />
    </DashboardLayout>
  )
}
