# API Route Mappings

This document provides a comprehensive mapping between frontend feature directories and backend API routes.

## Overview

Frontend features are organized by domain (e.g., `aviation-law`, `financial-services`), but backend API routes use shorter, URL-friendly names. This mapping ensures frontend hooks correctly access backend endpoints.

## Route Mapping Table

| Frontend Feature Directory | Backend API Route | Example Endpoint |
|----------------------------|-------------------|------------------|
| antitrust-competition | `/api/antitrust` | `/api/antitrust/create` |
| appellate-practice | `/api/appellate` | `/api/appellate/:id` |
| aviation-law | `/api/aviation` | `/api/aviation/create` |
| bankruptcy-management | `/api/bankruptcy` | `/api/bankruptcy/:id` |
| calendar-scheduling | `/api/calendar` | `/api/calendar/court-dates` |
| case-management | `/api/cases` | `/api/cases/create` |
| civil-rights | `/api/civilrights` | `/api/civilrights/create` |
| class-action | `/api/classaction` | `/api/classaction/:id` |
| client-crm | `/api/clients` | `/api/clients/create` |
| communication | `/api/communication` | `/api/communication/messages/send` |
| compliance | `/api/compliance` | `/api/compliance/create` |
| construction-law | `/api/construction` | `/api/construction/create` |
| consumer-protection | `/api/consumer` | `/api/consumer/create` |
| contract-management | `/api/contracts` | `/api/contracts/create` |
| corporate-governance | `/api/governance` | `/api/governance/:id` |
| court-docket | `/api/court` | `/api/court/create` |
| criminal-defense | `/api/criminal` | `/api/criminal/create` |
| cybersecurity-legal | `/api/cybersecurity` | `/api/cybersecurity/create` |
| data-privacy | `/api/privacy` | `/api/privacy/create` |
| document-management | `/api/documents` | `/api/documents/upload` |
| ediscovery | `/api/ediscovery` | `/api/ediscovery/create` |
| education-law | `/api/education` | `/api/education/create` |
| employment-law | `/api/employment` | `/api/employment/create` |
| energy-utilities | `/api/energy` | `/api/energy/create` |
| environmental-law | `/api/environmental` | `/api/environmental/create` |
| estate-planning | `/api/estate` | `/api/estate/create` |
| family-law | `/api/family` | `/api/family/create` |
| financial-services | `/api/financial` | `/api/financial/create` |
| franchise-law | `/api/franchise` | `/api/franchise/create` |
| government-contracts | `/api/govcontracts` | `/api/govcontracts/create` |
| healthcare-law | `/api/healthcare` | `/api/healthcare/create` |
| immigration-law | `/api/immigration` | `/api/immigration/create` |
| insurance-defense | `/api/insurancedefense` | `/api/insurancedefense/create` |
| integration | `/api/integrations` | `/api/integrations/create` |
| intellectual-property | `/api/ip` | `/api/ip/create` |
| international-trade | `/api/trade` | `/api/trade/create` |
| labor-relations | `/api/labor` | `/api/labor/create` |
| landlord-tenant | `/api/landlordtenant` | `/api/landlordtenant/create` |
| legal-research | `/api/research` | `/api/research/create` |
| litigation-management | `/api/litigation` | `/api/litigation/create` |
| maritime-law | `/api/maritime` | `/api/maritime/create` |
| mediation-adr | `/api/mediation` | `/api/mediation/create` |
| mergers-acquisitions | `/api/manda` | `/api/manda/create` |
| municipal-law | `/api/municipal` | `/api/municipal/create` |
| non-profit-law | `/api/nonprofit` | `/api/nonprofit/create` |
| personal-injury | `/api/personalinjury` | `/api/personalinjury/create` |
| pro-bono | `/api/probono` | `/api/probono/create` |
| real-estate-transactions | `/api/realestate` | `/api/realestate/create` |
| reporting-analytics | `/api/reports` | `/api/reports/create` |
| securities-law | `/api/securities` | `/api/securities/create` |
| security | `/api/security` | `/api/security/create` |
| social-security | `/api/socialsecurity` | `/api/socialsecurity/create` |
| sports-entertainment | `/api/sports` | `/api/sports/create` |
| task-workflow | `/api/tasks` | `/api/tasks/create` |
| tax-law | `/api/tax` | `/api/tax/create` |
| technology-transactions | `/api/technology` | `/api/technology/create` |
| telecommunications | `/api/telecom` | `/api/telecom/create` |
| time-billing | `/api/billing` | `/api/billing/create` |
| veterans-affairs | `/api/veterans` | `/api/veterans/create` |
| white-collar-crime | `/api/whitecollar` | `/api/whitecollar/create` |

## How to Use

### In Frontend Hooks

When creating API hooks in frontend features, always use the backend API route, not the feature directory name:

```typescript
// ✅ CORRECT - Use backend route name
import { useMutation } from '../../../shared/hooks/useMutation';

export function useCreateFinancial() {
  return useMutation('/financial/create', 'post');  // Not '/financial-services/create'
}
```

```typescript
// ❌ INCORRECT - Don't use feature directory name
export function useCreateFinancial() {
  return useMutation('/financial-services/create', 'post');  // This won't work!
}
```

### API Client Configuration

The shared API client (`frontend/src/shared/api/client.ts`) automatically prepends `/api` to all requests, so hooks should only specify the path after `/api/`:

```typescript
// In hooks:
useMutation('/financial/create', 'post')

// Results in actual request to:
// POST /api/financial/create
```

## Backend Route Registration

All routes are registered in `backend/src/index.ts`:

```typescript
// Example registrations
app.use('/api/cases', caseManagement);
app.use('/api/financial', financialServices);
app.use('/api/ip', intellectualProperty);
```

## Validation

To verify all routes are correctly connected, run:

```bash
# Check for any mismatched paths
node scripts/verify-api-routes.js
```

## Common Mistakes to Avoid

1. ❌ Using feature directory name instead of API route: `/aviation-law/` instead of `/aviation/`
2. ❌ Including `/api` prefix in hooks (it's added automatically)
3. ❌ Using inconsistent naming between frontend and backend

## References

- Backend routes: `backend/src/index.ts`
- Frontend API client: `frontend/src/shared/api/client.ts`
- Feature hooks: `frontend/src/features/*/hooks/`
