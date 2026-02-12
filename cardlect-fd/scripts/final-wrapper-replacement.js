const fs = require('fs')
const path = require('path')

// Map of wrapper files to their source files
const wrapperMappings = [
  {
    wrapper: 'app/dashboard/admin/page.tsx',
    source: 'app/admin/page.tsx'
  },
  {
    wrapper: 'app/dashboard/teacher/page.tsx',
    source: 'app/teacher/page.tsx'
  },
  {
    wrapper: 'app/dashboard/security/page.tsx',
    source: 'app/security/page.tsx'
  },
  {
    wrapper: 'app/dashboard/parent/page.tsx',
    source: 'app/parent/page.tsx'
  },
  {
    wrapper: 'app/dashboard/librarian/page.tsx',
    source: 'app/librarian/page.tsx'
  },
  {
    wrapper: 'app/dashboard/home/page.tsx',
    source: 'app/page.tsx'
  },
  {
    wrapper: 'app/dashboard/exam-officer/page.tsx',
    source: 'app/exam-officer/page.tsx'
  },
  {
    wrapper: 'app/dashboard/super-user-school-details/[id]/page.tsx',
    source: 'app/super-user/school-details/[id]/page.tsx'
  },
  {
    wrapper: 'app/dashboard/finance/page.tsx',
    source: 'app/finance/page.tsx'
  },
  {
    wrapper: 'app/dashboard/clinic/page.tsx',
    source: 'app/clinic/page.tsx'
  },
  {
    wrapper: 'app/dashboard/approved-stores/page.tsx',
    source: 'app/approved-stores/page.tsx'
  },
  {
    wrapper: 'app/dashboard/auth-reset-password/page.tsx',
    source: 'app/auth/reset-password/page.tsx'
  },
  {
    wrapper: 'app/dashboard/auth-newlogin/page.tsx',
    source: 'app/auth/newlogin/page.tsx'
  },
  {
    wrapper: 'app/dashboard/auth-recovery/page.tsx',
    source: 'app/auth/recovery/page.tsx'
  },
  {
    wrapper: 'app/dashboard/auth-logout/page.tsx',
    source: 'app/auth/logout/page.tsx'
  },
  {
    wrapper: 'app/dashboard/auth-2fa/page.tsx',
    source: 'app/auth/2fa/page.tsx'
  }
]

const projectRoot = path.join(__dirname, '..')

console.log('Starting wrapper replacement...')
console.log(`Project root: ${projectRoot}\n`)

let successCount = 0
let failureCount = 0
const results = []

wrapperMappings.forEach(mapping => {
  try {
    const sourcePath = path.join(projectRoot, mapping.source)
    const wrapperPath = path.join(projectRoot, mapping.wrapper)

    // Check if source exists
    if (!fs.existsSync(sourcePath)) {
      console.log(`❌ SOURCE NOT FOUND: ${mapping.source}`)
      failureCount++
      results.push({ mapping: mapping.wrapper, status: 'FAILED', reason: 'Source not found' })
      return
    }

    // Check if wrapper exists
    if (!fs.existsSync(wrapperPath)) {
      console.log(`⚠️  WRAPPER NOT FOUND: ${mapping.wrapper}`)
      results.push({ mapping: mapping.wrapper, status: 'SKIPPED', reason: 'Wrapper not found' })
      return
    }

    // Read source file
    const sourceContent = fs.readFileSync(sourcePath, 'utf-8')

    // Check if source is already the actual page (not a wrapper)
    if (!sourceContent.includes('dynamicImport')) {
      fs.writeFileSync(wrapperPath, sourceContent, 'utf-8')
      console.log(`✅ REPLACED: ${mapping.wrapper}`)
      successCount++
      results.push({ mapping: mapping.wrapper, status: 'SUCCESS', reason: 'Copied from source' })
    } else {
      console.log(`⏭️  SKIPPED: ${mapping.wrapper} (source is still a wrapper)`)
      results.push({ mapping: mapping.wrapper, status: 'SKIPPED', reason: 'Source is a wrapper' })
    }
  } catch (error) {
    console.log(`❌ ERROR: ${mapping.wrapper} - ${error.message}`)
    failureCount++
    results.push({ mapping: mapping.wrapper, status: 'ERROR', reason: error.message })
  }
})

console.log(`\n${'='.repeat(60)}`)
console.log(`SUMMARY`)
console.log(`${'='.repeat(60)}`)
console.log(`✅ Successful replacements: ${successCount}`)
console.log(`⚠️  Failures: ${failureCount}`)
console.log(`Total processed: ${wrapperMappings.length}`)
