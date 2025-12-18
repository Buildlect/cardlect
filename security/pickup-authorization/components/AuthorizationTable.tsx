'use client'

import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Avatar from './Avatar'

export default function AuthorizationTable({
  list,
  onEdit,
  onDelete,
}: {
  list: { id: string; student: string; class: string; authorizedPerson: string; relationship: string; status: string }[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  function statusClass(s: string) {
    switch (s.toLowerCase()) {
      case 'active':
        return 'bg-emerald-600/10 text-emerald-400'
      case 'expired':
        return 'bg-red-600/10 text-red-400'
      case 'pending':
        return 'bg-amber-600/10 text-amber-400'
      default:
        return 'bg-muted-foreground/10 text-muted-foreground'
    }
  }

  return (
    <div className="rounded-2xl p-6 border border-border bg-card/60">
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground text-left border-b border-border pb-2">
              <th className="py-3">STUDENT</th>
              <th className="py-3">CLASS</th>
              <th className="py-3">AUTHORIZED PERSON</th>
              <th className="py-3">RELATIONSHIP</th>
              <th className="py-3">STATUS</th>
              <th className="py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="py-4 flex items-center gap-3">
                  <Avatar name={row.student} size={40} />
                  <div className="text-foreground">{row.student}</div>
                </td>
                <td className="py-4 text-muted-foreground">{row.class}</td>
                <td className="py-4 text-muted-foreground">{row.authorizedPerson}</td>
                <td className="py-4 text-muted-foreground">{row.relationship}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(row.status)}`}>{row.status}</span>
                </td>
                <td className="py-4 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <button onClick={() => onEdit?.(row.id)} className="p-2 rounded-md hover:bg-input/40" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete?.(row.id)} className="p-2 rounded-md hover:bg-input/40" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
