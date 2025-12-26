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
} from "lucide-react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

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
  role?: "admin" | "security" | "super-user" | "parents" | "students" | "finance" | "store" | "teacher" | "clinic" | "approved-stores" | "exam-officer" | "librarian" | "visitor"
}

// Role-based default menu items
export const defaultMenuItems = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", id: "dashboard" },
    { icon: Users, label: "Students", href: "/admin/students", id: "students" },
    { icon: Users, label: "Staff", href: "/admin/staffs", id: "staff" },
    { icon: Book, label: "Classes", href: "/admin/classes", id: "classes" },
    { icon: CreditCard, label: "Cards", href: "/admin/cards", id: "cards" },
    { icon: Clock, label: "Attendance", href: "/admin/attendance", id: "attendance" },
    { icon: LogIn, label: "Gate Logs", href: "/admin/gate-logs", id: "gate-logs" },
    { icon: DollarSign, label: "Wallet", href: "/admin/wallet", id: "wallet" },
    { icon: BarChart3, label: "Reports", href: "/admin/reports", id: "reports" },
    { icon: MessageSquare, label: "Communication", href: "/admin/communication", id: "communication" },
  ] as MenuItem[],
  security: [
    { icon: LayoutGrid, label: "Dashboard", href: "/security", id: "dashboard" },
    { icon: UserCheck, label: "Pickup Authorization", href: "/security/pickup-authorization", id: "pickup-authorization" },
    { icon: Bell, label: "Alerts", href: "/security/alerts", id: "alerts" },
    { icon: DoorOpen, label: "Gate Logs", href: "/security/gate-logs", id: "gate-logs" },
    { icon: FileText, label: "Visitor & Incident Log", href: "/security/visitor-incident-log", id: "visitor-incident-log" },
    { icon: MessageSquare, label: "Communication", href: "/security/communication", id: "communication" },
    { icon: Settings, label: "Settings", href: "/security/setting", id: "setting" },
  ] as MenuItem[],
  "super-user": [
    { icon: LayoutGrid, label: "Dashboard", href: "/super-user", id: "dashboard" },
    { icon: Building2, label: "Manage Schools", href: "/super-user/schools", id: "schools" },
    { icon: CreditCard, label: "Cards", href: "/super-user/cards", id: "cards" },
    { icon: BarChart3, label: "Analytics", href: "/super-user/analytics", id: "analytics" },
    { icon: FileText, label: "Logs", href: "/super-user/logs", id: "logs" },
    { icon: Upload, label: "Bulk Import", href: "/super-user/bulk-import", id: "bulk-import" },
    { icon: MessageSquare, label: "Communication", href: "/super-user/communication", id: "communication" },
    { icon: Key, label: "Manage API Keys", href: "/super-user/api", id: "api" },
    { icon: Settings, label: "Settings", href: "/super-user/settings", id: "settings" },
  ] as MenuItem[],
  parents: [
    { icon: LayoutGrid, label: "Dashboard", href: "/parent", id: "dashboard" },
    { icon: Users, label: "My Children", href: "/parent/children", id: "children" },
    { icon: Clock, label: "Activity Log", href: "/parent/activity-log", id: "activity-log" },
    { icon: MessageSquare, label: "Communication", href: "/parent/communication", id: "communication" },
    { icon: Bell, label: "Notifications", href: "/parent/notifications", id: "notifications" },
    { icon: FileText, label: "Reports", href: "/parent/reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/parent/settings", id: "settings" },
  ] as MenuItem[],
  students: [
    { icon: LayoutGrid, label: "Dashboard", href: "/student", id: "dashboard" },
    { icon: Book, label: "Assignments", href: "/student/assignments", id: "assignments" },
    { icon: Award, label: "Grades", href: "/student/grades", id: "grades" },
    { icon: MessageSquare, label: "Communication", href: "/student/communication", id: "communication" },
    { icon: Clock, label: "Schedule", href: "/student/schedule", id: "schedule" },
    { icon: Users, label: "Study Groups", href: "/student/study-groups", id: "study-groups" },
    { icon: Settings, label: "Settings", href: "/student/settings", id: "settings" },
  ] as MenuItem[],
  finance: [
    { icon: LayoutGrid, label: "Dashboard", href: "/finance", id: "dashboard" },
    { icon: DollarSign, label: "Invoices", href: "/finance/invoices", id: "invoices" },
    { icon: CreditCard, label: "Payments", href: "/finance/payments", id: "payments" },
    { icon: MessageSquare, label: "Communication", href: "/finance/communication", id: "communication" },
    { icon: BarChart3, label: "Reports", href: "/finance/reports", id: "reports" },
    { icon: Users, label: "Students", href: "/finance/students", id: "students" },
    { icon: Settings, label: "Settings", href: "/finance/settings", id: "settings" },
  ] as MenuItem[],
  store: [
    { icon: LayoutGrid, label: "Dashboard", href: "/store", id: "dashboard" },
    { icon: Package, label: "Inventory", href: "/store/inventory", id: "inventory" },
    { icon: ShoppingCart, label: "Sales", href: "/store/sales", id: "sales" },
    { icon: MessageSquare, label: "Communication", href: "/store/communication", id: "communication" },
    { icon: Users, label: "Customers", href: "/store/customers", id: "customers" },
    { icon: BarChart3, label: "Reports", href: "/store/reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/store/settings", id: "settings" },
  ] as MenuItem[],
  teacher: [
    { icon: LayoutGrid, label: "Dashboard", href: "/teacher", id: "dashboard" },
    { icon: Users, label: "Classes", href: "/teacher/classes", id: "classes" },
    { icon: FileText, label: "Assignments", href: "/teacher/assignments", id: "assignments" },
    { icon: MessageSquare, label: "Communication", href: "/teacher/communication", id: "communication" },
    { icon: Award, label: "Grades", href: "/teacher/grades", id: "grades" },
    { icon: Clock, label: "Attendance", href: "/teacher/attendance", id: "attendance" },
    { icon: Settings, label: "Settings", href: "/teacher/settings", id: "settings" },
  ] as MenuItem[],
  clinic: [
    { icon: LayoutGrid, label: "Dashboard", href: "/clinic", id: "dashboard" },
    { icon: Users, label: "Students", href: "/clinic/students", id: "students" },
    { icon: MessageSquare, label: "Communication", href: "/clinic/communication", id: "communication" },
    { icon: ClipboardList, label: "Medical Records", href: "/clinic/medical-records", id: "medical-records" },
    { icon: Activity, label: "Visits", href: "/clinic/visits", id: "visits" },
    { icon: FileText, label: "Reports", href: "/clinic/reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/clinic/settings", id: "settings" },
  ] as MenuItem[],
  "approved-stores": [
    { icon: LayoutGrid, label: "Dashboard", href: "/approved-stores", id: "dashboard" },
    { icon: Store, label: "Stores", href: "/approved-stores/stores", id: "stores" },
    { icon: MessageSquare, label: "Communication", href: "/approved-stores/communication", id: "communication" },
    { icon: ShoppingCart, label: "Orders", href: "/approved-stores/orders", id: "orders" },
    { icon: BarChart3, label: "Sales", href: "/approved-stores/sales", id: "sales" },
    { icon: Users, label: "Merchants", href: "/approved-stores/merchants", id: "merchants" },
    { icon: Settings, label: "Settings", href: "/approved-stores/settings", id: "settings" },
  ] as MenuItem[],
  "exam-officer": [
    { icon: LayoutGrid, label: "Dashboard", href: "/exam-officer", id: "dashboard" },
    { icon: Award, label: "Exams", href: "/exam-officer/exams", id: "exams" },
    { icon: FileText, label: "Results", href: "/exam-officer/results", id: "results" },
    { icon: MessageSquare, label: "Communication", href: "/exam-officer/communication", id: "communication" },
    { icon: BarChart3, label: "Reports", href: "/exam-officer/reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/exam-officer/settings", id: "settings" },
  ] as MenuItem[],
  "librarian": [
    { icon: LayoutGrid, label: "Dashboard", href: "/librarian", id: "dashboard" },
    { icon: Book, label: "Books", href: "/librarian/books", id: "books" },
    { icon: Clock, label: "Borrowals", href: "/librarian/borrowals", id: "borrowals" },
    { icon: MessageSquare, label: "Communication", href: "/librarian/communication", id: "communication" },
    { icon: Users, label: "Students", href: "/librarian/students", id: "students" },
    { icon: BarChart3, label: "Reports", href: "/librarian/reports", id: "reports" },
    { icon: Settings, label: "Settings", href: "/librarian/settings", id: "settings" },
  ] as MenuItem[],
  "visitor": [
    { icon: LayoutGrid, label: "Dashboard", href: "/", id: "dashboard" },
    { icon: MessageSquare, label: "Communication", href: "/communication", id: "communication" },
    { icon: Settings, label: "Settings", href: "/settings", id: "settings" },
  ] as MenuItem[],
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
  role = "admin",
}: SidebarProps) {
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
          flex flex-col overflow-hidden
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
        <nav className="flex-1 px-3 py-3 space-y-2 overflow-y-auto overflow-x-hidden">
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
                <Icon className="h-5 w-5 transition-colors text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />

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
          <Link
            href="/logout"
            onClick={(e) => {
              e.preventDefault()
              onNavigate("/auth/logout")
              if (isMobile) onToggle()
            }}
            aria-label="Logout"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]"
          >
            <LogOut size={20} />
            {open && <span className="text-sm font-medium">Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
