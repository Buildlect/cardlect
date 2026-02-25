"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"

const mockClasses = [
  { id: 1, name: "JSS 1A", students: 35, teacher: "Mr. Okafor", capacity: 50 },
  { id: 2, name: "JSS 1B", students: 38, teacher: "Mrs. Afolabi", capacity: 50 },
  { id: 3, name: "JSS 2A", students: 42, teacher: "Mr. Eze", capacity: 50 },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState(mockClasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", teacher: "", capacity: 50 })

  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddClass = () => {
    if (formData.name && formData.teacher) {
      const newClass = {
        id: classes.length + 1,
        ...formData,
        students: 0,
        capacity: Number(formData.capacity),
      }
      setClasses([...classes, newClass])
      setFormData({ name: "", teacher: "", capacity: 50 })
      setShowForm(false)
    }
  }

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter((c) => c.id !== id))
  }

  return (
    <DashboardLayout currentPage="classes" role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Classes Management</h2>
          <Button onClick={() => setShowForm(true)} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 gap-2">
            <Plus size={18} /> Add Class
          </Button>
        </div>

        {/* Modal (simple implementation) */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowForm(false)}
              aria-hidden
            />
            <Card className="z-10 w-full max-w-2xl mx-4" role="dialog" aria-modal="true">
              <CardHeader>
                <CardTitle>Create New Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Class Name (e.g., JSS 1A)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    placeholder="Class Teacher"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={String(formData.capacity)}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: Number(e.target.value || 0) })
                    }
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleAddClass} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90">
                    Create Class
                  </Button>
                  <Button onClick={() => setShowForm(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No classes found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-semibold">
                        {cls.students}/{cls.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${(cls.students / cls.capacity) * 100}%`, backgroundColor: CARDLECT_COLORS.primary.darker }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Teacher: {cls.teacher}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                        <Users size={14} /> View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
