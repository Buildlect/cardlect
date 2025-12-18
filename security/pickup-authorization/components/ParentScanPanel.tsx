'use client'

import React from 'react'
import Avatar from './Avatar'

type Parent = { id: string; name: string; relationship: string }

export default function ParentScanPanel({ parent, onScan, liveVerify, setLiveVerify, pinVerify, setPinVerify }: { parent: Parent | null; onScan: () => void; liveVerify: boolean; setLiveVerify: (v: boolean) => void; pinVerify: boolean; setPinVerify: (v: boolean) => void }) {
  return (
    <div className="rounded-2xl p-6 border border-border bg-card/60 animate__animated animate__fadeInUp">
      <h3 className="text-lg font-semibold text-foreground mb-4">Parent Scan</h3>

      <div className="flex items-start gap-4">
        <div className="w-24 h-24">
          {/* @ts-ignore */}
          <Avatar name={parent?.name ?? ''} size={60} />
        </div>

        <div className="flex-1">
          <p className="text-foreground text-xl font-bold">{parent?.name ?? '—'}</p>
          <p className="text-muted-foreground">{parent?.relationship ?? '—'}</p>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={liveVerify} onChange={(e) => setLiveVerify(e.target.checked)} />
              Live Image Verification
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pinVerify} onChange={(e) => setPinVerify(e.target.checked)} />
              PIN Verification
            </label>
          </div>
        </div>
      </div>

      <button onClick={onScan} className="mt-6 w-full bg-primary text-primary-foreground py-2 rounded-lg">Scan Parent Card</button>
    </div>
  )
}
