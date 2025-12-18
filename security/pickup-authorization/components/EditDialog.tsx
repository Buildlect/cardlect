 'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type Authorization = { id: string; student: string; class: string; authorizedPerson: string; relationship: string; status: string }

export default function EditDialog({
  open,
  initial,
  onCancel,
  onSave,
}: {
  open: boolean
  initial: Authorization | null
  onCancel: () => void
  onSave: (data: Authorization) => void
}) {
  const [form, setForm] = useState<Authorization | null>(initial)

  useEffect(() => {
    setForm(initial)
  }, [initial])

  if (!open || !form) return null

  const update = (k: keyof Authorization, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative bg-background border border-border rounded-2xl w-full max-w-lg p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Edit Authorization</h3>
            <p className="text-sm text-muted-foreground mt-1">Update details for this authorization record.</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded hover:bg-secondary/50" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Student</label>
            <input value={form.student} onChange={(e) => update('student', e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-border bg-card" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Class</label>
            <input value={form.class} onChange={(e) => update('class', e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-border bg-card" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Authorized Person</label>
            <input value={form.authorizedPerson} onChange={(e) => update('authorizedPerson', e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-border bg-card" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Relationship</label>
            <input value={form.relationship} onChange={(e) => update('relationship', e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-border bg-card" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full mt-1 px-3 py-2 rounded border border-border bg-card">
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-card/60 border border-border">Cancel</button>
          <button
            onClick={() => {
              if (form) onSave(form)
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
