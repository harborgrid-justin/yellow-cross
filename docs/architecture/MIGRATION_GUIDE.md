# Migration Guide - Frontend Restructure

This document explains the changes made during the enterprise-grade restructuring of the Yellow Cross frontend.

## What Changed

### Directory Structure

#### Before (Old Structure)
```
yellow-cross/
├── frontend/              # Static HTML/CSS/JS
│   ├── css/              # Stylesheets
│   ├── js/               # Compiled JS from TS
│   ├── ts/               # TypeScript source
│   └── *.html            # HTML pages
└── src/react/            # React + TypeScript app
    ├── components/
    ├── pages/
    ├── types/
    └── utils/
```

**Problems**:
- Duplicate code and configuration
- Two separate frontend codebases
- Confusion about which to use
- Layer-based organization doesn't scale

#### After (New Structure)
```
yellow-cross/
└── frontend/                    # Unified frontend
    ├── src/
    │   ├── app/                # Application core
    │   ├── features/           # Feature modules (16 features)
    │   ├── shared/             # Shared code
    │   ├── assets/             # Static assets
    │   └── config/             # Configuration
    ├── public/                 # Public files
    ├── vite.config.ts          # Vite configuration
    └── tsconfig.json           # TypeScript configuration
```

**Benefits**:
- Single source of truth
- Feature-based organization (scales better)
- Clear module boundaries
- Modern build system with Vite

### File Mappings

| Old Location | New Location | Notes |
|--------------|--------------|-------|
| `src/react/App.tsx` | `frontend/src/app/App.tsx` | Imports updated |
| `src/react/main.tsx` | `frontend/src/app/main.tsx` | Entry point |
| `src/react/components/` | `frontend/src/shared/components/` | Shared components |
| `src/react/pages/HomePage.tsx` | `frontend/src/features/auth/HomePage.tsx` | Moved to auth feature |
| `src/react/pages/LoginPage.tsx` | `frontend/src/features/auth/LoginPage.tsx` | Moved to auth feature |
| `src/react/pages/features/*` | `frontend/src/features/*` | Feature pages |
| `src/react/types/` | `frontend/src/shared/types/` | Shared types |
| `src/react/utils/` | `frontend/src/shared/utils/` | Shared utilities |
| `src/react/styles/` | `frontend/src/assets/styles/` | Styles moved |
| `frontend/css/` | `frontend/src/assets/styles/` | Merged with React styles |
| `frontend/ts/` | **Removed** | Now using React components |
| `frontend/js/` | **Removed** | Now using Vite build |
| `frontend/*.html` | **Removed** | Now single-page app |

### Configuration Changes

#### TypeScript Configuration

**Before**: Compiled TS to JS in `frontend/js/`
```json
{
  "outDir": "./frontend/js",
  "rootDir": "./frontend/ts"
}
```

**After**: Modern React setup with Vite
```json
{
  "jsx": "react-jsx",
  "moduleResolution": "bundler",
  "noEmit": true,
  "paths": { "@/*": ["./frontend/src/*"] }
}
```

#### Build System

**Before**: 
- TypeScript compiler (`tsc`) for JS compilation
- Separate HTML pages
- Manual script includes

**After**:
- Vite for development and production builds
- Single-page application
- Hot Module Replacement (HMR)
- Automatic code splitting

#### Scripts

| Old Command | New Command | Purpose |
|-------------|-------------|---------|
| `npm run ts:build` | `npm run build:react` | Build frontend |
| `npm run ts:watch` | `npm run dev:react` | Development mode |
| - | `npm run lint:frontend` | Type check |
| - | `npm run preview:react` | Preview build |

### Import Path Changes

#### Before (Old Imports)
```typescript
// In src/react files
import Layout from './components/Layout';
import { featuresData } from '../utils/featuresData';
```

#### After (New Imports)
```typescript
// Using path aliases
import Layout from '@components/Layout';
import { featuresData } from '@utils/featuresData';

// Or relative within features
import { HomePage } from '../features/auth/HomePage';
```

### API Changes

#### New API Client

A centralized API client was added at `frontend/src/shared/api/client.ts`:

```typescript
import { api } from '@api/client';

// Before: Manual fetch
const response = await fetch('/api/cases');
const cases = await response.json();

// After: Type-safe API client
const cases = await api.get<Case[]>('/cases');
```

## Migration for Developers

### Setting Up Development Environment

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies (if not already done)
npm install

# 3. Start development server
npm run dev:react

# 4. Backend still runs the same way
npm start
```

### Updating Your Code

If you were working on the old structure:

#### 1. Feature Pages

**Before** (`src/react/pages/features/my-feature/MyFeaturePage.tsx`):
```typescript
import { featuresData } from '../../../utils/featuresData';
```

**After** (`frontend/src/features/my-feature/MyFeaturePage.tsx`):
```typescript
import { featuresData } from '@utils/featuresData';
import type { Feature } from '@types/index';
```

#### 2. Shared Components

**Before** (`src/react/components/MyComponent.tsx`):
```typescript
import { Link } from 'react-router-dom';
```

**After** (`frontend/src/shared/components/MyComponent.tsx`):
```typescript
import { Link } from 'react-router-dom';
// Same, but location changed
```

#### 3. Static Assets

**Before**: Reference CSS files directly
```html
<link rel="stylesheet" href="/css/styles.css">
```

**After**: Import in TypeScript
```typescript
import '../assets/styles/styles.css';
```

### Building for Production

```bash
# Build the frontend
npm run build:react

# Output will be in dist/ directory
ls -la dist/
```

The build creates:
- `dist/index.html` - Entry HTML
- `dist/assets/` - Bundled JS and CSS with fingerprints
- Source maps for debugging

## Testing

### Type Checking

```bash
# Check TypeScript types
npm run lint:frontend
```

### Unit Tests

The existing backend tests remain unchanged. Frontend tests can be added using Jest or Vitest.

### Running Tests

```bash
# Run all backend tests
npm test

# Run specific test
npm test backend/tests/typescript.test.js
```

## Breaking Changes

### For End Users
- **None** - The application works exactly the same from a user perspective
- All features, pages, and functionality remain identical

### For Developers

1. **Import Paths**: Update imports to use path aliases
   ```typescript
   // ❌ Old
   import { X } from '../../../shared/utils/X';
   
   // ✅ New
   import { X } from '@utils/X';
   ```

2. **File Locations**: Feature files moved
   ```
   ❌ Old: src/react/pages/features/my-feature/
   ✅ New: frontend/src/features/my-feature/
   ```

3. **Build Commands**: Use new npm scripts
   ```bash
   ❌ Old: npm run ts:build
   ✅ New: npm run build:react
   ```

4. **Static HTML Pages**: No longer used
   - Application is now a single-page app (SPA)
   - HTML pages converted to React components

## Backward Compatibility

### Backend
- **Fully compatible** - No changes to backend code
- All API endpoints work the same
- Database schema unchanged

### Frontend Assets
- All CSS has been migrated
- All functionality preserved
- Same visual appearance

## Troubleshooting

### Issue: Import errors after migration

**Solution**: Clear your IDE cache and restart TypeScript server
```bash
# VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Issue: Build fails

**Solution**: Ensure dependencies are installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Types not found

**Solution**: Check tsconfig.json paths
```bash
npm run lint:frontend
```

### Issue: HMR not working

**Solution**: Restart dev server
```bash
npm run dev:react
```

## Rollback Plan

If you need to roll back to the old structure:

```bash
# The old code is still in git history
git log --oneline | grep "Restructure frontend"
git checkout <commit-before-restructure>
```

However, we recommend moving forward as:
- The new structure is tested and working
- All tests pass
- Build succeeds
- No functionality lost

## Benefits of New Structure

1. **Performance**
   - Code splitting by route
   - Optimized production builds
   - Faster development with HMR

2. **Developer Experience**
   - Single source of truth
   - Clear organization
   - Path aliases for clean imports
   - Modern tooling (Vite)

3. **Scalability**
   - Feature-based organization
   - Easy to add new features
   - Clear module boundaries
   - Reduced coupling

4. **Maintainability**
   - Consistent patterns
   - Comprehensive documentation
   - Type safety throughout
   - Industry best practices

## Questions?

- Review [ENTERPRISE_ARCHITECTURE.md](./ENTERPRISE_ARCHITECTURE.md) for architecture details
- Review [frontend/README.md](./frontend/README.md) for frontend-specific docs
- Check the main [README.md](./README.md) for project overview

## Summary

The migration successfully:
- ✅ Merged `src/react/` and `frontend/` into unified `frontend/`
- ✅ Implemented feature-based organization
- ✅ Added path aliases for clean imports
- ✅ Updated TypeScript configuration
- ✅ Modernized build system with Vite
- ✅ Maintained all functionality
- ✅ Ensured backward compatibility with backend
- ✅ Documented changes comprehensively

No action is required for end users. Developers should review the new structure and update their workflows as outlined in this guide.
