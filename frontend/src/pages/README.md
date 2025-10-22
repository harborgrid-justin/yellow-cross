# Pages Module

This directory contains domain-specific page modules following the standardized Pages Domain Structure Template.

## Overview

The `pages/` directory is organized by domain, with each domain following a consistent structure that includes:

- Main page components (Main, Detail, Create, Edit)
- Domain-specific sub-components
- Redux store integration
- Protected routes with role-based access control
- Centralized exports

## Structure

```
pages/
├── README.md                 # This file
├── index.ts                  # Central exports for all page modules
├── admin/                    # Admin domain (reference implementation)
│   ├── index.ts             # Admin module exports
│   ├── routes.tsx           # Admin route configuration
│   ├── AdminMain.tsx        # Main admin page
│   ├── AdminDetail.tsx      # Detail view page
│   ├── AdminCreate.tsx      # Create page
│   ├── AdminEdit.tsx        # Edit page
│   ├── components/          # Admin-specific components
│   │   ├── index.ts
│   │   ├── AdminList.tsx
│   │   ├── AdminCard.tsx
│   │   ├── AdminForm.tsx
│   │   ├── AdminDetails.tsx
│   │   ├── AdminFilters.tsx
│   │   └── AdminSettings.tsx
│   └── store/               # Admin Redux store
│       ├── index.ts
│       └── adminSlice.ts
└── {domain}/                # Additional domains follow same structure
```

## Reference Implementation

The **`admin/`** directory serves as the reference implementation for all page modules. It demonstrates:

- Complete CRUD operations
- Form validation
- Error handling
- Loading states
- Empty states
- Search and filtering
- Role-based access control
- Redux integration
- Type safety
- Responsive design

## Creating a New Domain

To create a new domain page module:

1. **Copy the admin template:**
   ```bash
   cp -r pages/admin pages/{domain}
   ```

2. **Rename files and replace content:**
   - Replace `Admin` with `{Domain}` (PascalCase)
   - Replace `admin` with `{domain}` (lowercase)
   - Update file names accordingly

3. **Customize for domain:**
   - Define domain-specific types
   - Update form fields
   - Modify list columns
   - Adjust detail views
   - Implement API calls

4. **Integrate with app:**
   - Add reducer to Redux store
   - Export from pages/index.ts
   - Add routes to App.tsx

See [PAGES_DOMAIN_STRUCTURE.md](../../../PAGES_DOMAIN_STRUCTURE.md) for complete documentation.

## Available Domains

### Admin
**Path:** `/pages/admin`  
**Purpose:** Administrative user management  
**Access:** ADMIN, DISTRICT_ADMIN  
**Features:** Full CRUD operations, user management, role assignment

## Design Patterns

### Component Organization

Each domain follows this component pattern:

- **Main Component**: List view with search, filters, and bulk actions
- **Detail Component**: Read-only view of single item
- **Create Component**: Form for creating new items
- **Edit Component**: Form for editing existing items
- **List Component**: Reusable table/list display
- **Card Component**: Compact card display for grid layouts
- **Form Component**: Reusable form for create/edit
- **Details Component**: Reusable detail display
- **Filters Component**: Search and filtering controls
- **Settings Component**: Domain-specific settings

### State Management

Redux store for each domain includes:

- **Items state**: List of domain items
- **Selected item**: Currently active item
- **Filters**: Search and filter state
- **Loading states**: Separate flags for different operations
- **Error state**: Error messages
- **Notifications**: Success/error notifications
- **Pagination**: Page state for large datasets

### Route Structure

Each domain exposes these routes:

- `/pages/{domain}` - Main list view
- `/pages/{domain}/create` - Create new item
- `/pages/{domain}/:id` - View item details
- `/pages/{domain}/:id/edit` - Edit item

All routes are protected with `PrivateRoute` and role requirements.

## Best Practices

### TypeScript
- Define all types in slice file
- Use interfaces for objects
- Avoid `any` types
- Export types for reuse

### Components
- Keep components small and focused
- Use composition
- Extract reusable logic
- Handle all states (loading, error, empty)

### State Management
- Use Redux for cross-feature state
- Keep API calls in async thunks
- Handle errors gracefully
- Provide user feedback

### Routing
- Protect all routes
- Use consistent route patterns
- Include proper navigation
- Handle 404 cases

### Forms
- Validate input
- Show validation errors
- Disable during submission
- Clear after success
- Confirm destructive actions

## Testing

Each domain should include:

- **Unit tests**: Component logic
- **Integration tests**: Redux integration
- **E2E tests**: Critical user flows

## Documentation

Each domain should document:

- Purpose and features
- Access requirements
- Special considerations
- API endpoints used
- Related domains

## Migration from Features

To migrate an existing feature to pages structure:

1. Create new domain in pages/
2. Copy feature logic to new structure
3. Update routes to point to new pages
4. Test thoroughly
5. Remove old feature implementation
6. Update navigation links

See [APPLY_TEMPLATE_GUIDE.md](../../../APPLY_TEMPLATE_GUIDE.md) for step-by-step instructions.

## Common Issues

### Build Errors
- Ensure all types are defined
- Check import paths
- Verify exports in index files

### Route Issues
- Check App.tsx integration
- Verify PrivateRoute wrapper
- Check route paths match navigation

### State Issues
- Verify reducer in store
- Check selector imports
- Ensure slice name matches store key

## Resources

- [PAGES_DOMAIN_STRUCTURE.md](../../../PAGES_DOMAIN_STRUCTURE.md) - Complete template documentation
- [APPLY_TEMPLATE_GUIDE.md](../../../APPLY_TEMPLATE_GUIDE.md) - Quick application guide
- [FRONTEND_ARCHITECTURE.md](../../../FRONTEND_ARCHITECTURE.md) - Overall architecture
- [REDUX_INTEGRATION_GUIDE.md](../../../REDUX_INTEGRATION_GUIDE.md) - State management guide

## Contributing

When adding a new domain:

1. Follow the template structure
2. Use consistent naming
3. Include all required components
4. Add proper error handling
5. Document your domain
6. Add tests
7. Update this README

## Support

For questions or issues:

1. Check the reference implementation (admin/)
2. Review documentation files
3. Check existing domains for examples
4. Review the validation checklist
