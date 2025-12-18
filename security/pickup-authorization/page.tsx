 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SecuritySidebar from '../dashboard/components/SecuritySidebar'
import { Header } from '@/components/SuperAdmin/header'
import StudentScanPanel from './components/StudentScanPanel'
import StatusBanner from './components/StatusBanner'
import AuthorizationTable from './components/AuthorizationTable'
import PickupLogsTable from './components/PickupLogsTable'
import mockData from './data/mockPickupData'
import ConfirmDialog from './components/ConfirmDialog'
import EditDialog from './components/EditDialog'
// animations use tw-animate-css classes (no framer-motion)

export default function PickupAuthorizationPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Mode: either 'list' (initial) or 'new' (scan flow)
  const [mode, setMode] = useState<'list' | 'new'>('list')

  // Business state
  type Student = { id: string; name: string; class: string; lastEntry: string; recentPickups: string[] }
  type Parent = { id?: string; name: string; relationship?: string }
  type Authorization = { id: string; student: string; class: string; authorizedPerson: string; relationship: string; status: string }

  const [student, setStudent] = useState<Student | null>(null)
  const [parent, setParent] = useState<Parent | null>(null)
  const [authStatus, setAuthStatus] = useState<'AUTHORIZED' | 'DENIED' | 'MISMATCH' | null>(null)

  const [logs, setLogs] = useState(mockData.pickupLogs)
  const [authList, setAuthList] = useState<Authorization[]>(mockData.authorizationList)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<Authorization | null>(null)

  function mockScanStudent() {
    setStudent(mockData.mockStudent)
    // default parent: first active authorized person
    const p = mockData.mockStudent.authorizedPersons.find((x) => x.cardStatus === 'Active')
    setParent(p ? { id: p.id, name: p.name, relationship: p.relationship } : null)
    setAuthStatus(null)
  }

  function verifyById(id: string) {
    if (!id) return
    // match mock student id
    if (mockData.mockStudent.id === id) {
      setStudent(mockData.mockStudent)
      const p = mockData.mockStudent.authorizedPersons.find((x) => x.cardStatus === 'Active')
      setParent(p ? { id: p.id, name: p.name, relationship: p.relationship } : null)
      setAuthStatus(null)
      return
    }

    // match an authorized-person (parent) id for mockStudent
    const authPerson = mockData.mockStudent.authorizedPersons.find((ap) => ap.id === id)
    if (authPerson) {
      setStudent(mockData.mockStudent)
      setParent({ id: authPerson.id, name: authPerson.name, relationship: authPerson.relationship })
      // if cardStatus active, mark AUTHORIZED, otherwise DENIED
      const status = authPerson.cardStatus === 'Active' ? 'AUTHORIZED' : 'DENIED'
      setAuthStatus(status)
      if (status === 'AUTHORIZED') appendLog(status, mockData.mockStudent.name, authPerson.name)
      return
    }

    // match authorization record id
    const auth = mockData.authorizationList.find((a) => a.id === id)
    if (auth) {
      setStudent({ id: auth.id, name: auth.student, class: auth.class, lastEntry: '', recentPickups: [] })
      setParent({ name: auth.authorizedPerson, relationship: auth.relationship })
      // map auth.status to our authStatus
      const status = (auth.status && auth.status.toLowerCase() === 'active') ? 'AUTHORIZED' : 'DENIED'
      setAuthStatus(status as 'AUTHORIZED' | 'DENIED' | 'MISMATCH')
      if (status === 'AUTHORIZED') appendLog(status, auth.student, auth.authorizedPerson)
      return
    }

    // not found
    setStudent(null)
    setParent(null)
    setAuthStatus('DENIED')
  }

  function appendLog(status: string, studentName: string, parentName: string) {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newLog = { time, student: studentName, parent: parentName, status: status === 'AUTHORIZED' ? 'Authorized' : status === 'DENIED' ? 'Denied' : 'Mismatch' }
    setLogs((s) => [newLog, ...s])
  }

  // Initial view shows the list and the + New Authorization button
  return (
    <div className="flex h-screen bg-background">
      <SecuritySidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="pickup-authorization" />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Pickup Authorization</h1>
                <p className="text-muted-foreground">Manage who is authorized to pick up students.</p>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => setMode('new')} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-all">+ New Authorization</button>
              </div>
            </div>

            {mode === 'list' && (
              <div className="grid grid-cols-1 gap-6 animate__animated animate__fadeInUp">
                {/* Main table matching screenshot */}
                <div>
                  <AuthorizationTable
                    list={authList}
                    onEdit={(id) => {
                      const found = authList.find((a) => a.id === id) ?? null
                      setEditingItem(found)
                    }}
                    onDelete={(id) => {
                      setPendingDeleteId(id)
                    }}
                  />

                  <ConfirmDialog
                    open={!!pendingDeleteId}
                    title="Delete Authorization"
                    description="This action cannot be undone. Are you sure you want to delete this authorization?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    onCancel={() => setPendingDeleteId(null)}
                    onConfirm={() => {
                      if (pendingDeleteId) {
                        setAuthList((s) => s.filter((a) => a.id !== pendingDeleteId))
                        setPendingDeleteId(null)
                      }
                    }}
                  />
                  <EditDialog
                    open={!!editingItem}
                    initial={editingItem}
                    onCancel={() => setEditingItem(null)}
                    onSave={(data) => {
                      setAuthList((s) => s.map((a) => (a.id === data.id ? data : a)))
                      setEditingItem(null)
                    }}
                  />
                </div>
              </div>
            )}

            {mode === 'new' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
                <div className="lg:col-span-2 space-y-6">
                  <StudentScanPanel student={student} onScan={mockScanStudent} onVerify={verifyById} />

                  <div className="mt-2">
                    <StatusBanner status={authStatus} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {/* Student Information card */}
                      <div className="rounded-2xl p-6 border border-border bg-card/60">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Student Information</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-muted-foreground">Img</div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{student?.name ?? 'Jane Doe'}</p>
                            <p className="text-muted-foreground">{student?.class ?? 'Grade 5 / Class B'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Authorized Guardian card */}
                      <div className="rounded-2xl p-6 border border-border bg-card/60">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Authorized Guardian</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-muted-foreground">Img</div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{parent?.name ?? 'Mary Doe'}</p>
                            <p className="text-muted-foreground">{parent?.relationship ?? 'Mother'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <button onClick={() => {
                      setAuthStatus('DENIED')
                      if (student && parent) appendLog('DENIED', student.name, parent.name)
                    }} className="px-4 py-2 rounded-lg bg-amber-700 text-amber-100">Flag Issue</button>

                    <button onClick={() => { setStudent(null); setParent(null); setAuthStatus(null); }} className="px-4 py-2 rounded-lg bg-card/60 border border-border">Clear</button>

                    <div className="flex-1" />

                    <button onClick={() => {
                      if (authStatus && student && parent) {
                        appendLog(authStatus, student.name, parent.name)
                        setStudent(null)
                        setParent(null)
                        setAuthStatus(null)
                      }
                    }} className="px-4 py-2 rounded-lg bg-emerald-600 text-emerald-100">Confirm &amp; Log Pickup</button>
                  </div>
                </div>

                <div className="space-y-6">

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h4>
                    <PickupLogsTable logs={logs} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
