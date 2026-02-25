'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react'
import { MOCK_USERS } from '@/contexts/mock-users'
import { setAuthUser } from '@/contexts/auth-context'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

export default function PreLaunchPage() {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({})

  const handleCopyCredentials = async (user: typeof MOCK_USERS[0]) => {
    const text = `Email: ${user.email}\nPassword: ${user.password}`
    await navigator.clipboard.writeText(text)
    setCopiedId(user.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleLoginAs = (user: typeof MOCK_USERS[0]) => {
    setAuthUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      schoolName: user.schoolName,
    })

    // Redirect to appropriate dashboard
    if (user.role === 'visitor') {
      router.push('/')
    } else {
      router.push('/dashboard/overview')
    }
  }

  // Use main Cardlect primary color for all badges
  const mainColor = CARDLECT_COLORS.primary.main

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      'super-user': 'Super Admin',
      'admin': 'School Admin',
      'finance': 'Finance',
      'security': 'Security',
      'teacher': 'Teacher',
      'exam-officer': 'Exam Officer',
      'librarian': 'Librarian',
      'clinic': 'Clinic',
      'store': 'Store',
      'approved-stores': 'Vendor',
      'parents': 'Parent',
      'students': 'Student',
    }
    return labels[role] || role
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cardlect Pre-Launch</h1>
              <p className="text-sm text-muted-foreground">Test all user roles and dashboards</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Demo User Accounts</h2>
            <p className="text-foreground/70">Click any user below to instantly login and test their dashboard. All credentials are also displayed for manual testing.</p>
          </div>

          <div className="grid gap-4">
            {MOCK_USERS.map((user) => {
              const isExpanded = expandedId === user.id
              const showPass = showPassword[user.id] || false

              return (
                <div
                  key={user.id}
                  className="border border-border rounded-lg transition-all"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  {/* Main Row */}
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: mainColor }}
                          >
                            {getRoleLabel(user.role)}
                          </div>
                          {user.schoolId && user.schoolName && (
                            <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">
                              {user.schoolName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{user.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <div className="flex flex-col gap-2 md:flex-row">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : user.id)}
                          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors whitespace-nowrap"
                        >
                          {isExpanded ? 'Hide' : 'View'} Details
                        </button>
                        <button
                          onClick={() => handleLoginAs(user)}
                          className="px-4 py-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap text-white hover:opacity-90"
                          style={{ backgroundColor: mainColor }}
                        >
                          Login as {user.role === 'students' ? 'Student' : user.role === 'parents' ? 'Parent' : getRoleLabel(user.role)}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Credentials */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3">Login Credentials</h4>
                            <div className="space-y-3">
                              <div className="bg-card/50 rounded-lg p-3 border border-border">
                                <p className="text-xs text-muted-foreground mb-1">Email</p>
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm font-mono text-foreground break-all">{user.email}</code>
                                  <button
                                    onClick={() => handleCopyCredentials(user)}
                                    className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                                    title="Copy credentials"
                                  >
                                    {copiedId === user.id ? (
                                      <CheckCircle2 size={18} className="text-green-500" />
                                    ) : (
                                      <Copy size={18} className="text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="bg-card/50 rounded-lg p-3 border border-border">
                                <p className="text-xs text-muted-foreground mb-1">Password</p>
                                <div className="flex items-center justify-between gap-2">
                                  <code className="text-sm font-mono text-foreground">
                                    {showPass ? user.password : '••••••••'}
                                  </code>
                                  <button
                                    onClick={() => setShowPassword({ ...showPassword, [user.id]: !showPass })}
                                    className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                                  >
                                    {showPass ? (
                                      <EyeOff size={18} className="text-muted-foreground" />
                                    ) : (
                                      <Eye size={18} className="text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3">Additional Info</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">User ID</p>
                                <p className="text-foreground font-mono">{user.id}</p>
                              </div>
                              {user.schoolId && (
                                <div>
                                  <p className="text-muted-foreground">School ID</p>
                                  <p className="text-foreground font-mono">{user.schoolId}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground">Role</p>
                                <p className="text-foreground capitalize">{user.role}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">How to use this account:</p>
                          <ol className="text-sm text-foreground/80 space-y-1 list-decimal list-inside">
                            <li>Click the "Login" button above to instantly access this user's dashboard</li>
                            <li>Or manually copy the email and password and enter them on the login page</li>
                            <li>Test all features available for this user role</li>
                            <li>Logout when done to return to the login page</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-muted/20 border border-border rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">ℹ️ About This Page</h3>
            <p className="text-sm text-foreground/70 mb-3">
              This pre-launch page is designed for testing and demonstration purposes. It displays all available mock user accounts used during development.
            </p>
            <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
              <li>Quick login: Click "Login as [Role]" to instantly become that user</li>
              <li>Manual testing: Copy credentials to test the login form</li>
              <li>Dashboard testing: Each user has access to their role-specific dashboard</li>
              <li>Data is not persisted between sessions in the demo environment</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
