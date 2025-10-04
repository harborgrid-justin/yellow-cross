#!/usr/bin/env node

/**
 * Setup Verification Script
 * Verifies that Yellow Cross Platform setup is complete
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

console.log('\n🔍 Yellow Cross - Setup Verification\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let allChecksPassed = true;
const checks = [];

// Helper function to check file exists
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  checks.push({
    name: description,
    passed: exists,
    path: filePath
  });
  return exists;
}

// Helper function to check directory exists
function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  checks.push({
    name: description,
    passed: exists,
    path: dirPath
  });
  return exists;
}

// 1. Check project structure
console.log('📁 Project Structure\n');

checkDirectory(path.join(rootDir, 'backend'), 'Backend directory');
checkDirectory(path.join(rootDir, 'frontend'), 'Frontend directory');
checkDirectory(path.join(rootDir, 'scripts'), 'Scripts directory');
checkFile(path.join(rootDir, 'package.json'), 'package.json');
checkFile(path.join(rootDir, 'docker-compose.yml'), 'docker-compose.yml');
checkFile(path.join(rootDir, 'Dockerfile'), 'Dockerfile');

console.log();

// 2. Check environment configuration
console.log('⚙️  Environment Configuration\n');

checkFile(path.join(rootDir, '.env'), '.env file');
checkFile(path.join(rootDir, '.env.example'), '.env.example template');

// Verify .env has required variables
if (fs.existsSync(path.join(rootDir, '.env'))) {
  const envContent = fs.readFileSync(path.join(rootDir, '.env'), 'utf8');
  const requiredVars = ['DATABASE_URL', 'PORT', 'NODE_ENV', 'JWT_SECRET'];
  
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`);
    checks.push({
      name: `${varName} in .env`,
      passed: hasVar
    });
  });
}

console.log();

// 3. Check Prisma setup
console.log('🗄️  Prisma Configuration\n');

checkFile(path.join(rootDir, 'backend/prisma/schema.prisma'), 'Prisma schema');
checkDirectory(path.join(rootDir, 'backend/src/generated/prisma'), 'Prisma client generated');

// Check if Prisma client has key files
if (fs.existsSync(path.join(rootDir, 'backend/src/generated/prisma'))) {
  checkFile(path.join(rootDir, 'backend/src/generated/prisma/index.js'), 'Prisma client index');
  checkFile(path.join(rootDir, 'backend/src/generated/prisma/index.d.ts'), 'Prisma client types');
}

console.log();

// 4. Check dependencies
console.log('📦 Dependencies\n');

checkDirectory(path.join(rootDir, 'node_modules'), 'node_modules directory');
checkDirectory(path.join(rootDir, 'node_modules/@prisma/client'), '@prisma/client installed');
checkDirectory(path.join(rootDir, 'node_modules/express'), 'Express installed');
checkDirectory(path.join(rootDir, 'node_modules/pg'), 'PostgreSQL driver installed');

console.log();

// 5. Check backend structure
console.log('🔧 Backend Structure\n');

checkFile(path.join(rootDir, 'backend/src/index.js'), 'Backend entry point');
checkDirectory(path.join(rootDir, 'backend/src/config'), 'Config directory');
checkDirectory(path.join(rootDir, 'backend/src/features'), 'Features directory');
checkFile(path.join(rootDir, 'backend/src/config/database.js'), 'Database config');

console.log();

// 6. Check documentation
console.log('📚 Documentation\n');

checkFile(path.join(rootDir, 'README.md'), 'README.md');
checkFile(path.join(rootDir, 'QUICK_START.txt'), 'QUICK_START.txt');
checkFile(path.join(rootDir, 'SETUP_VERIFICATION.md'), 'SETUP_VERIFICATION.md');
checkFile(path.join(rootDir, 'ENTERPRISE_SETUP_COMPLETE.md'), 'ENTERPRISE_SETUP_COMPLETE.md');
checkFile(path.join(rootDir, 'ISSUE_RESOLUTION.md'), 'ISSUE_RESOLUTION.md');

console.log();

// Print results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 Verification Results\n');

const passedChecks = checks.filter(c => c.passed).length;
const totalChecks = checks.length;

checks.forEach(check => {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
  if (!check.passed) {
    allChecksPassed = false;
    if (check.path) {
      console.log(`   Missing: ${check.path}`);
    }
  }
});

console.log();
console.log(`\n📈 Total: ${passedChecks}/${totalChecks} checks passed\n`);

if (allChecksPassed) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ Setup Complete!\n');
  console.log('Your Yellow Cross Platform is ready to use.\n');
  console.log('Next steps:');
  console.log('  1. Start the server: npm start');
  console.log('  2. Or use Docker: npm run docker:setup');
  console.log('  3. Run tests: npm test');
  console.log('  4. Open Prisma Studio: npm run prisma:studio');
  console.log('\n📖 See README.md for more information.\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
} else {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  Setup Incomplete\n');
  console.log('Some checks failed. Please review the errors above.\n');
  console.log('💡 Common fixes:');
  console.log('  - Missing .env: Run "npm run setup:env"');
  console.log('  - Missing Prisma client: Run "npm run prisma:generate"');
  console.log('  - Missing dependencies: Run "npm install"');
  console.log('\n📖 See SETUP_VERIFICATION.md for detailed troubleshooting.\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}
