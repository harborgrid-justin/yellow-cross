# Redux Toolkit Integration Guide

This guide explains how the Redux Toolkit has been integrated into the Yellow Cross application and how to use it effectively with the existing architecture.

## Overview

The application now uses Redux Toolkit for centralized state management alongside existing custom hooks. This hybrid approach allows:

- **Redux Store**: Global, cross-cutting concerns (authentication, shared UI state, cached data)
- **Custom Hooks**: Feature-specific logic, API calls, and local component state

## Architecture

### Directory Structure

```
frontend/src/
├── app/
│   ├── main.tsx                 # Entry point with Redux Provider
│   └── App.tsx                  # Main app component
├── store/                       # Redux store (NEW)
│   ├── index.ts                 # Barrel exports
│   ├── store.ts                 # Store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── slices/                  # Redux slices
│   │   ├── authSlice.ts        # Authentication state
│   │   └── caseManagementSlice.ts  # Example feature slice
│   └── README.md                # Detailed store documentation
├── features/                    # Feature modules
│   ├── [feature-name]/
│   │   ├── [Feature]Page.tsx   # Page component
│   │   ├── hooks/              # Custom hooks (existing)
│   │   └── components/         # Feature components
├── shared/
│   ├── components/             # Shared components (existing)
│   │   └── ReduxExample.tsx    # Redux integration example
│   └── context/
│       └── AuthContext.tsx     # Auth context (updated to use Redux)
```

## Key Components

### 1. Redux Store Configuration

**File**: `frontend/src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import caseManagementReducer from './slices/caseManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseManagement: caseManagementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. Typed Hooks

**File**: `frontend/src/store/hooks.ts`

Pre-typed hooks for use throughout the app:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### 3. Redux Provider Integration

**File**: `frontend/src/app/main.tsx`

The app is wrapped with Redux Provider:

```typescript
import { Provider } from 'react-redux';
import { store } from '../store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## Usage Patterns

### Pattern 1: Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions, caseManagementActions } from '../store';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  // Select state
  const user = useAppSelector((state) => state.auth.user);
  const cases = useAppSelector((state) => state.caseManagement.cases);
  
  // Dispatch actions
  const handleAction = () => {
    dispatch(caseManagementActions.selectCase('case-123'));
  };
  
  return <div>{user?.email}</div>;
}
```

### Pattern 2: Hybrid Approach (Redux + Custom Hooks)

```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { caseManagementActions } from '../../store';
import { useCaseManagement } from './hooks/useCaseManagement';

function CaseList() {
  const dispatch = useAppDispatch();
  
  // Global state from Redux
  const selectedCaseId = useAppSelector(
    (state) => state.caseManagement.selectedCaseId
  );
  
  // Feature-specific logic from custom hook
  const { cases, loading, actions } = useCaseManagement();
  
  const handleSelect = (id: string) => {
    // Update both Redux and trigger API calls
    dispatch(caseManagementActions.selectCase(id));
    actions.selectCase(id);
  };
  
  return (
    <div>
      {cases.map(c => (
        <div 
          key={c.id} 
          onClick={() => handleSelect(c.id)}
          className={c.id === selectedCaseId ? 'selected' : ''}
        >
          {c.title}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Auth Context Integration

The AuthContext now uses Redux internally but maintains the same API:

```typescript
// Component using AuthContext (existing code works unchanged)
import { useAuth } from '../shared/context/AuthContext';

function Profile() {
  const { user, login, logout } = useAuth();
  
  // Same API as before, now backed by Redux
  return <div>{user?.email}</div>;
}
```

## Creating New Slices

### Step 1: Create the Slice

**File**: `frontend/src/store/slices/clientSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.loading = false;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
  },
});

export const { setLoading, setClients, addClient } = clientSlice.actions;
export default clientSlice.reducer;
```

### Step 2: Add to Store

**File**: `frontend/src/store/store.ts`

```typescript
import clientReducer from './slices/clientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseManagement: caseManagementReducer,
    client: clientReducer,  // Add new reducer
  },
});
```

### Step 3: Export Actions

**File**: `frontend/src/store/index.ts`

```typescript
export * as clientActions from './slices/clientSlice';
```

### Step 4: Use in Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clientActions } from '../store';

function ClientList() {
  const dispatch = useAppDispatch();
  const clients = useAppSelector((state) => state.client.clients);
  
  useEffect(() => {
    // Fetch clients from API
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => dispatch(clientActions.setClients(data)));
  }, [dispatch]);
  
  return <div>...</div>;
}
```

## Best Practices

### 1. State Organization

**Use Redux for:**
- Authentication state
- User preferences
- UI state (theme, sidebar state, etc.)
- Cached data shared across features
- Filters and selections that persist across navigation

**Use Custom Hooks for:**
- API calls and data fetching
- Feature-specific business logic
- Local component state
- Form management

### 2. Action Naming

Use namespaced exports to avoid conflicts:

```typescript
// ✅ Good - Namespaced
import { authActions, clientActions } from '../store';
dispatch(authActions.logout());
dispatch(clientActions.setClients(data));

// ❌ Bad - Can cause conflicts
import { logout, setClients } from '../store';
```

### 3. Selector Patterns

Create reusable selectors for complex queries:

```typescript
// In your slice file
export const selectActiveCases = (state: RootState) =>
  state.caseManagement.cases.filter(c => c.status === 'active');

// In component
import { selectActiveCases } from '../store/slices/caseManagementSlice';

function Dashboard() {
  const activeCases = useAppSelector(selectActiveCases);
  return <div>Active: {activeCases.length}</div>;
}
```

### 4. Async Operations

For async operations, handle them in components or create async thunks:

```typescript
// Component approach (recommended for most cases)
function ClientList() {
  const dispatch = useAppDispatch();
  
  const fetchClients = async () => {
    dispatch(clientActions.setLoading(true));
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      dispatch(clientActions.setClients(data));
    } catch (error) {
      dispatch(clientActions.setError(error.message));
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
}
```

## Migration Guide

### Migrating Existing Features to Redux

1. **Identify global state** - What needs to be shared across components?
2. **Create a slice** - Define state shape and actions
3. **Add to store** - Register reducer
4. **Update components** - Replace local state with Redux
5. **Keep hooks** - Maintain existing hooks for API calls

### Example: Migrating Case Management

**Before** (local state):
```typescript
function CaseList() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filters, setFilters] = useState({});
  // ...
}
```

**After** (Redux):
```typescript
function CaseList() {
  const dispatch = useAppDispatch();
  const selectedCase = useAppSelector(state => state.caseManagement.selectedCaseId);
  const filters = useAppSelector(state => state.caseManagement.filters);
  
  const handleSelect = (id) => {
    dispatch(caseManagementActions.selectCase(id));
  };
  // ...
}
```

## Testing

### Testing Components with Redux

```typescript
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'token',
      isLoading: false,
    },
  },
});

test('renders user email', () => {
  render(
    <Provider store={mockStore}>
      <MyComponent />
    </Provider>
  );
  // assertions...
});
```

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Store README](./frontend/src/store/README.md) - Detailed store documentation

## Troubleshooting

### TypeScript Errors

If you see type errors with `useDispatch` or `useSelector`:
- Always use `useAppDispatch` and `useAppSelector` instead
- These are pre-typed with the correct types

### Action Conflicts

If you get "already exported" errors:
- Use namespaced exports: `authActions`, `clientActions`
- Don't use direct exports in `store/index.ts`

### State Not Updating

If state updates don't reflect in UI:
- Check that you're using `useAppSelector` correctly
- Verify the action is being dispatched
- Use Redux DevTools to inspect state changes

## Next Steps

1. **Add More Slices**: Create slices for other features as needed
2. **Persist State**: Add redux-persist if you need to persist more than auth
3. **Optimize Selectors**: Use `reselect` for memoized selectors
4. **Add Middleware**: Custom middleware for logging, analytics, etc.
5. **DevTools**: Install Redux DevTools Extension for debugging

## Summary

The Redux Toolkit integration provides:
- ✅ Centralized state management
- ✅ Type-safe hooks and actions
- ✅ Backward compatibility with existing code
- ✅ Clear patterns for scaling
- ✅ No breaking changes to existing features
- ✅ Production-ready build
- ✅ No security vulnerabilities
