# React Hooks Guide

## Overview

This guide documents the comprehensive React hooks implementation for all features in Yellow Cross. Each feature has its own set of hooks for queries (data fetching), mutations (data modification), and composites (combining both).

## Architecture

### Shared Hooks

Located in `frontend/src/shared/hooks/`, these provide the foundation for all feature hooks:

- **useQuery**: Generic hook for data fetching with loading, error states, and refetch capability
- **useMutation**: Generic hook for data mutations (POST, PUT, PATCH, DELETE)
- **types**: Common TypeScript interfaces used across all hooks

### Feature Hooks

Each feature in `frontend/src/features/[feature-name]/hooks/` follows this structure:

```
hooks/
├── types.ts              # Feature-specific TypeScript types
├── useQueries.ts         # Query hooks for data fetching
├── useMutations.ts       # Mutation hooks for data modification
├── useManagement.ts      # Composite hook (for complex features)
└── index.ts              # Export all hooks
```

## Usage Examples

### Basic Query Hook

```typescript
import { useCases } from '@features/case-management/hooks';

function CaseList() {
  const { data, loading, error, refetch } = useCases({ page: 1, limit: 10 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.data.map(case => (
        <div key={case.id}>{case.title}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Basic Mutation Hook

```typescript
import { useCreateCase } from '@features/case-management/hooks';

function CreateCase() {
  const { mutate, loading, error } = useCreateCase({
    onSuccess: (newCase) => {
      console.log('Case created:', newCase);
    },
    onError: (error) => {
      console.error('Failed to create case:', error);
    }
  });

  const handleSubmit = async (formData) => {
    try {
      await mutate(formData);
    } catch (err) {
      // Error already handled by onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Case'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Composite Hook (Advanced)

```typescript
import { useCaseManagement } from '@features/case-management/hooks';

function CaseManager() {
  const {
    cases,
    currentCase,
    loading,
    error,
    actions,
    selectedCaseId
  } = useCaseManagement();

  return (
    <div>
      {/* List of cases */}
      {cases?.data.map(case => (
        <div key={case.id} onClick={() => actions.selectCase(case.id)}>
          {case.title}
        </div>
      ))}

      {/* Selected case details */}
      {currentCase && (
        <div>
          <h2>{currentCase.title}</h2>
          <button onClick={() => actions.updateStatus({ status: 'Closed' })}>
            Close Case
          </button>
        </div>
      )}

      {/* Loading states */}
      {loading.cases && <div>Loading cases...</div>}
      {loading.updating && <div>Updating...</div>}
    </div>
  );
}
```

## Available Features

### Core Features (15)

1. **Case Management** - `@features/case-management/hooks`
   - Query: `useCases`, `useCase`, `useCaseStatus`, `useCaseNotes`, `useCaseTimeline`, `useCaseAnalytics`
   - Mutation: `useCreateCase`, `useUpdateCase`, `useUpdateCaseStatus`, `useAssignCase`, `useTagCase`, `useCloseCase`, `useDeleteCase`, `useCreateCaseNote`
   - Composite: `useCaseManagement`

2. **Client CRM** - `@features/client-crm/hooks`
   - Query: `useClients`, `useClient`, `useClientCommunications`, `useClientFeedback`, `useClientSearch`, `useConflictCheck`
   - Mutation: `useCreateClient`, `useUpdateClient`, `useDeleteClient`, `useAddCommunication`, `useSubmitFeedback`
   - Composite: `useClientManagement`

3. **Document Management** - `@features/document-management/hooks`
   - Query: `useDocuments`, `useDocument`, `useDocumentVersions`, `useDocumentSearch`
   - Mutation: `useCreateDocument`, `useUpdateDocument`, `useDeleteDocument`, `useCreateDocumentVersion`

4. **Time & Billing** - `@features/time-billing/hooks`
   - Query: `useBillings`, `useBilling`
   - Mutation: `useCreateBilling`, `useUpdateBilling`, `useDeleteBilling`

5. **Calendar & Scheduling** - `@features/calendar-scheduling/hooks`
   - Query: `useCalendars`, `useCalendar`
   - Mutation: `useCreateCalendar`, `useUpdateCalendar`, `useDeleteCalendar`

6. **Task & Workflow** - `@features/task-workflow/hooks`
   - Query: `useTasks`, `useTask`
   - Mutation: `useCreateTask`, `useUpdateTask`, `useDeleteTask`

7. **Legal Research** - `@features/legal-research/hooks`
   - Query: `useResearchs`, `useResearch`
   - Mutation: `useCreateResearch`, `useUpdateResearch`, `useDeleteResearch`

8. **Court & Docket** - `@features/court-docket/hooks`
   - Query: `useDockets`, `useDocket`
   - Mutation: `useCreateDocket`, `useUpdateDocket`, `useDeleteDocket`

9. **Contract Management** - `@features/contract-management/hooks`
   - Query: `useContracts`, `useContract`
   - Mutation: `useCreateContract`, `useUpdateContract`, `useDeleteContract`

10. **eDiscovery** - `@features/ediscovery/hooks`
    - Query: `useEvidences`, `useEvidence`
    - Mutation: `useCreateEvidence`, `useUpdateEvidence`, `useDeleteEvidence`

11. **Compliance** - `@features/compliance/hooks`
    - Query: `useCompliances`, `useCompliance`
    - Mutation: `useCreateCompliance`, `useUpdateCompliance`, `useDeleteCompliance`

12. **Reporting & Analytics** - `@features/reporting-analytics/hooks`
    - Query: `useReports`, `useReport`
    - Mutation: `useCreateReport`, `useUpdateReport`, `useDeleteReport`

13. **Communication** - `@features/communication/hooks`
    - Query: `useMessages`, `useMessage`
    - Mutation: `useCreateMessage`, `useUpdateMessage`, `useDeleteMessage`

14. **Security** - `@features/security/hooks`
    - Query: `useSecuritys`, `useSecurity`
    - Mutation: `useCreateSecurity`, `useUpdateSecurity`, `useDeleteSecurity`

15. **Integration** - `@features/integration/hooks`
    - Query: `useIntegrations`, `useIntegration`
    - Mutation: `useCreateIntegration`, `useUpdateIntegration`, `useDeleteIntegration`

### Practice Area Features (45)

All practice area features follow the same pattern with standardized hooks:
- Litigation Management
- Mediation & ADR
- Intellectual Property
- Real Estate Transactions
- Corporate Governance
- Mergers & Acquisitions
- Employment Law
- Immigration Law
- Family Law
- Criminal Defense
- Bankruptcy Management
- Estate Planning
- Tax Law
- Personal Injury
- Class Action
- Healthcare Law
- Financial Services
- Securities Law
- Data Privacy
- Cybersecurity Legal
- White Collar Crime
- Appellate Practice
- International Trade
- Labor Relations
- Antitrust & Competition
- Energy & Utilities
- Environmental Law
- Maritime Law
- Aviation Law
- Sports & Entertainment
- Telecommunications
- Technology Transactions
- Franchise Law
- Government Contracts
- Insurance Defense
- Non-Profit Law
- Civil Rights
- Construction Law
- Education Law
- Municipal Law
- Veterans Affairs
- Social Security
- Consumer Protection
- Landlord-Tenant
- Pro Bono Management

Each feature has the standard set of hooks: `use[Entity]s`, `use[Entity]`, `useCreate[Entity]`, `useUpdate[Entity]`, `useDelete[Entity]`.

## Best Practices

### 1. Error Handling

Always handle errors appropriately:

```typescript
const { data, error } = useCases();

if (error) {
  // Display user-friendly error message
  return <ErrorMessage message={error} />;
}
```

### 2. Loading States

Show loading indicators for better UX:

```typescript
const { data, loading } = useCases();

if (loading) {
  return <Spinner />;
}
```

### 3. Optimistic Updates

For better perceived performance:

```typescript
const { mutate } = useUpdateCase(caseId, {
  onSuccess: (updatedCase) => {
    // Update local state immediately
    setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
  }
});
```

### 4. Refetching Data

Refresh data when needed:

```typescript
const { refetch } = useCases();

// Refetch after mutation
useEffect(() => {
  if (mutationSuccess) {
    refetch();
  }
}, [mutationSuccess, refetch]);
```

### 5. Conditional Fetching

Skip queries when not needed:

```typescript
const { data } = useCase(caseId, { skip: !caseId });
```

## TypeScript Support

All hooks are fully typed with TypeScript:

- Input types for mutations
- Response types for queries
- Generic types for reusable patterns
- Proper error typing

## API Integration

Hooks automatically:
- Add authentication tokens to requests
- Handle API errors consistently
- Parse JSON responses
- Manage request/response lifecycle

## Testing

Example test for a hook:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCases } from '@features/case-management/hooks';

test('fetches cases successfully', async () => {
  const { result } = renderHook(() => useCases());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

## Migration from Direct API Calls

Replace direct API calls:

```typescript
// Before
const [cases, setCases] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch('/api/cases')
    .then(res => res.json())
    .then(setCases)
    .finally(() => setLoading(false));
}, []);

// After
const { data: cases, loading } = useCases();
```

## Performance Considerations

- Hooks use React's built-in optimization (useCallback, useMemo)
- Data is cached in component state
- Refetching is controlled and explicit
- No unnecessary re-renders

## Future Enhancements

Planned improvements:
- Global cache management
- Request deduplication
- Automatic retry logic
- Offline support
- Real-time updates via WebSocket

## Support

For issues or questions:
- Check the examples in this guide
- Review feature-specific hook implementations
- Consult the API documentation
- Contact the development team

---

**Last Updated:** October 2025  
**Version:** 1.0.0
