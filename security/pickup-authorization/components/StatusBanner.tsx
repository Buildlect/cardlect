'use client'

import React from 'react'

export default function StatusBanner({ status }: { status: 'AUTHORIZED' | 'DENIED' | 'MISMATCH' | null }) {
  if (!status) return null

  const classes =
    status === 'AUTHORIZED'
      ? 'bg-emerald-700 text-emerald-100'
      : status === 'DENIED'
      ? 'bg-red-700 text-red-100'
      : 'bg-amber-700 text-amber-100'

  return (
    <div className={`px-4 py-3 rounded-md text-center font-semibold ${classes} animate__animated animate__fadeInDown`}>
      {status}
    </div>
  )
}
