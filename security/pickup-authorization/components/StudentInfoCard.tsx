'use client'

import React from 'react'
import Avatar from './Avatar'

export default function StudentInfoCard({ student }: { student: any | null }) {
  return (
    <div className="rounded-2xl p-6 border border-border bg-card/60">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20">
          {/* @ts-ignore */}
          <Avatar name={student?.name ?? ''} size={80} />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{student?.name ?? '—'}</p>
          <p className="text-muted-foreground">{student?.class ?? '—'}</p>
          <p className="text-sm text-muted-foreground">Last entry: {student?.lastEntry ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
