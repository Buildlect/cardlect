'use client'

import React from 'react'

export default function PickupLogsTable({ logs }: { logs: { time: string; student: string; parent: string; status: string }[] }) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-card/60">
      <h4 className="text-sm font-semibold text-foreground mb-3">Pickup Logs</h4>
      <div className="overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-sm text-muted-foreground text-left">
              <th className="pb-2">Time</th>
              <th className="pb-2">Student</th>
              <th className="pb-2">Parent</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="py-3 text-sm text-foreground">{l.time}</td>
                <td className="py-3 text-sm text-muted-foreground">{l.student}</td>
                <td className="py-3 text-sm text-muted-foreground">{l.parent}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${l.status === 'Authorized' ? 'bg-emerald-600/10 text-emerald-400' : l.status === 'Denied' ? 'bg-red-600/10 text-red-400' : 'bg-amber-600/10 text-amber-400'}`}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
