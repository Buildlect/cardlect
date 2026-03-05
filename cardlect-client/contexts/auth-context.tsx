'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import api from '@/lib/api-client'

export type UserRole =
    | 'super_admin'
    | 'school_admin'
    | 'staff'
    | 'parent'
    | 'student'
    | 'visitor'
    | 'partner'

export interface UserPermission {
    permission_key: string
    scope_type: string
    scope_id: string
}

export interface AuthUser {
    id: string
    fullName: string
    email: string
    role: UserRole
    schoolId?: string
    customRole?: string | null
    permissions: UserPermission[]
}

export let setAuthUser: (user: AuthUser | null) => void = () => { }
export let getAuthUser: () => AuthUser | null = () => null

interface AuthContextType {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    setAuthUser = setUser
    getAuthUser = () => user

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('cardlect_token')
            const storedUser = localStorage.getItem('cardlect_user')

            if (storedToken && storedUser) {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))

                // Optional: Verify token with /auth/me endpoint if it existed
                // try {
                //   const response = await api.get('/auth/me');
                //   setUser(response.data.data.user);
                // } catch (err) {
                //   logout();
                // }
            }
            setIsLoading(false)
        }

        initializeAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { user: userData, token: accessToken } = response.data.data

            setUser(userData)
            setToken(accessToken)

            localStorage.setItem('cardlect_token', accessToken)
            localStorage.setItem('cardlect_user', JSON.stringify(userData))

            router.push('/dashboard/overview')
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed')
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('cardlect_token')
        localStorage.removeItem('cardlect_user')
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function useProtectedRoute(allowedRoles?: UserRole | UserRole[], requiredCustomRole?: string) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/')
            } else if (allowedRoles) {
                const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
                if (user && !roles.includes(user.role)) {
                    router.push('/dashboard/overview')
                } else if (user?.role === 'staff' && requiredCustomRole && user?.customRole !== requiredCustomRole) {
                    router.push('/dashboard/overview')
                }
            } else if (user?.role === 'staff' && requiredCustomRole && user?.customRole !== requiredCustomRole) {
                router.push('/dashboard/overview')
            }
        }
    }, [user, isLoading, isAuthenticated, router, allowedRoles, requiredCustomRole])

    return { user, isLoading, isAuthorized: isAuthenticated }
}
