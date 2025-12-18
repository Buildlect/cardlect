'use client'

import React from 'react'

import Avatar from './Avatar'

export default function AuthorizedPersonsTable({ persons }: { persons: { id: string; name: string; relationship: string; cardStatus: string }[] }) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-card/60">
      <h4 className="text-sm font-semibold text-foreground mb-3">Authorized Persons</h4>
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-sm text-muted-foreground text-left">
              <th className="pb-2">Name</th>
              <th className="pb-2">Relationship</th>
              <th className="pb-2">Card Status</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-3 text-sm text-foreground flex items-center gap-3">
                  <Avatar name={p.name} size={36} />
                  {p.name}
                </td>
                <td className="py-3 text-sm text-muted-foreground">{p.relationship}</td>
                <td className="py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-sm ${p.cardStatus === 'Active' ? 'bg-emerald-600/10 text-emerald-400' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{p.cardStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
