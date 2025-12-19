"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
        {/* Auth Header with Theme Toggle */}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="flex items-center gap-0 sm:gap-3">
            <div>
              <Image
                src="/cardlet-logo.png"
                alt="Cardlet Logo"
                width={64}
                height={64}
                className="w-12 h-12"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Cardlect</h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-foreground">Cardlect</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {/* Auth Content */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-2xl">{children}</div>
        </div>

        {/* Footer */}
        <div className="text-center py-3 sm:py-4 border-t border-border/50 text-xs sm:text-xs text-muted-foreground px-4">
          <p>© 2025 Cardlect. All rights reserved.</p>
        </div>
      </div>
    </ThemeProvider>
  )
}
