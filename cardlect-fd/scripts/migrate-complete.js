const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..', 'app')
const dashboardDir = path.join(appDir, 'dashboard')

function isDashboard(p) {
  return p.split(path.sep).includes('dashboard')
}

function walk(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...walk(full))
    } else if (e.isFile() && e.name === 'page.tsx') {
      files.push(full)
    }
  }
  return files
}

// Pages that should be consolidated (not duplicated per role)
const SINGLETON_PAGES = new Set(['communication', 'settings', 'setting'])

function makeWrapperFor(originalPage) {
  const rel = path.relative(appDir, originalPage) // e.g. admin\students\page.tsx
  if (rel.startsWith('dashboard')) return null

  const parts = rel.split(path.sep) // ['admin','students','page.tsx']
  parts.pop() // remove page.tsx

  // If this is a singleton page, skip it (handle separately)
  const lastPart = parts[parts.length - 1]
  if (SINGLETON_PAGES.has(lastPart)) return null

  // Separate dynamic segments and fixed
  const fixed = parts.filter(p => !p.startsWith('['))
  const dynamics = parts.filter(p => p.startsWith('['))

  const flatName = fixed.join('-') || 'home'
  const targetDir = path.join(dashboardDir, flatName, ...dynamics)
  const wrapperPath = path.join(targetDir, 'page.tsx')

  // Export path relative to project using alias
  const exportPath = path.posix.join('@/app', parts.join('/'), 'page')

  return { wrapperPath, exportPath, targetDir }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function createSingletonPages() {
  // Create /dashboard/communication
  const commDir = path.join(dashboardDir, 'communication')
  ensureDir(commDir)
  const commContent = `'use client'
import { useProtectedRoute } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { CommunicationComponent } from "@/components/CommunicationComponent"

export default function CommunicationPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  // Map role display names
  const roleNames: Record<string, string> = {
    admin: 'Admin Communications',
    'super-user': 'Super User Communications',
    security: 'Security Communications',
    finance: 'Finance Communications',
    teacher: 'Teacher Communications',
    parents: 'Parent Communications',
    students: 'Student Communications',
    teacher: 'Teacher Communications',
    clinic: 'Clinic Communications',
    store: 'Store Communications',
    'approved-stores': 'Store Communications',
    'exam-officer': 'Exam Officer Communications',
    librarian: 'Librarian Communications',
  }

  const roleSubtitles: Record<string, string> = {
    admin: 'Connect with super-user, security, and finance teams',
    'super-user': 'Connect with all system users and administrators',
    security: 'Coordinate with admin and super-user teams',
    finance: 'Connect with admin, super-user, and parents',
    teacher: 'Connect with super-user, admin, parents, and students',
    parents: 'Connect with teachers, admin, and finance teams',
    students: 'Connect with teachers and admin',
    clinic: 'Connect with admin, super-user, parents, and students',
    store: 'Connect with super-user and finance teams',
    'approved-stores': 'Connect with super-user, finance, and store partners',
    'exam-officer': 'Coordinate with super-user, admin, teachers, and students',
    librarian: 'Connect with students, teachers, and administrators',
  }

  return (
    <DashboardLayout currentPage="communication" role={user.role}>
      <CommunicationComponent
        currentRole={user.role}
        title={roleNames[user.role] || 'Communications'}
        subtitle={roleSubtitles[user.role] || 'Connect and collaborate with team members'}
        accentColor={{ start: 'orange', end: 'amber' }}
      />
    </DashboardLayout>
  )
}
`
  fs.writeFileSync(path.join(commDir, 'page.tsx'), commContent, 'utf8')

  // Create /dashboard/settings
  const settingsDir = path.join(dashboardDir, 'settings')
  ensureDir(settingsDir)
  const settingsContent = `'use client'
import { useProtectedRoute } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SettingsPageTemplate } from "@/components/SettingsPageTemplate"

export default function SettingsPage() {
  const { user, isAuthorized, isLoading } = useProtectedRoute()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace('/auth/login')
    }
  }, [isLoading, isAuthorized, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  const roleDisplayNames: Record<string, string> = {
    'super-user': 'Super User',
    admin: 'School Admin',
    security: 'Security Officer',
    finance: 'Finance Manager',
    teacher: 'Teacher',
    parents: 'Parent',
    students: 'Student',
    clinic: 'Clinic Staff',
    store: 'Store Manager',
    'approved-stores': 'Store Manager',
    'exam-officer': 'Exam Officer',
    librarian: 'Librarian',
  }

  const roleInitials: Record<string, string> = {
    'super-user': 'SU',
    admin: 'AD',
    security: 'SO',
    finance: 'FM',
    teacher: 'TH',
    parents: 'PA',
    students: 'ST',
    clinic: 'CS',
    store: 'SM',
    'approved-stores': 'SM',
    'exam-officer': 'EO',
    librarian: 'LB',
  }

  return (
    <SettingsPageTemplate
      role={user.role}
      roleDisplayName={roleDisplayNames[user.role] || user.role}
      roleInitials={roleInitials[user.role] || 'US'}
    />
  )
}
`
  fs.writeFileSync(path.join(settingsDir, 'page.tsx'), settingsContent, 'utf8')

  console.log('Created singleton pages:/dashboard/communication and /dashboard/settings')
}

function main() {
  console.log('Clearing existing dashboard wrappers...')
  if (fs.existsSync(dashboardDir)) {
    fs.rmSync(dashboardDir, { recursive: true, force: true })
  }
  fs.mkdirSync(dashboardDir, { recursive: true })

  // Create singleton pages first
  createSingletonPages()

  // Then create wrappers for all other pages
  const pages = walk(appDir)
  let created = 0
  for (const p of pages) {
    if (isDashboard(p)) continue
    const info = makeWrapperFor(p)
    if (!info) continue
    ensureDir(info.targetDir)
    const lines = [
      "'use client'",
      "import { default as dynamicImport } from 'next/dynamic'",
      `const Page = dynamicImport(() => import('${info.exportPath}'), { ssr: false })`,
      "export default function DashboardWrapper(props: any) {",
      "  return Page ? <Page {...props} /> : null",
      "}"
    ]
    const content = lines.join('\n') + '\n'
    fs.writeFileSync(info.wrapperPath, content, 'utf8')
    created++
  }
  console.log(`Created ${created} wrapper files and 2 singleton pages (communication, settings) under /app/dashboard`)
}

main()
