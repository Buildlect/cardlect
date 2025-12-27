'use client'

import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export type UserRole = 
  | 'super-user' 
  | 'admin' 
  | 'finance' 
  | 'security' 
  | 'teacher' 
  | 'parents' 
  | 'students' 
  | 'clinic' 
  | 'store' 
  | 'approved-stores' 
  | 'exam-officer' 
  | 'librarian' 
  | 'visitor'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  schoolId?: string
  schoolName?: string
}

// Simple in-memory store (in production, We'll use session/localStorage with encryption)
let currentUser: AuthUser | null = null
let authInitialized = false

export function setAuthUser(user: AuthUser | null) {
  currentUser = user
  authInitialized = true
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('cardlect_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('cardlect_user')
    }
  }
}

export function getAuthUser(): AuthUser | null {
  if (currentUser) return currentUser
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cardlect_user')
    if (stored) {
      try {
        currentUser = JSON.parse(stored)
        return currentUser
      } catch (e) {
        console.error('Failed to parse auth user:', e)
      }
    }
  }
  
  return null
}

export function isAuthInitialized(): boolean {
  if (authInitialized) return true
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cardlect_user') !== null || authInitialized
  }
  return false
}

export function logout() {
  setAuthUser(null)
  // Navigation handled in the component
}

export function useAuth() {
  const router = useRouter()
  const user = getAuthUser()

  const login = (user: AuthUser) => {
    setAuthUser(user)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return { user, login, logout: handleLogout, isAuthenticated: !!user }
}

export function useProtectedRoute(requiredRole?: UserRole) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      const user = getAuthUser()
      
      if (!user) {
        // Not authenticated, redirect to login
        router.push('/')
        setIsLoading(false)
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Wrong role, redirect to correct dashboard
        const dashboardRoutes: Record<UserRole, string> = {
          'super-user': '/super-user',
          'admin': '/admin',
          'finance': '/finance',
          'security': '/security',
          'teacher': '/teacher',
          'parents': '/parent',
          'students': '/student',
          'clinic': '/clinic',
          'store': '/store',
          'approved-stores': '/approved-stores',
          'exam-officer': '/exam-officer',
          'librarian': '/librarian',
          'visitor': '/',
        }
        router.push(dashboardRoutes[user.role] || '/')
        setIsLoading(false)
        return
      }

      // User is authorized
      setIsAuthorized(true)
      setIsLoading(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [requiredRole, router])

  return { user: isAuthorized ? getAuthUser() : null, isLoading, isAuthorized }
}
