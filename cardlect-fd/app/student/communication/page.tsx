'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="students">
      <CommunicationComponent
        currentRole="students"
        title="Student Communications"
        subtitle="Connect with teachers, admin, and clinic staff"
        accentColor={{ start: 'green', end: 'emerald' }}
      />
    </DashboardLayout>
  )
}
