'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { Plus, Eye, Pause, Play, X, Users, UserCheck, BookOpen, Settings, Activity, TrendingUp, Edit2, Trash2, Check, Server, Zap } from 'lucide-react'
import { useCardlect, School } from '@/contexts/cardlect-context'
import SchoolOnboardingWizard from '@/components/SuperAdmin/school-onboarding-wizard'

interface SchoolDetailsModal extends School {
  staffList: Array<{ id: string; name: string; role: string; email: string }>
  studentList: Array<{ id: string; name: string; class: string; cardStatus: string }>
  parentList: Array<{ id: string; name: string; contact: string; email: string }>
  recentActivities: Array<{ id: string; type: string; description: string; time: string }>
}

export default function SchoolsPage() {
  const router = useRouter()
  const { schools, addSchool, updateSchool, deleteSchool, getSchoolStudents, getSchoolStaff, getSchoolParents } = useCardlect()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<SchoolDetailsModal | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: '',
    principalName: '',
    principalEmail: '',
    subscriptionPlan: 'basic' as const,
  })

  const openSchoolDetails = (school: School) => {
    const staffList = getSchoolStaff(school.id)
    const studentList = getSchoolStudents(school.id)
    const parentList = getSchoolParents(school.id)

    const schoolDetails: SchoolDetailsModal = {
      ...school,
      staffList: staffList.map(s => ({ id: s.id, name: s.name, role: s.role, email: s.email })),
      studentList: studentList.map(s => ({ id: s.id, name: s.name, class: s.class, cardStatus: s.cardStatus })),
      parentList: parentList.map(p => ({ id: p.id, name: p.name, contact: p.phone, email: p.email })),
      recentActivities: [
        { id: '1', type: 'gate', description: `${school.students} students scanned at gate`, time: '2 mins ago' },
        { id: '2', type: 'wallet', description: `Wallet transaction: $${school.totalTransactions}`, time: '5 mins ago' },
        { id: '3', type: 'attendance', description: `Attendance recorded: ${school.attendance}%`, time: '8 mins ago' },
      ],
    }
    setSelectedSchool(schoolDetails)
  }

  const toggleStatus = (id: string) => {
    const school = schools.find(s => s.id === id)
    if (school) {
      updateSchool(id, { status: school.status === 'active' ? 'disabled' : 'active' })
    }
  }

  const handleAddSchool = () => {
    if (!formData.name || !formData.subdomain || !formData.email) {
      alert('Please fill in all required fields')
      return
    }
    
    addSchool({
      ...formData,
      status: 'pending',
      students: 0,
      staff: 0,
      parents: 0,
      cardUsage: 0,
      walletActivity: 'low',
      totalTransactions: 0,
      attendance: 0,
      lastActivity: 'Just now',
      establishedDate: new Date().toISOString().split('T')[0],
      features: {
        fastScan: false, liveVerification: false, usbCamera: false, qrCode: false, nfcReader: false,
        attendance: false, wallet: false, library: false, clinic: false, events: false, notifications: false, analytics: false
      }
    })

    setFormData({
      name: '', subdomain: '', email: '', phone: '', address: '', principalName: '', principalEmail: '', subscriptionPlan: 'basic'
    })
    setShowAddForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary'
      case 'disabled': return 'bg-destructive/10 text-destructive'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600'
      default: return 'bg-secondary'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="schools" />
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Schools Management</h1>
                <p className="text-muted-foreground">Manage all schools in the Cardlect ecosystem</p>
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                Add School
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Total Schools</p>
                  <Activity size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.length}</p>
                <p className="text-primary text-xs mt-2">{schools.filter(s => s.status === 'active').length} active</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <Users size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.reduce((sum, s) => sum + s.students, 0).toLocaleString()}</p>
                <p className="text-primary text-xs mt-2">Across all schools</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Avg Card Usage</p>
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{Math.round(schools.filter(s => s.status === 'active').reduce((sum, s) => sum + s.cardUsage, 0) / Math.max(schools.filter(s => s.status === 'active').length, 1))}%</p>
                <p className="text-primary text-xs mt-2">System-wide average</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Transactions Today</p>
                  <Activity size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.reduce((sum, s) => sum + s.totalTransactions, 0).toLocaleString()}</p>
                <p className="text-primary text-xs mt-2">All activity</p>
              </div>
            </div>

            {showAddForm && (
              <SchoolOnboardingWizard onCancel={() => setShowAddForm(false)} onComplete={() => setShowAddForm(false)} />
            )}

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">School</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Subdomain</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Students</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Staff</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Parents</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Usage</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Attendance</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                          No schools added yet. Create your first school to get started.
                        </td>
                      </tr>
                    ) : (
                      schools.map((school, idx) => (
                        <tr key={school.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-foreground font-medium">
                              {school.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{school.subdomain}.cardlect.io</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(school.status)}`}>
                              {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.students}</td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.staff}</td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.parents}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${school.cardUsage}%` }} />
                              </div>
                              <span className="text-xs text-foreground">{school.cardUsage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-foreground font-medium">{school.attendance}%</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <button onClick={() => router.push(`/super-user/school-details/${school.id}`)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="View Details">
                                <Eye size={16} className="text-primary" />
                              </button>
                              <button onClick={() => router.push(`/super-user/school-details/${school.id}?tab=settings`)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="Settings">
                                <Settings size={16} className="text-purple-600" />
                              </button>
                              <button onClick={() => toggleStatus(school.id)} className="p-1 hover:bg-secondary/50 rounded transition-all" title={school.status === 'active' ? 'Deactivate' : 'Activate'}>
                                {school.status === 'active' ? <Pause size={16} className="text-yellow-600" /> : <Play size={16} className="text-green-600" />}
                              </button>
                              <button onClick={() => deleteSchool(school.id)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="Delete">
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{selectedSchool.name}</h2>
              <button onClick={() => setSelectedSchool(null)} className="p-1 hover:bg-secondary/50 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSchool.students}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Staff Members</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSchool.staff}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-primary">{selectedSchool.attendance}%</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Card Usage</p>
                  <p className="text-2xl font-bold text-primary">{selectedSchool.cardUsage}%</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <UserCheck size={20} className="text-primary" />
                  Staff Members ({selectedSchool.staffList.length})
                </h3>
                {selectedSchool.staffList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No staff members added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.staffList.map(staff => (
                      <div key={staff.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{staff.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Recent Students ({selectedSchool.studentList.length})
                </h3>
                {selectedSchool.studentList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.studentList.map(student => (
                      <div key={student.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Class: {student.class}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${student.cardStatus === 'active' || student.cardStatus === 'issued' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                          {student.cardStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Linked Parents ({selectedSchool.parentList.length})
                </h3>
                {selectedSchool.parentList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No parents linked yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.parentList.map(parent => (
                      <div key={parent.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{parent.name}</p>
                          <p className="text-xs text-muted-foreground">{parent.contact}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{parent.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  {selectedSchool.recentActivities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings size={20} className="text-primary" />
                  Management Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => router.push(`/student-registration?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Register Students
                  </button>
                  <button onClick={() => router.push(`/staff-management?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Manage Staff
                  </button>
                  <button onClick={() => router.push(`/parent-management?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Manage Parents
                  </button>
                  <button onClick={() => router.push(`/school-config?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    School Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
