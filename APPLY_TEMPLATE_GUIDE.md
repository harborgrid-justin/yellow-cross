# Quick Guide: Applying Pages Domain Structure Template

This guide provides quick instructions for applying the Pages Domain Structure Template to existing features in the Yellow Cross application.

## Quick Start

### 1. Choose Your Domain

Identify the feature/domain you want to restructure (e.g., `case-management`, `client-crm`, `document-management`).

### 2. Use the Script (Recommended)

We recommend creating a helper script to automate the conversion:

```bash
#!/bin/bash
# apply-template.sh

DOMAIN_LOWER=$1  # e.g., "appointments"
DOMAIN_PASCAL=$2 # e.g., "Appointments"

# Create structure
mkdir -p "frontend/src/pages/${DOMAIN_LOWER}/components"
mkdir -p "frontend/src/pages/${DOMAIN_LOWER}/store"

# Copy and replace from admin template
for file in AdminMain.tsx AdminDetail.tsx AdminCreate.tsx AdminEdit.tsx; do
  NEW_FILE="${file/Admin/$DOMAIN_PASCAL}"
  sed "s/Admin/$DOMAIN_PASCAL/g; s/admin/$DOMAIN_LOWER/g" \
    "frontend/src/pages/admin/$file" > \
    "frontend/src/pages/${DOMAIN_LOWER}/$NEW_FILE"
done

# Copy components
cp -r frontend/src/pages/admin/components/*.tsx "frontend/src/pages/${DOMAIN_LOWER}/components/"
# ... apply replacements

# Copy store
cp -r frontend/src/pages/admin/store/*.ts "frontend/src/pages/${DOMAIN_LOWER}/store/"
# ... apply replacements
```

### 3. Manual Steps

If not using a script:

1. **Copy admin folder**
   ```bash
   cp -r frontend/src/pages/admin frontend/src/pages/{domain}
   ```

2. **Find and replace** (use your IDE's global replace):
   - `Admin` → `{Domain}` (PascalCase)
   - `admin` → `{domain}` (lowercase)
   - Update file names accordingly

3. **Customize for domain**
   - Update types in slice
   - Modify form fields
   - Adjust list columns
   - Update API calls

## Step-by-Step Checklist

### Phase 1: Setup (5 min)
- [ ] Create domain folder structure
- [ ] Copy reference files from admin
- [ ] Rename all files (Admin → Domain)
- [ ] Find/replace Admin → Domain in all files
- [ ] Find/replace admin → domain in all files

### Phase 2: Customization (15-30 min)
- [ ] Define domain-specific types
- [ ] Update form fields in Create component
- [ ] Update form fields in Edit component
- [ ] Update columns in List component
- [ ] Update fields in Detail component
- [ ] Customize filters if needed
- [ ] Update API mock or implement real API

### Phase 3: Integration (10 min)
- [ ] Add reducer to Redux store (`store/store.ts`)
- [ ] Add exports to pages index (`pages/index.ts`)
- [ ] Add routes to App.tsx
- [ ] Update required roles in routes

### Phase 4: Testing (10-15 min)
- [ ] Run TypeScript linter
- [ ] Run build
- [ ] Test in browser:
  - [ ] Navigate to domain
  - [ ] Create new item
  - [ ] View item details
  - [ ] Edit item
  - [ ] Delete item
  - [ ] Test search
  - [ ] Test filters

## Common Customizations

### Adding Custom Fields

1. **Update type in slice:**
   ```typescript
   interface {Domain}Item {
     id: string;
     name: string;
     // Add your fields
     customField1: string;
     customField2: number;
     status: 'active' | 'inactive';
     createdAt: string;
     updatedAt: string;
   }
   ```

2. **Update form in Create/Edit:**
   ```typescript
   <div>
     <label htmlFor="customField1">Custom Field 1</label>
     <input
       type="text"
       id="customField1"
       name="customField1"
       value={formData.customField1}
       onChange={handleChange}
       className="..."
     />
   </div>
   ```

3. **Update List component:**
   ```typescript
   <th>Custom Field 1</th>
   // ...
   <td>{item.customField1}</td>
   ```

4. **Update Detail component:**
   ```typescript
   <div>
     <dt>Custom Field 1</dt>
     <dd>{item.customField1}</dd>
   </div>
   ```

### Changing Table to Card Layout

Replace `AdminList` usage with `AdminCard`:

```typescript
// In Main component
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredItems.map(item => (
    <{Domain}Card
      key={item.id}
      item={item}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))}
</div>
```

### Adding Custom Filters

Update the filters section in Main component:

```typescript
<div className="flex gap-4">
  {/* Existing filters */}
  
  {/* Add custom filter */}
  <select
    value={customFilter}
    onChange={(e) => setCustomFilter(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2"
  >
    <option value="all">All Custom</option>
    <option value="value1">Value 1</option>
    <option value="value2">Value 2</option>
  </select>
</div>
```

## Integration Code Snippets

### Add to Store (store/store.ts)

```typescript
import { {domain}Reducer } from '../pages/{domain}/store';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    caseManagement: caseManagementReducer,
    admin: adminReducer,
    {domain}: {domain}Reducer, // Add this line
  },
  // ...
});
```

### Add to Pages Index (pages/index.ts)

```typescript
// Admin Pages
export * from './admin';

// {Domain} Pages
export * from './{domain}'; // Add this line
```

### Add to App Routes (app/App.tsx)

```typescript
// Import
import { {Domain}Routes } from '../pages/{domain}';

// In Routes section
<Route path="pages/admin/*" element={<AdminRoutes />} />
<Route path="pages/{domain}/*" element={<{Domain}Routes />} /> {/* Add this */}
```

## Testing Commands

```bash
# Check TypeScript errors
npm run lint:frontend

# Build
npm run build:react

# Run dev server
npm run dev:react
```

## Example: Converting Case Management

Here's a concrete example of converting the case-management feature:

1. **Create structure:**
   ```bash
   mkdir -p frontend/src/pages/case-management/components
   mkdir -p frontend/src/pages/case-management/store
   ```

2. **Copy and rename files:**
   - Copy all files from `pages/admin`
   - Rename: `Admin*.tsx` → `CaseManagement*.tsx`
   - Find/replace: `Admin` → `CaseManagement`
   - Find/replace: `admin` → `caseManagement`

3. **Customize types:**
   ```typescript
   interface CaseManagementItem {
     id: string;
     caseNumber: string;
     clientName: string;
     caseType: string;
     status: 'open' | 'closed' | 'pending';
     assignedTo: string;
     priority: 'high' | 'medium' | 'low';
     createdAt: string;
     updatedAt: string;
   }
   ```

4. **Update form fields** in Create/Edit components

5. **Update List columns** to show case-specific fields

6. **Integrate:**
   ```typescript
   // store/store.ts
   import { caseManagementReducer } from '../pages/case-management/store';
   
   // pages/index.ts
   export * from './case-management';
   
   // app/App.tsx
   import { CaseManagementRoutes } from '../pages/case-management';
   <Route path="pages/case-management/*" element={<CaseManagementRoutes />} />
   ```

7. **Test** at `/pages/case-management`

## Tips for Success

### Do's ✅
- Start with the admin reference implementation
- Make one change at a time
- Test frequently during development
- Keep component names consistent
- Follow TypeScript strictly
- Use the validation checklist

### Don'ts ❌
- Don't skip type definitions
- Don't forget to update the store integration
- Don't ignore TypeScript errors
- Don't forget to test all CRUD operations
- Don't skip error and loading states
- Don't forget role-based access control

## Troubleshooting

### "Module not found" errors
- Check import paths are correct
- Ensure files are named correctly
- Verify exports in index.ts files

### TypeScript errors about types
- Ensure all interfaces are defined
- Check RootState includes your reducer
- Verify selector return types

### Redux state not updating
- Check reducer is added to store
- Verify slice name matches store key
- Check async thunks are dispatched correctly

### Routes not working
- Verify route is added to App.tsx
- Check route path matches navigation
- Ensure PrivateRoute wraps components correctly

## Need Help?

- Review `/frontend/src/pages/admin` for reference
- Check `PAGES_DOMAIN_STRUCTURE.md` for details
- Look at `FRONTEND_ARCHITECTURE.md` for overall structure
- Check `REDUX_INTEGRATION_GUIDE.md` for state management

## Next Steps

After successfully applying the template:

1. Remove old feature implementation if desired
2. Update any links to use new routes
3. Add tests for new components
4. Document any domain-specific features
5. Create API service implementation
6. Add to project documentation

Good luck with your domain implementation! 🚀
