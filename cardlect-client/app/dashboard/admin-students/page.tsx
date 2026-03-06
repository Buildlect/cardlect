"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Loader2, UserPlus, UserCheck } from "lucide-react"
import api from "@/lib/api-client"

interface Student {
  id: string
  full_name: string
  admission_number: string
  email: string
  status: string
  role: string
  phone_number?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    admissionNumber: "",
    email: "",
    phoneNumber: "",
    password: "password123"
  })

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users?role=student')
      setStudents(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.admission_number && s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const resetForm = () => {
    setFormData({ fullName: "", admissionNumber: "", email: "", phoneNumber: "", password: "password123" })
    setEditing(null)
  }

  const handleCreateStudent = async () => {
    setNotice(null)
    if (!formData.fullName || !formData.admissionNumber || !formData.email) {
      setNotice({ type: "error", text: "Please fill required fields." })
      return
    }
    try {
      await api.post('/users/create', { ...formData, role: 'student' })
      setNotice({ type: "success", text: "Student registered successfully." })
      setShowForm(false)
      resetForm()
      fetchStudents()
    } catch (err: any) {
      setNotice({ type: "error", text: err.response?.data?.message || 'Registration failed.' })
    }
  }

  const beginEdit = (student: Student) => {
    setEditing(student)
    setFormData({
      fullName: student.full_name || "",
      admissionNumber: student.admission_number || "",
      email: student.email || "",
      phoneNumber: student.phone_number || "",
      password: "password123",
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateStudent = async () => {
    if (!editing) return
    setNotice(null)
    if (!formData.fullName || !formData.email) {
      setNotice({ type: "error", text: "Name and email are required." })
      return
    }
    try {
      await api.put(`/users/${editing.id}`, {
        fullName: formData.fullName,
        admissionNumber: formData.admissionNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      })
      setNotice({ type: "success", text: "Student updated successfully." })
      setShowForm(false)
      resetForm()
      fetchStudents()
    } catch (err: any) {
      setNotice({ type: "error", text: err.response?.data?.message || 'Update failed.' })
    }
  }

  const handleDeleteStudent = async (student: Student) => {
    setNotice(null)
    if (!confirm(`Delete student ${student.full_name}? This action cannot be undone.`)) return
    try {
      await api.delete(`/users/${student.id}`)
      setNotice({ type: "success", text: "Student deleted successfully." })
      fetchStudents()
    } catch (err: any) {
      setNotice({ type: "error", text: err.response?.data?.message || 'Delete failed.' })
    }
  }

  return (
    <DashboardLayout currentPage="students">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Student Registry</h2>
            <p className="text-muted-foreground mt-1">Manage official student records and smart card identifiers.</p>
          </div>
          <Button
            onClick={() => {
              if (!showForm) resetForm()
              setShowForm(!showForm)
            }}
            className="bg-primary hover:bg-primary-darker text-white rounded-xl py-6 px-8 flex items-center gap-2"
          >
            <UserPlus size={20} /> Register Student
          </Button>
        </div>

        {notice && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notice.text}
          </div>
        )}

        {showForm && (
          <Card className="border-primary/20 shadow-xl animate-in fade-in slide-in-from-top-4">
            <CardHeader>
              <CardTitle>{editing ? 'Edit Student' : 'Register New Active Student'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input placeholder="Full Name (Official)" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="rounded-xl" />
                <Input placeholder="Admission ID" value={formData.admissionNumber} onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })} className="rounded-xl" />
                <Input placeholder="Institutional Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl" />
                <Input placeholder="Phone (Optional)" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="rounded-xl" />
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={editing ? handleUpdateStudent : handleCreateStudent} className="bg-primary hover:bg-primary-darker text-white rounded-xl px-8">
                  {editing ? 'Save Changes' : 'Confirm Enrollment'}
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  variant="outline"
                  className="rounded-xl px-8"
                >
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter students by name, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border"
            />
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Students</span>
            <span className="text-xl font-black text-primary">{students.length}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Student Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Admission ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Entity Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{student.full_name.charAt(0)}</div>
                          <p className="text-sm font-bold text-foreground">{student.full_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{student.admission_number || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">{student.email}</p>
                        <p className="text-[10px] text-muted-foreground">{student.phone_number || 'No Phone'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.status === "active" ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{student.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => beginEdit(student)}><Edit size={14} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500" onClick={() => handleDeleteStudent(student)}><Trash2 size={14} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="p-20 text-center">
                  <UserCheck size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">No students found in the current registry.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
