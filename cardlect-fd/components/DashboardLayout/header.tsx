"use client"

import { Bell, Search, Menu, X, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeToggleMobile } from "@/components/theme-toggle-mobile"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"

interface HeaderProps {
  sidebarOpen: boolean
  onMenuClick: () => void
  role?: "admin" | "security" | "super-user" | "parents" | "students" | "finance" | "store" | "teacher" | "clinic" | "approved-stores" | "exam-officer" | "librarian" | "visitor"
}

export function Header({ sidebarOpen, onMenuClick, role = "admin" }: HeaderProps) {
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
              className="relative p-2 hover:bg-secondary rounded-lg transition-all"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span style={{ backgroundColor: CARDLECT_COLORS.danger.main }} className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-foreground text-sm">Notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-foreground">Welcome to Cardlect</p>
                      <p className="text-xs text-muted-foreground mt-1">Get started with your dashboard</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-foreground">System Update</p>
                      <p className="text-xs text-muted-foreground mt-1">Updates available for your account</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-foreground">New Message</p>
                      <p className="text-xs text-muted-foreground mt-1">You have a new message</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border text-center">
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    View all notifications
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
                      <p className="font-semibold text-foreground text-sm">{roleDisplayNames[role as keyof typeof roleDisplayNames]}</p>
                      <p className="text-xs text-muted-foreground">Cardlect Dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left">
                    <Settings size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">Settings</span>
                  </button>
                </div>

                <div className="p-3 border-t border-border">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-destructive/10 transition-colors text-left">
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
