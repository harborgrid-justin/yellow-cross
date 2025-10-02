# Client Relationship Management (CRM) - Usage Guide

## Overview

This guide provides practical examples and instructions for using the Client CRM system. All examples use `curl` commands but can be adapted to any HTTP client.

---

## Prerequisites

- Server running on `http://localhost:3000` (adjust URL as needed)
- MongoDB connected for full functionality
- Basic understanding of REST APIs

---

## 1. Client Database Management

### Create a New Client

```bash
curl -X POST http://localhost:3000/api/clients/database \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "555-0123",
    "alternatePhone": "555-0124",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "clientType": "Individual",
    "clientCategory": "Standard",
    "primaryAttorney": "Jane Doe",
    "referralSource": "Online Search",
    "tags": ["estate-planning", "high-priority"],
    "notes": "Initial consultation scheduled",
    "createdBy": "admin@lawfirm.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "client": {
      "clientNumber": "CLT-2024-1234",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "status": "Prospective",
      "_id": "507f1f77bcf86cd799439011"
    },
    "clientNumber": "CLT-2024-1234",
    "clientId": "507f1f77bcf86cd799439011"
  }
}
```

### List All Clients (with Pagination)

```bash
# Basic list
curl http://localhost:3000/api/clients/database

# With pagination
curl "http://localhost:3000/api/clients/database?page=1&limit=20"

# With filters
curl "http://localhost:3000/api/clients/database?status=Active&clientType=Individual"

# With search
curl "http://localhost:3000/api/clients/database?search=Smith"
```

### Get Client Details

```bash
curl http://localhost:3000/api/clients/database/507f1f77bcf86cd799439011
```

### Update Client

```bash
curl -X PUT http://localhost:3000/api/clients/database/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active",
    "phone": "555-9999",
    "primaryAttorney": "Robert Johnson",
    "tags": ["estate-planning", "vip"],
    "updatedBy": "admin@lawfirm.com"
  }'
```

---

## 2. Client Communication History

### Log a Communication

```bash
# Log a phone call
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/communications \
  -H "Content-Type: application/json" \
  -d '{
    "communicationType": "Phone Call",
    "direction": "Outbound",
    "subject": "Case Status Update",
    "description": "Discussed progress on estate planning documents",
    "notes": "Client satisfied with progress",
    "duration": 30,
    "initiatedBy": "Jane Doe",
    "category": "Case Discussion",
    "priority": "Medium",
    "billable": true,
    "billableHours": 0.5
  }'

# Log a meeting
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/communications \
  -H "Content-Type: application/json" \
  -d '{
    "communicationType": "Meeting",
    "direction": "Inbound",
    "subject": "Initial Consultation",
    "description": "Discussed estate planning needs",
    "duration": 60,
    "initiatedBy": "John Smith",
    "attendees": [
      {"name": "Jane Doe", "role": "Attorney"},
      {"name": "John Smith", "role": "Client"}
    ],
    "category": "Consultation",
    "priority": "High",
    "followUpRequired": true,
    "followUpDate": "2024-12-15T10:00:00Z",
    "billable": true,
    "billableHours": 1.0
  }'
```

### Get Communication History

```bash
# All communications
curl http://localhost:3000/api/clients/507f1f77bcf86cd799439011/communications

# Filtered by type
curl "http://localhost:3000/api/clients/507f1f77bcf86cd799439011/communications?type=Phone%20Call"

# With pagination
curl "http://localhost:3000/api/clients/507f1f77bcf86cd799439011/communications?page=1&limit=10"
```

---

## 3. Client Portal Access

### Enable Portal Access

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/portal \
  -H "Content-Type: application/json" \
  -d '{
    "action": "enable",
    "email": "john.smith@email.com",
    "sendInvitation": true,
    "updatedBy": "admin@lawfirm.com"
  }'
```

### Disable Portal Access

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/portal \
  -H "Content-Type: application/json" \
  -d '{
    "action": "disable",
    "updatedBy": "admin@lawfirm.com"
  }'
```

### Reset Portal Credentials

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/portal \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reset",
    "updatedBy": "admin@lawfirm.com"
  }'
```

### Get Portal Status

```bash
curl http://localhost:3000/api/clients/507f1f77bcf86cd799439011/portal
```

---

## 4. Client Intake & Onboarding

### Process New Client Intake

```bash
curl -X POST http://localhost:3000/api/clients/intake \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "555-5678",
    "address": {
      "street": "456 Oak Ave",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02101",
      "country": "USA"
    },
    "clientType": "Individual",
    "matterType": "Personal Injury",
    "matterDescription": "Car accident case requiring legal representation for insurance claim and potential lawsuit",
    "referralSource": "Referral",
    "referredBy": "Dr. Michael Brown",
    "intakeFormData": {
      "accidentDate": "2024-01-15",
      "policeReportFiled": true,
      "injuries": "Whiplash, back pain",
      "insuranceCompany": "State Farm"
    },
    "documentsProvided": ["police-report", "medical-records", "insurance-correspondence"],
    "createdBy": "intake@lawfirm.com"
  }'
```

**Response includes:**
- New client record with CLT-YYYY-XXXX number
- Initial conflict check created
- Initial communication logged
- Next steps for onboarding

---

## 5. Client Billing Information

### Get Billing Information

```bash
curl http://localhost:3000/api/clients/507f1f77bcf86cd799439011/billing
```

### Update Billing Information

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/billing \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": {
      "type": "Credit Card",
      "isPrimary": true,
      "details": {
        "cardLastFour": "4242",
        "cardType": "Visa",
        "expirationDate": "12/2025"
      }
    },
    "billingCycle": "Monthly",
    "invoiceDelivery": "Email",
    "invoiceEmail": "john.smith@email.com",
    "creditLimit": 10000,
    "paymentTerms": "Net 30",
    "autoBilling": {
      "enabled": true,
      "dayOfMonth": 1,
      "minimumAmount": 100
    },
    "notes": "Prefers electronic invoices",
    "updatedBy": "billing@lawfirm.com"
  }'
```

### Add Retainer Payment Method

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/billing \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": {
      "type": "Retainer",
      "isPrimary": false,
      "details": {
        "retainerAmount": 5000,
        "retainerBalance": 5000,
        "retainerStartDate": "2024-01-01",
        "retainerEndDate": "2024-12-31"
      }
    },
    "updatedBy": "billing@lawfirm.com"
  }'
```

---

## 6. Client Conflict Checking

### Run Conflict Check

```bash
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/conflict-check \
  -H "Content-Type: application/json" \
  -d '{
    "checkType": "New Matter",
    "relatedParties": [
      {
        "name": "ABC Corporation",
        "relationship": "Opposing Party",
        "details": "Defendant in personal injury case"
      },
      {
        "name": "John Doe Insurance",
        "relationship": "Other",
        "details": "Insurance company for opposing party"
      }
    ],
    "opposingParties": [
      {
        "name": "ABC Corporation",
        "entityType": "Business",
        "industry": "Transportation"
      }
    ],
    "matterDescription": "Personal injury lawsuit against ABC Corporation",
    "performedBy": "admin@lawfirm.com",
    "notes": "Check all previous representations of ABC Corporation"
  }'
```

**Response includes:**
- Automated conflict search results
- Potential matches with scores
- Recommended actions
- Conflict check ID for tracking

### Get Conflict Check History

```bash
curl http://localhost:3000/api/clients/507f1f77bcf86cd799439011/conflict-check
```

---

## 7. Client Retention & Feedback

### Submit Client Feedback

```bash
# NPS Survey
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackType": "NPS",
    "surveyName": "Quarterly Satisfaction Survey - Q4 2024",
    "npsScore": 9,
    "ratings": {
      "communication": 9,
      "responsiveness": 10,
      "expertise": 9,
      "valueForMoney": 8,
      "overallExperience": 9
    },
    "comments": "Excellent service throughout the case. Very responsive and knowledgeable.",
    "strengths": ["Great communication", "Expert knowledge", "Quick responses"],
    "referralLikelihood": 10,
    "wouldUseAgain": true,
    "responseMethod": "Email",
    "createdBy": "survey@lawfirm.com"
  }'

# Complaint Submission
curl -X POST http://localhost:3000/api/clients/507f1f77bcf86cd799439011/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackType": "Complaint",
    "npsScore": 4,
    "overallSatisfaction": 5,
    "comments": "Response time to emails could be improved",
    "areasForImprovement": ["Email response time", "Status updates"],
    "responseMethod": "Phone",
    "createdBy": "support@lawfirm.com"
  }'
```

**Response includes:**
- Feedback record
- NPS category (Promoter/Passive/Detractor)
- Whether follow-up is required
- Action items

### Get Feedback History

```bash
curl http://localhost:3000/api/clients/507f1f77bcf86cd799439011/feedback
```

**Response includes:**
- All feedback records
- Average satisfaction score
- NPS breakdown (Promoters, Passives, Detractors)
- Latest feedback date

---

## 8. Client Relationship Analytics

### Get Comprehensive Analytics

```bash
curl http://localhost:3000/api/clients/analytics
```

**Response includes:**

1. **Overview Metrics**
   - Total clients
   - Active clients
   - Prospective clients
   - Former clients
   - New clients (last 30 days)
   - Churn rate

2. **Revenue Metrics**
   - Total revenue
   - Total outstanding
   - Average lifetime value
   - Average revenue per client

3. **Satisfaction Metrics**
   - Average NPS
   - Average satisfaction score
   - Number of clients with feedback

4. **Distribution Analysis**
   - Clients by type
   - Clients by category

5. **Engagement Metrics**
   - Communication activity by type
   - Total communications

6. **Insights**
   - Top 10 clients by revenue
   - At-risk clients (low satisfaction)
   - Retention rate

---

## Common Workflows

### Complete Client Onboarding Workflow

1. **Process Intake**
```bash
# Step 1: Submit intake form
curl -X POST http://localhost:3000/api/clients/intake \
  -H "Content-Type: application/json" \
  -d '{ ... intake data ... }'
# Returns: clientId, clientNumber
```

2. **Run Conflict Check**
```bash
# Step 2: Perform conflict check (use clientId from step 1)
curl -X POST http://localhost:3000/api/clients/{clientId}/conflict-check \
  -H "Content-Type: application/json" \
  -d '{ ... conflict check data ... }'
```

3. **Set Up Billing**
```bash
# Step 3: Configure billing information
curl -X POST http://localhost:3000/api/clients/{clientId}/billing \
  -H "Content-Type: application/json" \
  -d '{ ... billing data ... }'
```

4. **Enable Portal Access**
```bash
# Step 4: Give client portal access
curl -X POST http://localhost:3000/api/clients/{clientId}/portal \
  -H "Content-Type: application/json" \
  -d '{
    "action": "enable",
    "sendInvitation": true,
    "updatedBy": "admin@lawfirm.com"
  }'
```

5. **Update Status to Active**
```bash
# Step 5: Activate the client
curl -X PUT http://localhost:3000/api/clients/database/{clientId} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active",
    "updatedBy": "admin@lawfirm.com"
  }'
```

---

### Regular Client Management Workflow

1. **Log Regular Communications**
```bash
# Log calls, emails, meetings as they occur
curl -X POST http://localhost:3000/api/clients/{clientId}/communications \
  -H "Content-Type: application/json" \
  -d '{ ... communication data ... }'
```

2. **Monitor Billing**
```bash
# Check billing status regularly
curl http://localhost:3000/api/clients/{clientId}/billing
```

3. **Collect Feedback**
```bash
# After case milestones or completion
curl -X POST http://localhost:3000/api/clients/{clientId}/feedback \
  -H "Content-Type: application/json" \
  -d '{ ... feedback data ... }'
```

4. **Review Analytics**
```bash
# Monitor overall client metrics
curl http://localhost:3000/api/clients/analytics
```

---

### Periodic Review Workflow

1. **Run Periodic Conflict Check**
```bash
curl -X POST http://localhost:3000/api/clients/{clientId}/conflict-check \
  -H "Content-Type: application/json" \
  -d '{
    "checkType": "Periodic Review",
    "relatedParties": [],
    "performedBy": "compliance@lawfirm.com",
    "notes": "Quarterly compliance review"
  }'
```

2. **Review Communication History**
```bash
curl http://localhost:3000/api/clients/{clientId}/communications
```

3. **Check At-Risk Clients**
```bash
# From analytics, identify clients with low satisfaction
curl http://localhost:3000/api/clients/analytics
# Check "atRiskClients" in response
```

4. **Send Satisfaction Survey**
```bash
# Follow up with at-risk clients
curl -X POST http://localhost:3000/api/clients/{clientId}/feedback \
  -H "Content-Type: application/json" \
  -d '{ ... feedback request ... }'
```

---

## Tips & Best Practices

### 1. Client Creation
- Always include complete contact information
- Use tags for easy categorization and searching
- Set referral source for tracking effectiveness
- Add detailed notes during intake

### 2. Communication Logging
- Log all client interactions promptly
- Mark billable time accurately
- Set follow-up reminders when needed
- Link communications to related cases

### 3. Conflict Checking
- Run checks at intake, new matters, and periodically
- Include all related parties
- Document resolution decisions
- Maintain waiver documentation

### 4. Billing Management
- Set up payment methods early
- Configure auto-billing for retainer clients
- Monitor credit utilization
- Update payment terms as needed

### 5. Feedback Collection
- Send surveys after case milestones
- Follow up on complaints immediately
- Track NPS trends over time
- Use feedback for improvement

### 6. Analytics Review
- Review metrics monthly
- Identify at-risk clients proactively
- Track revenue trends
- Monitor churn rate

---

## Troubleshooting

### Common Issues

**Issue**: Database not connected message
```json
{
  "message": "Database not connected - showing capabilities only"
}
```
**Solution**: Check MongoDB connection status

**Issue**: Client not found (404)
**Solution**: Verify client ID is correct and exists

**Issue**: Validation error (400)
**Solution**: Check request body against validation schema in documentation

**Issue**: Duplicate email error
**Solution**: Email addresses must be unique, use a different email

---

## Additional Resources

- **Business Logic Documentation**: `CRM_BUSINESS_LOGIC.md`
- **Verification Document**: `CRM_VERIFICATION.md`
- **API Reference**: `API_REFERENCE.md`
- **Data Models**: See `src/models/` directory
- **Validators**: See `src/validators/clientValidators.js`

---

## Support

For additional help or questions:
- Review the comprehensive documentation in `CRM_BUSINESS_LOGIC.md`
- Check validation schemas in `src/validators/clientValidators.js`
- Examine data models in `src/models/` directory
- Review test examples in `tests/client-crm.test.js`
