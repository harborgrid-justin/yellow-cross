# API Request/Response Examples

Complete examples for all major API endpoints with curl commands and code samples.

## Table of Contents
- [Authentication](#authentication)
- [Case Management](#case-management)
- [Client CRM](#client-crm)
- [Document Management](#document-management)
- [Standard Response Format](#standard-response-format)

---

## Standard Response Format

All API responses follow this standardized format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "metadata": {
    "timestamp": "2025-10-23T07:21:10.871Z",
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { /* error details */ }
  },
  "metadata": {
    "timestamp": "2025-10-23T07:21:10.871Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Authentication

### Register New User

**Endpoint**: `POST /api/auth/register`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd123",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Attorney",
  "department": "Corporate Law",
  "phoneNumber": "+1-555-0123",
  "roles": ["Attorney"]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "SecureP@ssw0rd123",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["Attorney"]
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["Attorney"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecureP@ssw0rd123"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecureP@ssw0rd123"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "email": "john.doe@example.com",
      "roles": ["Attorney"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Case Management

### Create New Case

**Endpoint**: `POST /api/cases/create`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "caseTitle": "Smith vs. Jones Corporation",
  "caseType": "Civil Litigation",
  "clientId": "client-123",
  "clientName": "John Smith",
  "description": "Product liability case involving defective equipment",
  "priority": "High",
  "assignedTo": "attorney-456",
  "practiceArea": "Product Liability",
  "jurisdiction": "California",
  "createdBy": "user-789"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/cases/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "caseTitle": "Smith vs. Jones Corporation",
    "caseType": "Civil Litigation",
    "clientId": "client-123",
    "clientName": "John Smith",
    "priority": "High",
    "assignedTo": "attorney-456",
    "createdBy": "user-789"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Case created successfully",
  "data": {
    "case": {
      "id": "case-001",
      "caseNumber": "CASE-2025-0123",
      "caseTitle": "Smith vs. Jones Corporation",
      "caseType": "Civil Litigation",
      "status": "Open",
      "priority": "High",
      "openedDate": "2025-10-23T07:21:10.871Z",
      "assignedTo": "attorney-456"
    },
    "timeline": {
      "id": "timeline-001",
      "eventType": "Case Created",
      "eventDate": "2025-10-23T07:21:10.871Z"
    }
  }
}
```

---

### Get All Cases (with Pagination)

**Endpoint**: `GET /api/cases`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)
- `status` (optional): Filter by status (Open, In Progress, Closed)
- `priority` (optional): Filter by priority (High, Medium, Low)

**cURL Example**:
```bash
curl -X GET "http://localhost:3000/api/cases?page=1&limit=20&status=Open" \
  -H "Authorization: Bearer <access_token>"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Cases retrieved successfully",
  "data": [
    {
      "id": "case-001",
      "caseNumber": "CASE-2025-0123",
      "caseTitle": "Smith vs. Jones Corporation",
      "status": "Open",
      "priority": "High"
    },
    {
      "id": "case-002",
      "caseNumber": "CASE-2025-0124",
      "caseTitle": "Doe vs. ABC Company",
      "status": "Open",
      "priority": "Medium"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "timestamp": "2025-10-23T07:21:10.871Z"
  }
}
```

---

### Get Case by ID

**Endpoint**: `GET /api/cases/:id`

**cURL Example**:
```bash
curl -X GET http://localhost:3000/api/cases/case-001 \
  -H "Authorization: Bearer <access_token>"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Case retrieved successfully",
  "data": {
    "id": "case-001",
    "caseNumber": "CASE-2025-0123",
    "caseTitle": "Smith vs. Jones Corporation",
    "caseType": "Civil Litigation",
    "status": "Open",
    "priority": "High",
    "openedDate": "2025-10-23T07:21:10.871Z",
    "assignedTo": "attorney-456",
    "client": {
      "id": "client-123",
      "name": "John Smith"
    }
  }
}
```

---

### Update Case Status

**Endpoint**: `PUT /api/cases/:id/status`

**Request Body**:
```json
{
  "status": "In Progress",
  "updatedBy": "user-789"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:3000/api/cases/case-001/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "status": "In Progress",
    "updatedBy": "user-789"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Case status updated successfully",
  "data": {
    "case": {
      "id": "case-001",
      "caseNumber": "CASE-2025-0123",
      "status": "In Progress",
      "lastModifiedDate": "2025-10-23T08:30:00.000Z"
    }
  }
}
```

---

### Add Case Note

**Endpoint**: `POST /api/cases/:id/notes`

**Request Body**:
```json
{
  "content": "Client meeting scheduled for next week to discuss settlement options.",
  "noteType": "Client Communication",
  "createdBy": "user-789"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/cases/case-001/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "content": "Client meeting scheduled for next week",
    "noteType": "Client Communication",
    "createdBy": "user-789"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Case note added successfully",
  "data": {
    "note": {
      "id": "note-001",
      "caseId": "case-001",
      "content": "Client meeting scheduled for next week",
      "noteType": "Client Communication",
      "createdBy": "user-789",
      "createdDate": "2025-10-23T09:15:00.000Z"
    }
  }
}
```

---

## Client CRM

### Create New Client

**Endpoint**: `POST /api/clients`

**Request Body**:
```json
{
  "clientType": "Individual",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-0456",
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001"
  },
  "preferredContact": "Email",
  "createdBy": "user-789"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "clientType": "Individual",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-0456",
    "createdBy": "user-789"
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "client": {
      "id": "client-456",
      "clientNumber": "CLT-2025-0456",
      "clientType": "Individual",
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "status": "Active",
      "createdDate": "2025-10-23T10:00:00.000Z"
    }
  }
}
```

---

### Get All Clients

**Endpoint**: `GET /api/clients`

**cURL Example**:
```bash
curl -X GET "http://localhost:3000/api/clients?page=1&limit=20" \
  -H "Authorization: Bearer <access_token>"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": [
    {
      "id": "client-456",
      "clientNumber": "CLT-2025-0456",
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "status": "Active"
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## Document Management

### Upload Document

**Endpoint**: `POST /api/documents`

**Request Headers**:
```
Content-Type: multipart/form-data
Authorization: Bearer <access_token>
```

**Form Data**:
- `file`: The document file
- `caseId`: Associated case ID
- `documentType`: Type of document
- `description`: Document description
- `createdBy`: User ID

**cURL Example**:
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/document.pdf" \
  -F "caseId=case-001" \
  -F "documentType=Contract" \
  -F "description=Settlement agreement draft" \
  -F "createdBy=user-789"
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc-001",
      "fileName": "settlement-agreement.pdf",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "caseId": "case-001",
      "documentType": "Contract",
      "version": 1,
      "uploadedDate": "2025-10-23T11:00:00.000Z"
    }
  }
}
```

---

### Download Document

**Endpoint**: `GET /api/documents/:id/download`

**cURL Example**:
```bash
curl -X GET http://localhost:3000/api/documents/doc-001/download \
  -H "Authorization: Bearer <access_token>" \
  --output document.pdf
```

**Response**: Binary file download

---

## Error Examples

### 400 Bad Request - Validation Error

**Request**:
```bash
curl -X POST http://localhost:3000/api/cases/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "caseTitle": "",
    "priority": "Invalid"
  }'
```

**Response** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "caseTitle",
        "message": "Case title is required"
      },
      {
        "field": "priority",
        "message": "Priority must be one of: High, Medium, Low"
      }
    ]
  },
  "metadata": {
    "timestamp": "2025-10-23T12:00:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 401 Unauthorized - Missing Token

**Response** (401):
```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "No token provided"
  },
  "metadata": {
    "timestamp": "2025-10-23T12:00:00.000Z"
  }
}
```

---

### 404 Not Found

**Response** (404):
```json
{
  "success": false,
  "message": "Case with ID case-999 not found",
  "error": {
    "code": "NOT_FOUND"
  },
  "metadata": {
    "timestamp": "2025-10-23T12:00:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### 429 Rate Limit Exceeded

**Response** (429):
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_ERROR",
    "details": "Too many requests. Please try again in 15 minutes."
  },
  "metadata": {
    "timestamp": "2025-10-23T12:00:00.000Z",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## JavaScript/TypeScript Examples

### Using Axios

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const ACCESS_TOKEN = 'your-access-token';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`
  }
});

// Get all cases
async function getCases(page = 1, limit = 20) {
  try {
    const response = await api.get('/cases', {
      params: { page, limit, status: 'Open' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cases:', error.response?.data);
    throw error;
  }
}

// Create new case
async function createCase(caseData) {
  try {
    const response = await api.post('/cases/create', caseData);
    return response.data;
  } catch (error) {
    console.error('Error creating case:', error.response?.data);
    throw error;
  }
}
```

---

## Python Examples

### Using Requests Library

```python
import requests

API_BASE_URL = 'http://localhost:3000/api'
ACCESS_TOKEN = 'your-access-token'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {ACCESS_TOKEN}'
}

# Get all cases
def get_cases(page=1, limit=20):
    response = requests.get(
        f'{API_BASE_URL}/cases',
        headers=headers,
        params={'page': page, 'limit': limit, 'status': 'Open'}
    )
    return response.json()

# Create new case
def create_case(case_data):
    response = requests.post(
        f'{API_BASE_URL}/cases/create',
        headers=headers,
        json=case_data
    )
    return response.json()
```

---

**Last Updated**: 2025-10-23  
**API Version**: 1.0.0
