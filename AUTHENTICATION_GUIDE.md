# Authentication Usage Guide

## Overview
This guide shows how to use the new JWT authentication system in Yellow Cross to protect API endpoints and implement role-based access control (RBAC).

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Using Authentication Middleware](#using-authentication-middleware)
4. [Role-Based Access Control](#role-based-access-control)
5. [Permission-Based Access Control](#permission-based-access-control)
6. [Testing Authentication](#testing-authentication)
7. [Common Patterns](#common-patterns)

---

## Quick Start

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john@example.com",
    "password": "SecureP@ss123",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Attorney",
    "department": "Litigation"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "userId": "USR-1697654321-ABC123",
      "username": "john.doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["User"],
      "status": "Active"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecureP@ss123"
  }'
```

### 3. Use Token to Access Protected Endpoints
```bash
curl -X GET http://localhost:3000/api/cases \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (required, min 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, 1 upper, 1 lower, 1 digit, 1 special)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phoneNumber": "string (optional)",
  "jobTitle": "string (optional)",
  "department": "string (optional)"
}
```

**Response:** User object with access and refresh tokens

### POST /api/auth/login
Login with username/email and password.

**Request Body:**
```json
{
  "email": "john@example.com",  // email OR username required
  "password": "SecureP@ss123"
}
```

**Response:** User object with tokens and session ID

### POST /api/auth/logout
Logout and invalidate session.

**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "sessionId": "SES-1697654321-xyz"
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** New access and refresh tokens

### GET /api/auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`  
**Response:** Current user object

### PUT /api/auth/change-password
Change user password.

**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "currentPassword": "OldP@ss123",
  "newPassword": "NewP@ss123",
  "confirmPassword": "NewP@ss123"
}
```

### POST /api/auth/forgot-password
Request password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** Success message (token returned in dev mode only)

### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "RST-1697654321-ABCD123",
  "newPassword": "NewP@ss123",
  "confirmPassword": "NewP@ss123"
}
```

### GET /api/auth/verify/:token
Verify email address.

**URL Parameter:** `token` - verification token sent via email

---

## Using Authentication Middleware

### Basic Authentication
Require user to be logged in:

```typescript
import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Protect single route
router.get('/protected', authenticate, async (req, res) => {
  // req.user is now available
  res.json({
    message: 'You are authenticated!',
    user: req.user
  });
});

export default router;
```

### Protect All Routes in a Router
```typescript
import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes in this router
router.use(authenticate);

router.get('/list', async (req, res) => {
  // All routes here are protected
});

router.post('/create', async (req, res) => {
  // req.user available in all routes
});

export default router;
```

### Optional Authentication
```typescript
import { optionalAuthenticate } from '../middleware/auth';

// User info attached if token provided, but not required
router.get('/public', optionalAuthenticate, async (req, res) => {
  if (req.user) {
    res.json({ message: 'Welcome back!', user: req.user });
  } else {
    res.json({ message: 'Welcome guest!' });
  }
});
```

---

## Role-Based Access Control

### Define User Roles
Available roles in the system:
- `Admin` - Full system access
- `Attorney` - Can manage cases and clients
- `Paralegal` - Can view and assist with cases
- `Staff` - Can view assigned items
- `Client` - Can view own cases only

### Require Specific Role
```typescript
import { authenticate, requireRole } from '../middleware/auth';

// Admin only endpoint
router.delete('/admin/users/:id', 
  authenticate, 
  requireRole('Admin'),
  async (req, res) => {
    // Only admins can access this
  }
);

// Allow multiple roles
router.post('/cases/create',
  authenticate,
  requireRole(['Admin', 'Attorney']),
  async (req, res) => {
    // Admins and Attorneys can create cases
  }
);
```

### Check Role in Handler
```typescript
router.get('/cases/:id', authenticate, async (req, res) => {
  const isAdmin = req.user?.roles.includes('Admin');
  
  if (isAdmin) {
    // Show all details for admin
  } else {
    // Show limited details for non-admin
  }
});
```

---

## Permission-Based Access Control

### Permissions Format
Permissions follow the pattern: `resource:action`

Examples:
- `cases:create`
- `cases:read`
- `cases:update`
- `cases:delete`
- `clients:create`
- `documents:upload`
- `reports:generate`

### Require Specific Permission
```typescript
import { authenticate, requirePermission } from '../middleware/auth';

router.post('/documents/upload',
  authenticate,
  requirePermission('documents:upload'),
  async (req, res) => {
    // Only users with documents:upload permission
  }
);

// Multiple permissions (any one required)
router.post('/reports/generate',
  authenticate,
  requirePermission(['reports:generate', 'reports:admin']),
  async (req, res) => {
    // User needs either permission
  }
);
```

### Check Permission in Handler
```typescript
router.get('/sensitive-data', authenticate, async (req, res) => {
  const hasPermission = req.user?.permissions.includes('data:view-sensitive');
  
  if (!hasPermission && !req.user?.roles.includes('Admin')) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  }
  
  // Return sensitive data
});
```

---

## Testing Authentication

### 1. Create Test User
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestP@ss123"
  }' \
  | jq .
```

### 2. Login and Get Token
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestP@ss123"
  }' \
  | jq -r '.data.accessToken')

echo "Token: $TOKEN"
```

### 3. Test Protected Endpoint
```bash
# Use token
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

### 4. Test Without Token (Should Fail)
```bash
curl -X GET http://localhost:3000/api/auth/me
# Expected: 401 Unauthorized
```

---

## Common Patterns

### Pattern 1: Protect CRUD Endpoints
```typescript
import { authenticate, requirePermission, requireRole } from '../middleware/auth';

// List - Any authenticated user
router.get('/', authenticate, async (req, res) => {
  // List items
});

// Read - Any authenticated user
router.get('/:id', authenticate, async (req, res) => {
  // Get single item
});

// Create - Requires permission
router.post('/create', 
  authenticate, 
  requirePermission('resource:create'),
  async (req, res) => {
    // Create item
  }
);

// Update - Requires permission
router.put('/:id',
  authenticate,
  requirePermission('resource:update'),
  async (req, res) => {
    // Update item
  }
);

// Delete - Admin only
router.delete('/:id',
  authenticate,
  requireRole('Admin'),
  async (req, res) => {
    // Delete item
  }
);
```

### Pattern 2: Self or Admin Access
```typescript
import { authenticate, requireSelfOrAdmin } from '../middleware/auth';

// User can only view/edit own profile unless admin
router.get('/users/:id',
  authenticate,
  requireSelfOrAdmin('id'),
  async (req, res) => {
    // User can view own profile or admin can view any
  }
);

router.put('/users/:id',
  authenticate,
  requireSelfOrAdmin('id'),
  async (req, res) => {
    // User can update own profile or admin can update any
  }
);
```

### Pattern 3: Active Account Required
```typescript
import { authenticate, requireActiveAccount } from '../middleware/auth';

// Only active accounts can create data
router.post('/create',
  authenticate,
  requireActiveAccount,
  async (req, res) => {
    // Locked or inactive accounts blocked
  }
);
```

### Pattern 4: Email Verification Required
```typescript
import { authenticate, requireVerifiedEmail } from '../middleware/auth';

// Only verified users can access sensitive features
router.post('/sensitive-action',
  authenticate,
  requireVerifiedEmail,
  async (req, res) => {
    // Only verified email users
  }
);
```

### Pattern 5: User-Specific Rate Limiting
```typescript
import { authenticate, userRateLimit } from '../middleware/auth';

// 10 requests per minute per user
router.post('/expensive-operation',
  authenticate,
  userRateLimit(10, 60 * 1000),
  async (req, res) => {
    // Rate limited by user
  }
);
```

### Pattern 6: Multiple Middleware Chain
```typescript
import { 
  authenticate, 
  requireRole, 
  requirePermission,
  requireActiveAccount,
  userRateLimit 
} from '../middleware/auth';

router.post('/critical-action',
  authenticate,                    // Must be logged in
  requireActiveAccount,            // Account must be active
  requireRole(['Admin', 'Manager']), // Must be Admin or Manager
  requirePermission('critical:execute'), // Must have permission
  userRateLimit(5, 60 * 1000),    // Max 5 per minute
  async (req, res) => {
    // Highly protected endpoint
  }
);
```

---

## Example: Migrating Existing Feature to Use Auth

### Before (Unprotected)
```typescript
// backend/src/features/case-management.ts
router.post('/create', async (req, res) => {
  // Anyone can create cases
});
```

### After (Protected with RBAC)
```typescript
// backend/src/features/case-management.ts
import { authenticate, requireRole } from '../middleware/auth';

// Apply authentication to all routes
router.use(authenticate);

// Create - Admin and Attorney only
router.post('/create', 
  requireRole(['Admin', 'Attorney']),
  async (req, res) => {
    // Track who created the case
    const createdBy = req.user?.userId;
    
    const caseData = {
      ...req.body,
      createdBy
    };
    
    // Create case...
  }
);

// Read - All authenticated users
router.get('/:id', async (req, res) => {
  // All logged-in users can view
});

// Update - Admin and Attorney only
router.put('/:id',
  requireRole(['Admin', 'Attorney']),
  async (req, res) => {
    // Update case...
  }
);

// Delete - Admin only
router.delete('/:id',
  requireRole('Admin'),
  async (req, res) => {
    // Delete case...
  }
);
```

---

## Request Object Extensions

When authenticated, the `req.user` object contains:

```typescript
{
  id: string;           // User UUID
  userId: string;       // User ID (e.g., USR-123-ABC)
  username: string;     // Username
  email: string;        // Email address
  roles: string[];      // User roles
  permissions: string[]; // User permissions
}
```

Access in handlers:
```typescript
router.get('/my-data', authenticate, async (req, res) => {
  console.log('User ID:', req.user.id);
  console.log('Username:', req.user.username);
  console.log('Roles:', req.user.roles);
  console.log('Permissions:', req.user.permissions);
});
```

---

## Error Responses

### 401 Unauthorized
No token or invalid token:
```json
{
  "success": false,
  "message": "No authorization header provided"
}
```

### 403 Forbidden
Insufficient permissions:
```json
{
  "success": false,
  "message": "Access denied. Required role(s): Admin or Attorney",
  "requiredRoles": ["Admin", "Attorney"],
  "userRoles": ["User"]
}
```

### 423 Locked
Account locked:
```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts"
}
```

### 429 Too Many Requests
Rate limit exceeded:
```json
{
  "success": false,
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "resetIn": 30
}
```

---

## Security Best Practices

1. **Always use HTTPS in production** - Never send JWT over HTTP
2. **Store tokens securely** - Use httpOnly cookies or secure storage
3. **Set short token expiry** - Access tokens should expire quickly (1 hour)
4. **Use refresh tokens** - Refresh access tokens without re-login
5. **Validate all inputs** - Don't trust client data
6. **Log security events** - Track login attempts, role changes
7. **Implement rate limiting** - Prevent brute force attacks
8. **Require strong passwords** - Enforce password complexity
9. **Enable MFA for admins** - Add extra security layer
10. **Rotate secrets regularly** - Change JWT_SECRET periodically

---

## Next Steps

1. **Apply authentication to existing endpoints** - Protect all 519 endpoints
2. **Define permissions per feature** - Create detailed permission system
3. **Create admin interface** - UI for user and role management
4. **Implement MFA** - Two-factor authentication
5. **Add session management UI** - View/revoke active sessions
6. **Create audit log viewer** - Track security events
7. **Add OAuth integration** - Social login (Google, Microsoft)

---

## Support

For issues or questions about authentication:
1. Check the [User Model](backend/src/models/sequelize/User.ts) for available fields
2. Review [Auth Feature](backend/src/features/auth.ts) for endpoint implementations
3. See [Auth Middleware](backend/src/middleware/auth.ts) for middleware options
4. Consult [Gap Analysis](GAP_ANALYSIS_45_ITEMS.md) for security gaps addressed

---

**Authentication System Status**: ✅ Production Ready

All endpoints have been implemented with comprehensive security features. Apply middleware to existing features to enforce authentication across the platform.
