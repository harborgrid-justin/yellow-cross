/**
 * Script to convert feature pages to the domain structure template
 * This applies the same perspective from PR 126 (admin pages) to all domain pages
 */

const fs = require('fs');
const path = require('path');

// List of all features to convert (excluding admin which is already converted)
const FEATURES_TO_CONVERT = [
  'antitrust-competition',
  'appellate-practice',
  'aviation-law',
  'bankruptcy-management',
  'calendar-scheduling',
  'case-management',
  'civil-rights',
  'class-action',
  'client-crm',
  'communication',
  'compliance',
  'construction-law',
  'consumer-protection',
  'contract-management',
  'corporate-governance',
  'court-docket',
  'criminal-defense',
  'cybersecurity-legal',
  'data-privacy',
  'document-management',
  'ediscovery',
  'education-law',
  'employment-law',
  'energy-utilities',
  'environmental-law',
  'estate-planning',
  'family-law',
  'financial-services',
  'franchise-law',
  'government-contracts',
  'healthcare-law',
  'immigration-law',
  'insurance-defense',
  'integration',
  'intellectual-property',
  'international-trade',
  'labor-relations',
  'landlord-tenant',
  'legal-research',
  'litigation-management',
  'maritime-law',
  'mediation-adr',
  'mergers-acquisitions',
  'municipal-law',
  'non-profit-law',
  'personal-injury',
  'pro-bono',
  'real-estate-transactions',
  'reporting-analytics',
  'securities-law',
  'security',
  'social-security',
  'sports-entertainment',
  'task-workflow',
  'tax-law',
  'technology-transactions',
  'telecommunications',
  'time-billing',
  'veterans-affairs',
  'white-collar-crime'
];

// Helper to convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper to convert kebab-case to Title Case with spaces
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Read a file and replace placeholders
function processTemplate(templatePath, replacements) {
  let content = fs.readFileSync(templatePath, 'utf-8');
  
  // Apply all replacements
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  });
  
  return content;
}

// Convert a single feature to the pages domain structure
function convertFeatureToDomain(featureName) {
  console.log(`\n📦 Converting ${featureName}...`);
  
  const pascalName = toPascalCase(featureName);
  const titleName = toTitleCase(featureName);
  
  const pagesDir = path.join(__dirname, '../frontend/src/pages');
  const adminDir = path.join(pagesDir, 'admin');
  const targetDir = path.join(pagesDir, featureName);
  
  // Create directory structure
  const componentsDir = path.join(targetDir, 'components');
  const storeDir = path.join(targetDir, 'store');
  
  [targetDir, componentsDir, storeDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  const replacements = {
    'Admin': pascalName,
    'admin': featureName,
    'ADMIN': featureName.toUpperCase().replace(/-/g, '_'),
    'Admin Management': `${titleName} Management`,
    'admin management': `${featureName.replace(/-/g, ' ')} management`,
    'admin item': `${featureName.replace(/-/g, ' ')} item`,
    'Admin Item': `${titleName} Item`,
    'Manage and monitor admin items': `Manage and monitor ${featureName.replace(/-/g, ' ')} items`,
    'Administrative user management': `${titleName} management`,
    'WF-COMP-001': 'WF-COMP-TBD',
    'WF-COMP-002': 'WF-COMP-TBD',
    'WF-COMP-003': 'WF-COMP-TBD',
    'WF-COMP-004': 'WF-COMP-TBD',
    'WF-COMP-005': 'WF-COMP-TBD',
    'WF-COMP-006': 'WF-COMP-TBD',
    'WF-COMP-007': 'WF-COMP-TBD',
    'WF-COMP-008': 'WF-COMP-TBD',
    'WF-COMP-009': 'WF-COMP-TBD',
    'WF-COMP-010': 'WF-COMP-TBD',
    'WF-COMP-011': 'WF-COMP-TBD',
    'WF-COMP-012': 'WF-COMP-TBD',
    'WF-COMP-013': 'WF-COMP-TBD'
  };
  
  // Copy main page files
  const mainFiles = [
    'AdminMain.tsx',
    'AdminDetail.tsx',
    'AdminCreate.tsx',
    'AdminEdit.tsx',
    'routes.tsx',
    'index.ts'
  ];
  
  mainFiles.forEach(file => {
    const sourcePath = path.join(adminDir, file);
    const targetFile = file.replace('Admin', pascalName);
    const targetPath = path.join(targetDir, targetFile);
    
    const content = processTemplate(sourcePath, replacements);
    fs.writeFileSync(targetPath, content);
    console.log(`  ✓ Created ${targetFile}`);
  });
  
  // Copy component files
  const componentFiles = [
    'AdminList.tsx',
    'AdminCard.tsx',
    'AdminForm.tsx',
    'AdminDetails.tsx',
    'AdminFilters.tsx',
    'AdminSettings.tsx',
    'index.ts'
  ];
  
  componentFiles.forEach(file => {
    const sourcePath = path.join(adminDir, 'components', file);
    const targetFile = file.replace('Admin', pascalName);
    const targetPath = path.join(componentsDir, targetFile);
    
    const content = processTemplate(sourcePath, replacements);
    fs.writeFileSync(targetPath, content);
    console.log(`  ✓ Created components/${targetFile}`);
  });
  
  // Copy store files
  const storeFiles = [
    'adminSlice.ts',
    'index.ts'
  ];
  
  storeFiles.forEach(file => {
    const sourcePath = path.join(adminDir, 'store', file);
    const targetFile = file.replace('admin', featureName);
    const targetPath = path.join(storeDir, targetFile);
    
    const content = processTemplate(sourcePath, replacements);
    fs.writeFileSync(targetPath, content);
    console.log(`  ✓ Created store/${targetFile}`);
  });
  
  console.log(`✅ Successfully converted ${featureName}`);
}

// Main execution
async function main() {
  console.log('🚀 Starting conversion of features to pages domain structure...');
  console.log(`📊 Total features to convert: ${FEATURES_TO_CONVERT.length}`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const feature of FEATURES_TO_CONVERT) {
    try {
      convertFeatureToDomain(feature);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to convert ${feature}:`, error);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📈 Conversion Summary:');
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  📦 Total: ${FEATURES_TO_CONVERT.length}`);
  console.log('='.repeat(60));
  
  if (failCount === 0) {
    console.log('\n🎉 All features converted successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Update frontend/src/store/store.ts to add all domain reducers');
    console.log('  2. Update frontend/src/pages/index.ts to export all domains');
    console.log('  3. Update frontend/src/app/App.tsx to add all domain routes');
    console.log('  4. Run npm run lint:frontend to check for errors');
    console.log('  5. Run npm run build:react to verify the build');
  }
}

// Run the script
main().catch(console.error);
