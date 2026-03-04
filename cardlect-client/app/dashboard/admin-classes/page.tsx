"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Users, Loader2, BookOpen, UserCheck, GraduationCap } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"

interface AcademicClass {
  id: string
  name: string
  teacher_name?: string
  student_count: number
  capacity: number
  level?: string
  section?: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<AcademicClass[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", teacher_name: "", capacity: 40, level: "", section: "" })

  const fetchClasses = async () => {
    setLoading(true)
    try {
      const response = await api.get('/academic/classes')
      setClasses(response.data.data)
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddClass = async () => {
    if (!formData.name) {
      alert("Class name is required")
      return
    }
    try {
      await api.post('/academic/classes', formData)
      alert('Class created successfully!')
      setShowForm(false)
      fetchClasses()
      setFormData({ name: "", teacher_name: "", capacity: 40, level: "", section: "" })
    } catch (err: any) {
      alert(err.response?.data?.message || 'Creation failed')
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    alert('Delete functionality pending backend implementation.')
  }

  return (
    <DashboardLayout currentPage="classes" role="school_admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground">Classroom Management</h2>
            <p className="text-muted-foreground mt-1 tracking-tight">Organize student rosters, teacher assignments, and classroom capacity.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary-darker text-white rounded-xl py-6 px-8 flex items-center gap-2">
            <Plus size={20} /> New Academic Group
          </Button>
        </div>

        {showForm && (
          <Card className="border-primary/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle>Define New Class Structure</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Class Designation</label>
                  <Input
                    placeholder="e.g. SS3 Science A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Assigned Teacher</label>
                  <Input
                    placeholder="Lead Instructor Name"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Max Capacity</label>
                  <Input
                    type="number"
                    placeholder="Enrollment Limit"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="rounded-xl h-12"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button onClick={handleAddClass} className="bg-primary hover:bg-primary-darker text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20">
                  Save Configuration
                </Button>
                <Button onClick={() => setShowForm(false)} variant="ghost" className="rounded-xl px-10 h-12 font-bold">
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Meta */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter classes by name or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-muted/30 border-border h-12 font-medium"
            />
          </div>
          <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Groups</span>
            <span className="text-2xl font-black text-primary">{classes.length}</span>
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const fillPercent = (cls.student_count / (cls.capacity || 1)) * 100;
              return (
                <Card key={cls.id} className="border-border hover:border-primary/50 transition-all hover:shadow-xl group overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b border-border/50 group-hover:bg-primary/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-black text-foreground">{cls.name}</CardTitle>
                      <BookOpen size={20} className="text-primary opacity-40" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Enrollment Density</span>
                        <span className={fillPercent > 90 ? 'text-red-500' : 'text-primary'}>
                          {cls.student_count} / {cls.capacity || '∞'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${fillPercent}%`,
                            backgroundColor: fillPercent > 90 ? '#ef4444' : CARDLECT_COLORS.primary.main
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                        <UserCheck size={14} className="text-primary" />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {cls.teacher_name || 'No lead teacher assigned'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                        <GraduationCap size={14} className="text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                          Academic Level: {cls.level || 'Standardized'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button variant="outline" size="sm" className="flex-1 rounded-lg font-bold border-2 hover:bg-primary hover:text-white transition-all">
                        Roster
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-muted-foreground hover:text-primary">
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg h-9 w-9 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && filteredClasses.length === 0 && (
          <div className="bg-card border-2 border-dashed border-border rounded-3xl p-20 text-center">
            <Users size={64} className="mx-auto text-muted-foreground opacity-20 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Clusters Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Initialize your school structure by defining classes and academic groupings above.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
