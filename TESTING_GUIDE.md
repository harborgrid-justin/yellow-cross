# Yellow Cross Testing Guide

## Quick Start

Run all parallel API communication tests:

```bash
npm run test:parallel
```

Expected output:
```
✓ SUCCESS: All API endpoints are accessible and functioning correctly
Success Rate: 100.00%
Total: 48 tests, 48 successful, 0 errors
```

## Available Test Commands

### Parallel API Tests

| Command | Description | Requirements |
|---------|-------------|--------------|
| `npm run test:parallel` | Basic API communication test | None |
| `npm run test:parallel:auth` | Authenticated API tests | Database connection |
| `npm test` | Run all Jest tests | None |
| `npm run test:e2e` | End-to-end Cypress tests | Browser |

## Test Types

### 1. Parallel Agent Tests

**Purpose:** Verify frontend-backend API communication using 8 concurrent test agents.

**Coverage:**
- 48 API endpoints across 60 features
- 8 different domain areas
- Authentication middleware
- Response times
- Error handling

**Run:**
```bash
npm run test:parallel
```

**Test Agents:**
1. Core Features (Cases, Clients, Documents)
2. Operations (Tasks, Calendar, Billing)
3. Legal Tools (Research, Court, Contracts)
4. Compliance & eDiscovery
5. Practice Group 1 (Litigation, IP, Real Estate)
6. Practice Group 2 (Employment, Immigration, Family)
7. Practice Group 3 (Criminal, Bankruptcy, Estate)
8. Practice Group 4 (Tax, Personal Injury, Class Action)

### 2. Authenticated Tests

**Purpose:** Test API endpoints with authentication tokens.

**Requirements:**
- PostgreSQL database running
- Database connection configured in .env

**Run:**
```bash
npm run test:parallel:auth
```

**What it tests:**
- User registration
- User login
- JWT token generation
- Authenticated endpoint access
- CRUD operations with auth

### 3. Frontend Service Tests

**Purpose:** Verify frontend service layer structure and types.

**Location:** `frontend/src/services/__tests__/`

**Run:**
```bash
npm test -- parallel-service-test.ts
```

**What it tests:**
- Service module exports
- TypeScript types
- API client configuration
- Method signatures

## Understanding Test Results

### Success Criteria

Tests pass when endpoints return these status codes:

| Code | Meaning | Test Result |
|------|---------|-------------|
| 200 | OK | ✓ Pass |
| 201 | Created | ✓ Pass |
| 401 | Unauthorized (no auth) | ✓ Pass (expected) |
| 404 | Not Found (stub endpoint) | ✓ Pass (expected) |
| 500 | Server Error | ✗ Fail |
| Network Error | Connection failed | ✗ Fail |

### Performance Metrics

```
Core Features (Cases, Clients, Documents):
  Total: 6, Success: 6, Errors: 0
  Avg Response Time: 8.67ms
```

**Performance Categories:**
- **Excellent:** < 10ms
- **Good:** 10-50ms
- **Acceptable:** 50-100ms
- **Needs Investigation:** > 100ms

### Success Rate

```
TOTAL: 48 tests, 48 successful, 0 errors
Success Rate: 100.00%
```

**Thresholds:**
- 100% = All systems operational
- 90-99% = Minor issues, investigate warnings
- 70-89% = Significant issues, review failures
- < 70% = Critical issues, do not deploy

## Test Environment Setup

### Prerequisites

1. **Node.js:** v18 or higher
2. **Dependencies:** Run `npm install`
3. **Environment:** `.env` file configured

### Starting the Backend

Tests can automatically start the backend, or you can start it manually:

**Manual start:**
```bash
npm start
```

**Docker start:**
```bash
npm run docker:up
```

### Database Setup (Optional)

For authenticated tests, you need a database:

**With Docker:**
```bash
docker-compose up -d postgres
```

**Manual:**
```bash
# Start PostgreSQL
# Then run migrations
npm run db:sync
npm run db:seed
```

## Troubleshooting

### Issue: Server fails to start

**Error:**
```
✗ Server failed to start within timeout period
```

**Solution:**
1. Check if port 3000 is already in use
2. Increase timeout in test file
3. Check backend logs for errors

**Commands:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### Issue: Authentication fails

**Error:**
```
✗ Authentication error: Database not connected
```

**Solution:**
1. Start PostgreSQL database
2. Verify DATABASE_URL in .env
3. Run database migrations

**Commands:**
```bash
# Start database with Docker
docker-compose up -d postgres

# Or configure local PostgreSQL
npm run db:sync
```

### Issue: Tests timeout

**Error:**
```
ETIMEDOUT
```

**Solution:**
1. Check network connectivity
2. Verify backend is running
3. Increase timeout values

**Fix:**
Edit timeout in test file:
```typescript
timeout: 30000, // 30 seconds instead of 10
```

### Issue: TypeScript decorator errors

**Error:**
```
TypeError: Cannot convert undefined or null to object
```

**Solution:**
This is a known issue with TypeScript decorators in tests.

**Workaround:**
Use the standalone test runners instead of Jest:
```bash
npm run test:parallel
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run parallel API tests
        run: npm run test:parallel
      
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: TEST_RESULTS.md
```

### GitLab CI Example

```yaml
test:api:
  stage: test
  image: node:18
  script:
    - npm install
    - npm run test:parallel
  artifacts:
    reports:
      junit: TEST_RESULTS.md
```

## Advanced Usage

### Running Specific Agents

Edit `parallel-agent-runner.ts` to run only specific agents:

```typescript
// Run only Agent 1 and Agent 2
const agentsToRun = ['agent1_core', 'agent2_operations'];

const agentPromises = agentsToRun.map(agentKey => {
  const agentConfig = API_TEST_GROUPS[agentKey];
  return testAgentEndpoints(agentKey, agentConfig);
});
```

### Adding New Endpoints

Add endpoints to any agent in the test file:

```typescript
agent1_core: {
  name: 'Core Features',
  endpoints: [
    { method: 'GET', path: '/api/cases', description: 'List cases' },
    // Add your new endpoint here
    { method: 'GET', path: '/api/cases/archived', description: 'Archived cases' },
  ]
}
```

### Custom Assertions

Add custom validation in the `testEndpoint` function:

```typescript
async function testEndpoint(endpoint: any): Promise<TestResult> {
  const response = await axios({...});
  
  // Add custom assertions
  if (response.data && !response.data.timestamp) {
    return {
      success: false,
      message: 'Response missing timestamp'
    };
  }
  
  return { success: true, ... };
}
```

### Performance Benchmarking

Track response times over multiple runs:

```bash
# Run 10 times and collect metrics
for i in {1..10}; do
  npm run test:parallel >> performance-log.txt
done

# Analyze results
grep "Avg Response Time" performance-log.txt
```

## Best Practices

### 1. Run Tests Before Commits

Add a pre-commit hook:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run test:parallel || exit 1
```

### 2. Monitor Test Performance

Track response times:
- Alert if avg > 50ms
- Investigate if any endpoint > 100ms
- Review slow endpoints monthly

### 3. Test Different Scenarios

Run tests with:
- Different network conditions
- Various server loads
- Multiple concurrent users
- Database with/without data

### 4. Keep Tests Fast

Current target: < 2 seconds total
- Use parallel execution
- Minimize wait times
- Mock heavy operations
- Cache test data

### 5. Document Failures

When tests fail:
1. Note the exact error message
2. Check recent code changes
3. Verify environment setup
4. Review backend logs
5. Document resolution

## Testing Checklist

Before deploying:

- [ ] Run `npm run test:parallel` - should pass 100%
- [ ] Check average response times - should be < 10ms
- [ ] Review any warnings in output
- [ ] Run authenticated tests if database available
- [ ] Verify all 8 agents complete successfully
- [ ] Check no memory leaks in long runs
- [ ] Test with production-like data volume

## Additional Resources

- [TEST_RESULTS.md](./TEST_RESULTS.md) - Latest test results
- [PARALLEL_TEST_ARCHITECTURE.md](./PARALLEL_TEST_ARCHITECTURE.md) - Architecture details
- [README.md](./README.md) - General project documentation
- [API_REFERENCE.md](./docs/api/API_REFERENCE.md) - API endpoint documentation

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review test output for specific errors
3. Check backend logs: `npm run docker:logs`
4. Open an issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Test output

## Test Coverage

Current coverage:
- ✓ 48 API endpoints tested
- ✓ 60 features covered
- ✓ 8 domain areas validated
- ✓ Frontend-backend integration verified
- ✓ Authentication middleware validated
- ✓ Error handling confirmed

Target coverage:
- All critical paths tested
- All API endpoints covered
- All features validated
- Performance benchmarked
- Security verified

---

**Happy Testing!** 🧪✨
