"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Header } from "@/components/Security/header"
import { Sidebar } from "@/components/Security/sidebar"

interface LayoutShellProps {
  children: React.ReactNode
  currentPage?: string
}

export function LayoutShell({ children, currentPage = "Dashboard" }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Close mobile menu on resize to desktop
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Navigate and close mobile menu when applicable
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
      <div className="hidden md:block">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={(href: string) => router.push(href)}
          currentPage={currentPage}
        />
      </div>

      {/* Mobile sidebar - shows as overlay drawer */}
      {isMobile && mobileMenuOpen && (
        <>
          {mobileOverlay}
          <Sidebar
            open={true}
            onToggle={() => setMobileMenuOpen(false)}
            onNavigate={handleNavigation}
            currentPage={currentPage}
            isMobile={true}
          />
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onMenuClick={handleMobileMenuToggle} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}