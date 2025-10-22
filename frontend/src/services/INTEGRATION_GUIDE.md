# Services Integration Guide

This guide shows how to integrate the new services layer into existing Yellow Cross components and features.

## Table of Contents
- [React Components](#react-components)
- [Redux Integration](#redux-integration)
- [Custom Hooks](#custom-hooks)
- [Error Handling](#error-handling)
- [Complete Example](#complete-example)

## React Components

### Basic Usage in Components

```typescript
import React, { useEffect, useState } from 'react';
import { caseManagementApi } from '@/services';
import type { Case, CaseFilters } from '@/shared/types';

export const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await caseManagementApi.getAll({
          status: 'Open',
          page: 1,
          limit: 10
        });
        setCases(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cases</h2>
      <ul>
        {cases.map(c => (
          <li key={c.caseNumber}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Form Submission with Validation

```typescript
import React, { useState } from 'react';
import { caseManagementApi } from '@/services';
import type { CreateCaseData } from '@/services';

export const CreateCaseForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateCaseData>({
    caseNumber: '',
    title: '',
    clientName: '',
    matterType: 'Civil',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
    practiceArea: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // The service will validate the data using Zod schemas
      const newCase = await caseManagementApi.create(formData);
      
      console.log('Case created:', newCase);
      // Navigate to case detail or show success message
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.caseNumber}
        onChange={e => setFormData({ ...formData, caseNumber: e.target.value })}
        placeholder="Case Number"
      />
      {/* More form fields... */}
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Case'}
      </button>
    </form>
  );
};
```

## Redux Integration

### Using Services in Redux Thunks

```typescript
// features/case-management/store/caseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { caseManagementApi } from '@/services';
import type { Case, CaseFilters } from '@/shared/types';

interface CaseState {
  cases: Case[];
  loading: boolean;
  error: string | null;
  selectedCase: Case | null;
}

const initialState: CaseState = {
  cases: [],
  loading: false,
  error: null,
  selectedCase: null,
};

// Async thunk using the service
export const fetchCases = createAsyncThunk(
  'cases/fetchCases',
  async (filters: CaseFilters, { rejectWithValue }) => {
    try {
      const response = await caseManagementApi.getAll(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cases');
    }
  }
);

export const fetchCaseById = createAsyncThunk(
  'cases/fetchCaseById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await caseManagementApi.getById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch case');
    }
  }
);

export const createCase = createAsyncThunk(
  'cases/createCase',
  async (data: CreateCaseData, { rejectWithValue }) => {
    try {
      return await caseManagementApi.create(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create case');
    }
  }
);

export const updateCase = createAsyncThunk(
  'cases/updateCase',
  async ({ id, data }: { id: string; data: UpdateCaseData }, { rejectWithValue }) => {
    try {
      return await caseManagementApi.update(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update case');
    }
  }
);

export const deleteCase = createAsyncThunk(
  'cases/deleteCase',
  async (id: string, { rejectWithValue }) => {
    try {
      await caseManagementApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete case');
    }
  }
);

const caseSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCase: (state) => {
      state.selectedCase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch case by ID
      .addCase(fetchCaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCase = action.payload;
      })
      .addCase(fetchCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create case
      .addCase(createCase.fulfilled, (state, action) => {
        state.cases.push(action.payload);
      })
      
      // Update case
      .addCase(updateCase.fulfilled, (state, action) => {
        const index = state.cases.findIndex(c => c.caseNumber === action.payload.caseNumber);
        if (index !== -1) {
          state.cases[index] = action.payload;
        }
        if (state.selectedCase?.caseNumber === action.payload.caseNumber) {
          state.selectedCase = action.payload;
        }
      })
      
      // Delete case
      .addCase(deleteCase.fulfilled, (state, action) => {
        state.cases = state.cases.filter(c => c.caseNumber !== action.payload);
        if (state.selectedCase?.caseNumber === action.payload) {
          state.selectedCase = null;
        }
      });
  },
});

export const { clearError, clearSelectedCase } = caseSlice.actions;
export default caseSlice.reducer;
```

### Using Redux Store in Components

```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCases } from './store/caseSlice';
import type { RootState, AppDispatch } from '@/store';

export const CaseListRedux: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cases, loading, error } = useSelector((state: RootState) => state.cases);

  useEffect(() => {
    dispatch(fetchCases({ status: 'Open', page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cases</h2>
      <ul>
        {cases.map(c => (
          <li key={c.caseNumber}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Custom Hooks

### Create Reusable Hooks

```typescript
// hooks/useCases.ts
import { useState, useEffect } from 'react';
import { caseManagementApi } from '@/services';
import type { Case, CaseFilters } from '@/shared/types';

export const useCases = (filters?: CaseFilters) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await caseManagementApi.getAll(filters);
        setCases(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await caseManagementApi.getAll(filters);
      setCases(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  return { cases, loading, error, refresh };
};

export const useCase = (id: string) => {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await caseManagementApi.getById(id);
        setCaseData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { caseData, loading, error };
};
```

### Using Custom Hooks

```typescript
import React from 'react';
import { useCases } from './hooks/useCases';

export const CaseListWithHook: React.FC = () => {
  const { cases, loading, error, refresh } = useCases({
    status: 'Open',
    page: 1,
    limit: 10
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cases</h2>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {cases.map(c => (
          <li key={c.caseNumber}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Error Handling

### Centralized Error Handling

```typescript
import { handleApiError } from '@/services';
import type { ApiError } from '@/services';

export const handleError = (error: unknown): string => {
  try {
    const apiError = handleApiError(error) as ApiError;
    
    // Check for specific error codes
    if (apiError.status === 401) {
      return 'Unauthorized. Please log in.';
    }
    
    if (apiError.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (apiError.status === 404) {
      return 'Resource not found.';
    }
    
    if (apiError.status === 422) {
      // Validation errors
      if (apiError.errors) {
        return Object.entries(apiError.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
      }
    }
    
    return apiError.message || 'An error occurred';
  } catch {
    return 'An unexpected error occurred';
  }
};

// Usage in component
const handleSubmit = async () => {
  try {
    await caseManagementApi.create(formData);
  } catch (error) {
    const errorMessage = handleError(error);
    setError(errorMessage);
  }
};
```

## Complete Example

### Full Feature Integration

```typescript
// pages/cases/CasesPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  caseManagementApi,
  apiMetrics,
  auditService 
} from '@/services';
import { fetchCases, createCase, updateCase, deleteCase } from './store/caseSlice';
import type { RootState, AppDispatch } from '@/store';
import type { Case, CaseFilters } from '@/shared/types';

export const CasesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cases, loading, error } = useSelector((state: RootState) => state.cases);
  
  const [filters, setFilters] = useState<CaseFilters>({
    status: '',
    priority: '',
    matterType: '',
    search: ''
  });
  
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    dispatch(fetchCases(filters));
  }, [dispatch, filters]);

  const handleCreateCase = async (data: CreateCaseData) => {
    try {
      await dispatch(createCase(data)).unwrap();
      alert('Case created successfully!');
    } catch (error) {
      alert(`Failed to create case: ${error}`);
    }
  };

  const handleUpdateCase = async (id: string, data: UpdateCaseData) => {
    try {
      await dispatch(updateCase({ id, data })).unwrap();
      alert('Case updated successfully!');
    } catch (error) {
      alert(`Failed to update case: ${error}`);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (confirm('Are you sure you want to delete this case?')) {
      try {
        await dispatch(deleteCase(id)).unwrap();
        alert('Case deleted successfully!');
      } catch (error) {
        alert(`Failed to delete case: ${error}`);
      }
    }
  };

  const viewMetrics = () => {
    const metrics = apiMetrics.getMetrics();
    console.log('API Metrics:', metrics);
    setShowMetrics(true);
  };

  const viewAuditLogs = () => {
    const logs = auditService.getLogsForResource('CASE', 'multiple');
    console.log('Audit Logs:', logs);
  };

  if (loading) return <div>Loading cases...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cases-page">
      <h1>Case Management</h1>
      
      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.status} 
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Cases List */}
      <div className="cases-list">
        {cases.map(c => (
          <div key={c.caseNumber} className="case-card">
            <h3>{c.title}</h3>
            <p>Client: {c.clientName}</p>
            <p>Status: {c.status}</p>
            <button onClick={() => handleUpdateCase(c.caseNumber, { status: 'Closed' })}>
              Close Case
            </button>
            <button onClick={() => handleDeleteCase(c.caseNumber)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Admin Tools */}
      <div className="admin-tools">
        <button onClick={viewMetrics}>View API Metrics</button>
        <button onClick={viewAuditLogs}>View Audit Logs</button>
      </div>

      {/* Metrics Display */}
      {showMetrics && (
        <div className="metrics-panel">
          <h3>API Performance Metrics</h3>
          <pre>{JSON.stringify(apiMetrics.getMetrics(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

## Best Practices

1. **Use custom hooks** for reusable data fetching logic
2. **Integrate with Redux** for global state management
3. **Handle errors consistently** using centralized error handlers
4. **Monitor performance** using apiMetrics for production issues
5. **Use audit logs** for compliance and debugging
6. **Implement caching** for frequently accessed data
7. **Test thoroughly** with mocked services

## Next Steps

1. Review the [Services README](./README.md) for detailed API documentation
2. Check the [caseManagementApi.ts](./modules/caseManagementApi.ts) for implementation examples
3. Create domain-specific APIs for your features
4. Integrate services into existing Redux slices
5. Add comprehensive error handling and user feedback
6. Monitor API performance and optimize as needed
