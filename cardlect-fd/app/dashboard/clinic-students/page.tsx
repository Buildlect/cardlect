'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, Heart, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface StudentRecord {
  id: string
  name: string
  class: string
  age: number
  bloodType: string
  allergies: string
  lastVisit: string
  healthStatus: 'good' | 'fair' | 'needs-attention'
}

const mockStudents: StudentRecord[] = [
  { id: '1', name: 'Chioma Okonkwo', class: 'JSS 1A', age: 12, bloodType: 'O+', allergies: 'None', lastVisit: '2024-01-10', healthStatus: 'good' },
  { id: '2', name: 'Tunde Adebayo', class: 'JSS 1B', age: 12, bloodType: 'A+', allergies: 'Peanuts', lastVisit: '2024-01-08', healthStatus: 'good' },
  { id: '3', name: 'Amara Obi', class: 'JSS 2A', age: 13, bloodType: 'B+', allergies: 'None', lastVisit: '2023-12-20', healthStatus: 'needs-attention' },
  { id: '4', name: 'Jamal Hassan', class: 'JSS 2B', age: 13, bloodType: 'AB+', allergies: 'Dairy', lastVisit: '2024-01-12', healthStatus: 'fair' },
  { id: '5', name: 'Efe Okoro', class: 'JSS 3A', age: 14, bloodType: 'O-', allergies: 'Shellfish', lastVisit: '2024-01-05', healthStatus: 'good' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return CARDLECT_COLORS.success.main
    case 'fair': return CARDLECT_COLORS.warning.main
    case 'needs-attention': return CARDLECT_COLORS.danger.main
    default: return CARDLECT_COLORS.primary.darker
  }
}

export default function ClinicStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  const filteredStudents = mockStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudents = mockStudents.length
  const needsAttention = mockStudents.filter(s => s.healthStatus === 'needs-attention').length

  return (
    <DashboardLayout currentPage="students" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Student Health Records</h1>
        <p className="text-muted-foreground">Manage student health and medical information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <Users size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Good Health</p>
                <p className="text-3xl font-bold text-foreground">{mockStudents.filter(s => s.healthStatus === 'good').length}</p>
              </div>
              <Heart size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Needs Attention</p>
                <p className="text-3xl font-bold text-foreground">{needsAttention}</p>
              </div>
              <AlertCircle size={24} style={{ color: CARDLECT_COLORS.danger.main }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: getStatusColor(student.healthStatus) }}
                  >
                    {student.healthStatus.replace('-', ' ')}
                  </span>
                </div>

                {expandedStudent === student.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Age</p>
                        <p className="font-semibold text-foreground">{student.age} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Type</p>
                        <p className="font-semibold text-foreground">{student.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Allergies</p>
                        <p className="font-semibold text-foreground">{student.allergies}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Visit</p>
                        <p className="font-semibold text-foreground">{student.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
