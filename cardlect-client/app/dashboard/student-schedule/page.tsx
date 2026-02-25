'use client'

import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import { Clock, MapPin, User } from 'lucide-react'

interface ClassSession {
  day: string
  time: string
  subject: string
  teacher: string
  location: string
  duration: string
}

const schedule: ClassSession[] = [
  { day: 'Monday', time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', location: 'Room 101', duration: '1h' },
  { day: 'Monday', time: '09:15 - 10:15', subject: 'English', teacher: 'Ms. Williams', location: 'Room 102', duration: '1h' },
  { day: 'Monday', time: '10:30 - 11:30', subject: 'Physics', teacher: 'Dr. Davis', location: 'Lab A', duration: '1h' },
  { day: 'Tuesday', time: '08:00 - 09:00', subject: 'Chemistry', teacher: 'Mr. Brown', location: 'Lab B', duration: '1h' },
  { day: 'Tuesday', time: '09:15 - 10:15', subject: 'Biology', teacher: 'Ms. Martinez', location: 'Room 103', duration: '1h' },
  { day: 'Wednesday', time: '08:00 - 09:00', subject: 'History', teacher: 'Mr. Wilson', location: 'Room 104', duration: '1h' },
  { day: 'Thursday', time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Johnson', location: 'Room 101', duration: '1h' },
  { day: 'Friday', time: '08:00 - 09:00', subject: 'English', teacher: 'Ms. Williams', location: 'Room 102', duration: '1h' },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function SchedulePage() {
  return (
    <DashboardLayout currentPage="schedule" role="students">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Class Schedule</h1>
        <p className="text-muted-foreground">Your weekly class timetable and schedule</p>
      </div>

      {/* Daily Schedule */}
      <div className="space-y-6">
        {days.map((day) => {
          const daySchedule = schedule.filter(s => s.day === day)
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle style={{ color: CARDLECT_COLORS.primary.darker }}>{day}</CardTitle>
              </CardHeader>
              <CardContent>
                {daySchedule.length > 0 ? (
                  <div className="space-y-3">
                    {daySchedule.map((session, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 pl-4 py-3"
                        style={{ borderColor: CARDLECT_COLORS.primary.darker }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{session.subject}</h3>
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                          >
                            {session.duration}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{session.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{session.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No classes scheduled</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
