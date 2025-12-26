'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"

export default function Page() {
  return (
    <DashboardLayout currentPage="medical-records" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Medical Records</h1>
        <p className="text-muted-foreground">Manage your medical records.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg"> Medical Records</div>
          <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
