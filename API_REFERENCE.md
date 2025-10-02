# Yellow Cross - API Reference Guide

## Base URL
```
http://localhost:3000/api
```

## Authentication
All API endpoints (except public endpoints) require JWT authentication.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## API Endpoints by Feature

### 1. Case Management System

#### GET /api/cases
List all sub-features of case management system

**Response:**
```json
{
  "feature": "Case Management System",
  "subFeatures": [
    "Case Creation & Intake",
    "Case Tracking & Status",
    "Case Assignment & Distribution",
    "Case Timeline Management",
    "Case Categorization & Tagging",
    "Case Notes & Updates",
    "Case Closing & Archive",
    "Case Analytics Dashboard"
  ]
}
```

#### POST /api/cases/create
Create new case with intake forms

#### GET /api/cases/:id/status
Get case tracking and status information

#### PUT /api/cases/:id/assign
Assign case to attorneys

#### GET /api/cases/:id/timeline
View case timeline with key dates

#### PUT /api/cases/:id/categorize
Categorize and tag cases

#### POST /api/cases/:id/notes
Add notes and updates to case

#### POST /api/cases/:id/close
Close and archive a case

#### GET /api/cases/analytics
Get case analytics dashboard data

---

### 2. Client CRM

#### GET /api/clients
Client database management overview

#### GET /api/clients/:id/communications
Get client communication history

#### POST /api/clients/:id/portal
Manage client portal access

#### POST /api/clients/intake
Process client intake and onboarding

#### GET /api/clients/:id/billing
Get client billing information

#### POST /api/clients/:id/conflict-check
Run conflict of interest check

#### POST /api/clients/:id/feedback
Submit or retrieve client feedback

#### GET /api/clients/analytics
Get client relationship analytics

---

### 3. Document Management

#### GET /api/documents
Document management system overview

#### POST /api/documents/upload
Upload and store documents

**Request Body:**
```json
{
  "files": ["file1.pdf", "file2.docx"],
  "case_id": "12345",
  "category": "pleadings"
}
```

#### PUT /api/documents/:id/organize
Organize and index documents

#### GET /api/documents/templates
Access document templates library

#### GET /api/documents/:id/versions
View document version control

#### GET /api/documents/search
Search and retrieve documents

**Query Parameters:**
- `q`: Search query
- `case_id`: Filter by case
- `date_from`: Start date
- `date_to`: End date

#### POST /api/documents/:id/collaborate
Enable document collaboration

#### PUT /api/documents/:id/permissions
Set document security and permissions

#### POST /api/documents/automate
Automate document generation

---

### 4. Time & Billing

#### GET /api/billing
Time and billing management overview

#### POST /api/billing/time-entry
Create time tracking entry

**Request Body:**
```json
{
  "attorney_id": "123",
  "case_id": "456",
  "hours": 2.5,
  "description": "Legal research",
  "billable": true,
  "date": "2024-01-15"
}
```

#### GET /api/billing/billable-hours
Get billable hours management data

#### POST /api/billing/invoices
Generate invoices

#### POST /api/billing/payments
Process payments

#### POST /api/billing/expenses
Track expenses

#### GET /api/billing/trust-accounts
Manage trust accounting (IOLTA)

#### PUT /api/billing/rates
Manage billing rates

#### GET /api/billing/reports
Get financial reporting data

---

### 5. Calendar & Scheduling

#### GET /api/calendar
Calendar and scheduling system overview

#### POST /api/calendar/court-dates
Schedule court dates

#### POST /api/calendar/deadlines
Manage deadlines

#### POST /api/calendar/appointments
Schedule appointments

#### GET /api/calendar/availability
Check attorney availability

#### POST /api/calendar/reminders
Set reminders and notifications

#### POST /api/calendar/sync
Synchronize with external calendars

#### POST /api/calendar/resources
Schedule resources (rooms, equipment)

#### GET /api/calendar/conflicts
Check for scheduling conflicts

---

### 6. Task & Workflow Management

#### GET /api/tasks
Task and workflow management overview

#### POST /api/tasks/create
Create new task

**Request Body:**
```json
{
  "title": "File motion",
  "description": "File motion to dismiss",
  "assigned_to": "attorney_id",
  "due_date": "2024-01-20",
  "priority": "high",
  "case_id": "12345"
}
```

#### POST /api/tasks/workflows
Manage workflow automation

#### PUT /api/tasks/:id/dependencies
Set task dependencies

#### PUT /api/tasks/:id/priority
Update task priority

#### GET /api/tasks/templates
Access task templates

#### GET /api/tasks/:id/progress
Track task progress

#### POST /api/tasks/:id/collaborate
Collaborate on tasks

#### GET /api/tasks/analytics
Get workflow analytics

---

### 7. Legal Research & Knowledge Base

#### GET /api/research
Legal research system overview

#### GET /api/research/integrations
Access legal research integrations (Westlaw, LexisNexis)

#### GET /api/research/knowledge-base
Access internal knowledge base

#### GET /api/research/case-law
Search case law database

**Query Parameters:**
- `jurisdiction`: State/federal
- `citation`: Case citation
- `keywords`: Search terms

#### POST /api/research/memoranda
Manage legal memoranda

#### POST /api/research/citations
Manage research citations

#### GET /api/research/practice-areas/:area
Access practice area resources

#### GET /api/research/updates
Get legal updates and alerts

#### POST /api/research/collaborate
Collaborate on research

---

### 8. Court & Docket Management

#### GET /api/court
Court and docket management overview

#### GET /api/court/dockets
Track court dockets

#### POST /api/court/e-filing
Submit electronic filings

#### GET /api/court/rules/:court
Access court rules and procedures

#### GET /api/court/opposing-counsel
Access opposing counsel database

#### GET /api/court/judges/:id
Get judge information

#### GET /api/court/calendar
View courtroom calendar

#### POST /api/court/alerts
Set docket alerts

#### GET /api/court/documents/:id
Retrieve court documents

---

### 9. Contract Management

#### GET /api/contracts
Contract management overview

#### POST /api/contracts/create
Create new contract

#### GET /api/contracts/repository
Access contract repository

#### POST /api/contracts/:id/review
Submit contract for review

#### POST /api/contracts/:id/negotiations
Track contract negotiations

#### GET /api/contracts/:id/lifecycle
View contract lifecycle

#### GET /api/contracts/renewals
Manage contract renewals

#### GET /api/contracts/:id/compliance
Monitor contract compliance

#### GET /api/contracts/analytics
Get contract analytics

---

### 10. eDiscovery & Evidence Management

#### GET /api/ediscovery
eDiscovery system overview

#### POST /api/ediscovery/collect
Collect and preserve evidence

**Request Body:**
```json
{
  "case_id": "12345",
  "custodian": "John Doe",
  "data_sources": ["email", "files"],
  "date_range": {
    "start": "2023-01-01",
    "end": "2024-01-01"
  }
}
```

#### GET /api/ediscovery/review
Access document review platform

#### POST /api/ediscovery/process
Process ESI (electronically stored information)

#### POST /api/ediscovery/privilege
Manage privilege review

#### POST /api/ediscovery/productions
Manage document productions

#### POST /api/ediscovery/tagging
Tag and code evidence

#### POST /api/ediscovery/legal-holds
Manage legal holds

#### GET /api/ediscovery/analytics
Get eDiscovery analytics

---

### 11. Compliance & Risk Management

#### GET /api/compliance
Compliance and risk management overview

#### GET /api/compliance/ethics
Track ethics and compliance

#### POST /api/compliance/risk-assessment
Perform risk assessment

#### GET /api/compliance/malpractice-prevention
Access malpractice prevention tools

#### GET /api/compliance/regulatory
Monitor regulatory compliance

#### GET /api/compliance/audit-trail
View audit trails and logging

#### GET /api/compliance/privacy
Manage data privacy compliance (GDPR, CCPA)

#### GET /api/compliance/liability
Manage professional liability

#### GET /api/compliance/reports
Generate compliance reports

---

### 12. Reporting & Analytics

#### GET /api/reports
Reporting and analytics overview

#### GET /api/reports/case-analytics
Get case analytics and metrics

**Query Parameters:**
- `date_from`: Start date
- `date_to`: End date
- `practice_area`: Filter by practice area
- `attorney`: Filter by attorney

**Response:**
```json
{
  "total_cases": 150,
  "open_cases": 45,
  "closed_cases": 105,
  "avg_duration_days": 127,
  "win_rate": 0.78,
  "cases_by_type": {
    "civil": 80,
    "criminal": 40,
    "family": 30
  }
}
```

#### GET /api/reports/financial
Access financial dashboards

#### GET /api/reports/attorney-performance
View attorney performance metrics

#### GET /api/reports/client-analytics
Get client analytics

#### GET /api/reports/practice-areas
Analyze practice area performance

#### POST /api/reports/custom
Create custom reports

#### GET /api/reports/predictive
Access predictive analytics

#### GET /api/reports/executive
View executive dashboards

---

### 13. Communication & Collaboration

#### GET /api/communication
Communication system overview

#### POST /api/communication/messages
Send internal messages

**Request Body:**
```json
{
  "to": ["user_id_1", "user_id_2"],
  "subject": "Case update",
  "message": "Please review the latest filing",
  "case_id": "12345",
  "priority": "normal"
}
```

#### GET /api/communication/email
Manage email integration

#### POST /api/communication/video
Start video conferencing

#### POST /api/communication/files
Share files securely

#### POST /api/communication/workspaces
Create team collaboration spaces

#### POST /api/communication/client-portal
Communicate via client portal

#### GET /api/communication/external
Track external communications

#### GET /api/communication/templates
Access communication templates

---

### 14. Security & Access Control

#### GET /api/security
Security system overview

#### POST /api/security/auth
Authenticate users

**Request Body:**
```json
{
  "username": "attorney@firm.com",
  "password": "secure_password",
  "mfa_code": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "user": {
    "id": "123",
    "name": "John Attorney",
    "role": "attorney"
  }
}
```

#### GET /api/security/roles
Manage role-based access control

#### GET /api/security/encryption
View encryption settings

#### GET /api/security/audit
Access security audit trails

#### POST /api/security/ip-whitelist
Manage IP whitelisting

#### GET /api/security/sessions
Manage user sessions

#### POST /api/security/backup
Initiate data backup

#### GET /api/security/monitoring
View security monitoring

---

### 15. Integration & API Management

#### GET /api/integrations
Integration system overview

#### GET /api/integrations/third-party
Access third-party integrations

#### GET /api/integrations/api
API documentation and access

#### POST /api/integrations/webhooks
Configure webhooks

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["case.created", "document.uploaded"],
  "secret": "webhook_secret"
}
```

#### POST /api/integrations/import-export
Import/export data

#### POST /api/integrations/legacy
Connect legacy systems

#### GET /api/integrations/accounting
Manage accounting integrations (QuickBooks, Xero)

#### POST /api/integrations/e-signature
Manage e-signature integrations (DocuSign, Adobe Sign)

#### GET /api/integrations/security
View API security and rate limiting

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limit) |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

For list endpoints that return multiple items:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "pages": 5
  }
}
```

---

## Health Check

#### GET /health

Check system health status

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

---

## Root Endpoint

#### GET /

Get platform information

**Response:**
```json
{
  "name": "Yellow Cross",
  "version": "1.0.0",
  "description": "Enterprise Law Firm Practice Management Platform",
  "features": [
    "Case Management System",
    "Client Relationship Management (CRM)",
    ...
  ]
}
```

---

## Testing the API

### Using cURL

```bash
# Get platform info
curl http://localhost:3000/

# Get case management features
curl http://localhost:3000/api/cases

# Create a time entry
curl -X POST http://localhost:3000/api/billing/time-entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "attorney_id": "123",
    "case_id": "456",
    "hours": 2.5,
    "description": "Legal research"
  }'

# Search documents
curl "http://localhost:3000/api/documents/search?q=contract&case_id=123"
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

// Get case analytics
axios.get('http://localhost:3000/api/cases/analytics')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// Create task
axios.post('http://localhost:3000/api/tasks/create', {
  title: 'File motion',
  assigned_to: 'attorney_123',
  due_date: '2024-01-20'
}, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => console.log(response.data));
```

### Using Python

```python
import requests

# Get client analytics
response = requests.get('http://localhost:3000/api/clients/analytics')
print(response.json())

# Create case
headers = {'Authorization': f'Bearer {token}'}
data = {
    'title': 'New Case',
    'client_id': '123',
    'practice_area': 'civil'
}
response = requests.post(
    'http://localhost:3000/api/cases/create',
    json=data,
    headers=headers
)
print(response.json())
```

---

## API Versioning

Currently using v1. Future versions will be available at:
- `/api/v2/...`
- `/api/v3/...`

---

## Support

For API support:
- Documentation: See README.md and FEATURES.md
- Issues: Open a GitHub issue
- Contact: support@yellowcross.com

---

**Yellow Cross API - Version 1.0.0**
