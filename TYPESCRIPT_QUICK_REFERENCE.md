# TypeScript Quick Reference - Yellow Cross

## 🚀 Quick Start

### Build Commands
```bash
# Build once
npm run ts:build

# Watch mode (auto-rebuild on changes)
npm run ts:watch

# Clean and rebuild
npm run build:clean

# Build alias
npm run build
```

### File Locations
- **TypeScript Source**: `frontend/ts/*.ts`
- **Compiled JavaScript**: `frontend/js/*.js`
- **Type Definitions**: `frontend/js/*.d.ts`
- **Source Maps**: `frontend/js/*.map`
- **Configuration**: `tsconfig.json`

---

## 📝 Type Definitions

### Feature Interface
```typescript
interface Feature {
    name: string;
    icon: string;
    endpoint: string;
    category: 'management' | 'legal' | 'compliance' | 'analytics';
    description: string;
    subFeatureCount: number;
}
```

### Platform Info
```typescript
interface PlatformInfo {
    name: string;
    version: string;
    description: string;
    features: Feature[];
}
```

### Health Status
```typescript
interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
}
```

### HTTP Methods
```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

---

## 🔧 Common Patterns

### DOM Element Selection
```typescript
// Input element
const input = document.getElementById('email') as HTMLInputElement | null;
if (input) {
    input.value = 'example@email.com';
}

// Button element
const button = document.querySelector<HTMLButtonElement>('.submit-btn');

// Generic element
const element = document.getElementById('my-id') as HTMLElement | null;
```

### Event Handlers
```typescript
// Click event
button.addEventListener('click', (e: Event) => {
    e.preventDefault();
    // Handle click
});

// Keyboard event
input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        // Handle enter key
    }
});

// Form submit
form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    // Handle form
});
```

### API Calls
```typescript
// Generic API call
async function fetchAPI<T = any>(
    endpoint: string, 
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return await response.json() as T;
}

// Usage with type
const health = await fetchAPI<HealthStatus>('/health');
const features = await fetchAPI<Feature[]>('/api/features');
```

### Type-Safe Functions
```typescript
// Typed parameters and return
function processFeature(feature: Feature): string {
    return `${feature.name}: ${feature.description}`;
}

// Optional parameters
function loadData(id: string, cache: boolean = true): void {
    // Implementation
}

// Promise returns
async function getData(): Promise<PlatformInfo> {
    return await fetchAPI<PlatformInfo>('/api');
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Property 'value' does not exist on type 'HTMLElement'
```typescript
// ❌ Wrong
const input = document.getElementById('email');
input.value = 'test';  // Error!

// ✅ Correct
const input = document.getElementById('email') as HTMLInputElement | null;
if (input) {
    input.value = 'test';  // Safe
}
```

### Issue: Object is possibly 'null'
```typescript
// ❌ Wrong
const element = document.getElementById('my-id');
element.textContent = 'text';  // Error if null!

// ✅ Correct - Option 1: Null check
const element = document.getElementById('my-id');
if (element) {
    element.textContent = 'text';
}

// ✅ Correct - Option 2: Non-null assertion (only if you're sure)
const element = document.getElementById('my-id')!;
element.textContent = 'text';

// ✅ Correct - Option 3: Optional chaining
const element = document.getElementById('my-id');
element?.textContent = 'text';
```

### Issue: Type 'string | undefined' is not assignable to type 'string'
```typescript
// ❌ Wrong
const value: string = element.dataset.category;  // Error!

// ✅ Correct - Option 1: Use bracket notation
const value = element.dataset['category'];

// ✅ Correct - Option 2: Provide default
const value: string = element.dataset.category || 'default';

// ✅ Correct - Option 3: Use optional type
const value: string | undefined = element.dataset.category;
```

---

## 📚 Helpful TypeScript Features

### Type Assertions
```typescript
// As syntax (preferred)
const input = document.getElementById('email') as HTMLInputElement;

// Angle bracket syntax (avoid in JSX/TSX)
const input = <HTMLInputElement>document.getElementById('email');
```

### Optional Chaining
```typescript
const text = card.textContent?.toLowerCase();
const category = card.dataset?.['category'];
```

### Nullish Coalescing
```typescript
const value = searchTerm ?? 'default';  // Only if null/undefined
const value = searchTerm || 'default';  // If falsy (0, '', false, null, undefined)
```

### Array Type Guards
```typescript
if (Array.isArray(apiData.subFeatures)) {
    apiData.subFeatures.forEach(sf => {
        // TypeScript knows it's an array here
    });
}
```

### Type Guards
```typescript
function isError(value: any): value is Error {
    return value instanceof Error;
}

if (isError(error)) {
    console.error(error.message);  // TypeScript knows it's an Error
}
```

---

## 🧪 Testing

### Run TypeScript Tests
```bash
npm test -- backend/tests/typescript.test.js
```

### Type Check Without Building
```bash
npx tsc --noEmit
```

### Validate Compiled JavaScript
```bash
node -c frontend/js/app.js
node -c frontend/js/auth.js
```

---

## 📖 Resources

### Documentation
- [TYPESCRIPT_IMPLEMENTATION.md](./TYPESCRIPT_IMPLEMENTATION.md) - Full implementation guide
- [ISSUE_RESOLUTION_TYPESCRIPT.md](./ISSUE_RESOLUTION_TYPESCRIPT.md) - Issue analysis
- [COMPLETION_SUMMARY_TYPESCRIPT.md](./COMPLETION_SUMMARY_TYPESCRIPT.md) - Final summary

### External Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript DOM Types](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

---

## ⚙️ Configuration

### tsconfig.json Key Settings
```json
{
  "compilerOptions": {
    "target": "ES2020",           // Output JavaScript version
    "module": "ES2020",            // Module system
    "strict": true,                // Enable all strict checks
    "esModuleInterop": true,       // Better CommonJS interop
    "sourceMap": true,             // Generate .map files
    "declaration": true,           // Generate .d.ts files
    "outDir": "./frontend/js",     // Output directory
    "rootDir": "./frontend/ts"     // Source directory
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "ts:build": "tsc",
    "ts:watch": "tsc --watch",
    "build": "npm run ts:build"
  }
}
```

---

## 💡 Best Practices

### 1. Always Use Strict Mode
TypeScript is configured with strict mode. Keep it enabled for maximum type safety.

### 2. Type Function Parameters and Returns
```typescript
// ✅ Good
function processData(data: string): boolean {
    return data.length > 0;
}

// ❌ Avoid
function processData(data) {
    return data.length > 0;
}
```

### 3. Use Interfaces for Object Shapes
```typescript
// ✅ Good
interface User {
    id: string;
    email: string;
    name: string;
}

// ❌ Avoid inline types for complex objects
function saveUser(user: { id: string; email: string; name: string }) { }
```

### 4. Handle Null/Undefined Explicitly
```typescript
// ✅ Good
const element = document.getElementById('id');
if (element) {
    element.textContent = 'text';
}

// ❌ Avoid assuming non-null
const element = document.getElementById('id');
element.textContent = 'text';  // Might be null!
```

### 5. Use Generic Functions When Appropriate
```typescript
// ✅ Good - Reusable with different types
async function fetchAPI<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    return await response.json();
}

const user = await fetchAPI<User>('/api/user');
const posts = await fetchAPI<Post[]>('/api/posts');
```

---

## 🎯 Quick Checklist for New Code

Before committing TypeScript code:

- [ ] All functions have type annotations
- [ ] All parameters have types
- [ ] Return types are specified
- [ ] DOM elements are properly typed
- [ ] Null checks are in place where needed
- [ ] No `any` types (unless absolutely necessary)
- [ ] Code compiles with `npm run ts:build`
- [ ] No TypeScript errors
- [ ] Tests pass (if applicable)

---

## 🔄 Workflow

### Making Changes
1. Edit TypeScript files in `frontend/ts/`
2. Run `npm run ts:watch` for auto-compilation
3. Test changes in browser
4. Verify compilation: `npm run ts:build`
5. Commit both `.ts` and generated `.js` files

### Adding New Features
1. Define types in `frontend/ts/types.ts` (if needed)
2. Implement in appropriate `.ts` file
3. Ensure proper type annotations
4. Test thoroughly
5. Update documentation if needed

---

**Last Updated**: December 2024  
**TypeScript Version**: Latest (via npm)  
**Target**: ES2020  
**Status**: Production Ready ✅
