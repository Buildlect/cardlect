'use client'

import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { UserRole } from '@/contexts/auth-context'
import api from '@/lib/api-client'

interface NotificationPageProps {
  role: UserRole
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'entry' | 'purchase' | 'alert' | 'update'
}

interface AnnouncementRow {
  id: string
  title?: string
  content?: string
  priority?: string
  created_at?: string
}

const getNotificationColor = (type: NotificationItem['type']) => {
  switch (type) {
    case 'entry':
      return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
    case 'purchase':
      return { color: CARDLECT_COLORS.info.main, backgroundColor: `${CARDLECT_COLORS.info.main}20` }
    case 'alert':
      return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
    default:
      return { color: CARDLECT_COLORS.accent.main, backgroundColor: `${CARDLECT_COLORS.accent.main}20` }
  }
}

export function NotificationPageTemplate({ role }: NotificationPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    entries: true,
    purchases: true,
    alerts: true,
    updates: true,
    email: true,
    sms: false,
    push: true,
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const res = await api.get('/announcements')
        const rows: AnnouncementRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setNotifications(
          rows.map((row) => {
            const priority = (row.priority || '').toLowerCase()
            const type: NotificationItem['type'] = priority === 'high'
              ? 'alert'
              : priority === 'normal'
                ? 'update'
                : 'entry'
            return {
              id: row.id,
              title: row.title || 'Notification',
              message: row.content || '',
              time: row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A',
              read: false,
              type,
            }
          }),
        )
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } }; message?: string }
        setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load notifications')
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DashboardLayout currentPage="notifications" role={role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Manage notifications and preferences</p>
        </div>

        <Card style={{ borderColor: `${CARDLECT_COLORS.primary.main}30`, backgroundColor: `${CARDLECT_COLORS.primary.main}08` }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${CARDLECT_COLORS.primary.main}20` }}>
                <Bell size={24} style={{ color: CARDLECT_COLORS.primary.main }} />
              </div>
              <div>
                <div className="text-2xl font-bold">{unreadCount} Unread</div>
                <p className="text-sm text-muted-foreground">New notifications waiting for you</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium cursor-pointer">School Entries & Exits</label>
                  <input type="checkbox" checked={preferences.entries} onChange={() => togglePreference('entries')} className="w-4 h-4 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium cursor-pointer">Store Purchases</label>
                  <input type="checkbox" checked={preferences.purchases} onChange={() => togglePreference('purchases')} className="w-4 h-4 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium cursor-pointer">Alerts & Warnings</label>
                  <input type="checkbox" checked={preferences.alerts} onChange={() => togglePreference('alerts')} className="w-4 h-4 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium cursor-pointer">Academic Updates</label>
                  <input type="checkbox" checked={preferences.updates} onChange={() => togglePreference('updates')} className="w-4 h-4 rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <Mail size={18} />
                    <span>Email Notifications</span>
                  </label>
                  <input type="checkbox" checked={preferences.email} onChange={() => togglePreference('email')} className="w-4 h-4 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <MessageSquare size={18} />
                    <span>SMS Messages</span>
                  </label>
                  <input type="checkbox" checked={preferences.sms} onChange={() => togglePreference('sms')} className="w-4 h-4 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <Smartphone size={18} />
                    <span>Push Notifications</span>
                  </label>
                  <input type="checkbox" checked={preferences.push} onChange={() => togglePreference('push')} className="w-4 h-4 rounded" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Button style={{ backgroundColor: CARDLECT_COLORS.primary.main }} className="text-white mt-4">
            Save Preferences
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              ) : errorMessage ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications available.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-muted/30 border-border' : 'bg-primary/5 border-primary'}`}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={getNotificationColor(notification.type)}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
