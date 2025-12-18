 'use client'

import React from 'react'
import Avatar from './Avatar'

type Student = {
  id: string
  name: string
  class: string
  lastEntry: string
  recentPickups: string[]
}

export default function StudentScanPanel({ student, onScan, onVerify }: { student: Student | null; onScan: () => void; onVerify: (id: string) => void }) {
  const [idInput, setIdInput] = React.useState('')
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-border bg-card/60 animate__animated animate__fadeInUp">
        <h3 className="text-lg font-semibold text-foreground mb-4">Scan ID Card or Enter ID Number</h3>

        <p className="text-sm text-muted-foreground mb-4">Place the card near the scanner or manually type the ID below.</p>

        <div className="rounded-lg p-6 bg-input/40 border border-border flex items-center gap-4">
          <div className="w-28 h-28 bg-[#232323] rounded-md flex items-center justify-center text-muted-foreground">QR</div>
          <div className="flex-1">
            <input value={idInput} onChange={(e) => setIdInput(e.target.value)} placeholder="Enter ID Number" className="w-full bg-transparent border border-transparent px-4 py-3 rounded-md text-foreground" />
          </div>
          <button onClick={() => onVerify(idInput)} className="ml-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">Verify</button>
        </div>

        <div className="mt-4">
          <button onClick={onScan} className="w-full bg-primary text-primary-foreground py-2 rounded-lg">Scan Student Card</button>
        </div>
      </div>

      {/* show summary if student present */}
      {student && (
        <div className="rounded-2xl p-6 border border-border bg-card/60 animate__animated animate__fadeInUp">
          <h4 className="text-sm font-semibold text-foreground mb-3">Student Summary</h4>
          <div className="flex items-center gap-4">
              <div className="w-20 h-20">
                {/* Avatar */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Avatar name={student?.name ?? ''} size={80} />
              </div>
            <div>
              <p className="text-lg font-bold text-foreground">{student.name}</p>
              <p className="text-muted-foreground">{student.class}</p>
              <p className="text-sm text-muted-foreground">Last entry: {student.lastEntry}</p>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-1">Recent pickups</p>
                <div className="flex gap-2 flex-wrap">
                  {student.recentPickups.map((p) => (
                    <span key={p} className="px-3 py-1 bg-input rounded-full text-sm">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
