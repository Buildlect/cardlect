'use client'

import React from 'react'

function bgColorFromName(name: string) {
  const colors = ['bg-[#f97316]', 'bg-[#ef4444]', 'bg-[#06b6d4]', 'bg-[#8b5cf6]', 'bg-[#10b981]']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
  const initials = name
    ? name
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '--'

  const bg = name ? bgColorFromName(name) : 'bg-[#2a2a2a]'

  const style = { width: size, height: size }

  return (
    <div style={style} className={`rounded-full flex items-center justify-center text-white font-semibold ${bg}`}>{initials}</div>
  )
}
