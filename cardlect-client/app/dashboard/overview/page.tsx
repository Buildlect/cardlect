"use client"

import DashboardLayout from "@/components/DashboardLayout/layout"
import { useProtectedRoute } from "@/contexts/auth-context"
import AdminOverview from "@/components/dashboard/overviews/AdminOverview"
import SuperUserOverview from "@/components/dashboard/overviews/SuperUserOverview"
import ParentOverview from "@/components/dashboard/overviews/ParentOverview"
import StudentOverview from "@/components/dashboard/overviews/StudentOverview"
import TeacherOverview from "@/components/dashboard/overviews/TeacherOverview"
import FinanceOverview from "@/components/dashboard/overviews/FinanceOverview"
import SecurityOverview from "@/components/dashboard/overviews/SecurityOverview"
import ClinicOverview from "@/components/dashboard/overviews/ClinicOverview"
import StoreOverview from "@/components/dashboard/overviews/StoreOverview"
import LibrarianOverview from "@/components/dashboard/overviews/LibrarianOverview"
import ExamOfficerOverview from "@/components/dashboard/overviews/ExamOfficerOverview"
import ApprovedStoresOverview from "@/components/dashboard/overviews/ApprovedStoresOverview"
import { Loader2 } from "lucide-react"

export default function OverviewPage() {
    const { isLoading, user } = useProtectedRoute()

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const renderOverview = () => {
        switch (user.role) {
            case 'super_admin':
                return <SuperUserOverview />
            case 'school_admin':
                return <AdminOverview />
            case 'staff':
                // Check for specific sub-roles in staff
                switch (user.customRole) {
                    case 'finance': return <FinanceOverview />
                    case 'store': return <StoreOverview />
                    case 'librarian': return <LibrarianOverview />
                    case 'exam_officer': return <ExamOfficerOverview />
                    case 'security': return <SecurityOverview />
                    case 'clinic': return <ClinicOverview />
                    default: return <TeacherOverview /> // Defaulting to teacher for general staff
                }
            case 'parent':
                return <ParentOverview />
            case 'student':
                return <StudentOverview />
            case 'partner':
                return <ApprovedStoresOverview />
            case 'visitor':
                return <div>Welcome to Cardlect Model School visitor portal.</div>
            default:
                return <div>Unauthorized Role: {user.role}</div>
        }
    }

    return (
        <DashboardLayout currentPage="dashboard" role={user.role}>
            {renderOverview()}
        </DashboardLayout>
    )
}
