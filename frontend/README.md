# Yellow Cross Frontend

Enterprise-grade React + TypeScript frontend application following Google engineering best practices.

## Architecture Overview

This frontend is organized following **feature-based architecture** principles, which aligns with Google's approach to large-scale application development:

### Key Principles

1. **Feature-Based Organization**: Code is organized by features/domains rather than by technology layers
2. **Clear Module Boundaries**: Each feature is self-contained with clear public APIs
3. **Shared Code Isolation**: Reusable code is in `shared/` to prevent circular dependencies
4. **Type Safety**: Full TypeScript with strict mode enabled
5. **Code Splitting**: Automatic chunking for optimal loading performance
6. **Path Aliases**: Clean imports using `@` aliases

## Directory Structure

```
frontend/
├── src/
│   ├── app/                      # Application core & routing
│   │   ├── App.tsx              # Main app component with routes
│   │   └── main.tsx             # Application entry point
│   │
│   ├── features/                 # Feature modules (self-contained)
│   │   ├── auth/                # Authentication feature
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── HomePage.tsx
│   │   ├── case-management/     # Case management feature
│   │   ├── client-crm/          # Client CRM feature
│   │   └── .../                 # 15 total features
│   │
│   ├── shared/                   # Shared code across features
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   └── SubFeaturePage.tsx
│   │   ├── types/               # Shared TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── featuresData.ts
│   │   ├── api/                 # API client code
│   │   └── hooks/               # Custom React hooks
│   │
│   ├── assets/                   # Static assets
│   │   ├── styles/              # Global styles
│   │   │   ├── app.css
│   │   │   ├── auth.css
│   │   │   └── styles.css
│   │   └── images/              # Image assets
│   │
│   └── config/                   # App configuration
│
├── public/                       # Public static files
├── dist/                         # Build output (gitignored)
├── index.html                    # Entry HTML
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

## Best Practices Implemented

### 1. Feature-Based Organization (Google Style)

Each feature is a self-contained module with:
- Clear responsibility and scope
- Own components, types, and utilities
- Minimal dependencies on other features
- Public API surface

### 2. Type Safety

- Strict TypeScript configuration
- No implicit any
- Comprehensive type coverage
- Source maps for debugging

### 3. Performance

- Code splitting by route
- Lazy loading of features
- Vendor chunk separation
- Tree-shaking enabled

### 4. Developer Experience

- Path aliases for clean imports:
  ```typescript
  import { Layout } from '@components/Layout';
  import { Feature } from '@types/index';
  import { useAuth } from '@hooks/useAuth';
  ```
- Hot Module Replacement (HMR)
- Fast builds with Vite
- Clear error messages

### 5. Scalability

- Modular architecture allows independent feature development
- Clear boundaries prevent tight coupling
- Easy to add new features without impacting existing ones
- Consistent patterns across codebase

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Install dependencies (from root)
npm install

# Start dev server
npm run dev:react

# Build for production
npm run build:react

# Preview production build
npm run preview:react
```

### Available Scripts

- `npm run dev:react` - Start development server (port 3001)
- `npm run build:react` - Build for production
- `npm run preview:react` - Preview production build
- `npm run lint:frontend` - Lint frontend code

### Environment

- **Dev Server**: http://localhost:3001
- **API Proxy**: Proxies `/api/*` requests to `http://localhost:3000`

## Code Organization Guidelines

### When to Create a New Feature

Create a new feature module when:
- It represents a distinct business domain
- It can be developed/tested independently
- It has 3+ related components/pages
- It may be reused across the app

### When to Use Shared Code

Place code in `shared/` when:
- It's used by 2+ features
- It's a general-purpose utility
- It's a reusable UI component
- It has no feature-specific logic

### Import Rules

1. Never import from other features directly
2. Always import shared code via path aliases
3. Use relative imports within the same feature
4. Keep circular dependencies to zero

### Example Feature Structure

```typescript
features/
└── case-management/
    ├── CaseManagementPage.tsx    # Main page component
    ├── components/                # Feature-specific components
    │   ├── CaseList.tsx
    │   └── CaseDetail.tsx
    ├── hooks/                     # Feature-specific hooks
    │   └── useCases.ts
    ├── types/                     # Feature-specific types
    │   └── case.types.ts
    └── utils/                     # Feature-specific utilities
        └── caseHelpers.ts
```

## Technology Stack

- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool
- **React Router 7** - Routing
- **CSS3** - Styling

## Contributing

When adding new features:

1. Follow the feature-based structure
2. Add types for all new code
3. Use path aliases for imports
4. Document public APIs
5. Keep features independent

## Architecture References

This architecture is inspired by:
- Google's internal Angular applications structure
- Domain-Driven Design (DDD) principles
- Clean Architecture by Robert C. Martin
- Feature-Sliced Design (FSD) methodology
