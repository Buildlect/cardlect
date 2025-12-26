'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="exam-officer">
      <CommunicationComponent
        currentRole="exam-officer"
        title="Exam Officer Communications"
        subtitle="Coordinate with super-user, admin, teachers, and students"
        accentColor={{ start: 'purple', end: 'indigo' }}
      />
    </DashboardLayout>
  )
}
