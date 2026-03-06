'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Search, Heart, AlertCircle, Users, Loader2, Activity } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

export default function ClinicStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [healthRecords, setHealthRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, healthRes] = await Promise.all([
          api.get('/users?role=student&limit=100'),
          api.get('/analytics/health/overview'),
        ])
        setStudents(studentsRes.data.data || [])
        setHealthRecords(healthRes.data.data?.recent_records || [])
      } catch (err) {
        console.error('Failed to fetch clinic students:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredStudents = students.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admission_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchHealthRecord = async (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null)
      return
    }
    setExpandedStudent(studentId)
    // The health record for a student is fetched on expand via a separate call
    try {
      const res = await api.get(`/health/students/${studentId}`)
      const record = res.data.data
      setHealthRecords(prev => {
        const existing = prev.findIndex(r => r.student_id === studentId)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = { ...record, student_id: studentId }
          return updated
        }
        return [...prev, { ...record, student_id: studentId }]
      })
    } catch (_) {
      // No health record yet — silently ignore
    }
  }

  const getHealthRecord = (studentId: string) => healthRecords.find(r => r.student_id === studentId || r.user_id === studentId)

  return (
    <DashboardLayout currentPage="students" role="staff">
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Health Records</h1>
          <p className="text-muted-foreground">Manage student health and medical information.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Students', value: students.length, icon: Users, color: CARDLECT_COLORS.primary.darker },
            { label: 'With Health Records', value: healthRecords.length, icon: Heart, color: CARDLECT_COLORS.success.main },
            { label: 'Critical Flags', value: healthRecords.filter(r => r.flags?.length > 0 || r.critical).length, icon: AlertCircle, color: CARDLECT_COLORS.danger.main },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-foreground">{s.value}</p>
                  </div>
                  <Icon size={24} color={s.color} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Students */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users size={40} className="opacity-20 mb-3" />
              <p className="text-muted-foreground font-medium">No students found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredStudents.map((student) => {
                const health = getHealthRecord(student.id)
                const isExpanded = expandedStudent === student.id
                return (
                  <div
                    key={student.id}
                    onClick={() => fetchHealthRecord(student.id)}
                    className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {student.full_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{student.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{student.admission_number || 'No ID'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {health ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-500 bg-green-500/10">
                            Record on file
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground bg-muted/30">
                            No record
                          </span>
                        )}
                        <Activity size={16} className={`transition-transform ${isExpanded ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>

                    {isExpanded && health && (
                      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Blood Type</p>
                          <p className="font-semibold text-foreground">{health.blood_type || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Allergies</p>
                          <p className="font-semibold text-foreground">{health.allergies || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conditions</p>
                          <p className="font-semibold text-foreground">{health.conditions || health.pre_existing_conditions || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Emergency Contact</p>
                          <p className="font-semibold text-foreground">{health.emergency_contact || '—'}</p>
                        </div>
                      </div>
                    )}

                    {isExpanded && !health && (
                      <p className="mt-3 text-sm text-muted-foreground">No health record on file for this student.</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
