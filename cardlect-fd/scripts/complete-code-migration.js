const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const dashboardDir = path.join(appDir, 'dashboard');

// Roles that have pages to migrate
const ROLES = ['admin', 'teacher', 'parent', 'finance', 'security', 'student', 'clinic', 'store', 'super-user', 'approved-stores', 'exam-officer', 'librarian'];

// Pages that should NOT be migrated (we want singletons for these)
const SINGLETON_PAGES = new Set(['communication', 'settings']);

console.log('🚀 Starting complete code migration (not imports)...\n');

let totalMigrated = 0;
let totalSkipped = 0;
const migrations = [];

// For each role, find all page.tsx files and copy them
for (const role of ROLES) {
  const roleDir = path.join(appDir, role);
  
  if (!fs.existsSync(roleDir)) {
    console.log(`⚠️  Role directory not found: ${roleDir}`);
    continue;
  }

  // Recursively find all page.tsx files in this role's directory
  function findPageFiles(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip certain directories
        if (['.next', 'node_modules', '.git'].includes(entry.name)) continue;
        findPageFiles(fullPath, relPath);
      } else if (entry.name === 'page.tsx') {
        const dirName = path.dirname(relPath);
        const pageKey = dirName ? dirName.replace(/\\/g, '/') : '';
        
        // Skip singleton pages
        if (SINGLETON_PAGES.has(pageKey)) {
          console.log(`⏭️  Skipping singleton: /${role}/${pageKey}`);
          totalSkipped++;
          return;
        }
        
        // Create wrapper name: role-pagename (flatten hierarchy)
        // e.g., admin/students -> admin-students
        //       admin/cards/detail -> admin-cards-detail
        let wrapperName = role;
        if (pageKey) {
          const pathParts = pageKey.split(/[\\\/]/);
          wrapperName = [role, ...pathParts].join('-');
        }
        
        const wrapperDir = path.join(dashboardDir, wrapperName);
        const wrapperPagePath = path.join(wrapperDir, 'page.tsx');
        
        // Read the original page content
        let pageContent = fs.readFileSync(fullPath, 'utf-8');
        
        // Create wrapper directory if needed
        if (!fs.existsSync(wrapperDir)) {
          fs.mkdirSync(wrapperDir, { recursive: true });
        }
        
        // Write the actual code (not a wrapper)
        fs.writeFileSync(wrapperPagePath, pageContent, 'utf-8');
        
        migrations.push({
          from: `app/${role}/${pageKey}/page.tsx`,
          to: `app/dashboard/${wrapperName}/page.tsx`,
          role,
          status: '✅'
        });
        
        totalMigrated++;
      }
    }
  }
  
  findPageFiles(roleDir);
}

// Print migration results
console.log('\n' + '='.repeat(80));
console.log('MIGRATION RESULTS');
console.log('='.repeat(80) + '\n');

console.log(`✅ Total pages migrated: ${totalMigrated}`);
console.log(`⏭️  Total pages skipped (singletons): ${totalSkipped}`);
console.log(`📍 Total wrappers created/updated: ${totalMigrated + totalSkipped}\n`);

// Group migrations by role
const byRole = {};
for (const [role, pages] of Object.entries(
  migrations.reduce((acc, m) => {
    if (!acc[m.role]) acc[m.role] = [];
    acc[m.role].push(m);
    return acc;
  }, {})
)) {
  console.log(`\n${role.toUpperCase()} (${pages.length} pages):`);
  pages.forEach(m => {
    console.log(`  ${m.from} → ${m.to}`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('✅ CODE MIGRATION COMPLETE');
console.log('='.repeat(80));
console.log('\nNext steps:');
console.log('1. Review the migrated pages to ensure all code is correct');
console.log('2. Test all role-based navigation thoroughly');
console.log('3. Verify communication and settings singletons work for all roles');
console.log('4. Once verified, delete original role directories');
console.log('5. Run final build and deploy\n');
