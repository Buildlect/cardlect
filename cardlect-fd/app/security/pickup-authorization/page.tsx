'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Scan,
  User,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  mockStudent,
  mockParent,
  authorizedPersons,
  initialPickupLogs,
  mockScanStudent,
  mockScanParent,
  mockLookupStudentById,
  mockLookupParentById,
  validStudentIds,
  validParentIds,
  checkAuthorization,
  type Student,
  type Parent,
  type AuthorizedPerson,
  type PickupLog,
  type AuthorizationStatus
} from './lib/mock-pickup-data'

export default function PickupAuthorization() {
  const [student, setStudent] = useState<Student | null>(null)
  const [parent, setParent] = useState<Parent | null>(null)
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatus | null>(null)
  const [pickupLogs, setPickupLogs] = useState<PickupLog[]>(initialPickupLogs)
  const [liveVerification, setLiveVerification] = useState(false)
  const [pinVerification, setPinVerification] = useState(false)
  const [showAddPickup, setShowAddPickup] = useState(false)
  const [studentIdInput, setStudentIdInput] = useState('')
  const [parentIdInput, setParentIdInput] = useState('')

  const handleStudentScan = () => {
    const scannedStudent = mockScanStudent()
    setStudent(scannedStudent)
    setStudentIdInput(scannedStudent.id)
    // Reset parent and status when scanning new student
    setParent(null)
    setParentIdInput('')
    setAuthorizationStatus(null)
  }

  const handleParentScan = () => {
    const scannedParent = mockScanParent()
    setParent(scannedParent)
    setParentIdInput(scannedParent.id)

    // Check authorization if we have both student and parent
    if (student) {
      const status = checkAuthorization(student, scannedParent)
      setAuthorizationStatus(status)

      // Add to pickup logs
      const newLog: PickupLog = {
        id: `LOG${Date.now()}`,
        time: new Date().toLocaleString(),
        student: student.name,
        parent: scannedParent.name,
        status: status
      }
      setPickupLogs(prev => [newLog, ...prev])
    }
  }

  const handleStudentIdSubmit = () => {
    if (studentIdInput.trim()) {
      const foundStudent = mockLookupStudentById(studentIdInput.trim())
      if (foundStudent) {
        setStudent(foundStudent)
        setParent(null)
        setParentIdInput('')
        setAuthorizationStatus(null)
        // Show success message
        alert(`Student ID ${studentIdInput} found successfully! Student: ${foundStudent.name}`)
      } else {
        alert(`Student ID ${studentIdInput} not found. Valid IDs: ${validStudentIds.join(', ')}`)
      }
    }
  }

  const handleParentIdSubmit = () => {
    if (parentIdInput.trim()) {
      const foundParent = mockLookupParentById(parentIdInput.trim())
      if (foundParent) {
        setParent(foundParent)

        // Check authorization if we have both student and parent
        if (student) {
          const status = checkAuthorization(student, foundParent)
          setAuthorizationStatus(status)

          // Add to pickup logs
          const newLog: PickupLog = {
            id: `LOG${Date.now()}`,
            time: new Date().toLocaleString(),
            student: student.name,
            parent: foundParent.name,
            status: status
          }
          setPickupLogs(prev => [newLog, ...prev])

          // Show authorization result
          const statusMessage = status === 'authorized' ? 'AUTHORIZED TO PICK UP' :
            status === 'denied' ? 'DENIED - NOT AUTHORIZED' :
              'MISMATCH - REQUIRES VERIFICATION'
          alert(`Parent ID ${parentIdInput} found successfully! ${foundParent.name} - ${statusMessage}`)
        } else {
          alert(`Parent ID ${parentIdInput} found successfully! Parent: ${foundParent.name}. Please scan student first.`)
        }
      } else {
        alert(`Parent ID ${parentIdInput} not found. Valid IDs: ${validParentIds.join(', ')}`)
      }
    }
  }

  const getStatusColor = (status: AuthorizationStatus) => {
    switch (status) {
      case 'authorized':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'denied':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'mismatch':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: AuthorizationStatus) => {
    switch (status) {
      case 'authorized':
        return <CheckCircle className="w-5 h-5" />
      case 'denied':
        return <XCircle className="w-5 h-5" />
      case 'mismatch':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getStatusText = (status: AuthorizationStatus) => {
    switch (status) {
      case 'authorized':
        return 'AUTHORIZED'
      case 'denied':
        return 'DENIED'
      case 'mismatch':
        return 'MISMATCH'
      default:
        return 'UNKNOWN'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <DashboardLayout currentPage="pickup-authorization" role="security">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Pickup Authorization</h1>
              </div>
              <Button
                onClick={() => setShowAddPickup(!showAddPickup)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                {showAddPickup ? 'View Logs' : 'Add Pickup'}
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage student pickup authorizations with secure card scanning.
            </p>
          </div>

          {showAddPickup ? (
            /* Add Pickup UI */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Scan Panel */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Student Scan</h2>
                </div>

                {student ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-muted-foreground">{student.class}</p>
                        <p className="text-sm text-muted-foreground">Last entry: {student.lastEntryTime}</p>
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Recent Pickups</h4>
                      <div className="space-y-2">
                        {student.recentPickups.map((pickup, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{pickup.parent}</span>
                            <span className={`px-2 py-1 rounded text-xs ${pickup.status === 'authorized' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                              {pickup.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>Linked Parent: {student.linkedParent}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No student scanned</p>
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Student ID (e.g., STU001)"
                        value={studentIdInput}
                        onChange={(e) => setStudentIdInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleStudentIdSubmit}
                        variant="outline"
                        size="sm"
                      >
                        Submit
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valid IDs: {validStudentIds.join(', ')}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleStudentScan}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Scan className="w-4 h-4" />
                    Scan Student Card
                  </Button>
                </div>
              </div>

              {/* Parent Scan Panel */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Parent Scan</h2>
                </div>

                {parent ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {getInitials(parent.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{parent.name}</h3>
                        <p className="text-muted-foreground">{parent.relationship}</p>
                        <span className={`px-2 py-1 rounded text-xs ${parent.cardStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                          {parent.cardStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Live Image Verification</span>
                        <button
                          onClick={() => setLiveVerification(!liveVerification)}
                          className={`w-10 h-6 rounded-full transition-colors ${liveVerification ? 'bg-primary' : 'bg-secondary'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${liveVerification ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">PIN Verification</span>
                        <button
                          onClick={() => setPinVerification(!pinVerification)}
                          className={`w-10 h-6 rounded-full transition-colors ${pinVerification ? 'bg-primary' : 'bg-secondary'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pinVerification ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No parent scanned</p>
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter Parent ID (e.g., PAR001)"
                        value={parentIdInput}
                        onChange={(e) => setParentIdInput(e.target.value)}
                        className="flex-1"
                        disabled={!student}
                      />
                      <Button
                        onClick={handleParentIdSubmit}
                        variant="outline"
                        size="sm"
                        disabled={!student}
                      >
                        Submit
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valid IDs: {validParentIds.join(', ')}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleParentScan}
                    className="w-full gap-2"
                    variant="outline"
                    disabled={!student}
                  >
                    <Scan className="w-4 h-4" />
                    Scan Parent Card
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Pickup Logs View */
            <div className="space-y-8">
              {/* Authorization Status Banner */}
              {authorizationStatus && (
                <div className={`border rounded-lg p-6 ${getStatusColor(authorizationStatus)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(authorizationStatus)}
                    <div>
                      <h3 className="font-semibold text-lg">Pickup Authorization: {getStatusText(authorizationStatus)}</h3>
                      <p className="text-sm opacity-90">
                        {student?.name} pickup by {parent?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Authorized Persons Table */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Authorized Persons</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Relationship</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Card Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authorizedPersons.map((person) => (
                        <tr key={person.id} className="border-b border-border/50">
                          <td className="py-3 px-4">{person.name}</td>
                          <td className="py-3 px-4">{person.relationship}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${person.cardStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                              {person.cardStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pickup Logs Table */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Pickup Logs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Parent</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickupLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/50">
                          <td className="py-3 px-4 text-sm">{log.time}</td>
                          <td className="py-3 px-4">{log.student}</td>
                          <td className="py-3 px-4">{log.parent}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'authorized' ? 'bg-green-500/20 text-green-400' :
                              log.status === 'denied' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}