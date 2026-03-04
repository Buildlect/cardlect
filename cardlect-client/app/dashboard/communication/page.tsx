"use client"

import { useProtectedRoute } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"
import { Loader2 } from "lucide-react"

export default function CommunicationPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace("/auth/login")
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading || !user) {
    return (
      <DashboardLayout currentPage="communication" role="school_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  const roleConfigs: Record<string, { title: string; subtitle: string }> = {
    school_admin: {
      title: "Administrative Dispatch",
      subtitle: "Coordinate institutional operations with staff, security, and vendors."
    },
    super_admin: {
      title: "Global Command",
      subtitle: "Monitor all school nodes and system-level communications."
    },
    staff: {
      title: "Staff Communication",
      subtitle: "Collaborate with administration and manage student inquiries."
    },
    security_officer: {
      title: "Tactical Channel",
      subtitle: "Real-time gate coordination and incident reporting."
    },
    parent: {
      title: "Parent Portal",
      subtitle: "Connect with teachers and school administration regarding your child."
    },
    student: {
      title: "Academic Exchange",
      subtitle: "Connect with instructors and group colleagues."
    },
    store_partner: {
      title: "Partner Liaison",
      subtitle: "Coordinate inventory and financial settlement with school finance."
    }
  }

  const config = roleConfigs[user.role] || {
    title: "Secure Communication",
    subtitle: "End-to-end encrypted institutional messaging."
  }

  return (
    <DashboardLayout currentPage="communication" role={user.role}>
      <CommunicationComponent
        currentRole={user.role}
        title={config.title}
        subtitle={config.subtitle}
      />
    </DashboardLayout>
  )
}
