# Sequelize Guide - Yellow Cross Platform

Complete guide to using Sequelize ORM with PostgreSQL in the Yellow Cross platform.

---

## Overview

Yellow Cross uses **Sequelize** with **TypeScript** for database management.

### What is Sequelize?

Sequelize provides:
- **Type-safe database client** - Full TypeScript support with decorators
- **Model-based ORM** - Define models as TypeScript classes
- **Query interface** - Intuitive API for CRUD operations
- **Migrations support** - Version control for your database schema
- **Associations** - Easy relationship definitions (1:1, 1:N, N:M)

### Files

- **Models**: `backend/src/models/sequelize/` - Model definitions with TypeScript
- **Config**: `backend/src/config/database.ts` - Database configuration
- **Seed**: `backend/src/config/seed.ts` - Initial data seeding

---

## Database Configuration

### Connection

The database connection is configured in `backend/src/config/database.ts`:

```typescript
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_rj6VckGihv0J@ep-rough-wind-ad0xgjgi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [/* ... model classes ... */]
});
```

### Environment Variables

Set in `.env` file:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_rj6VckGihv0J@ep-rough-wind-ad0xgjgi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=development
```

---

## Models

### Model Structure

Models are defined as TypeScript classes with decorators:

```typescript
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  username!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
```

### Available Models

Yellow Cross includes 15+ models:

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

5. **User Management**
   - User

See `backend/src/models/sequelize/` for all model definitions.

---

## Database Operations

### Setup from Scratch

**1. Install dependencies:**
```bash
npm install
```

**2. Set DATABASE_URL in .env:**
```bash
DATABASE_URL=postgresql://username:password@host:5432/dbname
```

**3. Seed database:**
```bash
npm run db:seed
```

This will:
- Create all tables
- Seed initial data (admin user)

### Using Models

**Import models:**
```typescript
import { User, Case, Document } from '../models/sequelize';
```

**Create:**
```typescript
const newUser = await User.create({
  userId: 'USR-001',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashedpassword'
});
```

**Read (Find One):**
```typescript
const user = await User.findOne({
  where: { username: 'johndoe' }
});
```

**Read (Find Many):**
```typescript
const users = await User.findAll({
  where: { status: 'Active' },
  order: [['createdAt', 'DESC']],
  limit: 10
});
```

**Update:**
```typescript
const user = await User.findByPk(userId);
if (user) {
  user.email = 'newemail@example.com';
  await user.save();
}

// Or update directly
await User.update(
  { email: 'newemail@example.com' },
  { where: { id: userId } }
);
```

**Delete:**
```typescript
await User.destroy({
  where: { id: userId }
});
```

### Associations

**Define relationships in models:**
```typescript
@HasMany(() => CaseNote, 'caseId')
notes?: CaseNote[];

@BelongsTo(() => Case)
case?: Case;
```

**Query with associations:**
```typescript
const caseWithNotes = await Case.findByPk(caseId, {
  include: [CaseNote]
});
```

### Transactions

```typescript
const t = await sequelize.transaction();

try {
  const user = await User.create({
    username: 'johndoe'
  }, { transaction: t });

  const profile = await Profile.create({
    userId: user.id
  }, { transaction: t });

  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

---

## Custom Methods

### Static Methods

Defined in model classes:

```typescript
static async findByUsername(username: string): Promise<User | null> {
  return await User.findOne({ where: { username } });
}
```

Usage:
```typescript
const user = await User.findByUsername('admin');
```

### Instance Methods

```typescript
async comparePassword(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
}
```

Usage:
```typescript
const isValid = await user.comparePassword('password123');
```

---

## Database Scripts

### Seed Database

```bash
npm run db:seed
```

Creates tables and seeds initial data.

### Sync Models

```bash
npm run db:sync
```

Synchronizes models with database (creates tables if they don't exist).

---

## Best Practices

1. **Always use transactions** for operations that modify multiple records
2. **Use indexes** on frequently queried fields (defined with `@Index` decorator)
3. **Validate input** before database operations
4. **Handle errors** properly with try-catch blocks
5. **Use TypeScript types** for type safety
6. **Don't expose raw password** fields in API responses
7. **Use UUID** for primary keys (better security and distribution)

---

## Troubleshooting

### Connection Issues

**Problem:** `Unable to connect to database`

**Solutions:**
1. Check DATABASE_URL in `.env`
2. Verify database is running
3. Check firewall/network settings
4. Verify SSL settings for cloud databases

### Model Sync Issues

**Problem:** `Relation "table_name" does not exist`

**Solution:**
```bash
npm run db:seed
```

This will create all tables.

### TypeScript Decorator Errors

**Problem:** `Unable to resolve signature of decorator`

**Solution:** Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## Additional Resources

### Official Documentation
- [Sequelize Docs](https://sequelize.org/docs/v6/)
- [Sequelize-TypeScript](https://github.com/RobinBuschmann/sequelize-typescript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Yellow Cross Documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [README.md](../../README.md) - Project overview

---

**Status:** ✅ Sequelize integration complete!

**Yellow Cross Platform** - Built with Sequelize ORM and PostgreSQL 🏆
