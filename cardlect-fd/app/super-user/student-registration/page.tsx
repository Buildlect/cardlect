'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { Plus, Upload, Camera, LinkIcon, Tag, Trash2, Edit2 } from 'lucide-react'
import { useCardlect } from '@/contexts/cardlect-context'

export default function StudentRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { students, addStudent, updateStudent, deleteStudent, getSchoolStudents, schools } = useCardlect()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [schoolId, setSchoolId] = useState<string>(searchParams?.get('schoolId') || '')
  const [showAddForm, setShowAddForm] = useState(false)
  const [schoolStudents, setSchoolStudents] = useState(students.filter(s => s.schoolId === schoolId))
  const [formData, setFormData] = useState({
    name: '', admissionNo: '', class: '', email: '', phone: '', dateOfBirth: '', parentEmails: ''
  })

  useEffect(() => {
    setSchoolStudents(getSchoolStudents(schoolId))
  }, [schoolId, students])

  const handleAddStudent = () => {
    if (!formData.name || !formData.admissionNo || !schoolId) {
      alert('Please fill in required fields and select a school')
      return
    }

    addStudent({
      schoolId,
      name: formData.name,
      admissionNo: formData.admissionNo,
      class: formData.class || 'Unassigned',
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      parents: formData.parentEmails.split(',').map(e => e.trim()).filter(e => e),
      cardStatus: 'pending',
      imageVerified: false,
      enrollmentDate: new Date().toISOString().split('T')[0],
    })

    setFormData({ name: '', admissionNo: '', class: '', email: '', phone: '', dateOfBirth: '', parentEmails: '' })
    setShowAddForm(false)
  }

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-green-500/10 text-green-600'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600'
      case 'inactive': return 'bg-red-500/10 text-red-600'
      default: return 'bg-secondary'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="students" />
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Student Registration</h1>
                <p className="text-muted-foreground">Register students and issue cards with parent linking</p>
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                Add Student
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

            {showAddForm && schoolId && (
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Register New Student</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Student Name *</label>
                    <input type="text" placeholder="John Paul" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Student ID. *</label>
                    <input type="text" placeholder="STU-001" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input type="email" placeholder="student@school.edu" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input type="tel" placeholder="+234 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Class</label>
                    <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Class</option>
                      <option value="9A">NUR-3</option>
                      <option value="9A">NUR-2</option>
                      <option value="9A">NUR-1</option>
                      <option value="9B">PRI-5</option>
                      <option value="9B">PRI-4</option>
                      <option value="9B">PRI-3</option>
                      <option value="9B">PRI2</option>
                      <option value="9B">PRI-1</option>
                      <option value="10A">SS-3</option>
                      <option value="10B">SS-2</option>
                      <option value="11A">SS-1</option>
                      <option value="11B">JSS-3</option>
                      <option value="12A">JSS-2</option>
                      <option value="12B">JSS-1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Parent Emails (comma-separated)</label>
                    <input type="text" placeholder="parent1@email.com, parent2@email.com" value={formData.parentEmails} onChange={(e) => setFormData({...formData, parentEmails: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all">
                    <Camera size={18} />
                    Capture Photo
                  </button>
                  <button onClick={handleAddStudent} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                    <Tag size={18} />
                    Register & Issue Card
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!schoolId ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">Select a school to view and register students</p>
              </div>
            ) : schoolStudents.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No students registered in this school yet</p>
                <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                  <Plus size={18} />
                  Register First Student
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Admission No.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Class</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image Verified</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolStudents.map((student, idx) => (
                        <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-foreground font-medium">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{student.admissionNo}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{student.class}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{student.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCardStatusColor(student.cardStatus)}`}>
                              {student.cardStatus.charAt(0).toUpperCase() + student.cardStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${student.imageVerified ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                              {student.imageVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button onClick={() => deleteStudent(student.id)} className="p-1 hover:bg-secondary/50 rounded transition-all">
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
  )
}
