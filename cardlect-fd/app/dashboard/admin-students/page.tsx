"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Lock } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"

const mockStudents = [
  {
    id: 1,
    name: "Chioma Okonkwo",
    admission: "ADM001",
    class: "JSS1",
    email: "chioma@school.com",
    cardStatus: "Issued",
    phone: "08012345678",
  },
  {
    id: 2,
    name: "Tunde Adebayo",
    admission: "ADM002",
    class: "JSS1",
    email: "tunde@school.com",
    cardStatus: "Issued",
    phone: "08023456789",
  },
  {
    id: 3,
    name: "Amara Nwankwo",
    admission: "ADM003",
    class: "JSS2",
    email: "amara@school.com",
    cardStatus: "Pending",
    phone: "08034567890",
  },
  {
    id: 4,
    name: "Seun Akinbami",
    admission: "ADM004",
    class: "JSS2",
    email: "seun@school.com",
    cardStatus: "Issued",
    phone: "08045678901",
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", admission: "", class: "", email: "", phone: "" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: "", class: "", admission: "", cardStatus: "Issued" })
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [cardStatusModal, setCardStatusModal] = useState<{ id: number; currentStatus: string } | null>(null)

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admission.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStudent = () => {
    if (formData.name && formData.admission) {
      const newStudent = {
        id: students.length + 1,
        ...formData,
        cardStatus: "Pending",
      }
      setStudents([...students, newStudent])
      setFormData({ name: "", admission: "", class: "", email: "", phone: "" })
      setShowForm(false)
    }
  }

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((s) => s.id !== id))
    setDeleteConfirm(null)
  }

  const handleEditStudent = (student: any) => {
    setEditingId(student.id)
    setEditForm({ name: student.name, class: student.class, admission: student.admission, cardStatus: student.cardStatus })
  }

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.admission.trim() || !editForm.class.trim()) {
      alert('All fields are required')
      return
    }
    setStudents(students.map((s) => s.id === editingId ? { ...s, name: editForm.name, class: editForm.class, admission: editForm.admission, cardStatus: editForm.cardStatus } : s))
    setEditingId(null)
    alert('Student updated successfully!')
  }

  const handleCardStatusToggle = (id: number, currentStatus: string) => {
    const statuses = ['Issued', 'Blocked', 'Suspended']
    const currentIndex = statuses.indexOf(currentStatus)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    setStudents(students.map((s) => s.id === id ? { ...s, cardStatus: nextStatus } : s))
    setCardStatusModal(null)
    alert(`Card status changed to ${nextStatus}`)
  }

  return (
    <DashboardLayout currentPage="students" role="admin">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Student Management</h2>
        <Button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 gap-2">
          <Plus size={18} /> Add Student
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Admission Number"
                value={formData.admission}
                onChange={(e) => setFormData({ ...formData, admission: e.target.value })}
              />
              <Input
                placeholder="Class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleAddStudent} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90">
                Save Student
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No students found. Add your first student to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Admission</th>
                    <th className="text-left py-2 px-4">Class</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Card Status</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{student.name}</td>
                      <td className="py-2 px-4">{student.admission}</td>
                      <td className="py-2 px-4">{student.class}</td>
                      <td className="py-2 px-4">{student.email}</td>
                      <td className="py-2 px-4">
                        <span
                          style={{
                            backgroundColor: student.cardStatus === "Issued" 
                              ? `${CARDLECT_COLORS.success.main}20` 
                              : `${CARDLECT_COLORS.warning.main}20`,
                            color: student.cardStatus === "Issued" 
                              ? CARDLECT_COLORS.success.main 
                              : CARDLECT_COLORS.warning.main
                          }}
                          className="px-2 py-1 rounded text-xs font-medium"
                        >
                          {student.cardStatus}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button onClick={() => handleEditStudent(student)} className="p-1 hover:bg-muted rounded" title="Edit student">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setCardStatusModal({ id: student.id, currentStatus: student.cardStatus })} className="p-1 hover:bg-muted rounded" title="Toggle card status">
                          <Lock size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(student.id)}
                          className="p-1 hover:bg-muted rounded text-red-500"
                          title="Delete student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setEditingId(null)}>
          <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Edit Student</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1 font-medium">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border rounded px-3 py-2 text-foreground bg-background" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Admission Number</label>
                <input type="text" value={editForm.admission} onChange={(e) => setEditForm({...editForm, admission: e.target.value})} className="w-full border rounded px-3 py-2 text-foreground bg-background" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Class</label>
                <input type="text" value={editForm.class} onChange={(e) => setEditForm({...editForm, class: e.target.value})} className="w-full border rounded px-3 py-2 text-foreground bg-background" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Card Status</label>
                <select value={editForm.cardStatus} onChange={(e) => setEditForm({...editForm, cardStatus: e.target.value})} className="w-full border rounded px-3 py-2 text-foreground bg-background">
                  <option>Issued</option>
                  <option>Blocked</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveEdit} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="flex-1 text-white py-2 rounded hover:opacity-90">Save</button>
              <button onClick={() => setEditingId(null)} className="flex-1 border rounded py-2 hover:bg-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Delete Student?</h3>
            <p className="text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => handleDeleteStudent(deleteConfirm)} style={{ backgroundColor: CARDLECT_COLORS.danger.main }} className="flex-1 text-white py-2 rounded hover:opacity-90">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border rounded py-2 hover:bg-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Card Status Toggle */}
      {cardStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setCardStatusModal(null)}>
          <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Change Card Status</h3>
            <p className="text-muted-foreground mb-6">Current status: <span className="font-semibold text-foreground">{cardStatusModal.currentStatus}</span></p>
            <div className="space-y-2 mb-6">
              {['Issued', 'Blocked', 'Suspended'].map((status) => (
                <button key={status} onClick={() => handleCardStatusToggle(cardStatusModal.id, cardStatusModal.currentStatus)} className="w-full p-3 border rounded text-left hover:bg-secondary transition-colors">
                  {status}
                </button>
              ))}
            </div>
            <button onClick={() => setCardStatusModal(null)} className="w-full border rounded py-2 hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
