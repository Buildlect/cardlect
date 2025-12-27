'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { useTheme } from '@/components/theme-provider'
import { Lock, Bell, Globe, Shield, LogOut, Save, Sun, Moon } from 'lucide-react'

interface SettingsPageProps {
  role: "admin" | "security" | "super-user" | "parents" | "students" | "finance" | "store" | "teacher" | "clinic" | "approved-stores" | "exam-officer" | "librarian"
  roleDisplayName: string
  roleInitials: string
}

export function SettingsPageTemplate({ role, roleDisplayName, roleInitials }: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const [twoFaEnabled, setTwoFaEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackIntegration, setSlackIntegration] = useState(false)
  const [email, setEmail] = useState('user@cardlect.io')
  const [fullName, setFullName] = useState(roleDisplayName)
  const [timezone, setTimezone] = useState('UTC')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <DashboardLayout currentPage="settings" role={role}>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm">
            ✓ Settings saved successfully
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Update your account details</p>
            </div>
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl font-bold">
              {roleInitials}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <input
                type="text"
                value={roleDisplayName}
                disabled
                className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
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

        {/* Notifications Section */}
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

        {/* System Preferences */}
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
                <option>UTC</option>
                <option>GMT</option>
                <option>EST</option>
                <option>CST</option>
                <option>MST</option>
                <option>PST</option>
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
          <button className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-all">
            Cancel
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
