'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface MedicalRecord {
  id: string
  studentName: string
  date: string
  diagnosis: string
  treatment: string
  notes: string
  status: 'completed' | 'pending'
}

const mockRecords: MedicalRecord[] = [
  { id: '1', studentName: 'Chioma Okonkwo', date: '2024-01-10', diagnosis: 'Common Cold', treatment: 'Rest and medications', notes: 'Recovery in progress', status: 'completed' },
  { id: '2', studentName: 'Tunde Adebayo', date: '2024-01-08', diagnosis: 'Headache', treatment: 'Pain relief tablets', notes: 'Discharged same day', status: 'completed' },
  { id: '3', studentName: 'Amara Obi', date: '2024-01-12', diagnosis: 'Vaccination', treatment: 'Flu vaccine administered', notes: 'Follow-up in 3 months', status: 'completed' },
  { id: '4', studentName: 'Jamal Hassan', date: '2024-01-05', diagnosis: 'Minor cut', treatment: 'Wound cleaning and bandaging', notes: 'Monitor for infection', status: 'pending' },
]

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)

  const filteredRecords = mockRecords.filter(r =>
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout currentPage="medical-records" role="clinic">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Medical Records</h1>
        <p className="text-muted-foreground">Access and manage student medical records</p>
      </div>

      {/* Quick Stat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Records</p>
                <p className="text-3xl font-bold text-foreground">{mockRecords.length}</p>
              </div>
              <FileText size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pending Follow-up</p>
                <p className="text-3xl font-bold text-foreground">{mockRecords.filter(r => r.status === 'pending').length}</p>
              </div>
              <AlertCircle size={24} style={{ color: CARDLECT_COLORS.warning.main }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medical Records</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{record.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{record.diagnosis} - {record.date}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: record.status === 'completed' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.warning.main }}
                  >
                    {record.status}
                  </span>
                </div>

                {expandedRecord === record.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Treatment</p>
                        <p className="font-semibold text-foreground">{record.treatment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="font-semibold text-foreground">{record.notes}</p>
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
