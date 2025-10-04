# Prisma Guide - Yellow Cross Platform

Complete guide to using Prisma ORM in the Yellow Cross Platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prisma Schema](#prisma-schema)
3. [Common Commands](#common-commands)
4. [Database Operations](#database-operations)
5. [Migrations](#migrations)
6. [Prisma Studio](#prisma-studio)
7. [Client Usage](#client-usage)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Prisma is the Object-Relational Mapping (ORM) tool used in Yellow Cross Platform to interact with the PostgreSQL database.

### What is Prisma?

Prisma provides:
- **Type-safe database client** - Auto-completion and type checking
- **Database migrations** - Version control for your database schema
- **Visual database browser** (Prisma Studio)
- **Introspection** - Generate schema from existing database
- **Modern query interface** - Intuitive API for CRUD operations

### Architecture

```
┌─────────────────────────────────────┐
│   Backend Application Code          │
│   (backend/src/features/*.js)       │
└──────────────┬──────────────────────┘
               │ imports
               ▼
┌─────────────────────────────────────┐
│   Prisma Client                      │
│   (auto-generated)                   │
│   backend/src/generated/prisma/      │
└──────────────┬──────────────────────┘
               │ queries
               ▼
┌─────────────────────────────────────┐
│   PostgreSQL Database                │
│   (Docker or Local)                  │
└─────────────────────────────────────┘
```

### Files

- **Schema**: `backend/prisma/schema.prisma` - Database schema definition
- **Client**: `backend/src/generated/prisma/` - Auto-generated Prisma Client
- **Migrations**: `backend/prisma/migrations/` - Migration history

---

## Prisma Schema

The schema defines your database structure.

### Location
```
backend/prisma/schema.prisma
```

### Schema Structure

```prisma
// Generator - tells Prisma where to create the client
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

// Datasource - database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models - database tables
model Case {
  id          String   @id @default(uuid())
  caseNumber  String   @unique
  title       String
  // ... more fields
  
  // Relations
  documents   Document[]
  tasks       Task[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Document {
  id       String @id @default(uuid())
  title    String
  caseId   String
  
  // Relation
  case     Case   @relation(fields: [caseId], references: [id])
}
```

### Key Concepts

**Models** - Database tables
```prisma
model Case {
  // fields
}
```

**Fields** - Table columns
```prisma
id       String   @id @default(uuid())
title    String
priority String   @default("Medium")
```

**Relations** - Table relationships
```prisma
// One-to-many
case      Case     @relation(fields: [caseId], references: [id])
documents Document[]

// Many-to-many
tags      Tag[]
```

**Attributes** - Field modifiers
```prisma
@id              // Primary key
@unique          // Unique constraint
@default(value)  // Default value
@updatedAt       // Auto-update timestamp
@relation        // Define relationship
```

### Our Models

Yellow Cross Platform includes 15+ models:

1. **Case Management**
   - Case
   - CaseNote
   - CaseTimelineEvent

2. **Document Management**
   - Document
   - DocumentVersion
   - DocumentReview

3. **Task & Workflow**
   - Task
   - TaskComment
   - TaskTemplate
   - Workflow

4. **E-Discovery**
   - Evidence
   - PrivilegeLog
   - Production
   - LegalHold

See `backend/prisma/schema.prisma` for complete schema.

---

## Common Commands

All Prisma commands should be run from the project root.

### Setup Commands

**Generate Prisma Client:**
```bash
npm run prisma:generate
```
- Creates type-safe client from schema
- Location: `backend/src/generated/prisma/`
- Run after any schema changes

**Run Migrations:**
```bash
npm run prisma:migrate
```
- Creates migration files
- Applies changes to database
- Updates migration history

**Deploy Migrations (Production):**
```bash
npm run prisma:migrate:deploy
```
- Only applies existing migrations
- Doesn't create new ones
- Use in production/CI/CD

### Development Commands

**Open Prisma Studio:**
```bash
npm run prisma:studio
```
- Visual database browser
- Opens at http://localhost:5555
- View and edit data

**Seed Database:**
```bash
npm run prisma:seed
```
- Populates database with sample data
- Defined in `backend/prisma/seed.js`

**Reset Database (⚠️ Deletes all data):**
```bash
npm run prisma:reset
```
- Drops all tables
- Runs all migrations
- Seeds database

### Direct Prisma Commands

**Format Schema:**
```bash
cd backend
npx prisma format
```

**Validate Schema:**
```bash
cd backend
npx prisma validate
```

**View Migration Status:**
```bash
cd backend
npx prisma migrate status
```

**Push Schema (without migrations):**
```bash
cd backend
npx prisma db push
```

---

## Database Operations

### Setup from Scratch

**1. Create .env with DATABASE_URL:**
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/dbname?schema=public
```

**2. Generate Prisma Client:**
```bash
npm run prisma:generate
```

**3. Create and apply migrations:**
```bash
npm run prisma:migrate
```

**4. (Optional) Seed data:**
```bash
npm run prisma:seed
```

### Updating the Schema

**1. Edit the schema:**
```bash
nano backend/prisma/schema.prisma
# or use your preferred editor
```

**2. Generate client:**
```bash
npm run prisma:generate
```

**3. Create migration:**
```bash
cd backend
npx prisma migrate dev --name description_of_changes
```

**4. Commit changes:**
```bash
git add backend/prisma/
git commit -m "Database schema update: description"
```

### Syncing Schema with Database

**If schema and database are out of sync:**

**Option 1: Create new migration (preserves data)**
```bash
cd backend
npx prisma migrate dev --name sync_changes
```

**Option 2: Force push (may lose data)**
```bash
cd backend
npx prisma db push --force-reset
```

**Option 3: Reset everything (loses all data)**
```bash
npm run prisma:reset
```

---

## Migrations

Migrations are version control for your database schema.

### Creating Migrations

**Development:**
```bash
cd backend
npx prisma migrate dev --name add_new_field
```

This:
1. Creates migration file in `prisma/migrations/`
2. Applies migration to database
3. Regenerates Prisma Client

**Production:**
```bash
npm run prisma:migrate:deploy
```

### Migration Files

Location: `backend/prisma/migrations/`

Structure:
```
migrations/
├── 20231201000000_init/
│   └── migration.sql
├── 20231202000000_add_users/
│   └── migration.sql
└── migration_lock.toml
```

Each migration contains:
- Timestamp-based folder name
- SQL file with schema changes
- Applied in chronological order

### Migration Status

**Check status:**
```bash
cd backend
npx prisma migrate status
```

**Possible states:**
- ✅ All migrations applied
- ⚠️ Database is ahead (has unapplied migrations)
- ❌ Database is behind (missing migrations)
- ⚠️ Drift detected (manual changes to database)

### Handling Migration Issues

**Problem: Migration failed halfway**

```bash
cd backend
# Mark as rolled back
npx prisma migrate resolve --rolled-back 20231201000000_migration_name

# Try again
npx prisma migrate dev
```

**Problem: Database schema drifted**

```bash
cd backend
# See what changed
npx prisma db push --accept-data-loss

# Or create new migration
npx prisma migrate dev --name fix_drift
```

**Problem: Need to start fresh (⚠️ data loss)**

```bash
npm run prisma:reset
```

---

## Prisma Studio

Visual database browser and editor.

### Starting Studio

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

### Features

**View Data:**
- Browse all models
- See relationships
- View field types
- Check indexes

**Edit Data:**
- Add new records
- Update existing records
- Delete records
- Bulk operations

**Query Data:**
- Filter records
- Sort results
- Search fields
- Navigate relations

**Export Data:**
- Copy as JSON
- Export to CSV

### Use Cases

**Development:**
- Verify migrations applied correctly
- Check test data
- Debug data issues
- Quick data edits

**Testing:**
- Setup test scenarios
- Verify data changes
- Clean up test data

**Demo:**
- Populate demo data
- Show data to stakeholders

---

## Client Usage

### Importing the Client

```javascript
const { getPrismaClient } = require('./config/database');
const prisma = getPrismaClient();
```

### Basic Operations

**Create:**
```javascript
const newCase = await prisma.case.create({
  data: {
    caseNumber: 'CASE-2024-001',
    title: 'New Case',
    clientName: 'John Doe',
    matterType: 'Litigation',
    practiceArea: 'Civil',
    createdBy: userId
  }
});
```

**Read (Find One):**
```javascript
const case = await prisma.case.findUnique({
  where: { id: caseId }
});
```

**Read (Find Many):**
```javascript
const cases = await prisma.case.findMany({
  where: { 
    status: 'Open',
    practiceArea: 'Civil'
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

**Update:**
```javascript
const updated = await prisma.case.update({
  where: { id: caseId },
  data: { status: 'Closed' }
});
```

**Delete:**
```javascript
await prisma.case.delete({
  where: { id: caseId }
});
```

### Advanced Queries

**Relations:**
```javascript
const caseWithDocuments = await prisma.case.findUnique({
  where: { id: caseId },
  include: {
    documents: true,
    tasks: true,
    notes: true
  }
});
```

**Nested Create:**
```javascript
const caseWithDocuments = await prisma.case.create({
  data: {
    caseNumber: 'CASE-2024-001',
    title: 'New Case',
    documents: {
      create: [
        { title: 'Document 1', type: 'PDF' },
        { title: 'Document 2', type: 'DOCX' }
      ]
    }
  }
});
```

**Aggregation:**
```javascript
const stats = await prisma.case.aggregate({
  _count: { id: true },
  _avg: { estimatedValue: true },
  where: { status: 'Open' }
});
```

**Grouping:**
```javascript
const byStatus = await prisma.case.groupBy({
  by: ['status'],
  _count: { id: true }
});
```

### Transactions

**Simple Transaction:**
```javascript
const [case, document] = await prisma.$transaction([
  prisma.case.create({ data: caseData }),
  prisma.document.create({ data: docData })
]);
```

**Interactive Transaction:**
```javascript
await prisma.$transaction(async (tx) => {
  const case = await tx.case.create({ data: caseData });
  await tx.document.createMany({
    data: documents.map(doc => ({
      ...doc,
      caseId: case.id
    }))
  });
});
```

---

## Best Practices

### 1. Always Use Transactions for Related Data

```javascript
// ✅ Good
await prisma.$transaction(async (tx) => {
  const case = await tx.case.create({ data: caseData });
  await tx.caseNote.create({ 
    data: { ...noteData, caseId: case.id } 
  });
});

// ❌ Bad - race conditions possible
const case = await prisma.case.create({ data: caseData });
await prisma.caseNote.create({ 
  data: { ...noteData, caseId: case.id } 
});
```

### 2. Use Proper Error Handling

```javascript
try {
  const case = await prisma.case.findUnique({
    where: { id: caseId }
  });
  if (!case) {
    throw new Error('Case not found');
  }
} catch (error) {
  if (error.code === 'P2025') {
    // Record not found
  } else if (error.code === 'P2002') {
    // Unique constraint violation
  }
  throw error;
}
```

### 3. Always Disconnect

```javascript
// At application shutdown
await prisma.$disconnect();
```

### 4. Use Select for Large Datasets

```javascript
// ✅ Good - only fetch needed fields
const cases = await prisma.case.findMany({
  select: {
    id: true,
    caseNumber: true,
    title: true
  }
});

// ❌ Bad - fetches all fields
const cases = await prisma.case.findMany();
```

### 5. Index Frequently Queried Fields

In schema:
```prisma
model Case {
  caseNumber String @unique
  status     String
  
  @@index([status])
  @@index([createdAt])
}
```

### 6. Use Pagination

```javascript
const cases = await prisma.case.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
});
```

---

## Troubleshooting

### Client Not Found

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run prisma:generate
```

### Schema Validation Errors

**Error:** `Error validating: ...`

**Solution:**
```bash
cd backend
npx prisma format    # Format schema
npx prisma validate  # Check for errors
```

### Migration Conflicts

**Error:** `Migration ... conflicts with migration ...`

**Solution:**
```bash
cd backend
npx prisma migrate resolve --rolled-back MIGRATION_NAME
npx prisma migrate dev
```

### Database Out of Sync

**Error:** `Prisma schema and database are out of sync`

**Solution:**
```bash
npm run prisma:generate
cd backend
npx prisma db push
```

### Connection Errors

**Error:** `Can't reach database server`

**Solution:**
1. Check DATABASE_URL in .env
2. Verify PostgreSQL is running
3. Check firewall settings
4. For Docker: `docker-compose logs postgres`

### Performance Issues

**Slow queries:**
1. Add indexes to schema
2. Use `select` to limit fields
3. Implement pagination
4. Use `include` sparingly

**Too many connections:**
1. Use connection pooling
2. Always disconnect when done
3. Reuse Prisma Client instance

---

## Additional Resources

### Official Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### Yellow Cross Documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Migration details

### Schema Location
```
backend/prisma/schema.prisma
```

---

**Status:** ✅ Prisma guide complete!

**Yellow Cross Platform** - Built with Prisma ORM 🏆
