'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scan, User, Users, Shield, CheckCircle, XCircle, AlertTriangle, Plus } from 'lucide-react'
import api from '@/lib/api-client'

type AuthorizationStatus = 'authorized' | 'denied' | 'mismatch'

interface AuthorizedPerson {
  id: string
  full_name: string
  relationship?: string
  phone_number?: string
  is_active?: boolean
}

interface PickupLog {
  id: string
  created_at?: string
  student_name?: string
  pickup_person_name?: string
  status?: string
  gate_location?: string
}

export default function PickupAuthorization() {
  const [studentIdInput, setStudentIdInput] = useState('')
  const [pickupPersonIdInput, setPickupPersonIdInput] = useState('')
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>([])
  const [pickupLogs, setPickupLogs] = useState<PickupLog[]>([])
  const [authorizationStatus, setAuthorizationStatus] = useState<AuthorizationStatus | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [showAddPickup, setShowAddPickup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchPickupLogs = async () => {
    try {
      const res = await api.get('/pickups/events?limit=50')
      const rows: PickupLog[] = Array.isArray(res.data?.data) ? res.data.data : []
      setPickupLogs(rows)
    } catch {
      setPickupLogs([])
    }
  }

  useEffect(() => {
    fetchPickupLogs()
  }, [])

  const handleStudentIdSubmit = async () => {
    if (!studentIdInput.trim()) return
    setLoading(true)
    setErrorMessage(null)
    setAuthorizationStatus(null)
    setStatusMessage('')
    try {
      const res = await api.get(`/pickups/students/${encodeURIComponent(studentIdInput.trim())}/authorized-pickups`)
      const rows: AuthorizedPerson[] = Array.isArray(res.data?.data) ? res.data.data : []
      setAuthorizedPersons(rows)
      if (rows.length === 0) {
        setErrorMessage('No authorized pickup persons found for this student.')
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { error?: string } }; message?: string }
      setAuthorizedPersons([])
      setErrorMessage(apiError?.response?.data?.error || apiError?.message || 'Failed to load authorized persons')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPickup = async () => {
    if (!studentIdInput.trim() || !pickupPersonIdInput.trim()) {
      setErrorMessage('Student ID and Pickup Person ID are required.')
      return
    }

    setLoading(true)
    setErrorMessage(null)
    try {
      await api.post('/pickups/verify', {
        studentId: studentIdInput.trim(),
        pickupPersonId: pickupPersonIdInput.trim(),
        location: 'Main Gate',
      })
      setAuthorizationStatus('authorized')
      setStatusMessage('Pickup authorized and logged.')
      await fetchPickupLogs()
    } catch (error: unknown) {
      const apiError = error as { response?: { status?: number; data?: { error?: string } }; message?: string }
      const status = apiError?.response?.status
      const msg = apiError?.response?.data?.error || apiError?.message || 'Pickup verification failed'
      setStatusMessage(msg)
      setAuthorizationStatus(status === 403 ? 'denied' : 'mismatch')
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateNfcStudentScan = () => {
    handleStudentIdSubmit()
  }

  const handleSimulateQrParentScan = () => {
    const firstActive = authorizedPersons.find((p) => p.is_active)
    if (firstActive) {
      setPickupPersonIdInput(firstActive.id)
      setErrorMessage(null)
      return
    }
    setErrorMessage('No active authorized person available for QR simulation.')
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

  return (
    <DashboardLayout currentPage="pickup-authorization" role="staff" customRole="security">
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">Pickup Authorization</h1>
              <Button onClick={() => setShowAddPickup(!showAddPickup)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                {showAddPickup ? 'View Logs' : 'Verify Pickup'}
              </Button>
            </div>
            <p className="text-muted-foreground">Live security verification flow for pickup authorization with NFC/QR scan simulation.</p>
          </div>

          {authorizationStatus && (
            <div className={`border rounded-lg p-6 mb-6 ${getStatusColor(authorizationStatus)}`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(authorizationStatus)}
                <div>
                  <h3 className="font-semibold text-lg">Pickup {authorizationStatus.toUpperCase()}</h3>
                  <p className="text-sm opacity-90">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {showAddPickup ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Student Scan (NFC)</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Student ID"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleStudentIdSubmit} variant="outline" size="sm" disabled={loading}>Load</Button>
                  </div>
                  <Button onClick={handleSimulateNfcStudentScan} className="w-full gap-2" variant="outline" disabled={loading}>
                    <Scan className="w-4 h-4" />
                    Simulate NFC Student Scan
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Authorized Persons</h3>
                  <div className="space-y-2 max-h-60 overflow-auto">
                    {authorizedPersons.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No authorized persons loaded.</p>
                    ) : authorizedPersons.map((person) => (
                      <div key={person.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{person.full_name}</p>
                          <span className={`text-xs px-2 py-1 rounded ${person.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {person.is_active ? 'active' : 'inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {person.id}</p>
                        <p className="text-xs text-muted-foreground">{person.relationship || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Parent Scan (QR)</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Pickup Person ID"
                      value={pickupPersonIdInput}
                      onChange={(e) => setPickupPersonIdInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleVerifyPickup} variant="default" size="sm" disabled={loading}>Verify</Button>
                  </div>
                  <Button onClick={handleSimulateQrParentScan} className="w-full gap-2" variant="outline" disabled={loading || authorizedPersons.length === 0}>
                    <Scan className="w-4 h-4" />
                    Simulate QR Parent Scan
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Pickup Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pickup Person</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickupLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm">{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</td>
                        <td className="py-3 px-4">{log.student_name || 'N/A'}</td>
                        <td className="py-3 px-4">{log.pickup_person_name || 'N/A'}</td>
                        <td className="py-3 px-4">{log.gate_location || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {log.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
