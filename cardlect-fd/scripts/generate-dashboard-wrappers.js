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

function makeWrapperFor(originalPage) {
  const rel = path.relative(appDir, originalPage) // e.g. admin\students\page.tsx
  if (rel.startsWith('dashboard')) return null

  const parts = rel.split(path.sep) // ['admin','students','page.tsx']
  parts.pop() // remove page.tsx

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

function main() {
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
  console.log(`Created ${created} wrapper files under /app/dashboard`)
}

main()
