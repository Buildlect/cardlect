'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Plus, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useCardlect } from '@/contexts/cardlect-context'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

export default function StaffManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { staff, addStaff, deleteStaff, updateStaff, getSchoolStaff, schools } = useCardlect()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [schoolId, setSchoolId] = useState<string>(searchParams?.get('schoolId') || '')
  const [showAddForm, setShowAddForm] = useState(false)
  const [schoolStaff, setSchoolStaff] = useState(staff.filter(s => s.schoolId === schoolId))
  const [formData, setFormData] = useState({
    name: '', role: '', email: '', phone: '', department: '', password: ''
  })

  useEffect(() => {
    setSchoolStaff(getSchoolStaff(schoolId))
  }, [schoolId, staff])

  const handleAddStaff = () => {
    if (!formData.name || !formData.role || !schoolId || !formData.password) {
      alert('Please fill in required fields (Name, Role, School and Password)')
      return
    }

    addStaff({
      schoolId,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      department: formData.department || 'General',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      permissions: [],
    })

    setFormData({ name: '', role: '', email: '', phone: '', department: '', password: '' })
    setShowAddForm(false)
  }

  const toggleStatus = (id: string) => {
    const member = staff.find(s => s.id === id)
    if (member) {
      updateStaff(id, { status: member.status === 'active' ? 'inactive' : 'active' })
    }
  }

  return (
    <DashboardLayout currentPage="staff-management" role="super-user">
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
                <p className="text-muted-foreground">Manage school staff and assign permissions</p>
              </div>
              <button onClick={() => setShowAddForm(true)} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                <Plus size={18} />
                Add Staff Member
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Select School</label>
              <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Choose a school...</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            {/* Modal for registration form */}
            {showAddForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddForm(false)} />
                <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-2xl z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Add Staff Member</h2>
                      <p className="text-sm text-muted-foreground">Register a new staff account for the selected school</p>
                    </div>
                    <button onClick={() => setShowAddForm(false)} className="p-2 rounded hover:bg-secondary/20">
                      <X size={18} />
                    </button>
                  </div>

                  {!schoolId && (
                    <div style={{ backgroundColor: `${CARDLECT_COLORS.warning.main}15`, borderColor: CARDLECT_COLORS.warning.main, color: CARDLECT_COLORS.warning.main }} className="mb-4 p-4 border rounded text-sm">
                      Please select a school before adding a staff member.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <input type="text" placeholder="Peter Pan" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Role *</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Select Role</option>
                        <option value="Principal">School Admin</option>
                        <option value="Teacher">Class Teacher</option>
                        <option value="IT Manager">Cafeterian</option>
                        <option value="Admin">Librarian</option>
                        <option value="Other">Security</option>
                        <option value="Other">Clinic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input type="email" placeholder="peter@school.edu" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input type="tel" placeholder="+234 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
                      <input type="password" placeholder="Enter a password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                      <input type="text" placeholder="Administration" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleAddStaff} disabled={!schoolId} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50">
                      <Plus size={18} />
                      Add Staff Member
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!schoolId ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">Select a school to manage staff</p>
              </div>
            ) : schoolStaff.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No staff members added yet</p>
                <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                  <Plus size={18} />
                  Add First Staff Member
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolStaff.map((member, idx) => (
                        <tr key={member.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-foreground font-medium">{member.name}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{member.role}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{member.department}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{member.email}</td>
                          <td className="px-6 py-4">
                            <span style={{
                              backgroundColor: member.status === 'active' ? `${CARDLECT_COLORS.success.main}20` : `${CARDLECT_COLORS.danger.main}20`,
                              color: member.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main,
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              width: 'fit-content'
                            }}>
                              {member.status === 'active' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button onClick={() => toggleStatus(member.id)} className="px-3 py-1 text-xs bg-secondary text-foreground rounded hover:bg-secondary/80 transition-all">
                                {member.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => deleteStaff(member.id)} className="p-1 hover:bg-secondary/50 rounded transition-all">
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  )
}
