const fs = require('fs')
const path = require('path')

const dashboardPath = path.join(__dirname, '..', 'app', 'dashboard')

// Find all directories with specific names ending with -./
const invalidDirNames = [
  'admin-.',
  'approved-stores-.',
  'clinic-.',
  'exam-officer-.',
  'finance-.',
  'librarian-.',
  'parent-.',
  'security-.',
  'store-.',
  'student-.',
  'super-user-.',
  'teacher-.'
]

console.log(`Found ${invalidDirNames.length} invalid directories to clean up:\n`)

invalidDirNames.forEach(dirName => {
  const fullPath = path.join(dashboardPath, dirName)
  try {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true })
      console.log(`✅ Deleted: ${dirName}`)
    } else {
      console.log(`⏭️  Skipped: ${dirName} (does not exist)`)
    }
  } catch (error) {
    console.log(`❌ Failed to delete ${dirName}: ${error.message}`)
  }
})

console.log(`\nCleanup complete!`)

// Verify they're gone
console.log(`\nVerifying cleanup...`)
const remaining = fs.readdirSync(dashboardPath).filter(entry => entry.endsWith('-./'))
if (remaining.length === 0) {
  console.log(`✅ No invalid directories remaining`)
} else {
  console.log(`⚠️  ${remaining.length} invalid directories still present: ${remaining.join(', ')}`)
}

