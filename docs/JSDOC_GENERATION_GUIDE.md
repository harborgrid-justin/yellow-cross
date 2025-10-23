# JSDoc Generation Guide

This guide explains how to use the expert agents to generate comprehensive JSDoc documentation for all frontend files in the Yellow Cross application.

## Table of Contents

1. [Overview](#overview)
2. [Expert Agents](#expert-agents)
3. [Quick Start](#quick-start)
4. [Agent Details](#agent-details)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## Overview

Yellow Cross uses a specialized approach to JSDoc documentation generation with 6 expert agents, each focusing on a specific area of the frontend codebase:

1. **Components Agent** - React components
2. **Hooks Agent** - Custom React hooks
3. **Services Agent** - API clients and services
4. **Redux Agent** - State management
5. **Utilities Agent** - Helper functions and utilities
6. **Pages Agent** - Page components and routes

**Total Coverage**: ~1000-1300 frontend files

## Expert Agents

### Agent Configuration Location

All agent configurations are located in:
```
.github/agents/
├── README.md                 # Agent overview and coordination
├── jsdoc-components.md       # Components documentation agent
├── jsdoc-hooks.md           # Hooks documentation agent
├── jsdoc-services.md        # Services documentation agent
├── jsdoc-redux.md           # Redux documentation agent
├── jsdoc-utilities.md       # Utilities documentation agent
└── jsdoc-pages.md           # Pages documentation agent
```

### Agent Responsibilities

| Agent | Files | Count | Description |
|-------|-------|-------|-------------|
| Components | `**/*.tsx` components | 200-300 | React components, UI elements |
| Hooks | `**/hooks/*.ts` | 150-200 | Custom React hooks |
| Services | `**/services/**/*.ts` | 100-150 | API clients, HTTP requests |
| Redux | `**/store/**/*.ts` | 100-150 | Redux slices, actions, selectors |
| Utilities | `**/utils/*.ts`, constants | 50-100 | Helper functions, constants |
| Pages | `**/pages/**/*.tsx` | 200-300 | Page components, routes |

## Quick Start

### Option 1: Manual Documentation (Using Agent as Guide)

1. **Choose the appropriate agent** for the file you're documenting
2. **Open the agent configuration** (e.g., `.github/agents/jsdoc-components.md`)
3. **Follow the template** provided in the agent
4. **Add JSDoc comments** to your file
5. **Verify** the documentation in your IDE

### Option 2: AI-Assisted Documentation

1. **Use AI tools** (GitHub Copilot, ChatGPT, Claude, etc.)
2. **Provide the agent configuration** as context
3. **Request documentation** for specific files
4. **Review and refine** the generated documentation

### Option 3: Automated Batch Processing

```bash
# Example: Process all components in a feature
# (This would be a custom script using the agents as guidelines)
./scripts/generate-jsdoc.sh --agent=components --path=frontend/src/features/case-management
```

## Agent Details

### 1. Components Agent

**Purpose**: Document React components with props, state, and behavior.

**Template Example**:
```typescript
/**
 * CaseList - Displays a list of legal cases
 * 
 * Shows a paginated, filterable list of cases with search
 * functionality and status indicators.
 * 
 * @component
 * @param {Props} props - Component props
 * @param {Array<Case>} props.cases - Array of cases to display
 * @param {Function} props.onSelect - Handler for case selection
 * @param {boolean} [props.loading=false] - Loading state
 * 
 * @returns {JSX.Element} Rendered case list
 * 
 * @example
 * ```tsx
 * <CaseList 
 *   cases={cases}
 *   onSelect={handleSelect}
 *   loading={isLoading}
 * />
 * ```
 */
```

### 2. Hooks Agent

**Purpose**: Document custom React hooks with parameters and return values.

**Template Example**:
```typescript
/**
 * useCaseData - Fetches and manages case data
 * 
 * Custom hook for fetching case details with automatic
 * caching and error handling.
 * 
 * @hook
 * @param {string} caseId - The case identifier
 * @param {Object} [options] - Hook options
 * @param {boolean} [options.enabled=true] - Enable fetching
 * 
 * @returns {Object} Hook return value
 * @returns {Case|null} returns.data - Case data
 * @returns {boolean} returns.loading - Loading state
 * @returns {string|null} returns.error - Error message
 * @returns {Function} returns.refetch - Refetch function
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCaseData('123');
 * ```
 */
```

### 3. Services Agent

**Purpose**: Document API functions with HTTP details and error handling.

**Template Example**:
```typescript
/**
 * fetchCases - Fetches cases from the API
 * 
 * Retrieves a paginated list of cases with optional filtering.
 * 
 * @async
 * @function
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {string} [params.status] - Filter by status
 * 
 * @returns {Promise<ApiResponse<Case[]>>} API response with cases
 * 
 * @throws {ApiError} 401 - Unauthorized
 * @throws {ApiError} 500 - Server error
 * 
 * @example
 * ```typescript
 * const response = await fetchCases({ page: 1, status: 'active' });
 * console.log(response.data);
 * ```
 */
```

### 4. Redux Agent

**Purpose**: Document Redux slices, actions, and selectors.

**Template Example**:
```typescript
/**
 * setCases - Sets the cases in state
 * 
 * Replaces the current cases array with new data,
 * typically after fetching from the API.
 * 
 * @function
 * @param {CaseState} state - Current slice state
 * @param {PayloadAction<Case[]>} action - Action with cases payload
 * 
 * @example
 * ```typescript
 * dispatch(setCases([...newCases]));
 * ```
 */
```

### 5. Utilities Agent

**Purpose**: Document utility functions and helper modules.

**Template Example**:
```typescript
/**
 * formatCaseNumber - Formats a case number for display
 * 
 * Converts raw case numbers to standard display format
 * with proper spacing and prefixes.
 * 
 * @function
 * @param {string} caseNumber - Raw case number
 * @param {Object} [options] - Format options
 * @param {boolean} [options.includeYear=true] - Include year
 * 
 * @returns {string} Formatted case number
 * 
 * @example
 * ```typescript
 * const formatted = formatCaseNumber('20230001');
 * // Returns: "2023-0001"
 * ```
 */
```

### 6. Pages Agent

**Purpose**: Document page components and route configurations.

**Template Example**:
```typescript
/**
 * CaseManagementPage - Case management main page
 * 
 * Main landing page for the case management feature.
 * Displays case list, search, and navigation to case details.
 * 
 * **Route**: `/features/case-management`
 * **Access**: Requires authentication
 * 
 * @page
 * @component
 * @route /features/case-management
 * @requires auth
 * 
 * @returns {JSX.Element} Case management page
 * 
 * @example
 * ```tsx
 * <Route path="/features/case-management" element={<CaseManagementPage />} />
 * ```
 */
```

## Usage Examples

### Example 1: Documenting a Component

**Before**:
```typescript
const Button = ({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

**After** (using Components Agent):
```typescript
/**
 * Button - Reusable button component
 * 
 * A styled button component with support for disabled state
 * and click handling.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Button text label
 * @param {Function} props.onClick - Click event handler
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * 
 * @returns {JSX.Element} Button element
 * 
 * @example
 * ```tsx
 * <Button label="Save" onClick={handleSave} disabled={isSaving} />
 * ```
 */
const Button = ({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Example 2: Documenting a Hook

**Before**:
```typescript
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

**After** (using Hooks Agent):
```typescript
/**
 * useDebounce - Debounces a value with configurable delay
 * 
 * Returns a debounced version of the input value that only
 * updates after the specified delay has elapsed without changes.
 * 
 * @hook
 * @param {T} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * 
 * @returns {T} The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Only runs 500ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### Example 3: Documenting an API Function

**Before**:
```typescript
export async function createCase(data) {
  return api.post('/cases', data);
}
```

**After** (using Services Agent):
```typescript
/**
 * createCase - Creates a new case
 * 
 * Sends a POST request to create a new case with the
 * provided data. Requires authentication.
 * 
 * @async
 * @function
 * @param {CreateCaseData} data - Case data
 * @param {string} data.title - Case title
 * @param {string} data.description - Case description
 * @param {string} data.clientId - Associated client ID
 * 
 * @returns {Promise<ApiResponse<Case>>} Created case
 * 
 * @throws {ApiError} 400 - Invalid case data
 * @throws {ApiError} 401 - Not authenticated
 * @throws {ApiError} 500 - Server error
 * 
 * @example
 * ```typescript
 * try {
 *   const newCase = await createCase({
 *     title: 'Smith v. Jones',
 *     description: 'Contract dispute',
 *     clientId: '123'
 *   });
 *   console.log('Case created:', newCase.data);
 * } catch (error) {
 *   console.error('Failed to create case:', error.message);
 * }
 * ```
 */
export async function createCase(data: CreateCaseData): Promise<ApiResponse<Case>> {
  return api.post('/cases', data);
}
```

## Best Practices

### 1. Consistency

- Use the same format across similar files
- Follow the agent templates
- Use standard JSDoc tags

### 2. Completeness

- Document all exported functions/components
- Include all parameters and return values
- Add at least one example

### 3. Clarity

- Write clear, concise descriptions
- Avoid jargon when possible
- Explain "why" not just "what"

### 4. Type Safety

- Reference TypeScript types
- Document generics
- Note type constraints

### 5. Examples

- Include realistic examples
- Show common use cases
- Demonstrate edge cases

### 6. Cross-References

- Link related functions/components
- Reference type definitions
- Point to related documentation

## Verification

### IDE Verification

1. **Hover over functions** - JSDoc should appear in tooltips
2. **IntelliSense** - Parameter hints should show documentation
3. **Go to Definition** - Documentation should be visible

### Manual Verification

1. **Check coverage**: All exported items have JSDoc
2. **Check completeness**: All required tags present
3. **Check examples**: Examples are correct and run
4. **Check types**: Types match implementation

### Automated Verification

```bash
# Check for missing JSDoc (custom script)
npm run jsdoc:check

# Generate documentation site
npm run jsdoc:generate
```

## Troubleshooting

### Issue: JSDoc not appearing in IDE

**Solution**:
- Restart TypeScript server
- Ensure JSDoc is above the declaration
- Check for syntax errors

### Issue: Type hints not showing

**Solution**:
- Verify TypeScript types are correct
- Ensure `@param` types match function signature
- Check tsconfig.json settings

### Issue: Examples not working

**Solution**:
- Test examples in isolation
- Verify imports are correct
- Check for typos in code

### Issue: Inconsistent formatting

**Solution**:
- Review agent templates
- Use consistent tag order
- Follow spacing conventions

## Next Steps

After implementing JSDoc documentation:

1. **Generate API Documentation**:
   ```bash
   npm install --save-dev jsdoc
   npx jsdoc -c jsdoc.json
   ```

2. **Add Documentation to CI/CD**:
   - Verify documentation completeness
   - Generate documentation site
   - Publish to GitHub Pages

3. **Maintain Documentation**:
   - Update docs when code changes
   - Review documentation in PRs
   - Keep agent configs updated

## Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Agent Configurations](.github/agents/README.md)

## Contributing

To improve the JSDoc generation process:

1. **Update agent templates** when patterns change
2. **Add new examples** for common scenarios
3. **Report issues** with agent configurations
4. **Share best practices** with the team

---

**Last Updated**: 2025-10-23
**Related**: [Agent README](.github/agents/README.md)
