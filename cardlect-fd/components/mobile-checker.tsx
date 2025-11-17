'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function MobilePopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const handleResize = () => setShowPopup(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!showPopup) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-lg rounded-lg animate-slide-in">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="font-bold">Desktop Mode Recommended</p>
          <p className="text-sm">For the best experience, please switch to a desktop or larger screen.</p>
        </div>
        <button onClick={() => setShowPopup(false)} className="text-yellow-700 hover:text-yellow-900">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
