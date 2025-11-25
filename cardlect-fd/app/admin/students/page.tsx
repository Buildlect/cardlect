"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LayoutShell from "@/components/Admins/layout.shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Lock } from "lucide-react"

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
  }

  return (
    <LayoutShell currentPage="students">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Student Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-accent hover:bg-accent/90 gap-2">
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
              <Button onClick={handleAddStudent} className="bg-accent hover:bg-accent/90">
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
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            student.cardStatus === "Issued"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200"
                          }`}
                        >
                          {student.cardStatus}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="p-1 hover:bg-muted rounded">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 hover:bg-muted rounded">
                          <Lock size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-1 hover:bg-muted rounded text-red-500"
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
    </div>
    </LayoutShell>
  )
}
