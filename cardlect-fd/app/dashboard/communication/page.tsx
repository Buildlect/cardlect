'use client'
import { useProtectedRoute } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  // Map role display names
  const roleNames: Record<string, string> = {
    admin: 'Admin Communications',
    'super-user': 'Super User Communications',
    security: 'Security Communications',
    finance: 'Finance Communications',
    teacher: 'Teacher Communications',
    parents: 'Parent Communications',
    students: 'Student Communications',
    teacher: 'Teacher Communications',
    clinic: 'Clinic Communications',
    store: 'Store Communications',
    'approved-stores': 'Store Communications',
    'exam-officer': 'Exam Officer Communications',
    librarian: 'Librarian Communications',
  }

  const roleSubtitles: Record<string, string> = {
    admin: 'Connect with super-user, security, and finance teams',
    'super-user': 'Connect with all system users and administrators',
    security: 'Coordinate with admin and super-user teams',
    finance: 'Connect with admin, super-user, and parents',
    teacher: 'Connect with super-user, admin, parents, and students',
    parents: 'Connect with teachers, admin, and finance teams',
    students: 'Connect with teachers and admin',
    clinic: 'Connect with admin, super-user, parents, and students',
    store: 'Connect with super-user and finance teams',
    'approved-stores': 'Connect with super-user, finance, and store partners',
    'exam-officer': 'Coordinate with super-user, admin, teachers, and students',
    librarian: 'Connect with students, teachers, and administrators',
  }

  return (
    <DashboardLayout currentPage="communication" role={user.role}>
      <CommunicationComponent
        currentRole={user.role}
        title={roleNames[user.role] || 'Communications'}
        subtitle={roleSubtitles[user.role] || 'Connect and collaborate with team members'}
        accentColor={{ start: 'orange', end: 'amber' }}
      />
    </DashboardLayout>
  )
}
