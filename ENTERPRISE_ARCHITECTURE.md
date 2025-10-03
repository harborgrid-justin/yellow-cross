# Enterprise Architecture - Yellow Cross

## Overview

Yellow Cross has been restructured following **Google Engineering Best Practices** for enterprise-grade applications. This document outlines the architectural decisions, patterns, and rationale behind the new structure.

## Architecture Principles

### 1. Feature-Based Organization

**Why**: Scales better than layer-based organization as the application grows.

**Implementation**:
- Code is organized by business domains (features) rather than technical layers
- Each feature is self-contained with its own components, types, and logic
- Reduces cognitive load - developers can focus on one feature at a time
- Enables independent development and testing of features

**Reference**: Google's internal Angular applications and Bazel monorepo structure

### 2. Clear Module Boundaries

**Why**: Prevents tight coupling and circular dependencies.

**Implementation**:
- Features don't import from other features
- Shared code is explicitly placed in `shared/` directory
- Public APIs are well-defined at module boundaries
- Path aliases enforce clean import patterns

**Reference**: Domain-Driven Design (DDD) and Clean Architecture principles

### 3. Type Safety First

**Why**: Catch errors at compile time, improve developer experience, enable better tooling.

**Implementation**:
- Strict TypeScript mode enabled
- Comprehensive type coverage across all modules
- No `any` types unless absolutely necessary
- Type definitions co-located with features

**Reference**: Google TypeScript Style Guide

### 4. Performance by Default

**Why**: Fast initial load, efficient updates, optimal user experience.

**Implementation**:
- Automatic code splitting by route
- Vendor chunk separation (React libraries)
- Tree-shaking enabled
- Source maps for production debugging
- Lazy loading of features

**Reference**: Web.dev performance best practices

### 5. Developer Experience

**Why**: Happy developers write better code faster.

**Implementation**:
- Path aliases for clean imports (`@components`, `@features`, etc.)
- Hot Module Replacement (HMR) in development
- Fast builds with Vite
- Consistent patterns and conventions
- Comprehensive documentation

## Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Application Core
│   │   ├── App.tsx                   # Main app with routing
│   │   └── main.tsx                  # Entry point
│   │
│   ├── features/                     # Feature Modules
│   │   ├── auth/                     # Authentication
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── HomePage.tsx
│   │   ├── case-management/          # Case Management
│   │   │   └── CaseManagementPage.tsx
│   │   ├── client-crm/               # Client CRM
│   │   ├── document-management/      # Document Management
│   │   ├── time-billing/             # Time & Billing
│   │   ├── calendar-scheduling/      # Calendar
│   │   ├── task-workflow/            # Tasks & Workflows
│   │   ├── legal-research/           # Legal Research
│   │   ├── court-docket/             # Court & Docket
│   │   ├── contract-management/      # Contracts
│   │   ├── ediscovery/               # eDiscovery
│   │   ├── compliance/               # Compliance
│   │   ├── reporting-analytics/      # Reporting
│   │   ├── communication/            # Communication
│   │   ├── security/                 # Security
│   │   └── integration/              # Integrations
│   │
│   ├── shared/                       # Shared Code
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   └── SubFeaturePage.tsx
│   │   ├── types/                    # Shared TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/                    # Utility functions
│   │   │   └── featuresData.ts
│   │   ├── api/                      # API client
│   │   │   └── client.ts
│   │   └── hooks/                    # Custom React hooks
│   │
│   ├── assets/                       # Static Assets
│   │   ├── styles/                   # Global styles
│   │   │   ├── app.css               # Main application styles
│   │   │   ├── auth.css              # Authentication styles
│   │   │   └── styles.css            # Base styles
│   │   └── images/                   # Images
│   │
│   ├── config/                       # Configuration
│   │   └── constants.ts              # App constants
│   │
│   └── vite-env.d.ts                # Vite environment types
│
├── public/                           # Public static files
├── dist/                             # Build output (gitignored)
├── index.html                        # Entry HTML
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Frontend documentation
```

## Feature Module Structure

Each feature follows a consistent pattern:

```
features/
└── [feature-name]/
    ├── [Feature]Page.tsx            # Main page component
    ├── components/                   # Feature-specific components (optional)
    │   ├── [Component1].tsx
    │   └── [Component2].tsx
    ├── hooks/                        # Feature-specific hooks (optional)
    │   └── use[Feature].ts
    ├── types/                        # Feature-specific types (optional)
    │   └── [feature].types.ts
    └── utils/                        # Feature-specific utilities (optional)
        └── [feature]Helpers.ts
```

### Current Feature Status

All 15 features are currently simple page components. As complexity grows, they can be expanded with:
- Dedicated components directory
- Feature-specific hooks
- Local state management
- Feature-specific types

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.1.9 | Build tool & dev server |
| React Router | 7.9.3 | Routing |

### Build & Development

- **Vite**: Fast HMR, optimized production builds
- **TypeScript**: Strict mode enabled, comprehensive type checking
- **ESLint**: Code quality (backend)
- **Source Maps**: Production debugging support

### Performance Features

- Code splitting by route (automatic)
- Vendor chunk separation
- Tree-shaking
- Minification
- Gzip compression

## Configuration

### TypeScript Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,           // Strict type checking
    "jsx": "react-jsx",       // React 17+ JSX transform
    "moduleResolution": "bundler", // Vite-compatible
    "paths": {                // Path aliases
      "@/*": ["./frontend/src/*"],
      "@features/*": ["./frontend/src/features/*"],
      "@shared/*": ["./frontend/src/shared/*"],
      // ... etc
    }
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
{
  root: 'frontend',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'  // Backend proxy
    }
  }
}
```

## Import Patterns

### ✅ Good Patterns

```typescript
// Use path aliases for shared code
import { Layout } from '@components/Layout';
import { Feature } from '@types/index';
import { api } from '@api/client';

// Relative imports within same feature
import { CaseList } from './components/CaseList';
import { useCases } from './hooks/useCases';

// Import types explicitly
import type { Feature } from '@types/index';
```

### ❌ Bad Patterns

```typescript
// Never import from other features
import { ClientList } from '@features/client-crm/components/ClientList'; // ❌

// Don't use relative paths for shared code
import { Layout } from '../../../shared/components/Layout'; // ❌

// Don't skip type imports
import { Feature } from '@types/index'; // Use 'import type' instead
```

## API Client

Centralized API client in `shared/api/client.ts`:

```typescript
import { api } from '@api/client';

// GET request
const cases = await api.get<Case[]>('/cases');

// POST request
const newCase = await api.post<Case>('/cases', { title: 'New Case' });

// Error handling
try {
  const data = await api.get('/cases');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
  }
}
```

## Build & Deployment

### Development

```bash
npm run dev:react        # Start dev server on port 3001
npm run lint:frontend    # Type check frontend
```

### Production

```bash
npm run build:react      # Build for production
npm run preview:react    # Preview production build
```

### Output

- `dist/` - Production build output
- Assets are fingerprinted for caching
- Source maps included for debugging

## Migration from Old Structure

### What Changed

1. **Merged Directories**:
   - `src/react/` + `frontend/` → `frontend/`
   - Eliminated duplicate code and configuration

2. **New Organization**:
   - Feature-based instead of layer-based
   - Clear shared code boundary
   - Path aliases for clean imports

3. **Build System**:
   - Single Vite configuration
   - Optimized for performance
   - Better developer experience

### Backward Compatibility

The backend remains unchanged:
- `backend/` directory structure intact
- All API endpoints work the same
- Database schema unchanged

## Best Practices

### Adding New Features

1. Create feature directory under `features/`
2. Create main page component: `[Feature]Page.tsx`
3. Add route in `app/App.tsx`
4. Add feature data in `shared/utils/featuresData.ts`
5. Keep feature self-contained
6. Use shared code via path aliases

### Adding Shared Components

1. Place in `shared/components/`
2. Export from component file
3. Import using `@components` alias
4. Document component purpose
5. Keep components reusable and generic

### Performance Optimization

1. Use React.lazy() for code splitting (if needed)
2. Memoize expensive computations
3. Optimize images and assets
4. Monitor bundle size
5. Use Lighthouse for auditing

### Type Safety

1. Enable strict mode in tsconfig.json ✅
2. No implicit any ✅
3. Explicit return types for public APIs
4. Use type guards for runtime checks
5. Document complex types

## References

This architecture is based on:

1. **Google TypeScript Style Guide**
   - https://google.github.io/styleguide/tsguide.html

2. **Web.dev Best Practices**
   - https://web.dev/articles/vitals

3. **Domain-Driven Design**
   - Feature-based organization
   - Clear bounded contexts

4. **Clean Architecture**
   - Dependency inversion
   - Clear layer boundaries

5. **Feature-Sliced Design (FSD)**
   - https://feature-sliced.design/

## Future Enhancements

### Potential Improvements

1. **State Management**
   - Add Redux Toolkit or Zustand when needed
   - Keep state close to features

2. **Testing**
   - Jest + React Testing Library
   - Vitest for unit tests
   - Playwright for E2E

3. **CI/CD**
   - Automated builds
   - Type checking in CI
   - Bundle size monitoring

4. **Documentation**
   - Storybook for components
   - API documentation
   - Architecture decision records (ADRs)

5. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics

## Summary

The new architecture provides:

- ✅ Scalable feature-based organization
- ✅ Type-safe development
- ✅ Optimized performance
- ✅ Excellent developer experience
- ✅ Clear module boundaries
- ✅ Enterprise-grade structure
- ✅ Google best practices compliance

This structure can scale from the current 15 features to hundreds of features while maintaining clarity and organization.
