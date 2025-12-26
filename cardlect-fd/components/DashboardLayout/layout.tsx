"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, defaultMenuItems, type MenuItem } from "@/components/DashboardLayout/sidebar"
import { Header } from "@/components/DashboardLayout/header"
import { useProtectedRoute } from "@/contexts/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
  role?: "admin" | "security" | "super-user" | "parents" | "students" | "finance" | "store" | "teacher" | "clinic" | "approved-stores" | "exam-officer" | "librarian" | "visitor"
  menuItems?: MenuItem[]
}

export default function DashboardLayout({
  children,
  currentPage = "dashboard",
  role = "admin",
  menuItems,
}: DashboardLayoutProps) {
  const { isLoading, isAuthorized } = useProtectedRoute(role as any)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

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

  const finalMenuItems =
    menuItems ||
    defaultMenuItems[role as keyof typeof defaultMenuItems] ||
    defaultMenuItems.admin

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
          role={role}
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
            role={role}
          />
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onMenuClick={handleMobileMenuToggle} role={role} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
