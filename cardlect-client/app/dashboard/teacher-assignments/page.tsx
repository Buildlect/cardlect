'use client'

import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Assignment {
  id: string
  title: string
  className: string
  classId: string
  dueDate: string
  status: 'open' | 'closing' | 'closed'
}

interface ClassOption {
  id: string
  name: string
}

interface ClassRow {
  id: string
  name?: string
}

interface AssignmentRow {
  id: string
  title?: string
  class_id?: string
  due_date?: string
  dueDate?: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newAssignmentForm, setNewAssignmentForm] = useState({ title: '', description: '', dueDate: '', maxScore: '100', classId: '' })

  const fetchData = useCallback(async () => {
    try {
      const [assignmentRes, classRes] = await Promise.all([
        api.get('/academics/assignments'),
        api.get('/academics/classes'),
      ])

      const classRows: ClassRow[] = Array.isArray(classRes.data?.data) ? classRes.data.data : []
      const classMap = new Map<string, string>(classRows.map((row) => [row.id, row.name || 'Unnamed Class']))
      const classOptions = classRows.map((row) => ({ id: row.id, name: row.name || 'Unnamed Class' }))
      setClasses(classOptions)

      const assignmentRows: AssignmentRow[] = Array.isArray(assignmentRes.data?.data) ? assignmentRes.data.data : []
      setAssignments(assignmentRows.map((row) => {
        const due = row.due_date || row.dueDate
        const now = new Date()
        const dueDate = new Date(due || new Date().toISOString())
        const hoursLeft = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        const status: Assignment['status'] = hoursLeft < 0 ? 'closed' : hoursLeft <= 24 ? 'closing' : 'open'
        return {
          id: row.id,
          title: row.title || 'Untitled Assignment',
          classId: row.class_id,
          className: classMap.get(row.class_id) || row.class_id || 'N/A',
          dueDate: due,
          status,
        }
      }))

      if (classOptions[0]?.id) {
        setNewAssignmentForm((prev) => ({ ...prev, classId: classOptions[0].id }))
      }
    } catch (error) {
      console.error('Failed to load assignments:', error)
      setAssignments([])
      setClasses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = {
    total: assignments.length,
    open: assignments.filter(a => a.status === 'open').length,
    closing: assignments.filter(a => a.status === 'closing').length,
    closed: assignments.filter(a => a.status === 'closed').length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock style={{ color: CARDLECT_COLORS.primary.darker }} size={16} />
      case 'closing': return <AlertCircle style={{ color: CARDLECT_COLORS.warning.main }} size={16} />
      case 'closed': return <CheckCircle style={{ color: CARDLECT_COLORS.success.main }} size={16} />
      default: return null
    }
  }

  const handleAddAssignment = async () => {
    if (!newAssignmentForm.title.trim() || !newAssignmentForm.dueDate || !newAssignmentForm.classId) {
      alert('Title, class and due date are required')
      return
    }

    setSaving(true)
    try {
      await api.post('/academics/assignments', {
        classId: newAssignmentForm.classId,
        title: newAssignmentForm.title.trim(),
        description: newAssignmentForm.description,
        dueDate: newAssignmentForm.dueDate,
        maxScore: Number(newAssignmentForm.maxScore || 100),
      })

      setNewAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        maxScore: '100',
        classId: classes[0]?.id || '',
      })
      setShowNew(false)
      await fetchData()
      alert('Assignment created successfully')
    } catch (error) {
      console.error('Failed to create assignment:', error)
      alert('Failed to create assignment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout currentPage="assignments" role="staff" customRole="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground">Create and manage student assignments</p>
          </div>
          <Button onClick={() => setShowNew(!showNew)} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90 transition-opacity">
            <Plus size={18} /> {showNew ? 'Cancel' : 'New Assignment'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Total Assignments</div><div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.total}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Open</div><div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.open}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Closing Soon</div><div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.warning.main }}>{stats.closing}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Closed</div><div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.closed}</div></CardContent></Card>
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input type="text" placeholder="Assignment title" value={newAssignmentForm.title} onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea placeholder="Assignment description" value={newAssignmentForm.description} onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date *</label>
                  <input type="date" value={newAssignmentForm.dueDate} onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class *</label>
                  <select value={newAssignmentForm.classId} onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, classId: e.target.value })} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground">
                    {classes.map((cls) => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddAssignment} disabled={saving} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90">{saving ? 'Creating...' : 'Create Assignment'}</Button>
              <Button onClick={() => setShowNew(false)} variant="outline">Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading assignments...</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(assignment.status)}
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                        <div><span className="text-muted-foreground">Class: </span><span className="font-medium">{assignment.className}</span></div>
                        <div><span className="text-muted-foreground">Due: </span><span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span></div>
                        <div><span className="text-muted-foreground">Status: </span><span className="font-medium capitalize">{assignment.status}</span></div>
                      </div>
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
