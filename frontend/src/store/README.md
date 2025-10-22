# Redux Store

This directory contains the Redux Toolkit store configuration and slices for managing global application state.

## Directory Structure

```
store/
├── index.ts                      # Main store exports
├── store.ts                      # Store configuration
├── hooks.ts                      # Typed Redux hooks
├── slices/                       # Redux slices
│   ├── authSlice.ts             # Authentication state
│   └── caseManagementSlice.ts   # Case management state (example)
└── README.md                     # This file
```

## Using Redux in Your Components

### 1. Using Redux Hooks

Import the typed hooks from the store:

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MyComponent() {
  // Select state from the store
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.user !== null);
  
  // Get the dispatch function
  const dispatch = useAppDispatch();
  
  // Dispatch actions
  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  
  return <div>{user?.email}</div>;
}
```

### 2. Using Actions

Actions are organized by slice and exported as namespaces to avoid conflicts:

```typescript
import { authActions, caseManagementActions } from '../store';

// Auth actions
dispatch(authActions.loginSuccess({ user, accessToken, refreshToken }));
dispatch(authActions.logout());
dispatch(authActions.updateUser({ firstName: 'John' }));

// Case management actions
dispatch(caseManagementActions.selectCase('case-123'));
dispatch(caseManagementActions.addCase(newCase));
```

### 3. Accessing State

Use the `useAppSelector` hook to access state from any slice:

```typescript
import { useAppSelector } from '../store/hooks';

function Dashboard() {
  // Auth state
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  // Case management state
  const { cases, selectedCaseId } = useAppSelector((state) => state.caseManagement);
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>You have {cases.length} cases</p>
    </div>
  );
}
```

## Creating New Slices

To add a new feature slice:

1. Create a new file in `slices/` directory (e.g., `slices/clientSlice.ts`)
2. Define your state interface and initial state
3. Create the slice using `createSlice` from Redux Toolkit
4. Export actions and reducer
5. Add the reducer to `store.ts`
6. Export actions namespace in `index.ts`

### Example Slice Template

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyFeatureState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MyFeatureState = {
  data: [],
  loading: false,
  error: null,
};

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setData, setError } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

## Best Practices

1. **Keep slices focused**: Each slice should manage a specific domain of your application
2. **Use TypeScript**: Define interfaces for your state and action payloads
3. **Normalize data**: Store entities by ID in objects rather than arrays for efficient lookups
4. **Async operations**: Use async thunks or handle async logic in components/hooks
5. **Selector patterns**: Create reusable selectors for complex state queries
6. **Immutability**: Redux Toolkit uses Immer, so you can "mutate" state in reducers safely

## Integration with Existing Hooks

The Redux store complements (not replaces) existing custom hooks:

- **Redux**: Use for global, cross-cutting state (auth, UI preferences, shared data)
- **Custom Hooks**: Use for feature-specific logic, API calls, and local component state

Example of using both:

```typescript
function CaseList() {
  // Redux for global state
  const selectedCaseId = useAppSelector((state) => state.caseManagement.selectedCaseId);
  const dispatch = useAppDispatch();
  
  // Custom hook for API calls and local state
  const { cases, loading, actions } = useCaseManagement();
  
  const handleSelect = (id: string) => {
    dispatch(caseManagementActions.selectCase(id));
    actions.selectCase(id);
  };
  
  return <div>...</div>;
}
```

## Middleware

The store is configured with Redux Toolkit's default middleware which includes:

- `redux-thunk` for async actions
- Development checks for common mistakes
- Serializable state invariant middleware

Custom middleware can be added in `store.ts` if needed.

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux Style Guide](https://redux.js.org/style-guide/)
