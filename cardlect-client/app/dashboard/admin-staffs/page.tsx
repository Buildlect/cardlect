"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Loader2, UserPlus, Briefcase } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"

interface StaffMember {
  id: string
  full_name: string
  role: string
  email: string
  status: string
  department?: string
  designation?: string
  phone_number?: string
  employee_id?: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "password123",
    department: "",
    designation: "",
    employeeId: ""
  })

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users?role=staff')
      setStaff(response.data.data)
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const filteredStaff = staff.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department && s.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.designation && s.designation.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateStaff = async () => {
    if (!formData.fullName || !formData.email || !formData.designation) {
      alert("Please fill required fields")
      return
    }
    try {
      await api.post('/users/create', {
        ...formData,
        role: 'staff'
      })
      alert('Staff member registered successfully!')
      setShowForm(false)
      fetchStaff()
      setFormData({ fullName: "", email: "", password: "password123", department: "", designation: "", employeeId: "" })
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <DashboardLayout currentPage="staffs" role="school_admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Staff Directory</h2>
            <p className="text-muted-foreground mt-1">Manage institutional personnel and administrative roles.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-darker text-white rounded-xl py-6 px-8 flex items-center gap-2">
            <UserPlus size={20} /> Add Staff Member
          </Button>
        </div>

        {showForm && (
          <Card className="border-primary/20 shadow-xl animate-in fade-in slide-in-from-top-4">
            <CardHeader>
              <CardTitle>Register New Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  placeholder="Full Name (Legal)"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Employee ID (Internal)"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Primary Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Official Designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleCreateStaff} className="bg-primary hover:bg-primary-darker text-white rounded-xl px-8">
                  Confirm Registration
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl px-8">
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name, department or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border"
            />
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase">Personnel Count</span>
            <span className="text-xl font-black text-primary">{staff.length}</span>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Name & Access</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Employee ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Department</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Designation</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {member.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{member.full_name}</p>
                            <p className="text-[10px] text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{member.employee_id || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{member.department || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-foreground italic">{member.designation || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${member.status === "active" ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Edit size={14} /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500"><Trash2 size={14} /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStaff.length === 0 && (
                <div className="p-20 text-center">
                  <Briefcase size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">No personnel records found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
