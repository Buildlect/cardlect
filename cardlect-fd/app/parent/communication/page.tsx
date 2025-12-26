'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="parents">
      <CommunicationComponent
        currentRole="parents"
        title="Parent Communications"
        subtitle="Connect with teachers, admin, and finance teams"
        accentColor={{ start: 'pink', end: 'rose' }}
      />
    </DashboardLayout>
  )
}
