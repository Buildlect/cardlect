'use client'

import { SettingsPageTemplate } from "@/components/SettingsPageTemplate"

export default function AdminSettingsPage() {
  return (
    <SettingsPageTemplate
      role="admin"
      roleDisplayName="School Admin"
      roleInitials="AD"
    />
  )
}
