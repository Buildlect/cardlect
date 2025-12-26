'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { Save, Bell, Lock, User, Mail, Shield, Settings2 } from 'lucide-react'

export default function ExamOfficerSettingsPage() {
  const [settings, setSettings] = useState({
    fullName: 'Dr. James Wilson',
    email: 'james.wilson@cardlect.edu',
    phone: '+234-901-234-5678',
    department: 'Examinations',
    notifications: {
      examReminders: true,
      scoreAlerts: true,
      systemUpdates: true,
      emailNotifications: true,
    },
    privacy: {
      twoFactor: true,
      sessionTimeout: '30',
    },
  })

  const handleSaveSettings = () => {
    console.log('Settings saved:', settings)
  }

  return (
    <DashboardLayout currentPage="settings" role="exam-officer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your exam officer account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} /> Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  value={settings.fullName}
                  onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <Input
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [key]: e.target.checked }
                  })}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium text-foreground text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">Add extra security to your account</p>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.twoFactor}
                onChange={(e) => setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, twoFactor: e.target.checked }
                })}
                className="w-4 h-4 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={settings.privacy.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, sessionTimeout: e.target.value }
                })}
                className="mt-2"
              />
            </div>
            <Button
              variant="outline"
              className="w-full hover:bg-destructive/10"
            >
              <Lock size={18} /> Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button
            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
            className="text-white hover:opacity-90 transition-opacity"
            onClick={handleSaveSettings}
          >
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
