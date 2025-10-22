# Frontend Services Layer

## Overview

This services layer provides a comprehensive, type-safe API infrastructure for the Yellow Cross application. It follows industry best practices with modular architecture, security features, monitoring, and audit logging.

## Architecture

```
services/
├── index.ts                    # Main service exports
├── config/
│   └── apiConfig.ts           # Axios configuration with interceptors
├── core/
│   ├── ApiClient.ts           # Core HTTP client wrapper
│   ├── BaseApiService.ts      # Base class for CRUD operations
│   └── index.ts               # Core exports
├── modules/
│   └── caseManagementApi.ts   # Example domain API
├── utils/
│   └── apiUtils.ts            # Utility functions
├── types/
│   └── index.ts               # Type exports
├── security/
│   ├── SecureTokenManager.ts  # Token management
│   └── CsrfProtection.ts      # CSRF protection
├── cache/
│   └── ApiCache.ts            # Response caching
├── monitoring/
│   └── ApiMetrics.ts          # Performance metrics
└── audit/
    └── index.ts               # Audit logging
```

## Quick Start

### Using a Domain API

```typescript
import { caseManagementApi } from '@/services';

// Get all cases
const cases = await caseManagementApi.getAll({
  status: 'Open',
  page: 1,
  limit: 10
});

// Get a specific case
const case = await caseManagementApi.getById('case-123');

// Create a new case
const newCase = await caseManagementApi.create({
  caseNumber: 'CASE-001',
  title: 'New Case',
  clientName: 'John Doe',
  matterType: 'Civil',
  priority: 'High',
  status: 'Open',
  assignedTo: 'attorney@example.com',
  practiceArea: 'Litigation',
  description: 'Case description',
  tags: ['urgent', 'corporate']
});

// Update a case
const updated = await caseManagementApi.update('case-123', {
  status: 'In Progress'
});

// Delete a case
await caseManagementApi.delete('case-123');

// Get statistics
const stats = await caseManagementApi.getStatistics();

// Search cases
const results = await caseManagementApi.search('contract dispute');
```

### Using Utility Functions

```typescript
import {
  handleApiError,
  buildUrlParams,
  formatDateForApi,
  withRetry,
  apiCache
} from '@/services';

// Error handling
try {
  const data = await someApiCall();
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message);
}

// Build URL parameters
const params = buildUrlParams({ status: 'active', page: 1 });
// Returns: ?status=active&page=1

// Format dates for API
const dateString = formatDateForApi(new Date());

// Retry failed requests
const data = await withRetry(
  () => api.get('/endpoint'),
  { maxRetries: 3, backoffMs: 1000 }
);

// Cache API responses
apiCache.set('key', data, 5 * 60 * 1000); // Cache for 5 minutes
const cached = apiCache.get('key');
```

### Authentication

```typescript
import { tokenUtils } from '@/services';

// Check if authenticated
if (tokenUtils.isAuthenticated()) {
  // User is authenticated
}

// Get current token
const token = tokenUtils.getToken();

// Set tokens (usually done after login)
tokenUtils.setTokens(accessToken, refreshToken, expiresIn);

// Clear authentication
tokenUtils.clearAuth();
```

### Monitoring

```typescript
import { apiMetrics } from '@/services';

// Get API metrics
const metrics = apiMetrics.getMetrics();
console.log(`Average response time: ${metrics.averageResponseTime}ms`);
console.log(`Error rate: ${metrics.errorRate * 100}%`);

// Clear metrics
apiMetrics.clear();
```

### Audit Logging

```typescript
import { auditService, AuditAction, AuditStatus } from '@/services';

// Log an action
await auditService.logAction({
  action: AuditAction.CREATE,
  resourceType: 'CASE',
  resourceId: 'case-123',
  status: AuditStatus.SUCCESS,
  details: { caseNumber: 'CASE-001' }
});

// Get audit logs
const logs = auditService.getLogs();

// Get logs for specific resource
const caseLogs = auditService.getLogsForResource('CASE', 'case-123');
```

## Creating a New Domain API

To create a new domain API, follow the template in `modules/caseManagementApi.ts`:

1. **Define interfaces and types**
   ```typescript
   export interface MyDomainApi {
     getAll(filters?: MyFilters): Promise<PaginatedResponse<MyEntity>>;
     getById(id: string): Promise<MyEntity>;
     create(data: CreateMyEntityData): Promise<MyEntity>;
     update(id: string, data: UpdateMyEntityData): Promise<MyEntity>;
     delete(id: string): Promise<void>;
   }
   ```

2. **Create validation schemas**
   ```typescript
   import { z } from 'zod';
   
   const createMyEntitySchema = z.object({
     name: z.string().min(1).max(100),
     // ... other fields
   }).strict();
   ```

3. **Implement the API class**
   ```typescript
   class MyDomainApiImpl implements MyDomainApi {
     private readonly baseEndpoint = '/api/my-domain';
     
     async getAll(filters?: MyFilters): Promise<PaginatedResponse<MyEntity>> {
       // Implementation with validation, error handling, and audit logging
     }
     
     // ... other methods
   }
   ```

4. **Export singleton instance**
   ```typescript
   export const myDomainApi: MyDomainApi = new MyDomainApiImpl();
   ```

5. **Add to services/index.ts**
   ```typescript
   export { myDomainApi } from './modules/myDomainApi';
   export type { MyDomainApi } from './modules/myDomainApi';
   ```

## Features

### Type Safety
- Full TypeScript support
- Zod validation for runtime type checking
- Compile-time type checking

### Security
- Secure token management
- Automatic token refresh
- CSRF protection
- Request authentication

### Monitoring
- Performance metrics tracking
- Error rate monitoring
- Request/response logging

### Resilience
- Automatic retry with exponential backoff
- Error handling and transformation
- Network error detection

### Caching
- Response caching
- Configurable TTL
- Cache invalidation

### Audit Logging
- Comprehensive action logging
- Resource-specific audit trails
- Success/failure tracking

## Best Practices

1. **Always use validation schemas** - Define Zod schemas for create and update operations
2. **Handle errors consistently** - Use `handleApiError` for consistent error handling
3. **Implement audit logging** - Log important operations for compliance and debugging
4. **Use caching wisely** - Cache read-heavy endpoints to improve performance
5. **Monitor API health** - Regularly check metrics to identify performance issues
6. **Follow naming conventions** - Use consistent naming for endpoints and methods

## Testing

When testing components that use services:

```typescript
import { caseManagementApi } from '@/services';
import { vi } from 'vitest';

// Mock the API
vi.mock('@/services', () => ({
  caseManagementApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

// In your test
it('fetches cases', async () => {
  const mockCases = [/* ... */];
  (caseManagementApi.getAll as any).mockResolvedValue(mockCases);
  
  // Test your component
});
```

## Configuration

The services layer uses configuration from:
- `/frontend/src/config/constants.ts` - Application-wide constants
- `/frontend/src/constants/api.ts` - API-specific constants

Key configuration values:
- `API_CONFIG.baseUrl` - API base URL (from environment variable)
- `API_CONFIG.timeout` - Request timeout (30 seconds)
- Token storage keys for localStorage
- HTTP status codes and content types

## Troubleshooting

### "Token expired" errors
The system automatically refreshes expired tokens. If you see persistent errors:
1. Check that refresh token is valid
2. Verify backend refresh endpoint is working
3. Clear localStorage and re-login

### Network errors
1. Check API base URL configuration
2. Verify backend is running
3. Check browser console for CORS issues

### Validation errors
Zod validation errors include detailed messages:
```typescript
try {
  await api.create(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues); // Detailed validation errors
  }
}
```

## Future Enhancements

- GraphQL support
- WebSocket integration
- Offline mode with service workers
- Request queuing and batching
- Advanced caching strategies (LRU, time-based)
- Circuit breaker pattern for resilience
- Request deduplication
- Optimistic updates support

## Migration Guide

If migrating from the old API client (`/shared/api/client.ts`):

**Old approach:**
```typescript
import { api } from '@/shared/api/client';

const response = await api.get('/api/cases');
```

**New approach:**
```typescript
import { caseManagementApi } from '@/services';

const cases = await caseManagementApi.getAll();
```

Benefits of new approach:
- Type safety with compile-time checking
- Validation with runtime checks
- Built-in error handling
- Audit logging
- Performance monitoring
- Caching support

## License

MIT
