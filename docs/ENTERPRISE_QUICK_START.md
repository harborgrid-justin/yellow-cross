# Enterprise Capabilities - Quick Start Guide

Quick reference for developers using Yellow Cross enterprise features.

## 🚀 Quick Start

### 1. Environment Setup

Create `.env` file (or run `npm run setup:env:interactive`):

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/yellowcross
JWT_SECRET=your-secure-secret-key
```

### 2. Install & Run

```bash
npm install
npm run prisma:generate  # Generate Prisma client
npm start                # Start server
```

### 3. Check Health

```bash
curl http://localhost:3000/health
```

---

## 📝 Logging

### Import Logger

```javascript
const logger = require('./config/logger');
```

### Log Examples

```javascript
// Info logging
logger.info('User logged in', { userId: 123, email: 'user@example.com' });

// Error logging
logger.error('Database query failed', { error: err.message, query: 'SELECT * FROM users' });

// Debug logging (only in development)
logger.debug('Processing request', { requestId: req.correlationId });

// Warning logging
logger.warn('Rate limit approaching', { currentRequests: 95, limit: 100 });
```

### Specialized Logging

```javascript
// HTTP requests (automatic via middleware)
logger.logRequest(req, { userId: req.user?.id });

// Database operations
logger.logDatabase('INSERT', { table: 'users', duration: '45ms' });

// Security events
logger.logSecurity('Failed login attempt', { username, ip: req.ip });
```

---

## 🔥 Error Handling

### Import Error Handler

```javascript
const { ApiError, asyncHandler } = require('./middleware/errorHandler');
```

### Throw Errors

```javascript
// In route handlers
if (!user) {
  throw new ApiError(404, 'User not found');
}

if (!req.body.email) {
  throw new ApiError(400, 'Email is required');
}

if (!authorized) {
  throw new ApiError(403, 'Access denied');
}
```

### Wrap Async Routes

```javascript
// Old way (error prone)
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// New way (automatic error handling)
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
}));
```

---

## 🏥 Health Checks

### Endpoints

```bash
# Comprehensive health check
curl http://localhost:3000/health

# Liveness probe (Kubernetes)
curl http://localhost:3000/health/liveness

# Readiness probe (Kubernetes)
curl http://localhost:3000/health/readiness
```

### Use in Code

```javascript
const { isConnected } = require('./config/database');

// Check database before expensive operations
router.post('/export', asyncHandler(async (req, res) => {
  const dbHealthy = await isConnected();
  if (!dbHealthy) {
    throw new ApiError(503, 'Service temporarily unavailable');
  }
  // Perform export...
}));
```

---

## 🔍 Request Tracing

### Access Correlation ID

```javascript
// In any route handler
router.get('/users', (req, res) => {
  logger.info('Fetching users', {
    correlationId: req.correlationId  // Automatically added
  });
  
  // Use in logs, external API calls, etc.
});
```

### Send Custom Correlation ID

```bash
# Client can provide correlation ID
curl -H "X-Correlation-ID: my-custom-id" http://localhost:3000/api/users
```

### Track Across Services

```javascript
// Forward correlation ID to external services
await fetch('https://external-api.com/data', {
  headers: {
    'X-Correlation-ID': req.correlationId
  }
});
```

---

## ⚙️ Configuration

### Access Configuration

```javascript
const { getConfig } = require('./config/env');

const config = getConfig();

console.log(config.port);                    // 3000 (number)
console.log(config.security.bcryptRounds);   // 10 (number)
console.log(config.security.enableMfa);      // false (boolean)
```

### Configuration Values

```javascript
{
  nodeEnv: 'development',
  port: 3000,
  database: { url: 'postgresql://...' },
  jwt: { secret: '...', expiration: '24h' },
  security: {
    bcryptRounds: 10,
    sessionTimeout: 1800000,
    enableMfa: false,
    enableIpWhitelist: false
  },
  rateLimit: {
    windowMs: 900000,
    maxRequests: 100
  },
  upload: {
    maxFileSize: 52428800,
    uploadPath: './uploads'
  }
}
```

---

## 🗄️ Database

### Connect to Database

```javascript
const { connectDB, isConnected, getPrismaClient } = require('./config/database');

// In index.js (automatic)
await connectDB();

// Check connection
const connected = await isConnected();

// Get Prisma client
const prisma = getPrismaClient();
const users = await prisma.user.findMany();
```

---

## 🛡️ Best Practices

### 1. Always Include Correlation ID in Logs

```javascript
// ❌ BAD
logger.info('User created');

// ✅ GOOD
logger.info('User created', {
  userId: user.id,
  correlationId: req.correlationId
});
```

### 2. Use Structured Data

```javascript
// ❌ BAD
logger.info(`User ${userId} logged in from ${ip}`);

// ✅ GOOD
logger.info('User logged in', { userId, ip });
```

### 3. Use ApiError for Client Errors

```javascript
// ❌ BAD
res.status(400).json({ error: 'Invalid input' });

// ✅ GOOD
throw new ApiError(400, 'Invalid input');
```

### 4. Always Wrap Async Routes

```javascript
// ❌ BAD
router.get('/users', async (req, res) => {
  // Errors not caught!
});

// ✅ GOOD
router.get('/users', asyncHandler(async (req, res) => {
  // Errors automatically caught and logged
}));
```

### 5. Check Health Before Heavy Operations

```javascript
router.post('/bulk-export', asyncHandler(async (req, res) => {
  if (!await isConnected()) {
    throw new ApiError(503, 'Database unavailable');
  }
  // Proceed with operation
}));
```

---

## 🐛 Debugging

### View Logs in Development

Logs appear in console with colors and formatting.

### View Logs in Production

```bash
# All logs
tail -f logs/app.log

# Error logs only
tail -f logs/error.log

# Search by correlation ID
grep "550e8400-e29b-41d4-a716-446655440000" logs/app.log
```

### Debug Request Flow

1. Client makes request
2. Correlation ID added
3. Request logged with correlation ID
4. Route handler executes
5. Logs include correlation ID
6. Response sent with correlation ID header
7. Client receives correlation ID for tracking

---

## 📊 Monitoring Checklist

- ✅ All requests logged with timing
- ✅ All errors logged with context
- ✅ Health checks every 10 seconds
- ✅ Database connection monitored
- ✅ Memory usage tracked
- ✅ Correlation IDs in all logs
- ✅ Graceful shutdown implemented

---

## 🚨 Common Issues

### "Environment variable not found: DATABASE_URL"

**Solution**: Add DATABASE_URL to .env file or run without Prisma (app continues)

### "Winston is not defined"

**Solution**: Import logger: `const logger = require('./config/logger');`

### Tests failing with Prisma errors

**Solution**: Run `npm run prisma:generate` first

### Health check shows "degraded"

**Normal**: System works without database connection (graceful degradation)

---

## 📚 More Documentation

- **Full Guide**: See [ENTERPRISE_CAPABILITIES.md](./ENTERPRISE_CAPABILITIES.md)
- **API Reference**: See [API_REFERENCE.md](./api/API_REFERENCE.md)
- **Architecture**: See [ENTERPRISE_ARCHITECTURE.md](./architecture/ENTERPRISE_ARCHITECTURE.md)

---

## 🆘 Need Help?

### Check Health First

```bash
curl http://localhost:3000/health
```

### View Recent Errors

```bash
tail -n 50 logs/error.log
```

### Track Specific Request

```bash
# Use correlation ID from error
grep "correlation-id-here" logs/app.log
```

---

**Version**: 2.0.0  
**Last Updated**: 2024
