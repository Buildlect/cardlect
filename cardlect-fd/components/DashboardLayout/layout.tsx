"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, defaultMenuItems, type MenuItem } from "@/components/DashboardLayout/sidebar"
import { Header } from "@/components/DashboardLayout/header"
import { useProtectedRoute, getAuthUser, type UserRole } from "@/contexts/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
  role?: UserRole
  menuItems?: MenuItem[]
}

export default function DashboardLayout({
  children,
  currentPage = "dashboard",
  role,
  menuItems,
}: DashboardLayoutProps) {
  const { isLoading, isAuthorized, user } = useProtectedRoute(role as any)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  
  // Determine effective role: use authenticated user's role if available, otherwise use prop
  const effectiveRole = (user?.role || role || "admin") as UserRole

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  // Build a flat list of all available menu items (flatten nested dashboard hrefs)
  const flattenHref = (href: string) => {
    if (!href.startsWith('/dashboard')) return href
    const tail = href.replace(/^\/dashboard\/?/, '')
    if (!tail) return '/dashboard'
    const parts = tail.split('/').filter(Boolean)
    const fixed = parts.filter(p => !p.startsWith('['))
    const dynamics = parts.filter(p => p.startsWith('['))
    return '/dashboard/' + (fixed.join('-') || '') + (dynamics.length ? '/' + dynamics.join('/') : '')
  }

  const allItems: MenuItem[] = []
  Object.values(defaultMenuItems).forEach((arr) => {
    arr.forEach((it) => {
      const flatHref = flattenHref(it.href)
      if (!allItems.find(a => a.href === flatHref)) {
        allItems.push({ ...it, href: flatHref })
      }
    })
  })

  // If the authenticated user has explicit allowedPages, filter the global list by it.
  const finalMenuItems =
    menuItems ||
    (user && (user as any).allowedPages
      ? allItems.filter((it) => (user as any).allowedPages.includes(it.href))
      : defaultMenuItems[effectiveRole as keyof typeof defaultMenuItems] || defaultMenuItems.admin)

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleNavigation = (href: string) => {
    if (isMobile) {
      setMobileMenuOpen(false)
    }
    router.push(href)
  }

  const mobileOverlay = mobileMenuOpen && isMobile && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={() => setMobileMenuOpen(false)}
      aria-hidden="true"
    />
  )

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex h-screen">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={(href: string) => router.push(href)}
          currentPage={currentPage}
          menuItems={finalMenuItems}
          role={effectiveRole}
        />
      </div>

      {isMobile && mobileMenuOpen && (
        <>
          {mobileOverlay}
          <Sidebar
            open={true}
            onToggle={() => setMobileMenuOpen(false)}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            isMobile={true}
            menuItems={finalMenuItems}
            role={effectiveRole}
          />
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onMenuClick={handleMobileMenuToggle} role={effectiveRole} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
