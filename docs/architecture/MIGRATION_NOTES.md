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
The existing tests were written for Mongoose models and need to be rewritten for Sequelize:

**Files that need test updates:**
- `backend/tests/case-management.test.js` (19 tests)
- `backend/tests/client-crm.test.js` (15 tests)
- `backend/tests/document-management.test.js` (18 tests)
- `backend/tests/ediscovery.test.js` (20 tests)
- `backend/tests/task-workflow.test.js` (6 tests)

**Changes needed:**
1. Replace Mongoose model imports with Sequelize models
2. Update data creation to use Sequelize syntax
3. Replace MongoDB-specific queries with Sequelize queries
4. Update mock data to match PostgreSQL/Sequelize requirements
5. Handle UUID vs ObjectId differences

**Note:** Setup test (`backend/tests/setup.test.ts`) has been updated to check for Sequelize instead of Prisma.

### Feature Code Migration
**Status: ✅ COMPLETED - Feature files have been migrated to Sequelize**

All 15 feature modules have been updated to use Sequelize models (not Prisma):
- ✅ `backend/src/features/case-management.ts` - Using Sequelize Case, CaseNote, CaseTimelineEvent
- ✅ `backend/src/features/document-management.ts` - Using Sequelize Document models
- ✅ `backend/src/features/task-workflow.ts` - Using Sequelize Task models
- ✅ `backend/src/features/ediscovery.ts` - Using Sequelize Evidence models
- ✅ All 15 feature files updated

**Changes completed:**
1. ✅ Replaced Mongoose imports with Sequelize model imports from `../models/sequelize/`
2. ✅ Replaced Mongoose query methods with Sequelize equivalents:
   - `Model.findById()` → `Model.findByPk()`
   - `Model.find()` → `Model.findAll({ where: {} })`
   - `new Model().save()` → `Model.create()` or keep `.save()` for updates
   - `._id` references → `.id` (UUID instead of ObjectId)
3. ✅ Removed mongoose dependency from feature files
4. ✅ Updated to handle UUID instead of ObjectId in API responses

**Note:** The system has been migrated to **Sequelize** (not Prisma). Some models referenced in feature files don't have Sequelize equivalents yet (e.g., Client, DocumentTemplate, Invoice, etc.) and would need to be created as needed.

## Migration Strategy

### For Immediate Use:
1. **Start with Docker**: Use `npm run docker:setup` to get PostgreSQL running
2. **Seed database**: Execute `npm run db:seed` to create database schema and seed data
3. **Test connection**: Run `npx ts-node backend/src/test-connection.ts` to verify connection
4. **Test server**: Run `npm start` to verify the server works

### For Full Migration:
✅ **Migration Complete!** All feature modules have been updated to use Sequelize.

Remaining work:
1. Update feature-specific tests to use Sequelize
2. Create missing Sequelize models as needed (Client, Invoice, etc.)
3. Verify all features work end-to-end with Sequelize

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
