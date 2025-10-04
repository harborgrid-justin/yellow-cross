# Migration Notes: MongoDB/Mongoose → PostgreSQL/Prisma

## Overview
This document tracks the migration from MongoDB/Mongoose to PostgreSQL/Prisma ORM.

## Completed ✅
1. **Project Restructure**
   - Created separate `backend/` and `frontend/` folders
   - Moved all backend code to `backend/src/`
   - Moved all frontend code to `frontend/`

2. **Database Migration**
   - Installed Prisma and @prisma/client
   - Created comprehensive Prisma schema with all models:
     - Case, CaseNote, CaseTimelineEvent
     - Document, DocumentVersion, DocumentReview
     - Task, TaskComment, TaskTemplate, Workflow
     - Evidence, PrivilegeLog, Production, LegalHold
   - Updated database configuration to use Prisma instead of Mongoose

3. **Docker Setup**
   - Created `Dockerfile` with multi-stage build
   - Created `docker-compose.yml` with PostgreSQL and backend services
   - Added `.dockerignore` for optimized builds

4. **Easy Setup Commands**
   - `npm run setup` - Complete platform setup
   - `npm run docker:setup` - Docker-based setup
   - `npm run prisma:generate` - Generate Prisma client
   - `npm run prisma:migrate` - Run database migrations
   - `npm run prisma:studio` - Open database GUI
   - Interactive environment setup script

5. **Documentation**
   - Updated README.md with comprehensive setup instructions
   - Added Docker deployment instructions
   - Added troubleshooting guide
   - Updated environment variables for PostgreSQL

## Pending ⏳

### Tests Need Migration
The existing tests were written for Mongoose models and need to be rewritten for Prisma:

**Files that need test updates:**
- `backend/tests/case-management.test.js` (19 tests)
- `backend/tests/client-crm.test.js` (15 tests)
- `backend/tests/document-management.test.js` (18 tests)
- `backend/tests/ediscovery.test.js` (20 tests)
- `backend/tests/task-workflow.test.js` (6 tests)

**Changes needed:**
1. Replace Mongoose model imports with Prisma client
2. Update data creation to use Prisma syntax
3. Replace MongoDB-specific queries with Prisma queries
4. Update mock data to match PostgreSQL/Prisma requirements
5. Handle UUID vs ObjectId differences

### Feature Code Migration
The feature modules currently still reference Mongoose models. These need to be updated to use Prisma:

**Files to update:**
- `backend/src/features/case-management.js` - Update to use Prisma Case model
- `backend/src/features/document-management.js` - Update to use Prisma Document model
- `backend/src/features/task-workflow.js` - Update to use Prisma Task model
- `backend/src/features/ediscovery.js` - Update to use Prisma Evidence models
- Other feature files as needed

**Changes needed:**
1. Import Prisma client instead of Mongoose models
2. Replace Mongoose query methods with Prisma equivalents:
   - `Model.find()` → `prisma.model.findMany()`
   - `Model.findById()` → `prisma.model.findUnique()`
   - `Model.create()` → `prisma.model.create()`
   - `Model.findByIdAndUpdate()` → `prisma.model.update()`
   - `Model.findByIdAndDelete()` → `prisma.model.delete()`
3. Update validators to work with Prisma data types
4. Handle UUID vs ObjectId in API responses

## Migration Strategy

### For Immediate Use:
1. **Start with Docker**: Use `npm run docker:setup` to get PostgreSQL running
2. **Run migrations**: Execute `npm run prisma:migrate` to create database schema
3. **Verify setup**: Use `npm run prisma:studio` to browse the database
4. **Test server**: Run `npm start` to verify the server works

### For Full Migration:
1. Choose one feature module (e.g., case-management)
2. Update the feature code to use Prisma
3. Update the corresponding tests
4. Verify the feature works end-to-end
5. Repeat for other features

## Example Prisma Usage

### Create
```javascript
const { prisma } = require('./config/database');

// Create a case
const case = await prisma.case.create({
  data: {
    caseNumber: 'CASE-2024-001',
    title: 'Client vs. Defendant',
    clientName: 'John Doe',
    matterType: 'Civil',
    practiceArea: 'Personal Injury',
    status: 'Open',
    createdBy: 'attorney@example.com'
  }
});
```

### Read
```javascript
// Find all open cases
const cases = await prisma.case.findMany({
  where: { status: 'Open' },
  orderBy: { openedDate: 'desc' }
});

// Find case by ID
const case = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    notes: true,
    timelineEvents: true
  }
});
```

### Update
```javascript
const updatedCase = await prisma.case.update({
  where: { id: caseId },
  data: {
    status: 'Closed',
    closedDate: new Date(),
    outcome: 'Settled'
  }
});
```

### Delete
```javascript
await prisma.case.delete({
  where: { id: caseId }
});
```

## Benefits of Migration

✅ **Type Safety**: Prisma provides full TypeScript support and type-safe queries
✅ **Better Performance**: PostgreSQL optimized for complex queries and large datasets
✅ **ACID Compliance**: Full transaction support for data integrity
✅ **SQL Power**: Access to advanced SQL features (CTEs, window functions, etc.)
✅ **Easy Migrations**: Prisma Migrate handles schema changes automatically
✅ **Developer Experience**: Prisma Studio for database browsing
✅ **Production Ready**: PostgreSQL is enterprise-grade and battle-tested

## Next Steps

1. **Choose migration path**: Full rewrite or gradual migration?
2. **Update feature code**: Start with high-priority features
3. **Rewrite tests**: Ensure test coverage for new code
4. **Deploy to staging**: Test in staging environment first
5. **Data migration**: If existing MongoDB data, create migration scripts

## Questions?

For help with the migration, refer to:
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Project README.md for setup instructions
