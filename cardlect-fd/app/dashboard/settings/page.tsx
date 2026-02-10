'use client'
import { useProtectedRoute } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SettingsPageTemplate } from "@/components/SettingsPageTemplate"

export default function SettingsPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  const roleDisplayNames: Record<string, string> = {
    'super-user': 'Super User',
    admin: 'School Admin',
    security: 'Security Officer',
    finance: 'Finance Manager',
    teacher: 'Teacher',
    parents: 'Parent',
    students: 'Student',
    clinic: 'Clinic Staff',
    store: 'Store Manager',
    'approved-stores': 'Store Manager',
    'exam-officer': 'Exam Officer',
    librarian: 'Librarian',
  }

  const roleInitials: Record<string, string> = {
    'super-user': 'SU',
    admin: 'AD',
    security: 'SO',
    finance: 'FM',
    teacher: 'TH',
    parents: 'PA',
    students: 'ST',
    clinic: 'CS',
    store: 'SM',
    'approved-stores': 'SM',
    'exam-officer': 'EO',
    librarian: 'LB',
  }

  return (
    <SettingsPageTemplate
      role={user.role}
      roleDisplayName={roleDisplayNames[user.role] || user.role}
      roleInitials={roleInitials[user.role] || 'US'}
    />
  )
}
