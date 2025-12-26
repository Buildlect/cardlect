'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function AdminCommunication() {
  return (
    <DashboardLayout currentPage="communication" role="admin">
      <CommunicationComponent
        currentRole="admin"
        title="Admin Communications"
        subtitle="Connect with super-user, security, and finance teams"
        accentColor={{ start: 'cyan', end: 'blue' }}
      />
    </DashboardLayout>
  )
}
