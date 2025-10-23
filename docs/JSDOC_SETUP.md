# JSDoc Setup and API Documentation Generation

Complete guide for generating and maintaining API documentation from JSDoc comments in the Yellow Cross application.

## Overview

This project uses JSDoc to generate comprehensive API documentation from inline code comments. The setup includes:

- **JSDoc Configuration** - Customized for TypeScript and React
- **NPM Scripts** - Easy commands for documentation tasks
- **CI/CD Integration** - Automatic checks and generation
- **Coverage Reporting** - Track documentation completeness

## Quick Start

### Generate Documentation Locally

```bash
# Install JSDoc (if not already installed)
npm install -g jsdoc

# Generate API documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve
```

The generated documentation will be available at http://localhost:8080

### Check JSDoc Coverage

```bash
# Check which files need documentation
npm run docs:check
```

This will show:
- Total files checked
- Files with JSDoc
- Files missing JSDoc
- Coverage percentage

## Configuration

### JSDoc Configuration (`jsdoc.json`)

The project uses a customized JSDoc configuration:

```json
{
  "source": {
    "include": [
      "frontend/src/shared/components",
      "frontend/src/shared/hooks",
      "frontend/src/shared/api",
      "frontend/src/services",
      "frontend/src/features"
    ],
    "includePattern": ".+\\.(js|jsx|ts|tsx)$"
  },
  "opts": {
    "destination": "./docs/api",
    "recurse": true,
    "verbose": true
  }
}
```

### Included Directories

Documentation is generated from:
- `frontend/src/shared/components` - UI components
- `frontend/src/shared/hooks` - Custom hooks
- `frontend/src/shared/api` - API client
- `frontend/src/services` - Service modules
- `frontend/src/features` - Feature-specific code

## NPM Scripts

### `npm run docs:generate`
Generates API documentation in `docs/api` directory.

**Example:**
```bash
npm run docs:generate
```

**Output:**
- HTML documentation in `docs/api/`
- Includes all documented components, hooks, and functions
- Cross-referenced with proper links

### `npm run docs:serve`
Starts a local HTTP server to view documentation.

**Example:**
```bash
npm run docs:serve
# Opens browser at http://localhost:8080
```

### `npm run docs:check`
Checks JSDoc coverage and reports missing documentation.

**Example:**
```bash
npm run docs:check
```

**Sample Output:**
```
📊 JSDoc Coverage Report:
══════════════════════════════════════════════════
Total files checked: 50
Files with JSDoc: 42
Files without JSDoc: 8
Total exports: 156
Coverage: 84.00%
══════════════════════════════════════════════════

✅ PASSED: Coverage 84.00% meets minimum 80%
```

## CI/CD Integration

### GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/documentation.yml`) that:

1. **On Pull Requests**:
   - Checks JSDoc coverage
   - Fails if coverage is below 80%
   - Comments on PR if checks fail

2. **On Main Branch Push**:
   - Generates full API documentation
   - Uploads as artifact
   - (Optional) Deploys to GitHub Pages

### Workflow Configuration

```yaml
name: Documentation Checks

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  check-jsdoc-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run docs:check
```

### Coverage Requirements

- **Minimum Coverage**: 80%
- **Checked Files**: TypeScript and JavaScript files with exports
- **Excluded**: Test files, node_modules, build artifacts

## Writing JSDoc Comments

### Components

```typescript
/**
 * Button - Reusable button component
 * 
 * A flexible button with multiple variants and states.
 * 
 * @component
 * @param {ButtonProps} props - Component props
 * @param {('primary'|'secondary')} [props.variant='primary'] - Visual style
 * @param {boolean} [props.disabled=false] - Disabled state
 * 
 * @returns {JSX.Element} Button element
 * 
 * @example
 * <Button variant="primary">Click me</Button>
 */
export const Button = ({ variant = 'primary', disabled = false }) => {
  // ...
};
```

### Hooks

```typescript
/**
 * useQuery - Data fetching hook
 * 
 * @hook
 * @param {string} endpoint - API endpoint
 * @param {Object} [options] - Hook options
 * 
 * @returns {Object} Query state
 * @returns {T|null} returns.data - Fetched data
 * @returns {boolean} returns.loading - Loading state
 * 
 * @example
 * const { data, loading } = useQuery('/api/users');
 */
export function useQuery(endpoint, options) {
  // ...
}
```

### Functions

```typescript
/**
 * formatDate - Formats date for API
 * 
 * @function
 * @param {Date|string} date - Date to format
 * @returns {string} ISO 8601 formatted date
 * 
 * @example
 * const formatted = formatDate(new Date());
 * // "2025-10-23T04:00:00.000Z"
 */
export function formatDate(date) {
  // ...
}
```

## Coverage Checker Script

### How It Works

The coverage checker (`scripts/check-jsdoc-coverage.js`):

1. Scans all configured directories
2. Finds files with exports
3. Checks for JSDoc comments
4. Calculates coverage percentage
5. Reports missing documentation
6. Exits with error if below threshold

### Customization

Edit `scripts/check-jsdoc-coverage.js` to adjust:

```javascript
// Minimum coverage percentage
const MIN_COVERAGE_PERCENT = 80;

// Directories to check
const DIRECTORIES_TO_CHECK = [
  'frontend/src/shared/components',
  'frontend/src/shared/hooks',
  // Add more directories...
];
```

## Best Practices

### 1. Document All Exports

Every exported function, component, class, or interface should have JSDoc:

```typescript
// ❌ Missing documentation
export function processData(input) { }

// ✅ Properly documented
/**
 * processData - Processes input data
 * @param {string} input - Input data
 * @returns {Object} Processed result
 */
export function processData(input) { }
```

### 2. Include Examples

Always provide at least one usage example:

```typescript
/**
 * @example
 * const result = processData('input');
 */
```

### 3. Document Parameters

Include type and description for all parameters:

```typescript
/**
 * @param {string} name - User's name
 * @param {number} [age] - Optional age
 * @param {Object} options - Configuration
 * @param {boolean} options.validate - Enable validation
 */
```

### 4. Use Proper Tags

- `@component` - React components
- `@hook` - React hooks
- `@function` - Functions
- `@async` - Async functions
- `@param` - Parameters
- `@returns` - Return values
- `@example` - Usage examples
- `@throws` - Errors thrown

### 5. Keep It Updated

Update JSDoc when:
- Adding new parameters
- Changing return types
- Modifying behavior
- Adding new features

## Troubleshooting

### JSDoc Not Installed

```bash
npm install -g jsdoc
# or
npm install --save-dev jsdoc
```

### Coverage Check Fails

1. Check which files need documentation:
   ```bash
   npm run docs:check
   ```

2. Add JSDoc to listed files

3. Re-run check:
   ```bash
   npm run docs:check
   ```

### Documentation Not Generating

1. Verify JSDoc configuration:
   ```bash
   cat jsdoc.json
   ```

2. Check file paths are correct

3. Ensure files have JSDoc comments

4. Run with verbose output:
   ```bash
   jsdoc -c jsdoc.json --verbose
   ```

### CI/CD Check Failing

1. Run locally first:
   ```bash
   npm run docs:check
   ```

2. Fix any issues

3. Commit and push

4. Check workflow logs in GitHub Actions

## Deployment to GitHub Pages

### Enable GitHub Pages

1. Edit `.github/workflows/documentation.yml`
2. Change `if: false` to `if: true` in deploy step
3. Configure custom domain (optional)
4. Push to main branch

### Access Documentation

After deployment, documentation will be available at:
- Default: `https://[username].github.io/[repo]/`
- Custom: Configure in workflow CNAME

## Viewing Generated Docs

### Local Viewing

```bash
# Generate and serve
npm run docs:generate && npm run docs:serve

# Or use Python's HTTP server
python3 -m http.server 8080 --directory docs/api
```

### CI/CD Artifacts

Download from GitHub Actions:
1. Go to Actions tab
2. Find successful workflow run
3. Download "api-documentation" artifact

## Maintenance

### Regular Tasks

1. **Weekly**: Check coverage
   ```bash
   npm run docs:check
   ```

2. **Before Release**: Regenerate docs
   ```bash
   npm run docs:generate
   ```

3. **Monthly**: Review and update docs

### Updating Configuration

Edit `jsdoc.json` to:
- Add/remove directories
- Change output location
- Modify template settings
- Adjust markdown options

## Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Expert Agent Templates](../.github/agents/README.md)
- [JSDoc Generation Guide](./JSDOC_GENERATION_GUIDE.md)

---

**Last Updated**: 2025-10-23  
**Setup Version**: 1.0.0  
**Status**: Production Ready
