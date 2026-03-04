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
    'super_admin': 'Super Admin',
    'school_admin': 'School Admin',
    'staff': 'Staff Member',
    'parent': 'Parent',
    'student': 'Student',
    'partner': 'Partner',
    'visitor': 'Visitor',
  }

  const roleInitials: Record<string, string> = {
    'super_admin': 'SA',
    'school_admin': 'AD',
    'staff': 'ST',
    'parent': 'PA',
    'student': 'SD',
    'partner': 'PR',
    'visitor': 'VI',
  }

  return (
    <SettingsPageTemplate
      role={user.role}
      roleDisplayName={roleDisplayNames[user.role] || user.role}
      roleInitials={roleInitials[user.role] || 'US'}
    />
  )
}
