# Frontend Architecture

This document describes the frontend architecture of the Yellow Cross application, including the Redux Toolkit integration, component structure, and development patterns.

## Overview

The Yellow Cross frontend is built with:
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router 7** - Routing
- **Vite 7** - Build tool

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    main.tsx                           │  │
│  │    Redux Provider → Router → AuthProvider → App      │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │                   Redux Store                         │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │  authSlice   │  │ caseSlice    │  [other slices]  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Component Tree                           │  │
│  │                                                        │  │
│  │  Layout → Pages → Features → Components              │  │
│  │                      │                                │  │
│  │                      ├─ Hooks (API calls)            │  │
│  │                      ├─ Redux (global state)         │  │
│  │                      └─ Local state                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │                  API Client                           │  │
│  │              (fetch with auth)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    Backend REST API
```

## Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Application entry points
│   │   ├── main.tsx                  # App bootstrap with providers
│   │   └── App.tsx                   # Main app with routing
│   │
│   ├── store/                        # Redux Toolkit store
│   │   ├── index.ts                  # Store exports
│   │   ├── store.ts                  # Store configuration
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   ├── slices/                   # Redux slices
│   │   │   ├── authSlice.ts         # Authentication state
│   │   │   └── caseManagementSlice.ts # Feature state
│   │   └── README.md                 # Store documentation
│   │
│   ├── features/                     # Feature modules (60+ features)
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   │
│   │   ├── case-management/          # Case management feature
│   │   │   ├── CaseManagementPage.tsx
│   │   │   ├── hooks/                # Feature-specific hooks
│   │   │   │   ├── useCaseManagement.ts
│   │   │   │   ├── useCaseQueries.ts
│   │   │   │   ├── useCaseMutations.ts
│   │   │   │   └── types.ts
│   │   │   └── components/           # Feature components
│   │   │
│   │   └── [60+ other features]/     # Similar structure
│   │
│   ├── shared/                       # Shared resources
│   │   ├── components/               # Shared components
│   │   │   ├── ui/                   # UI component library
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── [20+ components]
│   │   │   ├── Layout.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── SubFeaturePage.tsx
│   │   │   ├── ReduxExample.tsx
│   │   │   └── README.md
│   │   │
│   │   ├── context/                  # React contexts
│   │   │   └── AuthContext.tsx       # Auth context (Redux-backed)
│   │   │
│   │   ├── api/                      # API client
│   │   │   └── client.ts
│   │   │
│   │   ├── types/                    # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   └── utils/                    # Utility functions
│   │       └── featuresData.ts
│   │
│   ├── assets/                       # Static assets
│   │   └── styles/
│   │       └── app.css
│   │
│   └── config/                       # Configuration
│       └── constants.ts
│
├── index.html                        # HTML entry point
├── vite.config.ts                   # Vite configuration
└── tsconfig.json                    # TypeScript configuration
```

## State Management

### Three-Layer State Architecture

The application uses a three-layer state management approach:

#### 1. Redux Store (Global State)
**Location**: `frontend/src/store/`

**Purpose**: Cross-cutting concerns and shared data
- Authentication (user, tokens)
- UI preferences (theme, sidebar state)
- Selected items (current case, client, etc.)
- Cached shared data
- Filters that persist across navigation

**Usage**:
```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { authActions } from '../store';

const user = useAppSelector(state => state.auth.user);
dispatch(authActions.logout());
```

#### 2. Custom Hooks (Feature State)
**Location**: `frontend/src/features/[feature]/hooks/`

**Purpose**: Feature-specific logic and API calls
- Data fetching and mutations
- Business logic
- Feature-specific state transformations
- Error handling

**Usage**:
```typescript
import { useCaseManagement } from './hooks/useCaseManagement';

const { cases, loading, actions } = useCaseManagement();
actions.createCase(data);
```

#### 3. Local Component State (UI State)
**Location**: Component files

**Purpose**: Transient UI state
- Form inputs
- Modal visibility
- Accordion open/closed
- Temporary UI flags

**Usage**:
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
```

### When to Use Each Layer

```
┌─────────────────────────────────────────────────────────┐
│                    State Decision Tree                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Does state need to be shared across features?          │
│  └─ YES → Redux Store                                   │
│  └─ NO → Continue                                       │
│                                                          │
│  Does state involve API calls or complex logic?         │
│  └─ YES → Custom Hook                                   │
│  └─ NO → Continue                                       │
│                                                          │
│  Is this temporary UI state for this component only?    │
│  └─ YES → Local State                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Routing Architecture

### Route Structure

Routes are organized hierarchically in `App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<Layout />}>
    {/* Public routes */}
    <Route index element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    
    {/* Protected routes */}
    <Route path="profile" element={
      <PrivateRoute><ProfilePage /></PrivateRoute>
    } />
    
    {/* Feature routes */}
    <Route path="features">
      <Route path="case-management" element={
        <PrivateRoute><CaseManagementPage /></PrivateRoute>
      } />
      <Route path="case-management/:subFeature" element={
        <PrivateRoute><SubFeaturePage /></PrivateRoute>
      } />
      {/* 60+ other feature routes */}
    </Route>
  </Route>
</Routes>
```

### Route Protection

Protected routes use the `PrivateRoute` component:

```typescript
// Checks authentication before rendering
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

## Component Patterns

### 1. Page Components
Top-level route components that orchestrate features.

```typescript
// CaseManagementPage.tsx
function CaseManagementPage() {
  const subFeatures = subFeaturesData['case-management'];
  
  return (
    <div className="feature-page">
      <FeatureHero title="Case Management" />
      <SubFeaturesGrid features={subFeatures} />
      <FeatureCTA />
    </div>
  );
}
```

### 2. Feature Components
Components specific to a feature domain.

```typescript
// features/case-management/components/CaseList.tsx
function CaseList() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.caseManagement.selectedCaseId);
  const { cases, loading } = useCaseManagement();
  
  return (
    <div>
      {cases.map(c => (
        <CaseCard 
          key={c.id}
          case={c}
          selected={c.id === selectedId}
          onSelect={() => dispatch(caseManagementActions.selectCase(c.id))}
        />
      ))}
    </div>
  );
}
```

### 3. Shared Components
Reusable components used across features.

```typescript
// shared/components/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

## Data Flow

### 1. Read Flow (Display Data)

```
API → Custom Hook → Component → Redux (optional cache) → UI
```

Example:
```typescript
// 1. Custom hook fetches from API
const { cases, loading } = useCases();

// 2. Component renders data
return <div>{cases.map(c => <CaseCard case={c} />)}</div>;

// 3. (Optional) Cache in Redux for cross-feature access
useEffect(() => {
  if (cases) {
    dispatch(caseManagementActions.setCases(cases));
  }
}, [cases]);
```

### 2. Write Flow (Update Data)

```
User Action → Redux → API → Custom Hook → UI Update
```

Example:
```typescript
// 1. User clicks button
<Button onClick={handleCreate}>Create Case</Button>

// 2. Update Redux state optimistically
const handleCreate = () => {
  dispatch(caseManagementActions.addCase(newCase));
  
  // 3. Call API
  actions.createCase(newCase);
  
  // 4. Hook handles response and updates UI
};
```

## Authentication Flow

### Login Process

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│  LoginPage │────▶│ AuthContext│────▶│ Redux Store│────▶│ LocalStorage
│            │     │  .login()  │     │  actions   │     │            │
└────────────┘     └────────────┘     └────────────┘     └────────────┘
                          │
                          ▼
                   ┌────────────┐
                   │ API Request│
                   │ /api/auth/ │
                   │   login    │
                   └────────────┘
```

### Protected Routes

```
Route Accessed
    │
    ▼
PrivateRoute
    │
    ├─ Check Redux: state.auth.user
    │
    ├─ Authenticated? ─┐
    │  YES             │ NO
    │  │               │
    │  ▼               ▼
    │ Render      Redirect to
    │ Component   /login
```

## Build and Development

### Development Server

```bash
npm run dev:react  # Start Vite dev server (port 5173)
```

### Production Build

```bash
npm run build:react  # Build optimized bundle
```

### Type Checking

```bash
npm run lint:frontend  # TypeScript type checking
```

## Performance Optimization

### 1. Code Splitting

Features are code-split by route:
- Each feature page is a separate chunk
- Loaded on-demand when accessed

### 2. Memoization

Use React.memo for expensive components:
```typescript
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexRender data={data} />;
});
```

### 3. Redux Selectors

Use memoized selectors for derived state:
```typescript
import { createSelector } from '@reduxjs/toolkit';

const selectActiveCases = createSelector(
  [(state) => state.caseManagement.cases],
  (cases) => cases.filter(c => c.status === 'active')
);
```

## Testing Strategy

### Unit Tests
- Test Redux slices in isolation
- Test utility functions
- Test custom hooks

### Integration Tests
- Test component + Redux integration
- Test API interactions
- Test authentication flows

### E2E Tests
- Cypress tests for critical user journeys
- Already configured in project

## Error Handling

### API Errors

```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
  dispatch(actions.setData(data));
} catch (error) {
  dispatch(actions.setError(error.message));
}
```

### Redux Error State

```typescript
// Slice with error handling
const slice = createSlice({
  name: 'feature',
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// Component error display
function Component() {
  const error = useAppSelector(state => state.feature.error);
  
  if (error) {
    return <Alert type="error">{error}</Alert>;
  }
}
```

## Security Considerations

### 1. Authentication
- Tokens stored in Redux and localStorage
- Auto-refresh before expiry
- Logout on unauthorized responses

### 2. Route Protection
- All feature routes protected with PrivateRoute
- Redirect to login if not authenticated

### 3. API Security
- CSRF protection
- Rate limiting
- Input validation

### 4. XSS Prevention
- React escapes by default
- Sanitize user input
- Use TypeScript for type safety

## Migration Path

### Adding New Features

1. **Create feature directory**
   ```bash
   mkdir -p frontend/src/features/new-feature/hooks
   mkdir -p frontend/src/features/new-feature/components
   ```

2. **Create page component**
   ```typescript
   // NewFeaturePage.tsx
   function NewFeaturePage() {
     return <div>New Feature</div>;
   }
   ```

3. **Add routes to App.tsx**
   ```typescript
   <Route path="new-feature" element={
     <PrivateRoute><NewFeaturePage /></PrivateRoute>
   } />
   ```

4. **Create Redux slice (if needed)**
   ```typescript
   // store/slices/newFeatureSlice.ts
   const newFeatureSlice = createSlice({ /* ... */ });
   ```

5. **Create custom hooks**
   ```typescript
   // hooks/useNewFeature.ts
   export function useNewFeature() {
     // API calls and logic
   }
   ```

## Best Practices

### 1. TypeScript
- Always define types for props
- Use interfaces for objects
- Avoid `any` type

### 2. Component Design
- Keep components small and focused
- Extract reusable logic to hooks
- Use composition over inheritance

### 3. State Management
- Don't duplicate state
- Use Redux for cross-cutting concerns
- Keep API calls in hooks

### 4. Code Organization
- Group by feature, not by type
- Co-locate related files
- Use barrel exports (index.ts)

### 5. Performance
- Memoize expensive computations
- Lazy load routes
- Optimize re-renders

## Resources

- [Redux Integration Guide](./REDUX_INTEGRATION_GUIDE.md)
- [Store Documentation](./frontend/src/store/README.md)
- [Components Documentation](./frontend/src/shared/components/README.md)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Summary

The Yellow Cross frontend architecture provides:

✅ **Scalable State Management** - Redux + Hooks + Local State
✅ **Type Safety** - Full TypeScript coverage
✅ **Feature Isolation** - 60+ independent features
✅ **Code Reusability** - Shared components and hooks
✅ **Performance** - Code splitting and optimization
✅ **Security** - Protected routes and auth handling
✅ **Developer Experience** - Clear patterns and documentation
✅ **Production Ready** - Built and tested
