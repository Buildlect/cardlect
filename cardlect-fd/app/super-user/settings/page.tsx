'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutShell } from "@/components/SuperAdmin/layout.shell"
import { useTheme } from '@/components/theme-provider'
import Link from 'next/link'
import { Lock, Bell, Globe, Shield, LogOut, Save, Sun, Moon } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [twoFaEnabled, setTwoFaEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackIntegration, setSlackIntegration] = useState(false)
  const [email, setEmail] = useState('admin@cardlect.io')
  const [fullName, setFullName] = useState('Super Admin')
  const [timezone, setTimezone] = useState('UTC')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  return (
    <LayoutShell currentPage="settings">
    <div className="flex h-screen bg-background">
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and system preferences</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl font-bold">
                  SA
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                  <input
                    type="text"
                    value="Super Administrator"
                    disabled
                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Lock size={20} />
                Security
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <button
                    onClick={() => setTwoFaEnabled(!twoFaEnabled)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      twoFaEnabled ? 'bg-primary' : 'bg-secondary'
                    } relative`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                        twoFaEnabled ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg">
                  <p className="font-medium text-foreground mb-3">Change Password</p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm">
                    Update Password
                  </button>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg">
                  <p className="font-medium text-foreground mb-3">IP Address Restrictions</p>
                  <p className="text-sm text-muted-foreground mb-3">Current IP: 192.168.1.100</p>
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm">
                    Manage IP Whitelist
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts and updates via email</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      emailNotifications ? 'bg-primary' : 'bg-secondary'
                    } relative`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                        emailNotifications ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Slack Integration</p>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack workspace</p>
                  </div>
                  <button
                    onClick={() => setSlackIntegration(!slackIntegration)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      slackIntegration ? 'bg-primary' : 'bg-secondary'
                    } relative`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                        slackIntegration ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Globe size={20} />
                System Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun size={18} />
                      Light Mode
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon size={18} />
                      Dark Mode
                    </button>
                    <button
                      onClick={() => setTheme('auto')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        theme === 'auto'
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Globe size={18} />
                      Auto
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  >
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>GMT</option>
                    <option>EST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={e => setDateFormat(e.target.value)}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Shield size={20} />
                Recent Login Activity
              </h2>

              <div className="space-y-3">
                {[
                  { device: 'Chrome on Windows', location: 'Lagos, NG', time: '5 minutes ago' },
                  
                ].map((login, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground text-sm">{login.device}</p>
                      <p className="text-xs text-muted-foreground">{login.location}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{login.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium">
                <Save size={18} />
                Save Changes
              </button>
              <Link href="/auth/logout">
              <button className="flex items-center gap-2 px-6 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive transition-all font-medium">
                <LogOut size={18} />
                Logout
              </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
      </LayoutShell>
  )
}
