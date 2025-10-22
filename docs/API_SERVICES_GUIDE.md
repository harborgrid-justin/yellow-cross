# Frontend API Services Guide

## Overview

This guide documents the complete set of 60 production-ready frontend API services for the Yellow Cross application. Each service provides a type-safe, validated, and audited interface to backend endpoints.

## Architecture

All API services follow a consistent pattern with:

- **Full TypeScript type safety** - Compile-time and runtime type checking
- **Zod validation** - Input validation for all create/update operations
- **CRUD operations** - getAll, getById, create, update, delete
- **Advanced operations** - getStatistics, search
- **Audit logging** - Automatic logging of all operations for compliance
- **Error handling** - Consistent error handling with retry logic
- **Documentation** - Comprehensive JSDoc comments and examples

## Available API Services (60 Total)

### Core Services (6)

1. **authApi** - Authentication and authorization
2. **caseManagementApi** - Legal case management
3. **clientCrmApi** - Client relationship management
4. **documentManagementApi** - Document storage and versioning
5. **calendarSchedulingApi** - Calendar events and scheduling
6. **timeBillingApi** - Time tracking and billing

### Domain-Specific Services (54)

7. **antitrustCompetitionApi** - Antitrust and competition law cases
8. **appellatePracticeApi** - Appellate court practice
9. **aviationLawApi** - Aviation law matters
10. **bankruptcyManagementApi** - Bankruptcy cases and proceedings
11. **civilRightsApi** - Civil rights litigation
12. **classActionApi** - Class action lawsuits
13. **communicationApi** - Client and case communications
14. **complianceApi** - Regulatory compliance tracking
15. **constructionLawApi** - Construction law disputes
16. **consumerProtectionApi** - Consumer protection cases
17. **contractManagementApi** - Contract lifecycle management
18. **corporateGovernanceApi** - Corporate governance matters
19. **courtDocketApi** - Court docket tracking
20. **criminalDefenseApi** - Criminal defense cases
21. **cybersecurityLegalApi** - Cybersecurity legal matters
22. **dataPrivacyApi** - Data privacy compliance
23. **ediscoveryApi** - Electronic discovery management
24. **educationLawApi** - Education law cases
25. **employmentLawApi** - Employment law matters
26. **energyUtilitiesApi** - Energy and utilities law
27. **environmentalLawApi** - Environmental law cases
28. **estatePlanningApi** - Estate planning and probate
29. **familyLawApi** - Family law cases
30. **financialServicesApi** - Financial services law
31. **franchiseLawApi** - Franchise law matters
32. **governmentContractsApi** - Government contract law
33. **healthcareLawApi** - Healthcare law and compliance
34. **immigrationLawApi** - Immigration law cases
35. **insuranceDefenseApi** - Insurance defense matters
36. **integrationApi** - System integrations
37. **intellectualPropertyApi** - IP litigation and management
38. **internationalTradeApi** - International trade law
39. **laborRelationsApi** - Labor relations and unions
40. **landlordTenantApi** - Landlord-tenant disputes
41. **legalResearchApi** - Legal research and analysis
42. **litigationManagementApi** - Litigation case management
43. **maritimeLawApi** - Maritime and admiralty law
44. **mediationAdrApi** - Mediation and ADR
45. **mergersAcquisitionsApi** - M&A transactions
46. **municipalLawApi** - Municipal law matters
47. **nonProfitLawApi** - Non-profit legal services
48. **personalInjuryApi** - Personal injury cases
49. **proBonoApi** - Pro bono case management
50. **realEstateTransactionsApi** - Real estate transactions
51. **reportingAnalyticsApi** - Reporting and analytics
52. **securitiesLawApi** - Securities law compliance
53. **socialSecurityApi** - Social security cases
54. **sportsEntertainmentApi** - Sports and entertainment law
55. **taskWorkflowApi** - Task and workflow management
56. **taxLawApi** - Tax law matters
57. **technologyTransactionsApi** - Technology transactions
58. **telecommunicationsApi** - Telecommunications law
59. **veteransAffairsApi** - Veterans affairs cases
60. **whiteCollarCrimeApi** - White collar crime defense

## Usage Examples

### Basic CRUD Operations

```typescript
import { antitrustCompetitionApi } from '@/services';

// Get all items with filtering
const cases = await antitrustCompetitionApi.getAll({
  status: 'Open',
  priority: 'High',
  page: 1,
  limit: 20
});

// Get a specific item
const case = await antitrustCompetitionApi.getById('case-123');

// Create a new item
const newCase = await antitrustCompetitionApi.create({
  title: 'Antitrust Investigation',
  description: 'Market monopoly investigation',
  status: 'Open',
  priority: 'High',
  assignedTo: 'attorney@example.com',
  tags: ['urgent', 'federal']
});

// Update an existing item
const updated = await antitrustCompetitionApi.update('case-123', {
  status: 'In Progress',
  priority: 'Critical'
});

// Delete an item
await antitrustCompetitionApi.delete('case-123');
```

### Advanced Operations

```typescript
// Get statistics
const stats = await antitrustCompetitionApi.getStatistics({
  status: 'Open'
});
console.log(`Total open cases: ${stats.total}`);
console.log(`By priority:`, stats.byPriority);

// Search items
const results = await antitrustCompetitionApi.search('monopoly', {
  priority: 'High'
});
```

### Using with React Hooks

```typescript
import { useEffect, useState } from 'react';
import { employmentLawApi, EmploymentCase } from '@/services';

function EmploymentCasesList() {
  const [cases, setCases] = useState<EmploymentCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await employmentLawApi.getAll({
          status: 'Open',
          limit: 50
        });
        setCases(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {cases.map(case => (
        <li key={case.id}>{case.title}</li>
      ))}
    </ul>
  );
}
```

### Error Handling

```typescript
import { familyLawApi, handleApiError } from '@/services';

try {
  const familyCase = await familyLawApi.create({
    title: 'Divorce Proceeding',
    status: 'Open',
    priority: 'Medium'
  });
  console.log('Created:', familyCase);
} catch (error) {
  const apiError = handleApiError(error);
  console.error('API Error:', apiError.message);
  console.error('Status:', apiError.status);
  console.error('Code:', apiError.code);
}
```

### Pagination

```typescript
import { realEstateTransactionsApi } from '@/services';

async function fetchAllTransactions() {
  let page = 1;
  let hasMore = true;
  const allTransactions = [];

  while (hasMore) {
    const response = await realEstateTransactionsApi.getAll({
      page,
      limit: 100
    });
    
    allTransactions.push(...response.data);
    hasMore = response.hasMore;
    page++;
  }

  return allTransactions;
}
```

### Filtering and Search

```typescript
import { immigrationLawApi } from '@/services';

// Filter by multiple criteria
const filtered = await immigrationLawApi.getAll({
  status: 'In Progress',
  priority: 'High',
  assignedTo: 'immigration-attorney@example.com',
  tags: ['visa', 'urgent']
});

// Full-text search
const searchResults = await immigrationLawApi.search('work permit', {
  status: 'Open'
});
```

### Batch Operations

```typescript
import { taskWorkflowApi } from '@/services';

async function createMultipleTasks(taskData: Array<CreateTaskData>) {
  const promises = taskData.map(data => taskWorkflowApi.create(data));
  const results = await Promise.allSettled(promises);
  
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  console.log(`Created ${successful.length} tasks`);
  console.log(`Failed ${failed.length} tasks`);
  
  return { successful, failed };
}
```

## Type Safety

All API services export their types for use in your application:

```typescript
import type {
  TaxLawApi,
  TaxCase,
  CreateTaxCaseData,
  UpdateTaxCaseData,
  TaxCaseFilters,
  TaxCaseStatistics,
  TaxCaseStatus,
  TaxCasePriority
} from '@/services';

// Use types in your components
interface Props {
  case: TaxCase;
  onUpdate: (data: UpdateTaxCaseData) => void;
}

// Use types for state
const [filter, setFilter] = useState<TaxCaseFilters>({
  status: 'Open',
  priority: 'High'
});
```

## Validation

All create and update operations are validated using Zod schemas:

```typescript
import { securitiesLawApi } from '@/services';

// This will fail validation
try {
  await securitiesLawApi.create({
    title: '', // Empty title - validation error
    status: 'InvalidStatus', // Invalid status - validation error
    priority: 'High'
  });
} catch (error) {
  // Error will contain detailed validation messages
  console.error(error);
}

// Valid creation
await securitiesLawApi.create({
  title: 'SEC Compliance Review',
  status: 'Open',
  priority: 'Critical',
  assignedTo: 'securities-attorney@example.com',
  tags: ['SEC', 'compliance']
});
```

## Audit Logging

All operations are automatically logged for compliance:

```typescript
import { auditService, whiteCollarCrimeApi } from '@/services';

// Create a case (automatically logged)
const newCase = await whiteCollarCrimeApi.create({
  title: 'Fraud Investigation',
  status: 'Open',
  priority: 'Critical'
});

// View audit logs
const logs = auditService.getLogs();
console.log('Recent operations:', logs);

// Get logs for specific resource
const caseLogs = auditService.getLogsForResource('WHITECOLLARCASE', newCase.id);
```

## Performance Monitoring

```typescript
import { apiMetrics } from '@/services';

// Get performance metrics
const metrics = apiMetrics.getMetrics();
console.log(`Average response time: ${metrics.averageResponseTime}ms`);
console.log(`Error rate: ${metrics.errorRate * 100}%`);
console.log(`Total requests: ${metrics.requestCount}`);
```

## Best Practices

1. **Always handle errors** - Use try-catch blocks and the handleApiError utility
2. **Use TypeScript types** - Import and use the provided types for type safety
3. **Implement loading states** - Show loading indicators during API calls
4. **Cache when appropriate** - Use the caching utilities for read-heavy operations
5. **Paginate large datasets** - Use pagination parameters to avoid loading too much data
6. **Validate input** - Rely on the built-in Zod validation for data integrity
7. **Monitor performance** - Use apiMetrics to track API performance
8. **Review audit logs** - Regularly check audit logs for compliance

## Testing

When testing components that use API services:

```typescript
import { vi } from 'vitest';
import { veteransAffairsApi } from '@/services';

// Mock the API
vi.mock('@/services', () => ({
  veteransAffairsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getStatistics: vi.fn(),
    search: vi.fn(),
  }
}));

// In your test
it('fetches veterans cases', async () => {
  const mockCases = [
    { id: '1', title: 'VA Benefits Appeal', status: 'Open', priority: 'High' }
  ];
  
  (veteransAffairsApi.getAll as any).mockResolvedValue({
    data: mockCases,
    total: 1,
    page: 1,
    limit: 10
  });
  
  // Test your component
});
```

## Migration from Old API

If migrating from previous API implementations:

**Old approach:**
```typescript
import { api } from '@/shared/api/client';
const response = await api.get('/api/cases');
```

**New approach:**
```typescript
import { litigationManagementApi } from '@/services';
const cases = await litigationManagementApi.getAll();
```

Benefits:
- Type safety with compile-time checking
- Validation with runtime checks
- Built-in error handling
- Audit logging
- Performance monitoring
- Caching support

## Support

For questions or issues:
1. Check this documentation
2. Review the service source code in `frontend/src/services/modules/`
3. Check the main README: `frontend/src/services/README.md`
4. Review type definitions in service files

## Summary

The Yellow Cross application now has 60 production-ready API services covering all major legal practice areas. Each service provides:

- ✅ Full CRUD operations
- ✅ Advanced search and statistics
- ✅ Type safety (TypeScript + Zod)
- ✅ Error handling and retry logic
- ✅ Audit logging for compliance
- ✅ Performance monitoring
- ✅ Comprehensive documentation
- ✅ Consistent patterns and interfaces

All services are ready for production use and follow industry best practices for security, reliability, and maintainability.
