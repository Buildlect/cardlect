'use client'

import { useProtectedRoute, type UserRole } from '@/contexts/auth-context'
import React from 'react'

interface AuthGuardProps {
  requiredRole?: UserRole
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ requiredRole, children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthorized } = useProtectedRoute(requiredRole)

  if (isLoading) {
    return (
      fallback || (
        <div className="w-screen h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
