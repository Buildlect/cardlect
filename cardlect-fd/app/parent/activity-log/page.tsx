'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, User } from 'lucide-react'
import { SEMANTIC_COLORS, ROLE_COLORS, CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Activity {
  id: string
  child: string
  type: 'entry' | 'exit' | 'purchase' | 'attendance'
  location: string
  timestamp: string
  details: string
}

const mockActivities: Activity[] = [
  { id: '1', child: 'Sarah Johnson', type: 'entry', location: 'Main Gate', timestamp: '2024-01-15 08:00', details: 'Card scanned at main entrance' },
  { id: '2', child: 'Sarah Johnson', type: 'purchase', location: 'School Store', timestamp: '2024-01-15 12:30', details: 'Lunch purchase - ₦1,500' },
  { id: '3', child: 'Michael Johnson', type: 'entry', location: 'Main Gate', timestamp: '2024-01-15 08:15', details: 'Card scanned at main entrance' },
  { id: '4', child: 'Michael Johnson', type: 'purchase', location: 'School Store', timestamp: '2024-01-15 13:00', details: 'Snack purchase - ₦800' },
  { id: '5', child: 'Sarah Johnson', type: 'exit', location: 'Main Gate', timestamp: '2024-01-15 15:30', details: 'Card scanned at exit' },
  { id: '6', child: 'Emma Johnson', type: 'attendance', location: 'Classroom', timestamp: '2024-01-15 09:00', details: 'Present for morning classes' },
]

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'entry':
      return <MapPin className="text-green-600" size={16} />
    case 'exit':
      return <MapPin className="text-red-600" size={16} />
    case 'purchase':
      return <User className="text-blue-600" size={16} />
    case 'attendance':
      return <Clock className="text-purple-600" size={16} />
    default:
      return null
  }
}

const getActivityColor = (type: string) => {
  switch(type) {
    case 'entry': return 'text-green-600 bg-green-50'
    case 'exit': return 'text-red-600 bg-red-50'
    case 'purchase': return 'text-blue-600 bg-blue-50'
    case 'attendance': return 'text-purple-600 bg-purple-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState(mockActivities)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const filteredActivities = activities.filter(a =>
    (a.child.toLowerCase().includes(searchTerm.toLowerCase()) || a.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === 'all' || a.type === selectedType)
  )

  return (
    <DashboardLayout currentPage="activity-log" role="parents">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground">View your children's daily activities and transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Today's Entries</div>
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-xs text-muted-foreground mt-2">School entries</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Transactions</div>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-xs text-muted-foreground mt-2">Store purchases</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Spent</div>
              <div className="text-2xl font-bold" style={{ color: ROLE_COLORS.parents.main }}>₦2,300</div>
              <div className="text-xs text-muted-foreground mt-2">Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Attendance</div>
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-xs text-muted-foreground mt-2">All present</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Input 
            placeholder="Search activities..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="all">All Activities</option>
            <option value="entry">Entry</option>
            <option value="exit">Exit</option>
            <option value="purchase">Purchases</option>
            <option value="attendance">Attendance</option>
          </select>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activities found
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: CARDLECT_COLORS.info.main + '20' }}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm">{activity.child}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {activity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {activity.timestamp}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getActivityColor(activity.type)} flex-shrink-0`}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
