"use client"

import {
  LayoutGrid,
  Building2,
  CreditCard,
  BarChart3,
  FileText,
  Upload,
  Key,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  onNavigate: (href: string) => void
  currentPage: string
  isMobile?: boolean
}

const menuItems: { icon: LucideIcon; label: string; href: string; id: string }[] = [
  { icon: LayoutGrid, label: "Dashboard", href: "/super-user", id: "dashboard" },
  { icon: Building2, label: "Manage Schools", href: "/super-user/schools", id: "schools" },
  { icon: CreditCard, label: "Cards", href: "/super-user/cards", id: "cards" },
  { icon: BarChart3, label: "Analytics", href: "/super-user/analytics", id: "analytics" },
  { icon: FileText, label: "Logs", href: "/super-user/logs", id: "logs" },
  { icon: Upload, label: "Bulk Import", href: "/super-user/bulk-import", id: "bulk-import" },
  { icon: Key, label: "Manage API Keys", href: "/super-user/api", id: "api" },
  { icon: Settings, label: "Settings", href: "/super-user/settings", id: "settings" },
]

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

export function Sidebar({ open, onToggle, onNavigate, currentPage, isMobile }: SidebarProps) {
  return (
    <aside
      className={`
        ${open ? "w-64" : "w-20"}
        h-screen overflow-hidden justify-between
        bg-white text-gray-700 border-r border-gray-200
        transition-all duration-300 flex flex-col mb-0
        dark:bg-[#151517] dark:text-gray-200 dark:border-[#111827]
        ${isMobile ? "fixed md:relative z-50 left-0 top-0" : ""}
      `}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {open && <span className="text-2xl font-bold text-orange-500 tracking-tight">Cardlect</span>}

        {isMobile && open && (
          <button
            onClick={onToggle}
            className="group relative p-1 hover:bg-orange-50 rounded-lg dark:hover:bg-[#111827]"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />
            <Tooltip text="Close sidebar" />
          </button>
        )}
        {!isMobile && (
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
            <Tooltip text={open ? "Collapse sidebar" : "Expand sidebar"} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
        {menuItems.map(({ icon: Icon, label, href, id }) => {
          return (
            <Link
              key={id}
              href={href}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(href)
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

      <div className="p-3 border-t border-gray-200 dark:border-[#111827]">
        <Link
          href="/logout"
          onClick={(e) => {
            e.preventDefault()
            onNavigate("/auth/logout")
          }}
          aria-label="Logout"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]"
        >
          <LogOut size={20} />
          {open && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
