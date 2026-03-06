'use client'

import { useProtectedRoute } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { NotificationPageTemplate } from '@/components/NotificationPageTemplate'

export default function NotificationsPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  return <NotificationPageTemplate role={user.role} />
}
