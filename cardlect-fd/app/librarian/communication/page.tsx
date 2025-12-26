'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  return (
    <DashboardLayout currentPage="communication" role="librarian">
      <CommunicationComponent
        currentRole="librarian"
        title="Librarian Communications"
        subtitle="Connect with students, teachers, and administrators"
        accentColor={{ start: 'teal', end: 'cyan' }}
      />
    </DashboardLayout>
  )
}
