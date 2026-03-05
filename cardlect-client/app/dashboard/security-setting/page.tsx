'use client'

import { SettingsPageTemplate } from "@/components/SettingsPageTemplate"

export default function SecuritySettingsPage() {
  return (
    <SettingsPageTemplate
      role="staff"
      roleDisplayName="Security Officer"
      roleInitials="SO"
    />
  )
}
