# Case Management System - Usage Guide

## Quick Start

This guide provides practical examples of how to use the Case Management System API.

---

## 🚀 Setup

### 1. Configure MongoDB

Set the MongoDB connection string in your `.env` file:

```bash
MONGODB_URI=mongodb://localhost:27017/yellow-cross
```

Or use a cloud MongoDB instance:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yellow-cross
```

### 2. Start the Server

```bash
npm start
```

The server will start on port 3000 (or your configured PORT).

---

## 📝 API Usage Examples

### 1. Create a New Case

**Endpoint:** `POST /api/cases/create`

```bash
curl -X POST http://localhost:3000/api/cases/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Smith v. Johnson Personal Injury Case",
    "description": "Client injured in car accident, seeking compensation",
    "clientName": "John Smith",
    "matterType": "Civil",
    "practiceArea": "Personal Injury",
    "priority": "High",
    "tags": ["car-accident", "personal-injury", "urgent"],
    "createdBy": "Attorney Sarah Johnson",
    "estimatedValue": 150000,
    "dueDate": "2024-12-31"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "case": {
      "_id": "657abc123def456...",
      "caseNumber": "CASE-2024-0001",
      "title": "Smith v. Johnson Personal Injury Case",
      "status": "Open",
      "priority": "High",
      ...
    },
    "caseNumber": "CASE-2024-0001",
    "caseId": "657abc123def456..."
  }
}
```

---

### 2. Get Case Status and Progress

**Endpoint:** `GET /api/cases/:id/status`

```bash
curl http://localhost:3000/api/cases/657abc123def456/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "caseNumber": "CASE-2024-0001",
    "currentStatus": "Open",
    "priority": "High",
    "openedDate": "2024-10-02T10:30:00.000Z",
    "duration": 5,
    "statusHistory": [...],
    "assignedTo": "Attorney Sarah Johnson",
    "recentEvents": [...],
    "upcomingDeadlines": [...],
    "progress": {
      "daysOpen": 5,
      "totalEvents": 3,
      "pendingDeadlines": 2
    }
  }
}
```

---

### 3. Assign Case to Attorney

**Endpoint:** `PUT /api/cases/:id/assign`

```bash
curl -X PUT http://localhost:3000/api/cases/657abc123def456/assign \
  -H "Content-Type: application/json" \
  -d '{
    "assignedTo": "Attorney Michael Davis",
    "assignedBy": "Manager Lisa Brown",
    "reason": "Michael has expertise in personal injury cases"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Case assigned successfully",
  "data": {
    "caseNumber": "CASE-2024-0001",
    "assignedTo": "Attorney Michael Davis",
    "assignmentHistory": [
      {
        "assignedTo": "Attorney Michael Davis",
        "assignedBy": "Manager Lisa Brown",
        "assignedAt": "2024-10-02T11:00:00.000Z",
        "reason": "Michael has expertise in personal injury cases"
      }
    ]
  }
}
```

---

### 4. Add a Note to the Case

**Endpoint:** `POST /api/cases/:id/notes`

```bash
curl -X POST http://localhost:3000/api/cases/657abc123def456/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Initial Client Meeting",
    "content": "Met with client John Smith. Discussed accident details, medical records, and compensation expectations. Client is cooperative and has strong evidence.",
    "noteType": "Meeting",
    "createdBy": "Attorney Michael Davis",
    "priority": "High",
    "visibility": "Team Only",
    "tags": ["client-meeting", "initial-consultation"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "note": {
      "_id": "657def789abc012...",
      "caseId": "657abc123def456...",
      "caseNumber": "CASE-2024-0001",
      "title": "Initial Client Meeting",
      "content": "Met with client John Smith...",
      "noteType": "Meeting",
      "createdBy": "Attorney Michael Davis",
      "createdAt": "2024-10-02T14:30:00.000Z"
    },
    "totalNotes": 1
  }
}
```

---

### 5. View Case Timeline

**Endpoint:** `GET /api/cases/:id/timeline`

```bash
curl http://localhost:3000/api/cases/657abc123def456/timeline
```

**Response:**
```json
{
  "success": true,
  "data": {
    "caseNumber": "CASE-2024-0001",
    "caseTitle": "Smith v. Johnson Personal Injury Case",
    "openedDate": "2024-10-02T10:30:00.000Z",
    "timeline": {
      "allEvents": [
        {
          "title": "Case Created",
          "eventType": "Case Created",
          "eventDate": "2024-10-02T10:30:00.000Z"
        },
        {
          "title": "Case Assigned",
          "eventType": "Assignment",
          "eventDate": "2024-10-02T11:00:00.000Z"
        },
        {
          "title": "Court Hearing Scheduled",
          "eventType": "Court Hearing",
          "eventDate": "2024-11-15T09:00:00.000Z",
          "isDeadline": true,
          "deadlineStatus": "Upcoming"
        }
      ],
      "upcomingDeadlines": [...],
      "overdueDeadlines": []
    },
    "statistics": {
      "totalEvents": 3,
      "totalDeadlines": 1,
      "upcomingDeadlines": 1,
      "overdueDeadlines": 0
    }
  }
}
```

---

### 6. Update Case Categorization

**Endpoint:** `PUT /api/cases/:id/categorize`

```bash
curl -X PUT http://localhost:3000/api/cases/657abc123def456/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "practiceArea": "Motor Vehicle Accidents",
    "priority": "Critical",
    "tags": ["car-accident", "personal-injury", "settlement-potential", "high-value"],
    "updatedBy": "Attorney Michael Davis"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Case categorization updated successfully",
  "data": {
    "caseNumber": "CASE-2024-0001",
    "practiceArea": "Motor Vehicle Accidents",
    "priority": "Critical",
    "tags": ["car-accident", "personal-injury", "settlement-potential", "high-value"]
  }
}
```

---

### 7. Close a Case

**Endpoint:** `POST /api/cases/:id/close`

```bash
curl -X POST http://localhost:3000/api/cases/657abc123def456/close \
  -H "Content-Type: application/json" \
  -d '{
    "closedBy": "Attorney Michael Davis",
    "outcome": "Settlement Reached",
    "resolution": "Successfully negotiated $125,000 settlement for client. All medical bills covered plus pain and suffering compensation. Client satisfied with outcome.",
    "archiveImmediately": false
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Case closed successfully",
  "data": {
    "caseNumber": "CASE-2024-0001",
    "status": "Closed",
    "closedDate": "2024-12-15T16:30:00.000Z",
    "outcome": "Settlement Reached",
    "archived": false,
    "duration": 74
  }
}
```

---

### 8. Get Analytics Dashboard

**Endpoint:** `GET /api/cases/analytics`

```bash
curl http://localhost:3000/api/cases/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCases": 156,
      "openCases": 42,
      "inProgressCases": 67,
      "closedCases": 47,
      "avgDuration": 45.3,
      "recentActivity": {
        "newCasesLast30Days": 12,
        "closedCasesLast30Days": 8
      }
    },
    "breakdown": {
      "byStatus": [
        { "_id": "Open", "count": 42 },
        { "_id": "In Progress", "count": 67 },
        { "_id": "Closed", "count": 47 }
      ],
      "byPriority": [
        { "_id": "Critical", "count": 15 },
        { "_id": "High", "count": 38 },
        { "_id": "Medium", "count": 72 },
        { "_id": "Low", "count": 31 }
      ],
      "byMatterType": [
        { "_id": "Civil", "count": 89 },
        { "_id": "Criminal", "count": 34 },
        { "_id": "Corporate", "count": 33 }
      ]
    },
    "performance": {
      "topAssignees": [
        {
          "_id": "Attorney Michael Davis",
          "caseCount": 23,
          "openCases": 15
        },
        {
          "_id": "Attorney Sarah Johnson",
          "caseCount": 19,
          "openCases": 12
        }
      ],
      "averageCaseDuration": 45.3
    },
    "generatedAt": "2024-10-02T17:00:00.000Z"
  }
}
```

---

### 9. List All Cases with Pagination

**Endpoint:** `GET /api/cases?page=1&limit=10`

```bash
# Basic listing
curl http://localhost:3000/api/cases

# With filters
curl "http://localhost:3000/api/cases?status=Open&priority=High&page=1&limit=20"

# With search
curl "http://localhost:3000/api/cases?search=Smith&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cases": [
      {
        "caseNumber": "CASE-2024-0001",
        "title": "Smith v. Johnson Personal Injury Case",
        "clientName": "John Smith",
        "status": "Open",
        "priority": "High",
        "assignedTo": "Attorney Michael Davis",
        "openedDate": "2024-10-02T10:30:00.000Z"
      },
      // ... more cases
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCases": 42,
      "casesPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 10. Reopen a Closed Case

**Endpoint:** `POST /api/cases/:id/reopen`

```bash
curl -X POST http://localhost:3000/api/cases/657abc123def456/reopen \
  -H "Content-Type: application/json" \
  -d '{
    "reopenedBy": "Attorney Michael Davis",
    "reason": "New evidence discovered that may affect settlement terms"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Case reopened successfully",
  "data": {
    "caseNumber": "CASE-2024-0001",
    "status": "Open"
  }
}
```

---

## 🔍 Advanced Filtering

### Filter by Multiple Criteria

```bash
curl "http://localhost:3000/api/cases?status=Open&priority=High&matterType=Civil&assignedTo=Attorney%20Michael%20Davis"
```

### Search Cases

```bash
# Search in case number, title, or client name
curl "http://localhost:3000/api/cases?search=Smith"
```

### Pagination

```bash
# Get page 2 with 25 results per page
curl "http://localhost:3000/api/cases?page=2&limit=25"
```

---

## 🔐 Input Validation

All endpoints validate input data. Invalid requests will return:

```json
{
  "success": false,
  "message": "Error creating case",
  "error": "\"title\" length must be at least 3 characters long"
}
```

### Common Validation Rules:

- **Title**: 3-200 characters
- **Client Name**: 2-100 characters
- **Matter Type**: Must be from predefined list (Civil, Criminal, Corporate, etc.)
- **Priority**: Low, Medium, High, or Critical
- **Status**: Open, In Progress, On Hold, Pending Review, Closed, Archived
- **Note Content**: 1-10,000 characters

---

## 🚨 Error Handling

### Common HTTP Status Codes:

- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation error, invalid data)
- **404**: Resource not found
- **500**: Server error

### Example Error Response:

```json
{
  "success": false,
  "message": "Case not found"
}
```

---

## 💡 Best Practices

### 1. Always Provide Context

When assigning cases or adding notes, provide meaningful reasons/content:

```json
{
  "assignedTo": "Attorney Smith",
  "assignedBy": "Manager Jones",
  "reason": "Attorney Smith has 5 years experience in similar cases and is available"
}
```

### 2. Use Tags Effectively

Tags help with organization and filtering:

```json
{
  "tags": ["urgent", "high-value", "settlement-potential", "court-hearing-scheduled"]
}
```

### 3. Set Realistic Priorities

Use priorities strategically:
- **Critical**: Imminent deadlines, court appearances
- **High**: Important cases requiring immediate attention
- **Medium**: Standard cases
- **Low**: Routine matters

### 4. Keep Notes Detailed

Good notes help team collaboration:

```json
{
  "title": "Client Phone Call - Evidence Discussion",
  "content": "Spoke with client about obtaining additional medical records. Client will contact Dr. Anderson's office tomorrow to request MRI results from August 2024. Follow up on Friday to confirm receipt.",
  "noteType": "Phone Call",
  "tags": ["follow-up-needed", "medical-records"]
}
```

### 5. Track Deadlines in Timeline

Add important dates as timeline events with deadlines:

```bash
curl -X POST http://localhost:3000/api/cases/657abc123def456/timeline \
  -d '{
    "title": "Discovery Deadline",
    "eventType": "Deadline",
    "eventDate": "2024-11-30T17:00:00Z",
    "isDeadline": true,
    "priority": "Critical",
    "notes": "All discovery materials must be filed by 5 PM"
  }'
```

---

## 📱 Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function createCase(caseData) {
  try {
    const response = await axios.post('http://localhost:3000/api/cases/create', caseData);
    console.log('Case created:', response.data.data.caseNumber);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Usage
createCase({
  title: 'New Case',
  clientName: 'John Doe',
  matterType: 'Civil',
  practiceArea: 'Contract Law',
  createdBy: 'Attorney Smith'
});
```

### Python

```python
import requests

def create_case(case_data):
    url = 'http://localhost:3000/api/cases/create'
    response = requests.post(url, json=case_data)
    if response.status_code == 201:
        print('Case created:', response.json()['data']['caseNumber'])
        return response.json()
    else:
        print('Error:', response.json())

# Usage
create_case({
    'title': 'New Case',
    'clientName': 'John Doe',
    'matterType': 'Civil',
    'practiceArea': 'Contract Law',
    'createdBy': 'Attorney Smith'
})
```

---

## 📊 Monitoring and Analytics

### Track Case Performance

Regularly check analytics to monitor:
- Case volume trends
- Average case duration
- Workload distribution
- Case outcomes

```bash
# Get analytics daily/weekly
curl http://localhost:3000/api/cases/analytics > daily_analytics_$(date +%Y%m%d).json
```

### Monitor Deadlines

Check for upcoming deadlines:

```bash
# Get cases with upcoming deadlines
curl http://localhost:3000/api/cases/657abc123def456/timeline | \
  jq '.data.timeline.upcomingDeadlines'
```

---

## 🆘 Troubleshooting

### Database Connection Issues

If you see "Database not connected" messages:
1. Check MongoDB is running: `mongod --version`
2. Verify connection string in `.env`
3. Test connection: `mongo "your-connection-string"`

### Validation Errors

Read the error message carefully - it tells you exactly what's wrong:
```json
{
  "error": "\"matterType\" must be one of [Civil, Criminal, Corporate, Family, Immigration, Real Estate, Intellectual Property, Tax, Employment, Other]"
}
```

### Case Not Found Errors

Make sure you're using the correct case ID (MongoDB ObjectID format):
- Correct: `657abc123def456789012345`
- Incorrect: `CASE-2024-0001` (this is the case number, not ID)

---

## 📚 Additional Resources

- **API Reference**: See `API_REFERENCE.md` for complete endpoint documentation
- **Business Logic**: See `CASE_MANAGEMENT_BUSINESS_LOGIC.md` for detailed implementation
- **Architecture**: See `ARCHITECTURE.md` for system design details

---

## ✅ Quick Checklist for New Cases

- [ ] Create case with all required fields
- [ ] Assign to appropriate attorney
- [ ] Add initial case notes
- [ ] Set up important timeline deadlines
- [ ] Categorize and tag appropriately
- [ ] Monitor status regularly
- [ ] Update with new developments
- [ ] Close with detailed outcome when complete

---

**Need Help?** Contact your system administrator or refer to the comprehensive documentation in this repository.
