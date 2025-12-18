'use client'

import React from 'react'

type Event = { time: string; type: string; status: string }

function statusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'bg-emerald-600/10 text-emerald-500'
    case 'pending':
      return 'bg-yellow-500/10 text-amber-500'
    case 'denied':
      return 'bg-red-600/10 text-red-500'
    default:
      return 'bg-muted-foreground/10 text-muted-foreground'
  }
}

export default function RecentEventsTable({ events }: { events: Event[] }) {
  return (
    <div className="space-y-3">
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-sm text-muted-foreground text-left">
              <th className="pb-2">Time</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="py-3 text-sm text-foreground">{e.time}</td>
                <td className="py-3 text-sm text-foreground">{e.type}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses(e.status)}`}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
