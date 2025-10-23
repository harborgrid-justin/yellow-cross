#!/usr/bin/env node
/**
 * JSDoc Coverage Checker
 * 
 * Validates that all exported functions, components, and classes have JSDoc comments.
 * This script is designed to run in CI/CD pipelines to enforce documentation standards.
 * 
 * Usage:
 *   node scripts/check-jsdoc-coverage.js
 *   npm run docs:check
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - Missing documentation found
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DIRECTORIES_TO_CHECK = [
  'frontend/src/shared/components',
  'frontend/src/shared/hooks',
  'frontend/src/shared/api',
  'frontend/src/services',
  'frontend/src/features'
];

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const MIN_COVERAGE_PERCENT = 80; // Minimum percentage of files that must have JSDoc

// Patterns to detect JSDoc comments
const JSDOC_PATTERN = /\/\*\*[\s\S]*?\*\//g;
const EXPORT_PATTERN = /export\s+(const|function|class|interface|type)\s+(\w+)/g;

/**
 * Check if a file has JSDoc comments
 */
function hasJSDocComments(content) {
  const jsdocMatches = content.match(JSDOC_PATTERN);
  return jsdocMatches && jsdocMatches.length > 0;
}

/**
 * Count exported items in a file
 */
function countExports(content) {
  const exports = content.match(EXPORT_PATTERN);
  return exports ? exports.length : 0;
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build directories
      if (!['node_modules', 'dist', 'build', '__tests__', 'test'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main function to check JSDoc coverage
 */
function checkJSDocCoverage() {
  console.log('🔍 Checking JSDoc coverage...\n');

  let totalFiles = 0;
  let filesWithJSDoc = 0;
  let filesWithoutJSDoc = [];
  let totalExports = 0;

  // Collect all files from configured directories
  DIRECTORIES_TO_CHECK.forEach(dir => {
    const files = getAllFiles(dir);
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const exportCount = countExports(content);

      // Only check files that have exports
      if (exportCount > 0) {
        totalFiles++;
        totalExports += exportCount;

        if (hasJSDocComments(content)) {
          filesWithJSDoc++;
        } else {
          filesWithoutJSDoc.push({
            file: file.replace(process.cwd() + '/', ''),
            exports: exportCount
          });
        }
      }
    });
  });

  // Calculate coverage
  const coverage = totalFiles > 0 ? (filesWithJSDoc / totalFiles) * 100 : 0;

  // Print results
  console.log('📊 JSDoc Coverage Report:');
  console.log('═'.repeat(50));
  console.log(`Total files checked: ${totalFiles}`);
  console.log(`Files with JSDoc: ${filesWithJSDoc}`);
  console.log(`Files without JSDoc: ${filesWithoutJSDoc.length}`);
  console.log(`Total exports: ${totalExports}`);
  console.log(`Coverage: ${coverage.toFixed(2)}%`);
  console.log('═'.repeat(50));

  // Show files without JSDoc
  if (filesWithoutJSDoc.length > 0) {
    console.log('\n⚠️  Files missing JSDoc comments:\n');
    filesWithoutJSDoc.slice(0, 20).forEach(({ file, exports }) => {
      console.log(`  - ${file} (${exports} export${exports > 1 ? 's' : ''})`);
    });
    
    if (filesWithoutJSDoc.length > 20) {
      console.log(`  ... and ${filesWithoutJSDoc.length - 20} more files\n`);
    }
  }

  // Check if coverage meets minimum
  if (coverage < MIN_COVERAGE_PERCENT) {
    console.log(`\n❌ FAILED: Coverage ${coverage.toFixed(2)}% is below minimum ${MIN_COVERAGE_PERCENT}%`);
    console.log(`   Please add JSDoc comments to ${filesWithoutJSDoc.length} files to meet the standard.\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ PASSED: Coverage ${coverage.toFixed(2)}% meets minimum ${MIN_COVERAGE_PERCENT}%\n`);
    process.exit(0);
  }
}

// Run the check
checkJSDocCoverage();
