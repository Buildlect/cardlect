'use client'

import * as Icons from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ComponentType, SVGProps } from 'react'

interface SidebarProps {
  open: boolean
  onToggle: () => void
  onNavigate: (href: string) => void
  currentPage: string
}

type IconComp = ComponentType<SVGProps<SVGSVGElement>>

const menuItems: { icon: IconComp; label: string; href: string; id: string }[] = [
  { icon: Icons.Squares2X2Icon, label: 'Dashboard', href: '/security', id: 'dashboard' },
  { icon: Icons.BellAlertIcon, label: 'Alerts', href: '/security/alerts', id: 'alerts' },
  { icon: Icons.DocumentTextIcon, label: 'Gate Logs', href: '/security/gate-logs', id: 'gate-logs' },
  { icon: Icons.UserCircleIcon, label: 'Pickup Authorization', href: '/security/pickup-authorization', id: 'pickup-authorization' },
  { icon: Icons.UserGroupIcon, label: 'Visitor & Incident Log', href: '/security/visitor-incident', id: 'visitor-incident' },
  { icon: Icons.Cog6ToothIcon, label: 'Settings', href: '/security/settings', id: 'settings' },
]

function Tooltip({ text }: { text: string }) {
  return (
    <span
      role="tooltip"
      className="
        pointer-events-none absolute left-full ml-3 top-1/2 
        -translate-y-1/2 whitespace-normal max-w-xs 
        bg-white text-gray-900 text-sm rounded border border-gray-200
        px-2 py-1 shadow-lg opacity-0 scale-95 -translate-x-2 
        transition-all duration-150 ease-out
        group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
        z-50
        dark:bg-[rgba(17,24,39,0.95)] dark:text-white dark:border-transparent
      "
    >
      <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border border-gray-200 shadow-sm dark:bg-[rgba(17,24,39,0.95)] dark:border-transparent" />
      {text}
    </span>
  )
}

export function SecuritySidebar({ open, onToggle, onNavigate, currentPage }: SidebarProps) {
  return (
    <aside
      className={
        `${open ? 'w-64' : 'w-20'} bg-white text-gray-700 border-r border-gray-200 transition-all duration-300 flex flex-col dark:bg-[#151517] dark:text-gray-200 dark:border-[#111827]`
      }
    >
      <div className="p-6 flex items-center justify-between">
        {open && <span className="text-2xl font-bold text-orange-500 tracking-tight">Cardlect</span>}

        <button onClick={onToggle} className="group relative p-1 hover:bg-orange-50 rounded-lg dark:hover:bg-[#111827]" aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}>
          {open ? <Icons.XMarkIcon className="h-5 w-5 text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" /> : <Icons.Bars3Icon className="h-5 w-5 text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />}
          <Tooltip text={open ? 'Collapse sidebar' : 'Expand sidebar'} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-2">
        {menuItems.map(({ icon: Icon, label, href, id }) => (
          <Link
            key={id}
            href={href}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(href)
            }}
            aria-label={label}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]`}
          >
            <Icon className="h-5 w-5 transition-colors text-gray-500 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400" />

            {open && <span className="text-sm font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400">{label}</span>}

            {!open && <Tooltip text={label} />}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-[#111827]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 transition-all dark:text-gray-200 dark:hover:bg-[rgba(234,88,12,0.06)]">
          <Icons.ArrowLeftOnRectangleIcon className="h-5 w-5" />
          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default SecuritySidebar
