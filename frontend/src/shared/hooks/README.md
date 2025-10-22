# Shared Hooks

This directory contains the foundational hooks used across all features in the application.

## Files

### `useQuery.ts`
Generic hook for data fetching with automatic loading and error state management.

**Features:**
- Automatic loading state
- Error handling
- Refetch capability
- Skip option for conditional fetching
- Success/error callbacks

**Example:**
```typescript
const { data, loading, error, refetch } = useQuery<MyType>('/api/endpoint');
```

### `useMutation.ts`
Generic hook for data mutations (POST, PUT, PATCH, DELETE).

**Features:**
- Support for all mutation methods
- Loading and error states
- Success/error callbacks
- Returns mutation function and state

**Example:**
```typescript
const { mutate, loading, error } = useMutation<ResponseType, InputType>(
  '/api/endpoint',
  'post',
  {
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.error('Error:', error),
  }
);
```

### `types.ts`
Common TypeScript interfaces and types.

**Exports:**
- `QueryState<T>` - State for query hooks
- `MutationState<TData, TVariables>` - State for mutation hooks
- `PaginationParams` - Standard pagination parameters
- `PaginatedResponse<T>` - Standard paginated response format
- `FilterParams` - Generic filter parameters

## Usage

Import from the shared hooks:

```typescript
import { useQuery, useMutation } from '@shared/hooks';
import type { QueryState, MutationState } from '@shared/hooks';
```

## Best Practices

1. **Always handle loading states**: Show loading indicators to users
2. **Always handle errors**: Display user-friendly error messages
3. **Use TypeScript generics**: Provide proper types for data and variables
4. **Use callbacks**: Handle success/error cases appropriately
5. **Conditional fetching**: Use `skip` option when data isn't needed yet

## Feature-Specific Hooks

Each feature has its own hooks built on top of these shared hooks. See individual feature directories:
- `/features/case-management/hooks/`
- `/features/client-crm/hooks/`
- `/features/document-management/hooks/`
- etc.

For comprehensive documentation, see `/docs/HOOKS_GUIDE.md`.
