# Shared Components

This directory contains reusable components used across multiple features in the Yellow Cross application.

## Directory Structure

```
shared/components/
├── ui/                      # UI component library
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── Table/
│   └── ...                 # Other UI components
├── Layout.tsx              # Main layout wrapper
├── PrivateRoute.tsx        # Protected route wrapper
├── SubFeaturePage.tsx      # Dynamic sub-feature page
├── ReduxExample.tsx        # Redux integration example
└── README.md              # This file
```

## Components Overview

### Layout Components

#### Layout.tsx
Main application layout wrapper that provides the shell for all pages.

**Features:**
- Header with navigation
- Sidebar for feature access
- Footer
- Responsive design

**Usage:**
```typescript
import Layout from '../shared/components/Layout';

// Used in App.tsx as route wrapper
<Route path="/" element={<Layout />}>
  <Route index element={<HomePage />} />
  ...
</Route>
```

#### PrivateRoute.tsx
Route protection component that ensures only authenticated users can access protected pages.

**Features:**
- Checks authentication status
- Redirects to login if not authenticated
- Supports demo mode bypass

**Usage:**
```typescript
import PrivateRoute from '../shared/components/PrivateRoute';

<Route path="profile" element={
  <PrivateRoute>
    <ProfilePage />
  </PrivateRoute>
} />
```

#### SubFeaturePage.tsx
Dynamic page component that renders sub-feature content based on route parameters.

**Features:**
- Dynamic content loading
- Breadcrumb navigation
- Feature metadata display

**Usage:**
```typescript
// Automatically used in route configuration
<Route path="case-management/:subFeature" element={
  <PrivateRoute>
    <SubFeaturePage />
  </PrivateRoute>
} />
```

### Example Components

#### ReduxExample.tsx
Demonstration component showing Redux integration patterns.

**Purpose:**
- Educational reference
- Shows best practices
- Can be removed in production

**Usage:**
```typescript
import ReduxExample from '../shared/components/ReduxExample';

// Add to a route for demonstration
<Route path="redux-example" element={<ReduxExample />} />
```

## UI Components

The `ui/` directory contains a comprehensive component library. Each component follows these patterns:

### Component Structure
```typescript
// Component file structure
ComponentName/
├── ComponentName.tsx       # Main component
├── index.ts               # Barrel export
└── styles.css            # Component styles (if needed)
```

### Available UI Components

- **Button** - Interactive button with variants
- **Input** - Text input with validation
- **Select** - Dropdown selection
- **Checkbox** - Checkbox input
- **Radio** - Radio button input
- **Switch** - Toggle switch
- **Textarea** - Multi-line text input
- **Modal** - Dialog overlay
- **Card** - Content container
- **Table** - Data table with sorting/filtering
- **Tabs** - Tabbed content
- **Accordion** - Collapsible sections
- **Dropdown** - Dropdown menu
- **Tooltip** - Hover tooltips
- **Badge** - Status badge
- **Progress** - Progress indicator
- **Spinner** - Loading spinner
- **Alert** - Alert messages
- **Breadcrumb** - Navigation breadcrumbs
- **Pagination** - Page navigation
- **Form** - Form wrapper with validation

### UI Component Usage

All UI components are exported from a central index:

```typescript
import { Button, Input, Modal, Table } from '../shared/components/ui';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
      <Input 
        type="text" 
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

## Creating New Shared Components

When creating new shared components:

1. **Determine if it's truly shared** - Will it be used in 2+ features?
2. **Create in appropriate location**:
   - UI primitives → `ui/ComponentName/`
   - Layout/structural → root level
3. **Follow naming conventions** - PascalCase for components
4. **Include TypeScript types** - Full type definitions
5. **Document props** - JSDoc comments for complex components
6. **Export properly** - Add to index.ts

### Example: Creating a New UI Component

```typescript
// shared/components/ui/SearchBar/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * SearchBar component for searching and filtering
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
```

```typescript
// shared/components/ui/SearchBar/index.ts
export { default as SearchBar } from './SearchBar';
```

```typescript
// shared/components/ui/index.ts
export * from './SearchBar';
// ... other exports
```

## Redux Integration in Components

Components can integrate with Redux for global state:

```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { someActions } from '../../store';

function MySharedComponent() {
  const dispatch = useAppDispatch();
  const someState = useAppSelector((state) => state.some.data);
  
  const handleAction = () => {
    dispatch(someActions.doSomething());
  };
  
  return <div>...</div>;
}
```

See [ReduxExample.tsx](./ReduxExample.tsx) for complete examples.

## Best Practices

### 1. Keep Components Focused
Each component should have a single responsibility.

### 2. Use TypeScript
Always define prop interfaces and use proper types.

### 3. Avoid Feature-Specific Logic
Shared components should be generic and reusable.

### 4. Document Complex Components
Add JSDoc comments for non-obvious behavior.

### 5. Test Thoroughly
Ensure components work in isolation and various contexts.

### 6. Performance Optimization
Use React.memo() for expensive renders:

```typescript
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>...</div>;
});
```

### 7. Accessibility
Ensure all components are accessible:
- Proper ARIA labels
- Keyboard navigation
- Screen reader support

## Component Composition

Build complex UIs by composing smaller components:

```typescript
import { Card, Button, Input } from '../shared/components/ui';

function LoginForm() {
  return (
    <Card>
      <h2>Login</h2>
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button variant="primary">Login</Button>
    </Card>
  );
}
```

## Styling

Components use CSS for styling. Follow these conventions:

1. **Class naming**: Use BEM or descriptive names
2. **Scoping**: Prefix classes with component name
3. **Responsive**: Include mobile-first responsive styles
4. **Theming**: Support theme variables where applicable

```css
/* Example component styles */
.search-bar {
  display: flex;
  gap: 8px;
}

.search-bar__input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-bar__button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## Testing Components

When testing is added, follow these patterns:

```typescript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <MyComponent />
      </Provider>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Resources

- [React Component Patterns](https://reactpatterns.com/)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)
- [Accessibility Guidelines](https://www.w3.org/WAI/ARIA/apg/)
- [Redux Integration Guide](../../../REDUX_INTEGRATION_GUIDE.md)
