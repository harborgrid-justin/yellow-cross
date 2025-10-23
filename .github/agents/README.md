# JSDoc Generation Agents

This directory contains expert agent configurations for generating comprehensive JSDoc documentation for all frontend files in the Yellow Cross application.

## Overview

The JSDoc generation is split across 6 specialized expert agents, each focusing on a specific area of the frontend codebase. This approach ensures:

- **Deep Expertise**: Each agent specializes in specific file types
- **Consistent Documentation**: Agents follow strict templates and standards
- **Complete Coverage**: All frontend files will be documented
- **Quality Assurance**: Each agent applies domain-specific best practices

## Expert Agents

### 1. Components Agent (`jsdoc-components.md`)
**Focus**: React component files (`.tsx`)

**Responsibilities**:
- Document React components with props, returns, and examples
- Focus on component behavior and usage patterns
- Document component lifecycle and state management
- Cover UI components, feature components, and page components

**Target Files**: ~200-300 component files
- `frontend/src/features/**/*/Page.tsx`
- `frontend/src/shared/components/**/*.tsx`
- `frontend/src/pages/**/*Page.tsx`

### 2. Hooks Agent (`jsdoc-hooks.md`)
**Focus**: Custom React hooks (`.ts` files in hooks directories)

**Responsibilities**:
- Document custom hooks with parameters and return values
- Explain hook behavior, dependencies, and side effects
- Document query hooks, mutation hooks, and utility hooks
- Include usage examples and best practices

**Target Files**: ~150-200 hook files
- `frontend/src/features/**/hooks/*.ts`
- `frontend/src/shared/hooks/*.ts`
- `frontend/src/pages/**/hooks/*.ts`

### 3. Services Agent (`jsdoc-services.md`)
**Focus**: API clients and service modules (`.ts` files in services)

**Responsibilities**:
- Document API functions with HTTP details
- Document request/response types and error handling
- Document authentication and security considerations
- Include API usage examples

**Target Files**: ~100-150 service files
- `frontend/src/services/**/*.ts`
- `frontend/src/shared/api/*.ts`
- `frontend/src/services/modules/*Api.ts`

### 4. Redux Agent (`jsdoc-redux.md`)
**Focus**: Redux store, slices, and state management (`.ts` files in store)

**Responsibilities**:
- Document Redux slices with state structure
- Document actions, reducers, and async thunks
- Document selectors and custom hooks
- Explain state management patterns

**Target Files**: ~100-150 Redux files
- `frontend/src/store/*.ts`
- `frontend/src/store/slices/*.ts`
- `frontend/src/pages/**/store/*.ts`

### 5. Utilities Agent (`jsdoc-utilities.md`)
**Focus**: Utility functions, helpers, constants, and types

**Responsibilities**:
- Document utility functions with edge cases
- Document constants and their purpose
- Document type definitions
- Document configuration files

**Target Files**: ~50-100 utility files
- `frontend/src/shared/utils/*.ts`
- `frontend/src/constants/*.ts`
- `frontend/src/config/*.ts`
- `frontend/src/services/utils/*.ts`
- `frontend/src/services/security/*.ts`

### 6. Pages Agent (`jsdoc-pages.md`)
**Focus**: Page components and route configurations

**Responsibilities**:
- Document page components with route information
- Document route configurations and navigation
- Document authentication and permission requirements
- Explain data requirements and user workflows

**Target Files**: ~200-300 page files
- `frontend/src/pages/**/*Page.tsx`
- `frontend/src/pages/**/routes.tsx`
- `frontend/src/pages/**/index.ts`

## Documentation Standards

All agents follow these common standards:

### Required Elements
1. **Description**: Clear explanation of purpose
2. **Parameters**: All parameters with types and descriptions
3. **Returns**: Return values with types
4. **Examples**: At least one usage example
5. **Tags**: Appropriate JSDoc tags

### JSDoc Tags to Use
- `@module` - For module/file documentation
- `@function` / `@method` - For functions and methods
- `@async` - For async functions
- `@param` - For parameters
- `@returns` - For return values
- `@throws` - For errors/exceptions
- `@example` - For usage examples
- `@see` - For cross-references
- `@typedef` - For type definitions
- `@property` - For object properties
- `@constant` - For constants
- `@component` - For React components
- `@hook` - For React hooks
- `@route` - For route paths
- `@requires` - For dependencies

### Quality Checklist
- [ ] Every exported function/component has JSDoc
- [ ] All parameters are documented with types
- [ ] Return values are documented
- [ ] At least one example is provided
- [ ] Complex logic is explained
- [ ] Edge cases are documented
- [ ] Related items are cross-referenced

## Usage Instructions

### For Developers

To use these agents to generate JSDoc:

1. **Choose the appropriate agent** based on the file type you're documenting
2. **Follow the agent's template** for consistent documentation
3. **Include all required elements** from the documentation standards
4. **Test your documentation** by reviewing it in your IDE

### For Automated Tools

These agent configurations can be used by:

1. **AI Assistants**: To generate documentation following expert patterns
2. **Documentation Generators**: To create API documentation
3. **Code Review Tools**: To verify documentation completeness
4. **IDE Extensions**: To provide documentation templates

## File Coverage Summary

| Agent | Target Files | Estimated Count | Priority |
|-------|--------------|----------------|----------|
| Components | `**/*.tsx` (components) | 200-300 | High |
| Hooks | `**/hooks/*.ts` | 150-200 | High |
| Services | `**/services/**/*.ts` | 100-150 | High |
| Redux | `**/store/**/*.ts` | 100-150 | Medium |
| Utilities | `**/utils/*.ts`, constants, config | 50-100 | Medium |
| Pages | `**/pages/**/*.tsx`, routes | 200-300 | High |
| **Total** | | **~1000-1300 files** | |

## Implementation Plan

### Phase 1: Core Infrastructure (High Priority)
1. **Components Agent**: Document all UI components
2. **Hooks Agent**: Document custom hooks
3. **Services Agent**: Document API clients

### Phase 2: State & Utilities (Medium Priority)
4. **Redux Agent**: Document state management
5. **Utilities Agent**: Document helpers and utilities

### Phase 3: Navigation & Routes (High Priority)
6. **Pages Agent**: Document pages and routes

## Verification

After documentation is complete, verify:

1. **Coverage**: All target files have JSDoc comments
2. **Completeness**: All required elements are present
3. **Consistency**: Documentation follows the templates
4. **Quality**: Examples work and descriptions are clear
5. **Cross-references**: Links between related items are accurate

## Benefits

This comprehensive JSDoc documentation provides:

- ✅ **Better IDE Support**: IntelliSense and autocomplete
- ✅ **Easier Onboarding**: New developers understand code faster
- ✅ **API Documentation**: Can generate reference docs
- ✅ **Type Safety**: Enhanced TypeScript integration
- ✅ **Maintenance**: Easier to understand and modify code
- ✅ **Testing**: Clear understanding of expected behavior

## Maintenance

These agent configurations should be:

1. **Updated**: When new patterns or standards emerge
2. **Reviewed**: Periodically for relevance and accuracy
3. **Extended**: When new file types or patterns are added
4. **Refined**: Based on feedback and usage

## Contributing

When updating agent configurations:

1. Maintain consistency with existing patterns
2. Include clear examples
3. Follow JSDoc standards
4. Test with real code
5. Document any new tags or patterns

## Additional Resources

- [JSDoc Official Documentation](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Status**: Active
