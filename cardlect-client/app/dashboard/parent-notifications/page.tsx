'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { ROLE_COLORS, CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Notification {
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

const getNotificationColor = (type: string) => {
  switch(type) {
    case 'entry': return { color: CARDLECT_COLORS.success.main, backgroundColor: CARDLECT_COLORS.success.main + '20' }
    case 'purchase': return { color: CARDLECT_COLORS.info.main, backgroundColor: CARDLECT_COLORS.info.main + '20' }
    case 'alert': return { color: CARDLECT_COLORS.danger.main, backgroundColor: CARDLECT_COLORS.danger.main + '20' }
    case 'update': return { color: CARDLECT_COLORS.accent.main, backgroundColor: CARDLECT_COLORS.accent.main + '20' }
    default: return { color: '#666666', backgroundColor: '#66666620' }
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
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
      try {
        const res = await api.get('/announcements')
        const rows: AnnouncementRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setNotifications(rows.map((row) => {
          const priority = (row.priority || '').toLowerCase()
          const type: Notification['type'] = priority === 'high' ? 'alert' : priority === 'normal' ? 'update' : 'entry'
          return {
            id: row.id,
            title: row.title || 'Notification',
            message: row.content || '',
            time: row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A',
            read: false,
            type,
          }
        }))
      } catch (error) {
        console.error('Failed to load notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const togglePreference = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <DashboardLayout currentPage="notifications" role="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Manage notifications and preferences</p>
        </div>

        <Card style={{ borderColor: ROLE_COLORS.parents.main + '30', backgroundColor: ROLE_COLORS.parents.main + '05' }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: ROLE_COLORS.parents.main + '20' }}>
                <Bell size={24} style={{ color: ROLE_COLORS.parents.main }} />
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
              <CardHeader><CardTitle className="text-lg">Event Types</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'entries', label: 'School Entries & Exits', icon: 'Door' },
                  { key: 'purchases', label: 'Store Purchases', icon: 'Cart' },
                  { key: 'alerts', label: 'Alerts & Warnings', icon: 'Alert' },
                  { key: 'updates', label: 'Academic Updates', icon: 'Book' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">{event.label}</label>
                    <input
                      type="checkbox"
                      checked={preferences[event.key as keyof typeof preferences] as boolean}
                      onChange={() => togglePreference(event.key)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Delivery Methods</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', icon: <Mail size={18} /> },
                  { key: 'sms', label: 'SMS Messages', icon: <MessageSquare size={18} /> },
                  { key: 'push', label: 'Push Notifications', icon: <Smartphone size={18} /> },
                ].map(method => (
                  <div key={method.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                      {method.icon}
                      <span>{method.label}</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences[method.key as keyof typeof preferences] as boolean}
                      onChange={() => togglePreference(method.key)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Button style={{ backgroundColor: ROLE_COLORS.parents.main }} className="text-white mt-4">
            Save Preferences
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-muted/30 border-border' : 'bg-primary/5 border-primary'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
