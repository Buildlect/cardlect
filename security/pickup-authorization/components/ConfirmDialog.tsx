 'use client'

import React from 'react'
import { X } from 'lucide-react'

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative bg-background border border-border rounded-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
          </div>
          <button onClick={onCancel} className="p-2 rounded hover:bg-secondary/50" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-card/60 border border-border">{cancelText}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
