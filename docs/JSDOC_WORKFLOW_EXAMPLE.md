# JSDoc Generation Workflow Example

This document demonstrates how the 6 expert agents work together to document a complete feature in the Yellow Cross application.

## Example Feature: Case Management

Let's walk through documenting the Case Management feature, which includes:
- Page components
- Custom hooks
- API services
- Redux state management
- Utility functions
- UI components

## Agent Workflow

### Step 1: Components Agent - UI Components

**File**: `frontend/src/shared/components/ui/Card/Card.tsx`

**Agent**: Components Agent (`.github/agents/jsdoc-components.md`)

**Documentation Added**:
```typescript
/**
 * Card - Reusable card container component
 * 
 * A flexible card component that provides a consistent container
 * for content throughout the application. Supports different
 * variants, optional headers, footers, and click actions.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {string} [props.title] - Optional card title
 * @param {string} [props.className] - Additional CSS classes
 * @param {('default'|'bordered'|'elevated')} [props.variant='default'] - Card style variant
 * @param {Function} [props.onClick] - Optional click handler (makes card interactive)
 * @param {ReactNode} [props.footer] - Optional footer content
 * 
 * @returns {JSX.Element} Rendered card component
 * 
 * @example
 * ```tsx
 * // Basic card
 * <Card title="Case Details">
 *   <p>Case content here</p>
 * </Card>
 * ```
 * 
 * @example
 * ```tsx
 * // Interactive card with footer
 * <Card 
 *   title="Recent Activity"
 *   variant="elevated"
 *   onClick={handleCardClick}
 *   footer={<Button>View All</Button>}
 * >
 *   <ActivityList items={activities} />
 * </Card>
 * ```
 * 
 * @see {@link Button} for footer actions
 * @see {@link Badge} for status indicators in cards
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  variant = 'default',
  onClick,
  footer
}) => {
  // Component implementation
};
```

---

### Step 2: Hooks Agent - Custom Hooks

**File**: `frontend/src/features/case-management/hooks/useCaseQueries.ts`

**Agent**: Hooks Agent (`.github/agents/jsdoc-hooks.md`)

**Documentation Added**:
```typescript
/**
 * useCaseQueries - Custom hook for case data fetching
 * 
 * Provides a collection of query hooks for fetching case-related data
 * including case details, case list, and case timeline. All queries
 * include automatic caching, refetching, and error handling.
 * 
 * @module features/case-management/hooks
 */

/**
 * useCase - Fetches a single case by ID
 * 
 * Retrieves detailed information for a specific case. Automatically
 * refetches when the case ID changes. Caches results for performance.
 * 
 * @hook
 * @param {string} caseId - The unique case identifier
 * @param {Object} [options] - Query options
 * @param {boolean} [options.enabled=true] - Whether to enable the query
 * @param {Function} [options.onSuccess] - Success callback
 * @param {Function} [options.onError] - Error callback
 * 
 * @returns {Object} Query result
 * @returns {Case|null} returns.data - The case data
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.refetch - Manual refetch function
 * 
 * @example
 * ```tsx
 * function CaseDetailPage() {
 *   const { caseId } = useParams();
 *   const { data: case, loading, error, refetch } = useCase(caseId);
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   
 *   return (
 *     <div>
 *       <h1>{case.title}</h1>
 *       <Button onClick={refetch}>Refresh</Button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link useCaseMutations} for case update operations
 * @see {@link Case} for case type definition
 */
export function useCase(
  caseId: string,
  options?: UseCaseOptions
): QueryState<Case> {
  // Hook implementation
}

/**
 * useCases - Fetches a paginated list of cases
 * 
 * Retrieves cases with support for filtering, sorting, and pagination.
 * Results are cached and automatically refetched when filters change.
 * 
 * @hook
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page=1] - Page number (1-indexed)
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.search] - Search term
 * @param {string} [params.sortBy='createdAt'] - Sort field
 * @param {('asc'|'desc')} [params.sortOrder='desc'] - Sort direction
 * 
 * @returns {Object} Query result with pagination
 * @returns {Case[]} returns.data - Array of cases
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message
 * @returns {number} returns.total - Total number of cases
 * @returns {number} returns.page - Current page
 * @returns {Function} returns.refetch - Refetch function
 * 
 * @example
 * ```tsx
 * function CaseListPage() {
 *   const [page, setPage] = useState(1);
 *   const [status, setStatus] = useState('active');
 *   
 *   const { 
 *     data: cases, 
 *     loading, 
 *     total,
 *     refetch 
 *   } = useCases({ page, status, limit: 25 });
 *   
 *   return (
 *     <div>
 *       <StatusFilter value={status} onChange={setStatus} />
 *       <CaseList cases={cases} loading={loading} />
 *       <Pagination 
 *         page={page} 
 *         total={total} 
 *         onChange={setPage} 
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link useCase} for single case queries
 * @see {@link CaseFilters} for filter options
 */
export function useCases(
  params?: UseCasesParams
): QueryStateWithPagination<Case[]> {
  // Hook implementation
}
```

---

### Step 3: Services Agent - API Functions

**File**: `frontend/src/services/modules/caseManagementApi.ts`

**Agent**: Services Agent (`.github/agents/jsdoc-services.md`)

**Documentation Added**:
```typescript
/**
 * Case Management API Module
 * 
 * Provides API functions for managing legal cases including
 * CRUD operations, status updates, and document associations.
 * All functions require authentication.
 * 
 * @module services/modules/caseManagementApi
 */

/**
 * getCases - Fetches a list of cases
 * 
 * Retrieves cases from the backend with support for pagination,
 * filtering, and sorting. Requires authentication token.
 * 
 * **HTTP Method**: GET
 * **Endpoint**: `/api/cases`
 * **Auth Required**: Yes
 * 
 * @async
 * @function
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.status] - Filter by status (open, closed, pending)
 * @param {string} [params.search] - Search term for title/description
 * @param {string} [params.sortBy='createdAt'] - Field to sort by
 * @param {string} [params.sortOrder='desc'] - Sort direction (asc, desc)
 * 
 * @returns {Promise<ApiResponse<CasesListResponse>>} API response
 * @returns {Case[]} returns.data.cases - Array of cases
 * @returns {number} returns.data.total - Total count
 * @returns {number} returns.data.page - Current page
 * @returns {number} returns.data.totalPages - Total pages
 * 
 * @throws {ApiError} 401 - Unauthorized (missing or invalid token)
 * @throws {ApiError} 403 - Forbidden (insufficient permissions)
 * @throws {ApiError} 500 - Internal server error
 * 
 * @example
 * ```typescript
 * // Fetch first page of active cases
 * try {
 *   const response = await getCases({
 *     page: 1,
 *     limit: 25,
 *     status: 'open',
 *     sortBy: 'updatedAt',
 *     sortOrder: 'desc'
 *   });
 *   
 *   console.log(`Found ${response.data.total} cases`);
 *   console.log('Cases:', response.data.cases);
 * } catch (error) {
 *   console.error('Failed to fetch cases:', error.message);
 * }
 * ```
 * 
 * @see {@link getCase} for single case retrieval
 * @see {@link Case} for case type definition
 */
export async function getCases(
  params?: GetCasesParams
): Promise<ApiResponse<CasesListResponse>> {
  const queryString = new URLSearchParams(params as any).toString();
  return api.get(`/cases?${queryString}`);
}

/**
 * createCase - Creates a new case
 * 
 * Creates a new case record with the provided information.
 * Validates required fields and returns the created case with
 * generated ID and timestamps.
 * 
 * **HTTP Method**: POST
 * **Endpoint**: `/api/cases`
 * **Auth Required**: Yes
 * **Permissions**: cases.create
 * 
 * @async
 * @function
 * @param {CreateCaseData} data - Case creation data
 * @param {string} data.title - Case title (required, max 200 chars)
 * @param {string} data.description - Case description (required)
 * @param {string} data.clientId - Associated client ID (required)
 * @param {string} [data.caseNumber] - Custom case number (optional, auto-generated if not provided)
 * @param {string} [data.status='open'] - Initial status
 * @param {string} [data.priority='medium'] - Case priority
 * @param {string[]} [data.tags] - Array of tag strings
 * 
 * @returns {Promise<ApiResponse<Case>>} API response with created case
 * @returns {Case} returns.data - The created case object
 * 
 * @throws {ApiError} 400 - Bad request (validation failed)
 * @throws {ApiError} 401 - Unauthorized
 * @throws {ApiError} 403 - Forbidden (missing cases.create permission)
 * @throws {ApiError} 404 - Client not found
 * @throws {ApiError} 409 - Conflict (duplicate case number)
 * @throws {ApiError} 500 - Internal server error
 * 
 * @example
 * ```typescript
 * try {
 *   const newCase = await createCase({
 *     title: 'Smith v. Jones Contract Dispute',
 *     description: 'Breach of contract claim regarding...',
 *     clientId: 'client-123',
 *     priority: 'high',
 *     tags: ['contract', 'commercial']
 *   });
 *   
 *   console.log('Case created:', newCase.data.id);
 *   navigate(`/cases/${newCase.data.id}`);
 * } catch (error) {
 *   if (error.status === 400) {
 *     console.error('Validation error:', error.message);
 *   } else if (error.status === 404) {
 *     console.error('Client not found');
 *   }
 * }
 * ```
 * 
 * @see {@link updateCase} for updating existing cases
 * @see {@link CreateCaseData} for data structure
 */
export async function createCase(
  data: CreateCaseData
): Promise<ApiResponse<Case>> {
  return api.post('/cases', data);
}
```

---

### Step 4: Redux Agent - State Management

**File**: `frontend/src/store/slices/caseManagementSlice.ts`

**Agent**: Redux Agent (`.github/agents/jsdoc-redux.md`)

**Documentation Added**:
```typescript
/**
 * Case Management Redux Slice
 * 
 * Manages global state for case management including the current case,
 * case list, filters, and UI state. Uses Redux Toolkit for simplified
 * state management with immer integration.
 * 
 * @module store/slices/caseManagementSlice
 */

/**
 * CaseManagementState - State shape for case management
 * 
 * @typedef {Object} CaseManagementState
 * @property {Case|null} currentCase - Currently selected case
 * @property {Case[]} cases - List of cases
 * @property {boolean} loading - Loading state for operations
 * @property {string|null} error - Error message if any
 * @property {Object} filters - Active filter settings
 * @property {string} filters.status - Status filter
 * @property {string} filters.search - Search term
 * @property {Object} pagination - Pagination state
 * @property {number} pagination.page - Current page
 * @property {number} pagination.total - Total items
 * @property {number} pagination.pageSize - Items per page
 */

/**
 * Initial state for case management slice
 * 
 * @type {CaseManagementState}
 */
const initialState: CaseManagementState = {
  currentCase: null,
  cases: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    total: 0,
    pageSize: 20,
  },
};

/**
 * Case Management Slice
 * 
 * Redux Toolkit slice containing reducers and actions for
 * case management state.
 */
export const caseManagementSlice = createSlice({
  name: 'caseManagement',
  initialState,
  reducers: {
    /**
     * setCurrentCase - Sets the currently selected case
     * 
     * Updates the currentCase in state, typically when navigating
     * to a case detail page or selecting a case from the list.
     * 
     * @function
     * @param {CaseManagementState} state - Current state
     * @param {PayloadAction<Case>} action - Action with case payload
     * 
     * @example
     * ```typescript
     * dispatch(setCurrentCase(selectedCase));
     * ```
     */
    setCurrentCase: (state, action: PayloadAction<Case>) => {
      state.currentCase = action.payload;
      state.error = null;
    },

    /**
     * setCases - Sets the cases list
     * 
     * Replaces the current cases array with new data, typically
     * after fetching cases from the API. Clears any existing error.
     * 
     * @function
     * @param {CaseManagementState} state - Current state
     * @param {PayloadAction<Case[]>} action - Action with cases array
     * 
     * @example
     * ```typescript
     * dispatch(setCases(fetchedCases));
     * ```
     */
    setCases: (state, action: PayloadAction<Case[]>) => {
      state.cases = action.payload;
      state.error = null;
    },

    /**
     * setFilters - Updates filter settings
     * 
     * Merges new filter values with existing filters. Resets
     * pagination to page 1 when filters change.
     * 
     * @function
     * @param {CaseManagementState} state - Current state
     * @param {PayloadAction<Partial<CaseFilters>>} action - Partial filter updates
     * 
     * @example
     * ```typescript
     * dispatch(setFilters({ status: 'open', search: 'contract' }));
     * ```
     */
    setFilters: (state, action: PayloadAction<Partial<CaseFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page
    },
  },
});

/**
 * Selectors
 */

/**
 * selectCurrentCase - Selector for current case
 * 
 * @function
 * @param {RootState} state - Redux root state
 * @returns {Case|null} Currently selected case or null
 * 
 * @example
 * ```typescript
 * const currentCase = useSelector(selectCurrentCase);
 * ```
 */
export const selectCurrentCase = (state: RootState) => 
  state.caseManagement.currentCase;

/**
 * selectCases - Selector for cases list
 * 
 * @function
 * @param {RootState} state - Redux root state
 * @returns {Case[]} Array of cases
 * 
 * @example
 * ```typescript
 * const cases = useSelector(selectCases);
 * ```
 */
export const selectCases = (state: RootState) => 
  state.caseManagement.cases;
```

---

### Step 5: Utilities Agent - Helper Functions

**File**: `frontend/src/shared/utils/caseUtils.ts`

**Agent**: Utilities Agent (`.github/agents/jsdoc-utilities.md`)

**Documentation Added**:
```typescript
/**
 * Case Utility Functions
 * 
 * Helper functions for working with case data including
 * formatting, validation, and transformation utilities.
 * 
 * @module shared/utils/caseUtils
 */

/**
 * formatCaseNumber - Formats a case number for display
 * 
 * Converts raw case numbers to a standardized display format
 * with proper spacing and prefixes. Handles various input
 * formats and validates the case number structure.
 * 
 * @function
 * @param {string} caseNumber - Raw case number (e.g., "20230001")
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.includeYear=true] - Include year prefix
 * @param {string} [options.separator='-'] - Separator character
 * @param {boolean} [options.padZeros=true] - Pad with leading zeros
 * 
 * @returns {string} Formatted case number (e.g., "2023-0001")
 * 
 * @throws {TypeError} When caseNumber is not a string
 * @throws {RangeError} When caseNumber format is invalid
 * 
 * @example
 * ```typescript
 * const formatted = formatCaseNumber('20230001');
 * console.log(formatted); // "2023-0001"
 * ```
 * 
 * @example
 * ```typescript
 * // Custom separator
 * const formatted = formatCaseNumber('20230001', {
 *   separator: '/',
 *   includeYear: true
 * });
 * console.log(formatted); // "2023/0001"
 * ```
 * 
 * @see {@link parseCaseNumber} for parsing formatted case numbers
 */
export function formatCaseNumber(
  caseNumber: string,
  options: FormatCaseNumberOptions = {}
): string {
  // Implementation
}

/**
 * getCaseStatusColor - Returns the color code for a case status
 * 
 * Maps case status values to consistent color codes used
 * throughout the UI for status badges and indicators.
 * 
 * @function
 * @param {CaseStatus} status - The case status
 * @returns {string} Color code (e.g., 'green', 'red', 'yellow')
 * 
 * @example
 * ```typescript
 * const color = getCaseStatusColor('open');
 * // Returns: 'green'
 * ```
 * 
 * @see {@link CaseStatus} for valid status values
 */
export function getCaseStatusColor(status: CaseStatus): string {
  const colorMap: Record<CaseStatus, string> = {
    open: 'green',
    closed: 'gray',
    pending: 'yellow',
    archived: 'blue',
  };
  return colorMap[status] || 'gray';
}
```

---

### Step 6: Pages Agent - Page Components

**File**: `frontend/src/pages/case-management/CaseListPage.tsx`

**Agent**: Pages Agent (`.github/agents/jsdoc-pages.md`)

**Documentation Added**:
```typescript
/**
 * CaseListPage - Case list and management page
 * 
 * Displays a paginated, filterable list of cases with search
 * functionality, status filtering, and sorting options. Users
 * can navigate to case details, create new cases, and perform
 * bulk operations.
 * 
 * **Route**: `/pages/case-management`
 * **Access**: Requires authentication
 * **Permissions**: cases.read
 * **Parent**: Layout
 * 
 * @page
 * @component
 * @route /pages/case-management
 * @requires auth
 * @requires permission:cases.read
 * 
 * @description
 * This is the main landing page for case management. Users can:
 * - View all accessible cases in a table/grid view
 * - Search cases by title, case number, or description
 * - Filter cases by status, priority, or tags
 * - Sort cases by various fields
 * - Navigate to individual case detail pages
 * - Create new cases (with cases.create permission)
 * - Perform bulk operations (archive, export, etc.)
 * 
 * @features
 * - Real-time search with debouncing
 * - Status-based filtering
 * - Multi-column sorting
 * - Pagination with configurable page size
 * - Responsive table/grid layout
 * - Bulk selection and actions
 * - Export to CSV/PDF
 * 
 * @data-requirements
 * - Fetches: Case list from `/api/cases`
 * - Uses Redux state: caseManagement.cases
 * - Uses Redux state: caseManagement.filters
 * - Requires: User authentication token
 * 
 * @navigation
 * - From: Home page, main navigation
 * - To: Case detail page (/pages/case-management/:id)
 * - To: Create case page (/pages/case-management/new)
 * 
 * @returns {JSX.Element} The case list page
 * 
 * @example
 * ```tsx
 * // Route configuration
 * <Route 
 *   path="/pages/case-management" 
 *   element={<PrivateRoute><CaseListPage /></PrivateRoute>} 
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Navigation
 * navigate('/pages/case-management');
 * ```
 * 
 * @see {@link CaseDetailPage} for individual case views
 * @see {@link useCases} for data fetching logic
 * @see {@link CaseTable} for the table component
 */
export const CaseListPage: React.FC = () => {
  // Component implementation
};
```

---

## Agent Coordination Summary

### Coverage by Agent

| Agent | Files Documented | Lines of Docs | Key Contributions |
|-------|------------------|---------------|-------------------|
| Components | 15 UI components | ~750 | Card, Button, Table, Modal, etc. |
| Hooks | 8 custom hooks | ~600 | useCase, useCases, useCaseMutations |
| Services | 6 API functions | ~500 | CRUD operations, API client |
| Redux | 1 slice + selectors | ~400 | State management, actions |
| Utilities | 5 utility functions | ~300 | Formatting, validation |
| Pages | 5 page components | ~800 | Routes, navigation, layout |
| **Total** | **40 files** | **~3,350 lines** | **Complete feature documentation** |

### Documentation Flow

```
1. Pages Agent
   └─> Documents page structure and routes
       │
2. Components Agent
   └─> Documents UI components used by pages
       │
3. Hooks Agent
   └─> Documents data fetching and state hooks
       │
4. Services Agent
   └─> Documents API functions called by hooks
       │
5. Redux Agent
   └─> Documents global state management
       │
6. Utilities Agent
   └─> Documents helper functions used throughout
```

### Cross-References

The agents create a web of cross-references:

- **Pages** reference **Components**, **Hooks**, and **Redux**
- **Components** reference other **Components** and **Utilities**
- **Hooks** reference **Services** and **Redux**
- **Services** reference **Utilities** and types
- **Redux** references **Services** (for thunks)
- **Utilities** reference types and constants

## Benefits of Multi-Agent Approach

### 1. Specialized Expertise
Each agent understands the specific patterns and best practices for its domain.

### 2. Consistent Documentation
All files of the same type follow the same documentation structure.

### 3. Complete Coverage
No file type is left undocumented when all agents work together.

### 4. Parallel Processing
Multiple agents can work on different file types simultaneously.

### 5. Maintainability
When patterns change, only the relevant agent needs updating.

### 6. Quality Assurance
Each agent applies domain-specific validation and quality checks.

## Next Steps

After completing documentation for one feature:

1. **Review and Refine**: Check consistency across agent outputs
2. **Test Examples**: Verify all code examples work
3. **Update Agents**: Refine agent templates based on learnings
4. **Expand Coverage**: Apply to remaining features
5. **Generate Docs**: Create API documentation site
6. **Integrate CI/CD**: Add documentation checks to pipeline

---

**This workflow demonstrates how the 6 expert agents collaborate to create comprehensive, consistent JSDoc documentation across an entire feature.**
