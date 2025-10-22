# Pages Domain Structure Template

This document provides comprehensive instructions for creating consistent page domain structures in the Yellow Cross application. The `/frontend/src/pages/admin` folder serves as the reference implementation.

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Reference Implementation](#reference-implementation)
4. [File Templates](#file-templates)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Applying the Template](#applying-the-template)
7. [Integration Steps](#integration-steps)
8. [Validation Checklist](#validation-checklist)

## Overview

Each domain page should follow a standardized structure that includes:
- Main page components (Main, Detail, Create, Edit)
- Specialized sub-components organized in `components/` folder
- Redux store integration with full CRUD operations
- Route configuration with role-based protection
- Centralized exports for easy integration

### Benefits

- **Consistency**: All domain pages follow the same structure
- **Maintainability**: Easy to find and update components
- **Scalability**: Simple to add new domains using the same pattern
- **Type Safety**: Full TypeScript support throughout
- **Best Practices**: Built-in error handling, loading states, and validation

## Folder Structure

```
pages/{domain}/
├── index.ts                    # Central exports for the domain
├── routes.tsx                  # Route configuration with protection
├── {Domain}Main.tsx           # Primary domain page component
├── {Domain}Detail.tsx         # Detail/view page component  
├── {Domain}Create.tsx         # Create/add new item page
├── {Domain}Edit.tsx           # Edit existing item page
├── components/                # Domain-specific components
│   ├── index.ts              # Component exports
│   ├── {Domain}List.tsx      # List/grid view component
│   ├── {Domain}Card.tsx      # Card display component
│   ├── {Domain}Form.tsx      # Form component for create/edit
│   ├── {Domain}Details.tsx   # Detailed information component
│   ├── {Domain}Filters.tsx   # Filtering and search component
│   └── {Domain}Settings.tsx  # Domain-specific settings (if applicable)
└── store/                    # Redux store for the domain
    ├── index.ts              # Store exports
    └── {domain}Slice.ts      # Redux slice with actions and reducers
```

## Reference Implementation

The admin pages (`/frontend/src/pages/admin`) serve as the complete reference implementation. Key files:

### Core Components
- `AdminMain.tsx` - Main page with list view, search, and filters
- `AdminDetail.tsx` - Detail view with full item information
- `AdminCreate.tsx` - Creation form with validation
- `AdminEdit.tsx` - Edit form pre-populated with existing data

### Sub-Components
- `AdminList.tsx` - Reusable table component
- `AdminCard.tsx` - Card view for grid layouts
- `AdminForm.tsx` - Reusable form component
- `AdminDetails.tsx` - Reusable detail display
- `AdminFilters.tsx` - Search and filter controls
- `AdminSettings.tsx` - Domain-specific settings

### Store
- `adminSlice.ts` - Complete Redux slice with:
  - State management
  - Async thunks for CRUD operations
  - Loading states for different operations
  - Error handling
  - Notifications
  - Pagination support
  - Selectors

### Routes
- `routes.tsx` - Protected routes with role-based access control

## File Templates

### 1. Main Index File (`index.ts`)

```typescript
/**
 * WF-COMP-XXX | index.ts - {Domain} page exports
 * Purpose: Centralized exports for {domain} page module
 * Last Updated: {date} | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as {Domain}Main } from './{Domain}Main';
export { default as {Domain}Detail } from './{Domain}Detail';
export { default as {Domain}Create } from './{Domain}Create';
export { default as {Domain}Edit } from './{Domain}Edit';

// Route exports
export { default as {Domain}Routes } from './routes';
```

### 2. Routes Configuration (`routes.tsx`)

```typescript
/**
 * WF-COMP-XXX | routes.tsx - {Domain} page routes
 * Purpose: {Domain} route configuration with role-based protection
 * Related: ProtectedRoute, {domain} components
 * Last Updated: {date} | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/components/PrivateRoute';
import {
  {Domain}Main,
  {Domain}Detail,
  {Domain}Create,
  {Domain}Edit,
} from './components';

export const {Domain}Routes: React.FC = () => {
  return (
    <Routes>
      {/* Main {Domain} List/Dashboard */}
      <Route 
        path="/" 
        element={
          <PrivateRoute requiredRoles={['{REQUIRED_ROLES}']}>
            <{Domain}Main />
          </PrivateRoute>
        } 
      />

      {/* Create New {Domain} Item */}
      <Route 
        path="/create" 
        element={
          <PrivateRoute requiredRoles={['{REQUIRED_ROLES}']}>
            <{Domain}Create />
          </PrivateRoute>
        } 
      />

      {/* View {Domain} Item Details */}
      <Route 
        path="/:id" 
        element={
          <PrivateRoute requiredRoles={['{REQUIRED_ROLES}']}>
            <{Domain}Detail />
          </PrivateRoute>
        } 
      />

      {/* Edit {Domain} Item */}
      <Route 
        path="/:id/edit" 
        element={
          <PrivateRoute requiredRoles={['{REQUIRED_ROLES}']}>
            <{Domain}Edit />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default {Domain}Routes;
```

### 3. Redux Store Slice (`store/{domain}Slice.ts`)

See `/frontend/src/pages/admin/store/adminSlice.ts` for the complete implementation including:

- Type definitions for items and state
- Initial state setup
- Mock API functions (replace with real API)
- Async thunks for all CRUD operations
- Slice with reducers for:
  - State management
  - Filters
  - Notifications
  - Pagination
  - Error handling
- Extra reducers for async operation handling
- Selectors for accessing state

### 4. Components Index (`components/index.ts`)

```typescript
/**
 * WF-COMP-XXX | components/index.ts - {Domain} Components Module
 * Purpose: Component exports for {domain} management
 * Dependencies: React, {domain} types, {domain} services
 * Features: {domain} CRUD operations, filtering, search, validation
 */

// Main page components
export { default as {Domain}Main } from '../{Domain}Main';
export { default as {Domain}Detail } from '../{Domain}Detail';
export { default as {Domain}Create } from '../{Domain}Create';
export { default as {Domain}Edit } from '../{Domain}Edit';

// Management components
export { default as {Domain}List } from './{Domain}List';
export { default as {Domain}Card } from './{Domain}Card';
export { default as {Domain}Form } from './{Domain}Form';
export { default as {Domain}Details } from './{Domain}Details';
export { default as {Domain}Filters } from './{Domain}Filters';
export { default as {Domain}Settings } from './{Domain}Settings';
```

## Implementation Guidelines

### 1. Naming Conventions
- **Domain Names**: Use PascalCase (e.g., `Appointments`, `Inventory`, `UserManagement`)
- **File Names**: Use PascalCase for components (e.g., `AppointmentsMain.tsx`)
- **Store Names**: Use camelCase for slices (e.g., `appointmentsSlice.ts`)
- **Variables**: Use camelCase (e.g., `appointmentsList`, `selectedItem`)

### 2. Required Roles Configuration

Replace `{REQUIRED_ROLES}` based on access requirements:

- **Admin-level**: `['ADMIN', 'DISTRICT_ADMIN']`
- **Manager-level**: `['ADMIN', 'DISTRICT_ADMIN', 'MANAGER']`
- **Staff-level**: `['ADMIN', 'DISTRICT_ADMIN', 'MANAGER', 'STAFF']`
- **Universal**: `['ADMIN', 'DISTRICT_ADMIN', 'MANAGER', 'STAFF', 'NURSE', 'DOCTOR']`

### 3. Component Structure Requirements

Each component should include:

- **Header comment** with purpose and file info
- **Type definitions** for props and internal state
- **Error handling** for loading states and failures
- **Loading indicators** for async operations
- **Empty states** when no data is available
- **Responsive design** following Tailwind CSS patterns

### 4. State Management

The Redux slice must include:

- **Loading states**: Separate loading flags for different operations
  - `loading.items` - for fetching lists
  - `loading.operations` - for create/update/delete
  - `loading.details` - for fetching single item
- **Error handling**: Clear error messages
- **Notifications**: Success/error notifications for operations
- **Pagination**: Support for paginated data
- **Filters**: Persistent filter state

### 5. API Integration

Create corresponding API service in `src/services/{domain}Api.ts`:

```typescript
export const {domain}Api = {
  getItems: async (params?: any) => {
    const response = await fetch(`/api/{domain}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },
  
  getItem: async (id: string) => {
    const response = await fetch(`/api/{domain}/${id}`);
    return response.json();
  },
  
  createItem: async (data: any) => {
    const response = await fetch(`/api/{domain}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  updateItem: async (id: string, data: any) => {
    const response = await fetch(`/api/{domain}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  deleteItem: async (id: string) => {
    await fetch(`/api/{domain}/${id}`, { method: 'DELETE' });
  }
};
```

### 6. Type Definitions

Create domain types in `src/types/{domain}.ts`:

```typescript
export interface {Domain}Item {
  id: string;
  // Add domain-specific properties
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface {Domain}FormData {
  // Form-specific properties
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface {Domain}Filters {
  searchTerm?: string;
  status?: string;
  // Add domain-specific filters
}
```

## Applying the Template

### Step-by-Step Process

1. **Create the domain folder**
   ```bash
   mkdir -p frontend/src/pages/{domain}/components
   mkdir -p frontend/src/pages/{domain}/store
   ```

2. **Copy reference files from admin**
   ```bash
   # Copy and rename files from admin to new domain
   # Replace all instances of "Admin" with your domain name
   # Replace all instances of "admin" with lowercase domain name
   ```

3. **Update placeholders**
   - Replace `{domain}` with lowercase name (e.g., `appointments`)
   - Replace `{Domain}` with PascalCase name (e.g., `Appointments`)
   - Replace `{DOMAIN}` with uppercase name (e.g., `APPOINTMENTS`)
   - Replace `{REQUIRED_ROLES}` with appropriate roles
   - Replace `{date}` with current date (YYYY-MM-DD)
   - Replace `WF-COMP-XXX` with actual work item number

4. **Customize for domain**
   - Add domain-specific fields to types
   - Update form fields in Create/Edit components
   - Modify List component columns
   - Add domain-specific filters
   - Customize Detail view fields

5. **Create API service**
   - Create `src/services/{domain}Api.ts`
   - Implement actual API calls
   - Update slice to use real API

6. **Add types**
   - Create `src/types/{domain}.ts`
   - Define all interfaces
   - Export types

## Integration Steps

### 1. Add Reducer to Store

Update `/frontend/src/store/store.ts`:

```typescript
import { {domain}Reducer } from '../pages/{domain}/store';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    {domain}: {domain}Reducer,
  },
  // ...
});
```

### 2. Update Pages Index

Update `/frontend/src/pages/index.ts`:

```typescript
// Add to existing exports
export * from './{domain}';
```

### 3. Add Routes to App

Update `/frontend/src/app/App.tsx`:

```typescript
// Import routes
import { {Domain}Routes } from '../pages/{domain}';

// Add route in the Routes section
<Route path="pages/{domain}/*" element={<{Domain}Routes />} />
```

### 4. Test the Integration

1. Run TypeScript linter: `npm run lint:frontend`
2. Run build: `npm run build:react`
3. Start dev server: `npm run dev:react`
4. Navigate to `/pages/{domain}` in browser
5. Test all CRUD operations

## Validation Checklist

Before considering a domain complete, verify:

- [ ] All files follow naming conventions
- [ ] Routes are protected with appropriate roles
- [ ] Redux store integrates correctly
- [ ] Components handle loading states
- [ ] Components handle error states
- [ ] Components handle empty states
- [ ] Form validation works correctly
- [ ] Create operation works
- [ ] Read/Detail operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Filters work correctly
- [ ] Search works correctly
- [ ] Pagination works (if applicable)
- [ ] Types are properly defined
- [ ] API service follows patterns
- [ ] Main exports are complete
- [ ] Routes integrate with main router
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive design works
- [ ] Navigation works correctly

## Examples

### Creating an Appointments Domain

1. Create structure:
   ```bash
   mkdir -p frontend/src/pages/appointments/components
   mkdir -p frontend/src/pages/appointments/store
   ```

2. Copy and customize files:
   - `AdminMain.tsx` → `AppointmentsMain.tsx`
   - `AdminDetail.tsx` → `AppointmentsDetail.tsx`
   - `AdminCreate.tsx` → `AppointmentsCreate.tsx`
   - `AdminEdit.tsx` → `AppointmentsEdit.tsx`
   - All component files
   - Store files
   - Route files

3. Update types for appointments:
   ```typescript
   interface AppointmentItem {
     id: string;
     patientName: string;
     doctorName: string;
     date: string;
     time: string;
     status: 'scheduled' | 'completed' | 'cancelled';
     notes?: string;
     createdAt: string;
     updatedAt: string;
   }
   ```

4. Integrate with app as described above

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement pagination for large lists
- Debounce search inputs
- Lazy load routes

### Accessibility
- Include ARIA labels
- Support keyboard navigation
- Provide screen reader text
- Ensure color contrast

### Error Handling
- Display user-friendly error messages
- Log errors for debugging
- Provide retry mechanisms
- Handle network failures gracefully

### Testing
- Write unit tests for components
- Test Redux slice logic
- Test API integrations
- Include E2E tests for critical paths

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure all types are properly defined
2. **Redux not updating**: Check reducer integration in store
3. **Routes not working**: Verify route configuration in App.tsx
4. **API errors**: Check API service implementation and endpoints
5. **Loading states stuck**: Ensure async thunks handle all cases

### Getting Help

- Review the reference implementation at `/frontend/src/pages/admin`
- Check existing feature implementations in `/frontend/src/features`
- Consult FRONTEND_ARCHITECTURE.md for overall structure
- Review REDUX_INTEGRATION_GUIDE.md for state management

## Summary

This Pages Domain Structure Template provides:

✅ **Standardized Structure** - Consistent organization across all domains  
✅ **Complete CRUD Operations** - Full create, read, update, delete functionality  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **State Management** - Redux integration with proper patterns  
✅ **Role-Based Access** - Protected routes with authorization  
✅ **Error Handling** - Comprehensive error states and messages  
✅ **Loading States** - Proper loading indicators for all operations  
✅ **Reusable Components** - Modular components for easy maintenance  
✅ **Documentation** - Clear comments and structure  
✅ **Best Practices** - Following React and Redux best practices

By following this template, you ensure consistency, maintainability, and scalability across all domain pages in the Yellow Cross application.
