# JSDoc Quick Start Guide

Quick reference for generating JSDoc documentation using the 6 expert agents.

## 🚀 Quick Reference

### Choose Your Agent

| File Type | Agent | Config |
|-----------|-------|--------|
| React Component (`.tsx`) | Components | `.github/agents/jsdoc-components.md` |
| Custom Hook (`.ts` in hooks/) | Hooks | `.github/agents/jsdoc-hooks.md` |
| API Service (`.ts` in services/) | Services | `.github/agents/jsdoc-services.md` |
| Redux Slice (`.ts` in store/) | Redux | `.github/agents/jsdoc-redux.md` |
| Utility Function (`.ts` in utils/) | Utilities | `.github/agents/jsdoc-utilities.md` |
| Page Component (`.tsx` in pages/) | Pages | `.github/agents/jsdoc-pages.md` |

## 📝 Quick Templates

### Component Template
```typescript
/**
 * ComponentName - Brief description
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 * @returns {JSX.Element} Rendered component
 * @example
 * ```tsx
 * <ComponentName title="Example" />
 * ```
 */
```

### Hook Template
```typescript
/**
 * useHookName - Brief description
 * 
 * @hook
 * @param {string} param - Parameter description
 * @returns {Object} Hook return value
 * @returns {T} returns.data - Data description
 * @returns {boolean} returns.loading - Loading state
 * @example
 * ```tsx
 * const { data, loading } = useHookName('id');
 * ```
 */
```

### API Function Template
```typescript
/**
 * functionName - Brief description
 * 
 * @async
 * @function
 * @param {string} id - Parameter description
 * @returns {Promise<ApiResponse<T>>} API response
 * @throws {ApiError} 401 - Unauthorized
 * @example
 * ```typescript
 * const result = await functionName('123');
 * ```
 */
```

### Redux Action Template
```typescript
/**
 * actionName - Brief description
 * 
 * @function
 * @param {State} state - Current state
 * @param {PayloadAction<T>} action - Action with payload
 * @example
 * ```typescript
 * dispatch(actionName(payload));
 * ```
 */
```

### Utility Function Template
```typescript
/**
 * utilityFunction - Brief description
 * 
 * @function
 * @param {string} input - Input description
 * @param {Object} [options] - Optional options
 * @returns {string} Return value description
 * @example
 * ```typescript
 * const result = utilityFunction('input');
 * ```
 */
```

### Page Template
```typescript
/**
 * PageName - Brief description
 * 
 * @page
 * @component
 * @route /path/to/page
 * @requires auth
 * @returns {JSX.Element} Rendered page
 * @example
 * ```tsx
 * <Route path="/path" element={<PageName />} />
 * ```
 */
```

## 🎯 Common JSDoc Tags

| Tag | Usage | Example |
|-----|-------|---------|
| `@component` | React component | `@component` |
| `@hook` | React hook | `@hook` |
| `@function` | Function | `@function` |
| `@async` | Async function | `@async` |
| `@param` | Parameter | `@param {string} name - Description` |
| `@returns` | Return value | `@returns {number} Description` |
| `@throws` | Error thrown | `@throws {Error} When invalid` |
| `@example` | Code example | `@example` |
| `@see` | Cross-reference | `@see {@link OtherFunction}` |
| `@typedef` | Type definition | `@typedef {Object} TypeName` |
| `@property` | Object property | `@property {string} name` |
| `@constant` | Constant | `@constant` |
| `@module` | Module doc | `@module path/to/module` |
| `@route` | Page route | `@route /path/to/page` |
| `@requires` | Requirement | `@requires auth` |

## ✅ Quick Checklist

Before committing your JSDoc:

- [ ] Every exported function/component has JSDoc
- [ ] All parameters documented with types
- [ ] Return value documented
- [ ] At least one example included
- [ ] Complex logic explained
- [ ] Related items cross-referenced
- [ ] JSDoc appears in IDE tooltips

## 📚 Full Documentation

For complete details, see:
- [JSDoc Generation Guide](./docs/JSDOC_GENERATION_GUIDE.md)
- [JSDoc Workflow Example](./docs/JSDOC_WORKFLOW_EXAMPLE.md)
- [Agent Configurations](./.github/agents/README.md)

## 🛠️ Tips

1. **Start with the template** from the appropriate agent
2. **Fill in specifics** for your code
3. **Include realistic examples** that actually work
4. **Test in IDE** to verify tooltips appear
5. **Cross-reference** related functions/components

## 💡 Example Workflow

1. Identify file type → Choose agent
2. Open agent config → Copy template
3. Fill in details → Add above declaration
4. Test in IDE → Verify appearance
5. Commit changes → Documentation complete!

---

**Quick access**: [Components](./.github/agents/jsdoc-components.md) | [Hooks](./.github/agents/jsdoc-hooks.md) | [Services](./.github/agents/jsdoc-services.md) | [Redux](./.github/agents/jsdoc-redux.md) | [Utilities](./.github/agents/jsdoc-utilities.md) | [Pages](./.github/agents/jsdoc-pages.md)
