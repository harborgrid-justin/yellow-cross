/**
 * Screenshot Generator for Yellow Cross Platform
 * 
 * This script:
 * 1. Starts the backend and frontend servers (optional)
 * 2. Logs in with a test user
 * 3. Navigates to all user-accessible pages
 * 4. Captures screenshots of each page
 * 5. Saves them in an organized directory structure
 * 
 * Usage:
 *   npm run screenshots:generate           - Start servers and generate screenshots
 *   npm run screenshots:generate -- --skip-servers  - Use already running servers
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

// Configuration
const BASE_URL = process.env['BASE_URL'] || 'http://localhost:3001';
const BACKEND_URL = process.env['BACKEND_URL'] || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const WAIT_TIME = parseInt(process.env['WAIT_TIME'] || '2000'); // Time to wait for page to fully load
const SKIP_SERVERS = process.argv.includes('--skip-servers');

// List of all feature routes from App.tsx
const FEATURE_ROUTES = [
  'case-management',
  'client-crm',
  'document-management',
  'time-billing',
  'calendar-scheduling',
  'task-workflow',
  'legal-research',
  'court-docket',
  'contract-management',
  'ediscovery',
  'compliance',
  'reporting-analytics',
  'communication',
  'security',
  'integration',
  'litigation-management',
  'mediation-adr',
  'intellectual-property',
  'real-estate-transactions',
  'corporate-governance',
  'mergers-acquisitions',
  'employment-law',
  'immigration-law',
  'family-law',
  'criminal-defense',
  'bankruptcy-management',
  'estate-planning',
  'tax-law',
  'personal-injury',
  'class-action',
  'securities-law',
  'healthcare-law',
  'environmental-law',
  'insurance-defense',
  'appellate-practice',
  'financial-services',
  'energy-utilities',
  'telecommunications',
  'aviation-law',
  'maritime-law',
  'construction-law',
  'franchise-law',
  'sports-entertainment',
  'technology-transactions',
  'data-privacy',
  'cybersecurity-legal',
  'government-contracts',
  'non-profit-law',
  'education-law',
  'labor-relations',
  'international-trade',
  'antitrust-competition',
  'white-collar-crime',
  'civil-rights',
  'municipal-law',
  'veterans-affairs',
  'social-security',
  'consumer-protection',
  'landlord-tenant',
  'pro-bono',
];

// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  { path: '/', name: 'home' },
  { path: '/login', name: 'login' },
  { path: '/register', name: 'register' },
];

interface ServerProcess {
  backend?: ChildProcess;
  frontend?: ChildProcess;
}

const servers: ServerProcess = {};

/**
 * Start the backend server
 */
async function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting backend server...');
    
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      stdio: 'pipe',
    });

    servers.backend = backend;

    backend.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Server running') || output.includes('listening')) {
        console.log('✓ Backend server started');
        resolve();
      }
    });

    backend.stderr?.on('data', (data) => {
      console.log(`Backend: ${data.toString()}`);
    });

    backend.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      console.log('✓ Backend server should be ready');
      resolve();
    }, 10000);
  });
}

/**
 * Start the frontend server
 */
async function startFrontend(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Starting frontend server...');
    
    const frontend = spawn('npm', ['run', 'dev:react'], {
      cwd: path.join(__dirname, '..'),
      shell: true,
      stdio: 'pipe',
    });

    servers.frontend = frontend;

    frontend.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('localhost:3001')) {
        console.log('✓ Frontend server started');
        resolve();
      }
    });

    frontend.stderr?.on('data', (data) => {
      console.log(`Frontend: ${data.toString()}`);
    });

    frontend.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      console.log('✓ Frontend server should be ready');
      resolve();
    }, 15000);
  });
}

/**
 * Stop all servers
 */
function stopServers(): void {
  console.log('\nStopping servers...');
  if (servers.backend) {
    servers.backend.kill();
  }
  if (servers.frontend) {
    servers.frontend.kill();
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

/**
 * Create screenshot directory structure
 */
function setupDirectories(): void {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  
  const publicDir = path.join(SCREENSHOT_DIR, 'public');
  const featuresDir = path.join(SCREENSHOT_DIR, 'features');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  if (!fs.existsSync(featuresDir)) {
    fs.mkdirSync(featuresDir, { recursive: true });
  }
}

/**
 * Take a screenshot of a page
 */
async function takeScreenshot(
  page: Page,
  url: string,
  filename: string,
  directory: string
): Promise<void> {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(WAIT_TIME);
    
    const screenshotPath = path.join(directory, filename);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    
    console.log(`✓ Screenshot saved: ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to screenshot ${url}:`, error instanceof Error ? error.message : error);
  }
}

/**
 * Login to the application
 */
async function login(page: Page): Promise<boolean> {
  try {
    console.log('\nLogging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for form to be visible
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Fill in login credentials (using default seed user)
    await page.fill('input[type="email"]', 'admin@yellowcross.com');
    await page.fill('input[type="password"]', 'Admin@123');
    
    // Click login button and wait for navigation
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    // Wait a bit more for any client-side routing
    await page.waitForTimeout(3000);
    
    // Check if we're logged in by looking for typical authenticated UI elements
    const currentUrl = page.url();
    const isLoggedIn = !currentUrl.includes('/login');
    
    if (isLoggedIn) {
      console.log('✓ Successfully logged in');
      console.log(`  Current URL: ${currentUrl}`);
    } else {
      console.log('✗ Login may have failed');
      console.log(`  Current URL: ${currentUrl}`);
      
      // Check for error messages
      const errorMessage = await page.locator('.error, .alert, [role="alert"]').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`  Error message: ${errorMessage}`);
      }
    }
    
    return isLoggedIn;
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Generate screenshots for all public pages
 */
async function screenshotPublicPages(page: Page): Promise<void> {
  console.log('\n=== Capturing Public Pages ===');
  const publicDir = path.join(SCREENSHOT_DIR, 'public');
  
  for (const route of PUBLIC_ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    const filename = `${route.name}.png`;
    await takeScreenshot(page, url, filename, publicDir);
  }
}

/**
 * Generate screenshots for all authenticated feature pages
 */
async function screenshotFeaturePages(page: Page): Promise<void> {
  console.log('\n=== Capturing Feature Pages ===');
  const featuresDir = path.join(SCREENSHOT_DIR, 'features');
  
  for (const feature of FEATURE_ROUTES) {
    const url = `${BASE_URL}/features/${feature}`;
    const filename = `${feature}.png`;
    await takeScreenshot(page, url, filename, featuresDir);
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    console.log('=== Yellow Cross Screenshot Generator ===\n');
    
    // Setup directories
    setupDirectories();
    
    if (SKIP_SERVERS) {
      console.log('Skipping server startup (--skip-servers flag detected)');
      console.log('Assuming servers are already running...\n');
    } else {
      // Start servers
      await startBackend();
      await startFrontend();
    }
    
    // Wait for servers to be ready
    console.log('\nWaiting for servers to be ready...');
    const backendReady = await waitForServer(BACKEND_URL);
    const frontendReady = await waitForServer(BASE_URL);
    
    if (!backendReady) {
      console.warn('⚠ Backend server may not be ready');
    }
    if (!frontendReady) {
      console.warn('⚠ Frontend server may not be ready');
    }
    
    console.log('✓ Servers are ready\n');
    
    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    
    // Take screenshots of public pages
    await screenshotPublicPages(page);
    
    // Login
    const loggedIn = await login(page);
    
    if (loggedIn) {
      // Take screenshots of authenticated pages
      await screenshotFeaturePages(page);
      
      // Also capture the profile page
      console.log('\n=== Capturing Profile Page ===');
      await takeScreenshot(
        page,
        `${BASE_URL}/profile`,
        'profile.png',
        path.join(SCREENSHOT_DIR, 'public')
      );
    } else {
      console.warn('\n⚠ Skipping authenticated pages due to login failure');
    }
    
    // Close browser
    await browser.close();
    
    // Generate summary
    console.log('\n=== Screenshot Generation Complete ===');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log(`- Public pages: ${PUBLIC_ROUTES.length}`);
    if (loggedIn) {
      console.log(`- Feature pages: ${FEATURE_ROUTES.length}`);
      console.log(`Total: ${PUBLIC_ROUTES.length + FEATURE_ROUTES.length + 1} pages`);
    } else {
      console.log(`Total: ${PUBLIC_ROUTES.length} pages (authenticated pages skipped)`);
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (!SKIP_SERVERS) {
      stopServers();
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, cleaning up...');
  if (!SKIP_SERVERS) {
    stopServers();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, cleaning up...');
  if (!SKIP_SERVERS) {
    stopServers();
  }
  process.exit(0);
});

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  if (!SKIP_SERVERS) {
    stopServers();
  }
  process.exit(1);
});
