'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"

export default function Page() {
  return (
    <DashboardLayout currentPage="students" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Students</h1>
        <p className="text-muted-foreground">Manage your students.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg"> Students</div>
          <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
