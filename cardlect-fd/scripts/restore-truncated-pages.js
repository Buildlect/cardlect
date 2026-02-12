const fs = require('fs')
const path = require('path')

const baseDir = path.join(__dirname, '..')
const dashboardDir = path.join(baseDir, 'app', 'dashboard')

// Get all page.tsx files from dashboard recursively
function getAllPages(dir, prefix = '') {
  const files = fs.readdirSync(dir)
  const pages = []
  
  files.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory() && !file.startsWith('[')) {
      const subPages = getAllPages(fullPath, prefix ? `${prefix}/${file}` : file)
      pages.push(...subPages)
    } else if (stat.isDirectory() && file.startsWith('[')) {
      const pagePath = path.join(fullPath, 'page.tsx')
      if (fs.existsSync(pagePath)) {
        const name = prefix ? `${prefix}/${file}` : file
        pages.push({ name, path: pagePath })
      }
    }
  })
  
  // Check for page.tsx in this directory
  const pagePath = path.join(dir, 'page.tsx')
  if (fs.existsSync(pagePath)) {
    pages.push({ name: prefix || 'root', path: pagePath })
  }
  
  return pages
}

const dashboardPages = getAllPages(dashboardDir)

console.log('Checking for truncated pages...\n')

let restored = 0
let skipped = 0

dashboardPages.forEach(page => {
  const dashboardContent = fs.readFileSync(page.path, 'utf-8')
  const dashboardLines = dashboardContent.split('\n').length
  
  // Skip auth pages - they should stay in original location
  if (page.name.startsWith('auth-')) {
    console.log(`⏭️  SKIP: ${page.name} (auth pages excluded)`)
    skipped++
    return
  }
  
  // Try to find original file
  let originalPath = null
  
  // First, try based on common naming patterns
  const nameVariations = [
    // Flatten back to original path
    page.name.replace(/-/g, '/'),
    // Try as direct role path
    page.name.split('-')[0], // First part might be role
  ]
  
  for (const variation of nameVariations) {
    const testPath = path.join(baseDir, 'app', `${variation}/page.tsx`)
    if (fs.existsSync(testPath)) {
      originalPath = testPath
      break
    }
  }
  
  // If not found and has multiple segments, try parent structures
  if (!originalPath && page.name.includes('/')) {
    const parts = page.name.split('/')
    // Try: role/subpage/page.tsx
    let testPath = path.join(baseDir, 'app', ...parts, 'page.tsx')
    if (fs.existsSync(testPath)) {
      originalPath = testPath
    }
  }
  
  if (originalPath && fs.existsSync(originalPath)) {
    const originalContent = fs.readFileSync(originalPath, 'utf-8')
    const originalLines = originalContent.split('\n').length
    
    // If original is significantly longer, restore it
    if (originalLines > dashboardLines + 10) {
      fs.writeFileSync(page.path, originalContent, 'utf-8')
      console.log(`✅ RESTORED: ${page.name} (${dashboardLines} → ${originalLines} lines)`)
      restored++
    } else {
      console.log(`⏸️  OK: ${page.name} (${dashboardLines} lines)`)
      skipped++
    }
  } else {
    console.log(`⏸️  OK: ${page.name} (${dashboardLines} lines, no original found)`)
    skipped++
  }
})

console.log(`\n${'='.repeat(60)}`)
console.log(`SUMMARY`)
console.log(`${'='.repeat(60)}`)
console.log(`✅ Restored: ${restored}`)
console.log(`⏸️  OK/Kept: ${skipped}`)
console.log(`Total checked: ${restored + skipped}`)
