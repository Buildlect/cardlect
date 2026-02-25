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
            case 'super-user':
                return <SuperUserOverview />
            case 'admin':
                return <AdminOverview />
            case 'finance':
                return <FinanceOverview />
            case 'security':
                return <SecurityOverview />
            case 'teacher':
                return <TeacherOverview />
            case 'parents':
                return <ParentOverview />
            case 'students':
                return <StudentOverview />
            case 'clinic':
                return <ClinicOverview />
            case 'store':
                return <StoreOverview />
            case 'approved-stores':
                return <ApprovedStoresOverview />
            case 'exam-officer':
                return <ExamOfficerOverview />
            case 'librarian':
                return <LibrarianOverview />
            default:
                return <div>Unauthorized Role</div>
        }
    }

    return (
        <DashboardLayout currentPage="dashboard" role={user.role}>
            {renderOverview()}
        </DashboardLayout>
    )
}
