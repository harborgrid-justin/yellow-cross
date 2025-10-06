# Cypress E2E Testing Suite

This directory contains end-to-end (E2E) tests for the Yellow Cross frontend application.

## Overview

- **Total Test Files**: 25
- **Total Test Cases**: 128
- **Test Framework**: Cypress 13.6.4
- **Coverage**: All 22 frontend TSX files plus additional integration and quality tests

## Test Files

### Authentication & Core Pages (1-3)
- `01-home-page.cy.ts` - Home page functionality
- `02-login-page.cy.ts` - Login page functionality
- `03-register-page.cy.ts` - Registration page functionality

### Feature Pages (4-18)
- `04-case-management.cy.ts` - Case Management System
- `05-client-crm.cy.ts` - Client Relationship Management
- `06-document-management.cy.ts` - Document Management System
- `07-time-billing.cy.ts` - Time & Billing Management
- `08-calendar-scheduling.cy.ts` - Calendar & Scheduling System
- `09-task-workflow.cy.ts` - Task & Workflow Management
- `10-legal-research.cy.ts` - Legal Research & Knowledge Base
- `11-court-docket.cy.ts` - Court & Docket Management
- `12-contract-management.cy.ts` - Contract Management
- `13-ediscovery.cy.ts` - eDiscovery
- `14-compliance.cy.ts` - Compliance
- `15-reporting-analytics.cy.ts` - Reporting & Analytics
- `16-communication.cy.ts` - Communication
- `17-security.cy.ts` - Security
- `18-integration.cy.ts` - Integration

### Component & System Tests (19-25)
- `19-layout-component.cy.ts` - Layout component functionality
- `20-sub-feature-page.cy.ts` - Sub-feature page routing
- `21-app-routing.cy.ts` - Application routing and navigation
- `22-responsive-design.cy.ts` - Responsive design across devices
- `23-accessibility.cy.ts` - Accessibility compliance
- `24-performance.cy.ts` - Performance benchmarks
- `25-error-handling.cy.ts` - Error handling and edge cases

## Running Tests

### Open Cypress Test Runner (Interactive)
```bash
npm run cypress:open
# or
npm run test:e2e:open
```

### Run Tests in Headless Mode
```bash
npm run cypress:run
# or
npm run test:e2e
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/01-home-page.cy.ts"
```

## Prerequisites

1. **Development Server**: Ensure the dev server is running on port 3001
   ```bash
   npm run dev:react
   ```

2. **Dependencies**: Install all dependencies including Cypress
   ```bash
   npm install
   ```

## Configuration

- **Base URL**: `http://localhost:3001` (configured in `cypress.config.ts`)
- **Viewport**: 1280x720 (default)
- **Screenshots**: Enabled on test failure
- **Videos**: Disabled (can be enabled in config)

## Test Coverage

Each test file typically includes:
- Page load verification
- Element existence checks
- Navigation functionality
- Interactive element testing
- Content validation

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run E2E Tests
  run: |
    npm run dev:react &
    sleep 5
    npm run test:e2e
```

## Best Practices

1. **Before Each**: Tests use `beforeEach` to ensure clean state
2. **Assertions**: Clear, descriptive assertions for easy debugging
3. **Selectors**: Use semantic selectors (classes, IDs, data attributes)
4. **Wait Times**: Cypress automatically waits for elements
5. **Screenshots**: Failed tests automatically capture screenshots

## Support Files

- `cypress/support/commands.ts` - Custom Cypress commands
- `cypress/support/e2e.ts` - Global test configuration
- `cypress/tsconfig.json` - TypeScript configuration for Cypress

## Troubleshooting

### Port Already in Use
If port 3001 is in use, update `baseUrl` in `cypress.config.ts`

### Tests Timing Out
Increase timeout in individual tests or globally in config

### TypeScript Errors
Check `cypress/tsconfig.json` for proper TypeScript configuration

## Contributing

When adding new frontend pages or features:
1. Create corresponding test file in `cypress/e2e/`
2. Follow existing test patterns
3. Run tests to ensure they pass
4. Update this README if needed
