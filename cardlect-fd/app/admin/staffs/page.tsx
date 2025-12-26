"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

// selectable roles (could be moved to a separate file and imported)
const roles = [
  "Class Teacher",
  "Security Personnel",
  "Clinic Staff",
  "Cafeteria Staff",
  "clinical Staff",
]

const mockStaff = [
  {
    id: 1,
    name: "Mr. Okafor",
    role: "Mathematics Teacher",
    class: "SS2 Science",
    email: "okafor@school.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Mrs. Afolabi",
    role: "English Teacher",
    class: "SS1 Arts",
    email: "afolabi@school.com",
    status: "Active",
  },
  {
    id: 3,
    name: "Mr. Eze",
    role: "Principal",
    class: "Administration",
    email: "eze@school.com",
    status: "Active",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState(mockStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    class: "",
    email: "",
    password: "",
  })

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddStaff = () => {
    if (formData.name && formData.role && formData.password) {
      const newMember = {
        id: staff.length + 1,
        ...formData,
        status: "Active",
      }
      setStaff([...staff, newMember])
      setFormData({ name: "", role: "", class: "", email: "", password: "" })
      setShowForm(false)
    }
  }

  const handleDeleteStaff = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id))
  }

  return (
    <DashboardLayout currentPage="staffs" role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Staff Management</h2>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={18} /> Add Staff
          </Button>
        </div>

        {/* Modal */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowForm(false)}
            />
            <div
              className="relative z-10 w-full max-w-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Add New Staff Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    {/* role as selectable dropdown */}
                    <div>
                      <label className="sr-only">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full rounded border px-3 py-2"
                      >
                        <option value="">Select role</option>
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

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
                      type="password"
                      placeholder="Set password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={handleAddStaff} className="bg-primary hover:bg-primary/90">
                      Save Staff
                    </Button>
                    <Button onClick={() => setShowForm(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Staff ({filteredStaff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No staff members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Role</th>
                      <th className="text-left py-2 px-4">Class</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{member.name}</td>
                        <td className="py-2 px-4">{member.role}</td>
                        <td className="py-2 px-4">{member.class}</td>
                        <td className="py-2 px-4">{member.email}</td>
                        <td className="py-2 px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                            {member.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button className="p-1 hover:bg-muted rounded">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
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
    </DashboardLayout>
  )
}
