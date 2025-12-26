'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Phone, Mail, Smartphone } from 'lucide-react'
import { ROLE_COLORS } from '@/lib/cardlect-colors'

interface Child {
  id: string
  name: string
  grade: string
  school: string
  admissionNo: string
  dateOfBirth: string
  cardStatus: 'active' | 'inactive' | 'lost'
  emergencyContact: string
  email: string
}

const mockChildren: Child[] = [
  { id: '1', name: 'Sarah Johnson', grade: 'Grade 10', school: 'Cambridge Academy', admissionNo: 'ADM-2024-001', dateOfBirth: '2009-05-15', cardStatus: 'active', emergencyContact: '08012345678', email: 'sarah@school.com' },
  { id: '2', name: 'Michael Johnson', grade: 'Grade 8', school: 'Cambridge Academy', admissionNo: 'ADM-2024-002', dateOfBirth: '2011-03-22', cardStatus: 'active', emergencyContact: '08012345678', email: 'michael@school.com' },
  { id: '3', name: 'Emma Johnson', grade: 'Grade 6', school: 'Cambridge Academy', admissionNo: 'ADM-2024-003', dateOfBirth: '2013-08-10', cardStatus: 'inactive', emergencyContact: '08012345678', email: 'emma@school.com' },
]

export default function ChildrenPage() {
  const [children, setChildren] = useState(mockChildren)

  const getCardStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-yellow-600 bg-yellow-50'
      case 'lost': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <DashboardLayout currentPage="children" role="parents">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Children</h1>
            <p className="text-muted-foreground">Manage and monitor your children's profiles</p>
          </div>
          <Button style={{ backgroundColor: ROLE_COLORS.parents.main }} className="text-white">
            <Plus size={18} /> Add Child
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Children</div>
              <div className="text-2xl font-bold" style={{ color: ROLE_COLORS.parents.main }}>{children.length}</div>
              <div className="text-xs text-muted-foreground mt-2">Registered profiles</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Active Cards</div>
              <div className="text-2xl font-bold text-green-600">{children.filter(c => c.cardStatus === 'active').length}</div>
              <div className="text-xs text-muted-foreground mt-2">With active cards</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Issues</div>
              <div className="text-2xl font-bold text-yellow-600">{children.filter(c => c.cardStatus !== 'active').length}</div>
              <div className="text-xs text-muted-foreground mt-2">Need attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Children Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.grade}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCardStatusColor(child.cardStatus)}`}>
                    {child.cardStatus.charAt(0).toUpperCase() + child.cardStatus.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">School: </span>
                    <span className="font-medium">{child.school}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admission: </span>
                    <span className="font-medium">{child.admissionNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DOB: </span>
                    <span className="font-medium">{new Date(child.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={14} />
                    <span>{child.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} />
                    <span>{child.emergencyContact}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit size={16} /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Smartphone size={16} /> Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
