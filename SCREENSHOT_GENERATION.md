# Screenshot Generation Guide

This document explains how to generate screenshots of all user-accessible pages in the Yellow Cross platform.

## Overview

The screenshot generation script (`scripts/generate-screenshots.ts`) automatically:
1. Starts the backend and frontend servers
2. Navigates to all public and authenticated pages
3. Captures full-page screenshots
4. Saves them in an organized directory structure

## Prerequisites

Before running the screenshot script, ensure:

1. **Dependencies are installed:**
   ```bash
   npm install
   ```

2. **Playwright browsers are installed:**
   ```bash
   npx playwright install chromium
   ```

3. **Database is seeded:**
   ```bash
   npm run db:seed
   ```

4. **Environment variables are configured:**
   - Copy `.env.example` to `.env` if not already done
   - Ensure `DATABASE_URL` is set correctly

## Running the Script

### Quick Start

Simply run:
```bash
npm run screenshots:generate
```

This will:
- Start the backend server (http://localhost:3000)
- Start the frontend server (http://localhost:3001)
- Generate screenshots for all pages
- Save them to the `screenshots/` directory

### What Gets Captured

The script captures screenshots of:

#### Public Pages (3 pages)
- Home page (`/`)
- Login page (`/login`)
- Register page (`/register`)

#### Authenticated Pages (60+ feature pages)
All main feature pages under `/features/`:
- case-management
- client-crm
- document-management
- time-billing
- calendar-scheduling
- task-workflow
- legal-research
- court-docket
- contract-management
- ediscovery
- compliance
- reporting-analytics
- communication
- security
- integration
- litigation-management
- mediation-adr
- intellectual-property
- real-estate-transactions
- corporate-governance
- mergers-acquisitions
- employment-law
- immigration-law
- family-law
- criminal-defense
- bankruptcy-management
- estate-planning
- tax-law
- personal-injury
- class-action
- securities-law
- healthcare-law
- environmental-law
- insurance-defense
- appellate-practice
- financial-services
- energy-utilities
- telecommunications
- aviation-law
- maritime-law
- construction-law
- franchise-law
- sports-entertainment
- technology-transactions
- data-privacy
- cybersecurity-legal
- government-contracts
- non-profit-law
- education-law
- labor-relations
- international-trade
- antitrust-competition
- white-collar-crime
- civil-rights
- municipal-law
- veterans-affairs
- social-security
- consumer-protection
- landlord-tenant
- pro-bono

Plus the profile page (`/profile`)

## Output Structure

Screenshots are saved to:
```
screenshots/
├── public/          # Public pages (no auth required)
│   ├── home.png
│   ├── login.png
│   ├── register.png
│   └── profile.png
└── features/        # Authenticated feature pages
    ├── case-management.png
    ├── client-crm.png
    ├── document-management.png
    └── ... (60+ more)
```

## Configuration

You can modify the script configuration in `scripts/generate-screenshots.ts`:

- `BASE_URL`: Frontend URL (default: `http://localhost:3001`)
- `BACKEND_URL`: Backend URL (default: `http://localhost:3000`)
- `SCREENSHOT_DIR`: Output directory (default: `./screenshots`)
- `WAIT_TIME`: Page load wait time in ms (default: `2000`)

## Authentication

The script uses the default admin credentials created by the database seed:
- **Email:** admin@yellowcross.com
- **Password:** Admin@123

If you've changed these credentials, update them in the script at the `login()` function.

## Troubleshooting

### Server Fails to Start

If the backend or frontend server fails to start:
1. Check that ports 3000 and 3001 are not in use
2. Verify your `.env` file is configured correctly
3. Ensure the database is accessible

### Screenshots Are Blank or Incomplete

If screenshots are blank or pages don't load:
1. Increase `WAIT_TIME` in the script (e.g., to 5000ms)
2. Check browser console logs for JavaScript errors
3. Ensure the frontend build is up to date: `npm run build:react`

### Login Fails

If authentication fails:
1. Verify the admin user exists: `npm run db:seed`
2. Check the credentials in the script match your database
3. Ensure the backend server is running and accessible

### Out of Memory

If the script runs out of memory:
1. Close the browser between page captures (modify script)
2. Capture pages in smaller batches
3. Reduce viewport size in the script

## Manual Execution

If you need more control, you can:

1. Start servers manually:
   ```bash
   # Terminal 1: Start backend
   npm run dev
   
   # Terminal 2: Start frontend
   npm run dev:react
   ```

2. Run the script without starting servers:
   Modify the script to comment out `startBackend()` and `startFrontend()` calls

## Script Behavior

The script:
- Takes **full-page screenshots** (entire scrollable content)
- Uses a **1920x1080 viewport** for consistency
- Waits for **network idle** before capturing
- Adds a **2-second delay** after page load for dynamic content
- Runs in **headless mode** (no visible browser window)
- Automatically **cleans up** servers on exit

## Notes

- Screenshots are added to `.gitignore` and won't be committed
- The script takes approximately 5-10 minutes to complete
- Each screenshot is a PNG file with full-page capture
- File sizes vary based on page content (typically 100KB - 2MB per screenshot)

## Advanced Usage

### Capture Specific Pages Only

Modify the script to comment out unwanted pages:

```typescript
// Comment out to skip public pages
// await screenshotPublicPages(page);

// Comment out to skip feature pages
// await screenshotFeaturePages(page);
```

### Change Screenshot Format

To capture JPEG instead of PNG, modify the `takeScreenshot()` function:

```typescript
await page.screenshot({
  path: screenshotPath,
  fullPage: true,
  type: 'jpeg',
  quality: 90,
});
```

### Add More Pages

Add custom routes to capture:

```typescript
const CUSTOM_ROUTES = [
  { path: '/custom-page', name: 'custom-page' },
];
```

## Support

For issues or questions:
1. Check the console output for error messages
2. Review the troubleshooting section above
3. Ensure all prerequisites are met
4. Check server logs for backend/frontend errors
