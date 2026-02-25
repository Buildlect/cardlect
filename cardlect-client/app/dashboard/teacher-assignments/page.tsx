'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface Assignment {
  id: string
  title: string
  class: string
  dueDate: string
  submitted: number
  total: number
  status: 'open' | 'closing' | 'closed'
}

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Quadratic Equations Problem Set', class: '10A', dueDate: '2024-01-20', submitted: 32, total: 35, status: 'open' },
  { id: '2', title: 'Algebra Worksheet Chapter 5', class: '10A', dueDate: '2024-01-18', submitted: 34, total: 35, status: 'closing' },
  { id: '3', title: 'Math Exam Review', class: '10B', dueDate: '2024-01-15', submitted: 38, total: 38, status: 'closed' },
  { id: '4', title: 'Problem Solving Activity', class: '11', dueDate: '2024-01-22', submitted: 18, total: 28, status: 'open' },
]

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(mockAssignments)
  const [showNew, setShowNew] = useState(false)
  const [newAssignmentForm, setNewAssignmentForm] = useState({ title: '', description: '', dueDate: '', maxScore: '100', class: '10A' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const stats = {
    total: assignments.length,
    open: assignments.filter(a => a.status === 'open').length,
    submitted: assignments.reduce((sum, a) => sum + a.submitted, 0),
    totalSubmittable: assignments.reduce((sum, a) => sum + a.total, 0),
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return <Clock style={{ color: CARDLECT_COLORS.primary.darker }} size={16} />
      case 'closing': return <AlertCircle style={{ color: CARDLECT_COLORS.warning.main }} size={16} />
      case 'closed': return <CheckCircle style={{ color: CARDLECT_COLORS.success.main }} size={16} />
      default: return null
    }
  }

  const getSubmissionPercentage = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100)
  }

  const handleAddAssignment = () => {
    if (!newAssignmentForm.title.trim() || !newAssignmentForm.dueDate) {
      alert('Title and due date are required')
      return
    }
    const newAssignment: Assignment = {
      id: `${assignments.length + 1}`,
      title: newAssignmentForm.title.trim(),
      class: newAssignmentForm.class,
      dueDate: newAssignmentForm.dueDate,
      submitted: 0,
      total: 35,
      status: 'open'
    }
    setAssignments([newAssignment, ...assignments])
    setNewAssignmentForm({ title: '', description: '', dueDate: '', maxScore: '100', class: '10A' })
    setShowNew(false)
    alert('Assignment created successfully!')
  }

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id))
    setDeleteConfirm(null)
    alert('Assignment deleted')
  }

  return (
    <DashboardLayout currentPage="assignments" role="teacher">
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

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Assignments</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.info.main }}>{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-2">All classes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{stats.open}</div>
              <div className="text-xs text-muted-foreground mt-2">Awaiting submissions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Submitted</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>{stats.submitted}</div>
              <div className="text-xs text-muted-foreground mt-2">Out of {stats.totalSubmittable}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Submission Rate</div>
              <div className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.success.main }}>
                {Math.round((stats.submitted / stats.totalSubmittable) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">Overall</div>
            </CardContent>
          </Card>
        </div>

        {/* New Assignment Form */}
        {showNew && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input type="text" placeholder="Assignment title" value={newAssignmentForm.title} onChange={(e) => setNewAssignmentForm({...newAssignmentForm, title: e.target.value})} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea placeholder="Assignment description" value={newAssignmentForm.description} onChange={(e) => setNewAssignmentForm({...newAssignmentForm, description: e.target.value})} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date *</label>
                  <input type="date" value={newAssignmentForm.dueDate} onChange={(e) => setNewAssignmentForm({...newAssignmentForm, dueDate: e.target.value})} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <select value={newAssignmentForm.class} onChange={(e) => setNewAssignmentForm({...newAssignmentForm, class: e.target.value})} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground">
                    <option>10A</option>
                    <option>10B</option>
                    <option>11</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddAssignment} style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="text-white hover:opacity-90">Create Assignment</Button>
              <Button onClick={() => setShowNew(false)} variant="outline">Cancel</Button>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submissionPct = getSubmissionPercentage(assignment.submitted, assignment.total)
            return (
              <Card key={assignment.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(assignment.status)}
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-muted-foreground">Class: </span>
                          <span className="font-medium">{assignment.class}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Due: </span>
                          <span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status: </span>
                          <span className="font-medium capitalize">{assignment.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submissions</span>
                      <span className="font-semibold">{assignment.submitted}/{assignment.total} ({submissionPct}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${submissionPct}%`, backgroundColor: CARDLECT_COLORS.success.main }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">View Submissions</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(assignment.id)} className="text-red-500 hover:bg-red-50">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
            <div className="bg-white dark:bg-card rounded-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Delete Assignment?</h3>
              <p className="text-muted-foreground mb-6">This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteAssignment(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 border rounded py-2 hover:bg-muted">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
