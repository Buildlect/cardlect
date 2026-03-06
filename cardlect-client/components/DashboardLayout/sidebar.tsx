"use client"

import {
  LayoutDashboard,
  Users,
  Book,
  CreditCard,
  LogIn,
  BarChart3,
  LogOut,
  X,
  Menu,
  Clock,
  DollarSign,
  LayoutGrid,
  UserCheck,
  Bell,
  DoorOpen,
  FileText,
  Building2,
  Upload,
  Key,
  Settings,
  Package,
  ShoppingCart,
  Award,
  Stethoscope,
  Store,
  ClipboardList,
  Activity,
  MessageSquare,
  BookMarked,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { useAuth, UserRole } from "@/contexts/auth-context"

export interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  id: string
}

interface SidebarProps {
  open: boolean
  onToggle: () => void
  onNavigate: (href: string) => void
  currentPage: string
  isMobile?: boolean
  menuItems: MenuItem[]
  role?: UserRole
}

// Role-based default menu items
export const defaultMenuItems: Record<string, MenuItem[]> = {
  school_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: Users, label: "Students", href: "/dashboard/admin-students", id: "students" },
    { icon: Users, label: "Staff", href: "/dashboard/admin-staffs", id: "staff" },
    { icon: Book, label: "Classes", href: "/dashboard/admin-classes", id: "classes" },
    { icon: CreditCard, label: "Cards", href: "/dashboard/admin-cards", id: "cards" },
    { icon: Clock, label: "Attendance", href: "/dashboard/admin-attendance", id: "attendance" },
    { icon: LogIn, label: "Gate Logs", href: "/dashboard/admin-gate-logs", id: "gate-logs" },
    { icon: DollarSign, label: "Wallet", href: "/dashboard/admin-wallet", id: "wallet" },
    { icon: Award, label: "CBT Exams", href: "/dashboard/admin-exams", id: "exams" },
    { icon: BarChart3, label: "Reports", href: "/dashboard/admin-reports", id: "reports" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  super_admin: [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: Building2, label: "Manage Schools", href: "/dashboard/super-user-schools", id: "schools" },
    { icon: CreditCard, label: "Cards", href: "/dashboard/super-user-cards", id: "cards" },
    { icon: Award, label: "CBT Exams", href: "/dashboard/super-user-exams", id: "exams" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/super-user-analytics", id: "analytics" },
    { icon: FileText, label: "Logs", href: "/dashboard/overview", id: "logs" },
    { icon: Upload, label: "Bulk Import", href: "/dashboard/super-user-bulk-import", id: "bulk-import" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Key, label: "Manage API Keys", href: "/dashboard/super-user-api", id: "api" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  parent: [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: Award, label: "CBT Exams", href: "/dashboard/parent-exams", id: "exams" },
    { icon: Users, label: "My Children", href: "/dashboard/parent-children", id: "children" },
    { icon: Clock, label: "Activity Log", href: "/dashboard/parent-activity-log", id: "activity-log" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: FileText, label: "Reports", href: "/dashboard/parent-reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  student: [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: Award, label: "CBT Exams", href: "/dashboard/student-exams", id: "exams" },
    { icon: Book, label: "Assignments", href: "/dashboard/student-assignments", id: "assignments" },
    { icon: Award, label: "Grades", href: "/dashboard/student-grades", id: "grades" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Clock, label: "Schedule", href: "/dashboard/student-schedule", id: "schedule" },
    { icon: Users, label: "Study Groups", href: "/dashboard/student-study-groups", id: "study-groups" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  partner: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: Store, label: "My Stores", href: "/dashboard/approved-stores-stores", id: "stores" },
    { icon: ShoppingCart, label: "Orders", href: "/dashboard/approved-stores-orders", id: "orders" },
    { icon: BarChart3, label: "Partner Sales", href: "/dashboard/approved-stores-sales", id: "sales" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  staff: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
  visitor: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview", id: "dashboard" },
    { icon: MessageSquare, label: "Communication", href: "/dashboard/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications", id: "notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
  ],
}

export const staffSpecificMenuItems: Record<string, MenuItem[]> = {
  exam_officer: [
    { icon: Award, label: "Manage Exams", href: "/dashboard/admin-exams", id: "exams" },
    { icon: Book, label: "Academic Records", href: "/dashboard/admin-classes", id: "classes" },
  ],
  finance: [
    { icon: DollarSign, label: "Financials", href: "/dashboard/admin-wallet", id: "wallet" },
    { icon: FileText, label: "Invoices", href: "/dashboard/finance-invoices", id: "invoices" },
  ],
  librarian: [
    { icon: BookMarked, label: "Catalog", href: "/dashboard/librarian-catalog", id: "catalog" },
    { icon: Clock, label: "Borrowals", href: "/dashboard/librarian-borrowals", id: "borrowals" },
  ],
  security: [
    { icon: DoorOpen, label: "Gate Logs", href: "/dashboard/admin-gate-logs", id: "gate-logs" },
    { icon: Activity, label: "Security Alerts", href: "/dashboard/security-alerts", id: "alerts" },
  ],
  clinic: [
    { icon: Stethoscope, label: "Medical Records", href: "/dashboard/clinic-medical-records", id: "medical-records" },
    { icon: Activity, label: "Visits", href: "/dashboard/clinic-visits", id: "visits" },
  ],
  store: [
    { icon: Package, label: "Inventory", href: "/dashboard/store-inventory", id: "inventory" },
    { icon: ShoppingCart, label: "Sales History", href: "/dashboard/store-sales", id: "sales" },
    { icon: Users, label: "Customers", href: "/dashboard/store-customers", id: "customers" },
  ],
}


function Tooltip({ text }: { text: string }) {
  return (
    <span
      role="tooltip"
      className="
        pointer-events-none absolute left-full ml-3 top-1/2 
        -translate-y-1/2 whitespace-normal max-w-xs 
        bg-white text-gray-900 text-sm rounded border border-gray-200
        px-2 py-1 shadow-lg opacity-0 scale-95 -translate-x-2 
        transition-all duration-150 ease-out
        group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
        z-50
        dark:bg-[rgba(17,24,39,0.95)] dark:text-white dark:border-transparent
      "
    >
      <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border border-gray-200 shadow-sm dark:bg-[rgba(17,24,39,0.95)] dark:border-transparent" />
      {text}
    </span>
  )
}

export function Sidebar({
  open,
  onToggle,
  onNavigate,
  currentPage,
  isMobile = false,
  menuItems,
  role = "school_admin",
}: SidebarProps) {
  const router = useRouter()
  const { logout: authLogout } = useAuth()

  const handleLogout = () => {
    authLogout()
  }

  return (
    <>
      {/* Mobile backdrop: click to close */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300" : "h-screen"}
          ${isMobile ? (open ? "translate-x-0 w-64" : "-translate-x-full w-64") : open ? "w-64" : "w-20"}
          bg-white text-gray-700 border-r border-gray-200
          flex flex-col overflow-hidden min-h-0
          dark:bg-[#151517] dark:text-gray-200 dark:border-[#111827]
        `}
        aria-hidden={isMobile ? !open : false}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          {open && (
            <span className="text-2xl font-bold text-orange-500 tracking-tight">
              Cardlect
            </span>
          )}

          <button
            onClick={onToggle}
            className="group relative p-1 hover:bg-orange-50 rounded-lg dark:hover:bg-[#111827]"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? (
              <X className="h-5 w-5 text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />
            )}

            {/* Toggle tooltip */}
            <Tooltip text={open ? "Collapse sidebar" : "Expand sidebar"} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-2 overflow-y-auto overflow-x-hidden min-h-0">
          {menuItems.map(({ icon: Icon, label, href, id }) => {
            return (
              <Link
                key={id}
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(href)
                  if (isMobile) onToggle()
                }}
                aria-label={label}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all text-gray-700 hover:bg-orange-50
                  dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-colors text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />

                {/* Text only when expanded */}
                {open && (
                  <span className="text-sm font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {label}
                  </span>
                )}

                {/* Tooltip only when collapsed */}
                {!open && <Tooltip text={label} />}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto p-3 border-t border-gray-200 dark:border-[#111827]">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {open && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
