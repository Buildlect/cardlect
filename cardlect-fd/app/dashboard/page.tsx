'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useProtectedRoute } from '@/contexts/auth-context'

export default function DashboardHome() {
  const router = useRouter()
  const { user, isLoading } = useProtectedRoute()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to appropriate role dashboard
      const roleMap: Record<string, string> = {
        admin: '/dashboard/admin',
        security: '/dashboard/security',
        'super-user': '/dashboard/super-user',
        parents: '/dashboard/parent',
        students: '/dashboard/student',
        finance: '/dashboard/finance',
        store: '/dashboard/store',
        teacher: '/dashboard/teacher',
        clinic: '/dashboard/clinic',
        'approved-stores': '/dashboard/approved-stores',
        'exam-officer': '/dashboard/exam-officer',
        librarian: '/dashboard/librarian',
        visitor: '/dashboard',
      }

      const rolePath = roleMap[user.role] || '/dashboard/parent'
      router.push(rolePath)
    }
  }, [user, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading dashboard...</p>
    </div>
  )
}
