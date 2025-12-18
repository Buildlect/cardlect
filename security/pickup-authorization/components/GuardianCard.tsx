'use client'

import React from 'react'
import Avatar from './Avatar'

export default function GuardianCard({ parent }: { parent: any | null }) {
  return (
    <div className="rounded-2xl p-6 border border-border bg-card/60">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20">
          {/* @ts-ignore */}
          <Avatar name={parent?.name ?? ''} size={80} />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{parent?.name ?? '—'}</p>
          <p className="text-muted-foreground">{parent?.relationship ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
