'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="teacher">
      <CommunicationComponent
        currentRole="teacher"
        title="Teacher Communications"
        subtitle="Connect with super-user, admin, parents, and students"
        accentColor={{ start: 'blue', end: 'cyan' }}
      />
    </DashboardLayout>
  )
}
