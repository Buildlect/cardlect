"use client"

import { Bell, Search, Menu, X, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeToggleMobile } from "@/components/theme-toggle-mobile"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import { logout } from "@/contexts/auth-context"

interface HeaderProps {
  sidebarOpen: boolean
  onMenuClick: () => void
  role?: "admin" | "security" | "super-user" | "parents" | "students" | "finance" | "store" | "teacher" | "clinic" | "approved-stores" | "exam-officer" | "librarian" | "visitor"
}

export function Header({ sidebarOpen, onMenuClick, role = "admin" }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Role display names
  const roleDisplayNames = {
    "super-user": "Super Admin",
    "admin": "School Admin",
    "security": "Security Officer",
    "finance": "Finance Manager",
    "teacher": "Teacher",
    "parents": "Parent",
    "students": "Student",
    "clinic": "Clinic Staff",
    "store": "Store Manager",
    "approved-stores": "Vendor Manager",
    "exam-officer": "Exam Officer",
    "librarian": "Librarian",
    "visitor": "Visitor",
  }

  // Role avatar initials
  const roleInitials = {
    "super-user": "SA",
    "admin": "AD",
    "security": "SC",
    "finance": "FM",
    "teacher": "TH",
    "parents": "PA",
    "students": "ST",
    "clinic": "CL",
    "store": "ST",
    "approved-stores": "VM",
    "exam-officer": "EO",
    "librarian": "LB",
    "visitor": "VI",
  }

  // Settings routes for each role
  const settingsRoutes = {
    "super-user": "/super-user/settings",
    "admin": "/admin/settings",
    "security": "/security/setting",
    "finance": "/finance/settings",
    "teacher": "/teacher/settings",
    "parents": "/parent/settings",
    "students": "/student/settings",
    "clinic": "/clinic/settings",
    "store": "/store/settings",
    "approved-stores": "/approved-stores/settings",
    "exam-officer": "/exam-officer/settings",
    "librarian": "/librarian/settings",
    "visitor": "/",
  }

  // Different placeholders based on role
  const searchPlaceholders = {
    admin: "Search students, staff...",
    security: "Search visitor, incident...",
    "super-user": "Search schools, users...",
    parents: "Search child, activities...",
    students: "Search assignments, grades...",
    finance: "Search invoices, payments...",
    store: "Search items, inventory...",
    teacher: "Search classes, students...",
    clinic: "Search students, medical...",
    "approved-stores": "Search approved stores, orders...",
    "exam-officer": "Search exams, results...",
    "librarian": "Search books, students...",
    "visitor": "Search information...",
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/logout")
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-all"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholders[role]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": CARDLECT_COLORS.primary.main } as any}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-all"
            aria-label="Search"
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          
          <div className="hidden md:flex"><ThemeToggle /></div>
          <div className="md:hidden"><ThemeToggleMobile /></div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setProfileOpen(false)
              }}
              className="relative p-2 hover:bg-secondary rounded-lg transition-all group"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} style={{ color: notificationsOpen ? CARDLECT_COLORS.primary.darker : 'inherit' }} className="transition-colors" />
              <span style={{ backgroundColor: CARDLECT_COLORS.danger.main }} className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-card border-2 rounded-lg shadow-xl z-50" style={{ borderColor: CARDLECT_COLORS.primary.darker }}>
                <div className="p-4 border-b" style={{ borderColor: CARDLECT_COLORS.primary.darker, backgroundColor: CARDLECT_COLORS.primary.darker + '10' }}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-foreground text-sm">Notifications</p>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: CARDLECT_COLORS.primary.darker, color: '#fafafa' }}>3 New</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    <div className="p-3 bg-muted/40 rounded-lg hover:bg-muted transition-all cursor-pointer border-l-4 border-l-blue-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">Welcome to Cardlect</p>
                          <p className="text-xs text-muted-foreground mt-1">Get started with your dashboard and explore features</p>
                        </div>
                        <span className="text-xs font-medium" style={{ color: CARDLECT_COLORS.info.main }}>●</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-lg hover:bg-muted transition-all cursor-pointer border-l-4 border-l-yellow-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">System Update Available</p>
                          <p className="text-xs text-muted-foreground mt-1">Updates available for your account and system</p>
                        </div>
                        <span className="text-xs font-medium" style={{ color: CARDLECT_COLORS.warning.main }}>●</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">4 hours ago</p>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-lg hover:bg-muted transition-all cursor-pointer border-l-4 border-l-green-500">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">New Message</p>
                          <p className="text-xs text-muted-foreground mt-1">You have a new message from your administrator</p>
                        </div>
                        <span className="text-xs font-medium" style={{ color: CARDLECT_COLORS.success.main }}>●</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Just now</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t" style={{ borderColor: CARDLECT_COLORS.primary.darker }}>
                  <button className="text-xs font-semibold w-full py-2 rounded transition-all" style={{ color: CARDLECT_COLORS.primary.darker, backgroundColor: CARDLECT_COLORS.primary.darker + '15' }}>
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen)
                setNotificationsOpen(false)
              }}
              style={{ backgroundColor: CARDLECT_COLORS.primary.main }}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-all text-sm"
              title={roleDisplayNames[role as keyof typeof roleDisplayNames]}
            >
              {roleInitials[role as keyof typeof roleInitials]}
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: CARDLECT_COLORS.primary.main }} className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {roleInitials[role as keyof typeof roleInitials]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm" style={{ color: CARDLECT_COLORS.primary.darker }}>{roleDisplayNames[role as keyof typeof roleDisplayNames]}</p>
                      <p className="text-xs text-muted-foreground">user@cardlect.io</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">My Profile</span>
                  </button>
                  <Link
                    href={settingsRoutes[role as keyof typeof settingsRoutes]}
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Settings size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Settings</span>
                  </Link>
                </div>

                <div className="p-3 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut size={16} style={{ color: CARDLECT_COLORS.danger.main }} />
                    <span className="text-sm" style={{ color: CARDLECT_COLORS.danger.main }}>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholders[role]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": CARDLECT_COLORS.primary.main } as any}
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
