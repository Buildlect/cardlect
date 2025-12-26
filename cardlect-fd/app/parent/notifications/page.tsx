'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { ROLE_COLORS, CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'entry' | 'purchase' | 'alert' | 'update'
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Sarah Entry', message: 'Sarah arrived at school', time: '8:00 AM', read: false, type: 'entry' },
  { id: '2', title: 'Store Purchase', message: 'Sarah made a purchase - ₦1,500', time: '12:30 PM', read: false, type: 'purchase' },
  { id: '3', title: 'Low Balance Alert', message: 'Michael\'s wallet balance is below ₦5,000', time: '2:15 PM', read: true, type: 'alert' },
  { id: '4', title: 'Exam Score', message: 'Emma\'s exam results are ready to view', time: 'Yesterday', read: true, type: 'update' },
]

const getNotificationColor = (type: string) => {
  switch(type) {
    case 'entry': return 'text-green-600 bg-green-50'
    case 'purchase': return 'text-blue-600 bg-blue-50'
    case 'alert': return 'text-red-600 bg-red-50'
    case 'update': return 'text-purple-600 bg-purple-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [preferences, setPreferences] = useState({
    entries: true,
    purchases: true,
    alerts: true,
    updates: true,
    email: true,
    sms: false,
    push: true,
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const togglePreference = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <DashboardLayout currentPage="notifications" role="parents">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Manage notifications and preferences</p>
        </div>

        {/* Unread Count */}
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

        {/* Notification Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'entries', label: 'School Entries & Exits', icon: '🚪' },
                  { key: 'purchases', label: 'Store Purchases', icon: '🛒' },
                  { key: 'alerts', label: 'Alerts & Warnings', icon: '⚠️' },
                  { key: 'updates', label: 'Academic Updates', icon: '📚' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                      <span>{event.icon}</span>
                      <span>{event.label}</span>
                    </label>
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

            {/* Delivery Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Methods</CardTitle>
              </CardHeader>
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

        {/* Recent Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <Card>
            <CardContent className="pt-6">
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
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getNotificationColor(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
