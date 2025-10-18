# Yellow Cross - Quick API Reference

## 60 Features | 519 Endpoints

### Base URL
```
http://localhost:3000
```

---

## Core Platform Endpoints

### System Information
```bash
GET  /api                    # Platform info & feature list
GET  /health                 # Health check
GET  /health/liveness        # Kubernetes liveness probe
GET  /health/readiness       # Kubernetes readiness probe
```

---

## Original 15 Features

### 1. Case Management
```bash
GET    /api/cases                  # List cases
POST   /api/cases/create           # Create case
GET    /api/cases/:id              # Get case
PUT    /api/cases/:id              # Update case
DELETE /api/cases/:id              # Delete case
```

### 2. Client CRM
```bash
GET    /api/clients                # List clients
POST   /api/clients/create         # Create client
GET    /api/clients/:id            # Get client
PUT    /api/clients/:id            # Update client
DELETE /api/clients/:id            # Delete client
```

### 3. Document Management
```bash
GET    /api/documents              # List documents
POST   /api/documents/create       # Upload document
GET    /api/documents/:id          # Get document
PUT    /api/documents/:id          # Update document
DELETE /api/documents/:id          # Delete document
```

### 4. Time & Billing
```bash
GET    /api/billing                # List billing entries
POST   /api/billing/create         # Create entry
GET    /api/billing/:id            # Get entry
PUT    /api/billing/:id            # Update entry
DELETE /api/billing/:id            # Delete entry
```

### 5. Calendar & Scheduling
```bash
GET    /api/calendar               # List events
POST   /api/calendar/create        # Create event
GET    /api/calendar/:id           # Get event
PUT    /api/calendar/:id           # Update event
DELETE /api/calendar/:id           # Delete event
```

### 6. Task & Workflow
```bash
GET    /api/tasks                  # List tasks
POST   /api/tasks/create           # Create task
GET    /api/tasks/:id              # Get task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
```

### 7. Legal Research
```bash
GET    /api/research               # List research
POST   /api/research/create        # Create research
GET    /api/research/:id           # Get research
PUT    /api/research/:id           # Update research
DELETE /api/research/:id           # Delete research
```

### 8. Court & Docket
```bash
GET    /api/court                  # List court matters
POST   /api/court/create           # Create matter
GET    /api/court/:id              # Get matter
PUT    /api/court/:id              # Update matter
DELETE /api/court/:id              # Delete matter
```

### 9. Contract Management
```bash
GET    /api/contracts              # List contracts
POST   /api/contracts/create       # Create contract
GET    /api/contracts/:id          # Get contract
PUT    /api/contracts/:id          # Update contract
DELETE /api/contracts/:id          # Delete contract
```

### 10. eDiscovery
```bash
GET    /api/ediscovery             # List evidence
POST   /api/ediscovery/create      # Create evidence
GET    /api/ediscovery/:id         # Get evidence
PUT    /api/ediscovery/:id         # Update evidence
DELETE /api/ediscovery/:id         # Delete evidence
```

### 11. Compliance
```bash
GET    /api/compliance             # List compliance items
POST   /api/compliance/create      # Create item
GET    /api/compliance/:id         # Get item
PUT    /api/compliance/:id         # Update item
DELETE /api/compliance/:id         # Delete item
```

### 12. Reporting & Analytics
```bash
GET    /api/reports                # List reports
POST   /api/reports/create         # Create report
GET    /api/reports/:id            # Get report
PUT    /api/reports/:id            # Update report
DELETE /api/reports/:id            # Delete report
```

### 13. Communication
```bash
GET    /api/communication          # List messages
POST   /api/communication/create   # Create message
GET    /api/communication/:id      # Get message
PUT    /api/communication/:id      # Update message
DELETE /api/communication/:id      # Delete message
```

### 14. Security
```bash
GET    /api/security               # List security items
POST   /api/security/create        # Create item
GET    /api/security/:id           # Get item
PUT    /api/security/:id           # Update item
DELETE /api/security/:id           # Delete item
```

### 15. Integration
```bash
GET    /api/integrations           # List integrations
POST   /api/integrations/create    # Create integration
GET    /api/integrations/:id       # Get integration
PUT    /api/integrations/:id       # Update integration
DELETE /api/integrations/:id       # Delete integration
```

---

## New 45 Features (16-60)

### Practice Area Specializations

#### 16. Litigation Management
```bash
GET    /api/litigation             # List matters
POST   /api/litigation/create      # Create matter
GET    /api/litigation/:id         # Get matter
PUT    /api/litigation/:id         # Update matter
DELETE /api/litigation/:id         # Delete matter
```

#### 17. Mediation & ADR
```bash
GET    /api/mediation              # List sessions
POST   /api/mediation/create       # Create session
GET    /api/mediation/:id          # Get session
PUT    /api/mediation/:id          # Update session
DELETE /api/mediation/:id          # Delete session
```

#### 18. Intellectual Property
```bash
GET    /api/ip                     # List IP assets
POST   /api/ip/create              # Create asset
GET    /api/ip/:id                 # Get asset
PUT    /api/ip/:id                 # Update asset
DELETE /api/ip/:id                 # Delete asset
```

#### 19. Real Estate
```bash
GET    /api/realestate             # List transactions
POST   /api/realestate/create      # Create transaction
GET    /api/realestate/:id         # Get transaction
PUT    /api/realestate/:id         # Update transaction
DELETE /api/realestate/:id         # Delete transaction
```

#### 20. Corporate Governance
```bash
GET    /api/governance             # List events
POST   /api/governance/create      # Create event
GET    /api/governance/:id         # Get event
PUT    /api/governance/:id         # Update event
DELETE /api/governance/:id         # Delete event
```

#### 21-60. Additional Features
All new features follow the same pattern:
```bash
GET    /api/{feature}              # List records
POST   /api/{feature}/create       # Create record
GET    /api/{feature}/:id          # Get record
PUT    /api/{feature}/:id          # Update record
DELETE /api/{feature}/:id          # Delete record
```

**Feature Paths:**
- `/api/manda` - Mergers & Acquisitions
- `/api/employment` - Employment Law
- `/api/immigration` - Immigration Law
- `/api/family` - Family Law
- `/api/criminal` - Criminal Defense
- `/api/bankruptcy` - Bankruptcy
- `/api/estate` - Estate Planning
- `/api/tax` - Tax Law
- `/api/personalinjury` - Personal Injury
- `/api/classaction` - Class Action
- `/api/appellate` - Appellate Practice
- `/api/environmental` - Environmental Law
- `/api/healthcare` - Healthcare Law
- `/api/insurancedefense` - Insurance Defense
- `/api/securities` - Securities Law
- `/api/financial` - Financial Services
- `/api/energy` - Energy & Utilities
- `/api/telecom` - Telecommunications
- `/api/aviation` - Aviation Law
- `/api/maritime` - Maritime Law
- `/api/construction` - Construction Law
- `/api/franchise` - Franchise Law
- `/api/sports` - Sports & Entertainment
- `/api/technology` - Technology Transactions
- `/api/privacy` - Data Privacy & GDPR
- `/api/cybersecurity` - Cybersecurity Legal
- `/api/govcontracts` - Government Contracts
- `/api/nonprofit` - Non-Profit Law
- `/api/education` - Education Law
- `/api/labor` - Labor Relations
- `/api/trade` - International Trade
- `/api/antitrust` - Antitrust & Competition
- `/api/whitecollar` - White Collar Crime
- `/api/civilrights` - Civil Rights
- `/api/municipal` - Municipal Law
- `/api/veterans` - Veterans Affairs
- `/api/socialsecurity` - Social Security
- `/api/consumer` - Consumer Protection
- `/api/landlordtenant` - Landlord-Tenant
- `/api/probono` - Pro Bono Management

---

## Request Examples

### Create a Record
```bash
curl -X POST http://localhost:3000/api/litigation/create \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "CASE-2025-0001",
    "litigationType": "civil",
    "court": "Superior Court",
    "createdBy": "user123"
  }'
```

### Get a Record
```bash
curl http://localhost:3000/api/litigation/LIT-001
```

### Update a Record
```bash
curl -X PUT http://localhost:3000/api/litigation/LIT-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "settled",
    "updatedBy": "user123"
  }'
```

### List All Records
```bash
curl http://localhost:3000/api/litigation
```

### Delete a Record
```bash
curl -X DELETE http://localhost:3000/api/litigation/LIT-001
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* record data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### List Response
```json
{
  "success": true,
  "data": [ /* array of records */ ],
  "total": 10,
  "page": 1,
  "pageSize": 50
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (health check failed)

---

## Authentication

Currently, endpoints are accessible without authentication.  
For production use, add JWT tokens:

```bash
curl http://localhost:3000/api/litigation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Rate Limiting

- Window: 15 minutes
- Max Requests: 100 per IP
- Applies to: All `/api/*` endpoints

---

## Quick Testing

### Test Platform
```bash
# Get platform info
curl http://localhost:3000/api

# Check health
curl http://localhost:3000/health
```

### Test New Features
```bash
# Test litigation feature
curl http://localhost:3000/api/litigation

# Test IP feature
curl http://localhost:3000/api/ip

# Test pro bono feature
curl http://localhost:3000/api/probono
```

---

## Documentation Links

- **Full Feature List**: [NEW_FEATURES.md](./NEW_FEATURES.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Feature Matrix**: [FEATURE_MATRIX.md](./FEATURE_MATRIX.md)
- **Platform README**: [README.md](./README.md)

---

**Yellow Cross v2.0.0**  
60 Features | 519 Endpoints | Production Ready
