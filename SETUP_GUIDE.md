# Yellow Cross Platform - Complete Setup Guide

This guide provides comprehensive instructions for setting up the Yellow Cross Platform from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Automated)](#quick-start-automated)
3. [Detailed Setup Steps](#detailed-setup-steps)
4. [Docker Setup](#docker-setup)
5. [Manual Database Setup](#manual-database-setup)
6. [Verification](#verification)
7. [Common Issues](#common-issues)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v8 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Choose One Database Option
- **Option A (Recommended):** Docker & Docker Compose ([Download](https://docs.docker.com/get-docker/))
- **Option B:** PostgreSQL 15+ ([Download](https://www.postgresql.org/download/))

### Verify Prerequisites
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v8 or higher
git --version     # Any recent version
```

For Docker:
```bash
docker --version
docker-compose --version
```

For PostgreSQL:
```bash
psql --version    # Should be 15 or higher
```

---

## Quick Start (Automated)

The fastest way to get started - **one command does everything!**

### 1. Clone the Repository
```bash
git clone https://github.com/harborgrid-justin/yellow-cross.git
cd yellow-cross
```

### 2. Run Complete Setup
```bash
npm run setup
```

This single command will:
1. ✅ Install all dependencies
2. ✅ Create .env configuration file (using defaults from .env.example)
3. ✅ Generate Prisma client
4. ✅ Prepare database migrations
5. ✅ Verify setup is complete

**That's it!** Your setup is complete.

### 3. Start the Application

**With Docker (Recommended):**
```bash
npm run docker:setup
```

**Without Docker (requires PostgreSQL running locally):**
```bash
npm start
```

### 4. Access the Application
- **Frontend:** http://localhost:3000
- **API Health Check:** http://localhost:3000/health
- **Prisma Studio (Database GUI):** Run `npm run prisma:studio`

---

## Detailed Setup Steps

If you prefer to understand each step or customize the setup:

### Step 1: Install Dependencies
```bash
npm run setup:install
```

This installs all Node.js packages including:
- Express.js (backend framework)
- Prisma (database ORM)
- React (frontend framework)
- And 50+ other production and development dependencies

**Time:** ~1-2 minutes

### Step 2: Environment Configuration

**Automated (Recommended):**
```bash
npm run setup:env
```

This creates a `.env` file with default configuration from `.env.example`.

**Interactive (For Custom Configuration):**
```bash
npm run setup:env:interactive
```

This will prompt you for:
- Server port (default: 3000)
- Environment (development/production)
- Database credentials
- JWT secret
- And more...

**Manual:**
```bash
cp .env.example .env
# Then edit .env with your preferred editor
nano .env    # or vim, code, etc.
```

### Step 3: Database Setup

**Generate Prisma Client:**
```bash
npm run prisma:generate
```

This generates the type-safe Prisma Client based on your schema at:
- Location: `backend/src/generated/prisma/`
- Time: ~10-20 seconds

**Run Database Migrations:**
```bash
npm run prisma:migrate
```

This creates all database tables based on the Prisma schema:
- 15+ models/tables
- All relationships
- Indexes and constraints

**Note:** This requires a running PostgreSQL database. See [Docker Setup](#docker-setup) or [Manual Database Setup](#manual-database-setup).

### Step 4: Verify Setup
```bash
npm run setup:verify
```

This runs 29 automated checks to ensure:
- ✅ All files are in place
- ✅ Dependencies are installed
- ✅ Configuration is complete
- ✅ Prisma client is generated
- ✅ Documentation exists

---

## Docker Setup

Docker provides the easiest way to run PostgreSQL without manual installation.

### Option 1: Complete Docker Setup (Recommended)
```bash
npm run docker:setup
```

This single command:
1. Builds Docker images
2. Starts PostgreSQL container
3. Starts backend container
4. Runs database migrations
5. Makes everything ready!

### Option 2: Step-by-Step Docker

**Build Docker Images:**
```bash
npm run docker:build
```

**Start Containers:**
```bash
npm run docker:up
```

**View Logs:**
```bash
npm run docker:logs
```

**Stop Containers:**
```bash
npm run docker:down
```

### Docker Environment Variables

The docker-compose.yml uses these environment variables from `.env`:
- `POSTGRES_USER` - Database username (default: yellowcross)
- `POSTGRES_PASSWORD` - Database password (default: yellowcross_dev)
- `POSTGRES_DB` - Database name (default: yellowcross)
- `POSTGRES_PORT` - Database port (default: 5432)

### Accessing PostgreSQL in Docker

**Connect to PostgreSQL Container:**
```bash
docker-compose exec postgres psql -U yellowcross
```

**View Database:**
```bash
npm run prisma:studio
```

---

## Manual Database Setup

If you prefer to install PostgreSQL directly on your system:

### Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

**Method 1: Using createdb command:**
```bash
createdb yellowcross
```

**Method 2: Using psql:**
```bash
psql -U postgres
CREATE DATABASE yellowcross;
\q
```

### Create Database User (Optional)

```sql
CREATE USER yellowcross WITH PASSWORD 'yellowcross_dev';
GRANT ALL PRIVILEGES ON DATABASE yellowcross TO yellowcross;
```

### Update .env

Make sure your `.env` file has the correct `DATABASE_URL`:
```
DATABASE_URL=postgresql://yellowcross:yellowcross_dev@localhost:5432/yellowcross?schema=public
```

### Run Migrations
```bash
npm run prisma:migrate
```

---

## Verification

### Automated Verification
```bash
npm run setup:verify
```

Expected output:
```
✅ Setup Complete!

Your Yellow Cross Platform is ready to use.

📈 Total: 29/29 checks passed
```

### Manual Verification

**1. Check Server Starts:**
```bash
npm start
```

Expected: `Yellow Cross Platform running on port 3000`

**2. Check Health Endpoint:**
```bash
curl http://localhost:3000/health
```

Expected: `{"status":"healthy","timestamp":"..."}`

**3. Check Frontend:**
Open http://localhost:3000 in your browser

Expected: Homepage loads with Yellow Cross Platform UI

**4. Run Tests:**
```bash
npm test -- backend/tests/setup.test.js
```

Expected: ✅ 20/23 tests passing (3 failures are unrelated Joi validation issues)

**5. Check Prisma Studio:**
```bash
npm run prisma:studio
```

Expected: Browser opens to http://localhost:5555 with database GUI

---

## Common Issues

### Issue: "Cannot connect to database"

**Error:**
```
Error: P1001: Can't reach database server
```

**Solutions:**

1. **If using Docker:**
   ```bash
   docker-compose ps  # Check if postgres container is running
   docker-compose up -d postgres  # Start postgres if needed
   docker-compose logs postgres   # Check logs
   ```

2. **If using local PostgreSQL:**
   ```bash
   pg_isready  # Check if PostgreSQL is running
   sudo systemctl start postgresql  # Linux
   brew services start postgresql@15  # macOS
   ```

3. **Check DATABASE_URL in .env:**
   ```bash
   cat .env | grep DATABASE_URL
   ```
   Should look like: `postgresql://user:password@localhost:5432/dbname`

### Issue: "Prisma Client not found"

**Error:**
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Migration failed"

**Error:**
```
Error: P3005: Database schema is not empty
```

**Solutions:**

1. **Reset database (⚠️ deletes all data):**
   ```bash
   npm run prisma:reset
   ```

2. **Force push schema:**
   ```bash
   cd backend && npx prisma db push --force-reset
   ```

### Issue: ".env file missing"

**Solution:**
```bash
npm run setup:env
```

Or copy manually:
```bash
cp .env.example .env
```

### Issue: "npm install fails"

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

3. **Use Node.js v18 or higher:**
   ```bash
   node --version  # Check version
   # Install from nodejs.org if needed
   ```

### Issue: "Port 3000 already in use"

**Solutions:**

1. **Find process using port:**
   ```bash
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

2. **Kill process:**
   ```bash
   kill -9 <PID>  # macOS/Linux
   taskkill /PID <PID> /F  # Windows
   ```

3. **Or change port in .env:**
   ```bash
   PORT=3001
   ```

---

## Next Steps

Now that your setup is complete:

### 1. Explore the Platform

**Start Development Server:**
```bash
npm run dev
```

This starts the server with auto-reload on code changes.

**Open Prisma Studio:**
```bash
npm run prisma:studio
```

Browse and edit your database with a visual interface.

### 2. Run Tests
```bash
npm test
```

### 3. Build Frontend
```bash
npm run build:react
```

### 4. Read Documentation

- **[README.md](./README.md)** - Main documentation
- **[FEATURES.md](./FEATURES.md)** - Feature list
- **[API_REFERENCE.md](./API_REFERENCE.md)** - API documentation
- **[ENTERPRISE_ARCHITECTURE.md](./ENTERPRISE_ARCHITECTURE.md)** - Architecture details
- **[QUICK_START.txt](./QUICK_START.txt)** - Quick reference

### 5. Customize Configuration

Edit `.env` to customize:
- Port and environment settings
- Database connection
- JWT secret and security settings
- Email configuration (for sending emails)
- Integration API keys (Westlaw, LexisNexis, DocuSign, etc.)
- File upload settings
- Backup configuration

### 6. Development Workflow

**Start coding:**
```bash
npm run dev  # Backend with auto-reload
npm run dev:react  # Frontend with hot reload
```

**Run linters:**
```bash
npm run lint  # Backend
npm run lint:frontend  # Frontend
```

**Run tests:**
```bash
npm test
```

**Database operations:**
```bash
npm run prisma:studio  # Visual database editor
npm run prisma:migrate  # Create new migration
npm run prisma:seed  # Seed sample data
```

### 7. Deployment

**Build for production:**
```bash
npm run build
```

**Run in production mode:**
```bash
NODE_ENV=production npm start
```

**Docker deployment:**
```bash
npm run docker:build
npm run docker:up
```

---

## Need Help?

### Documentation
- [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md) - Verification checklist
- [ISSUE_RESOLUTION.md](./ISSUE_RESOLUTION.md) - Common issues and solutions
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Database migration guide

### Support
- Check [README.md](./README.md) for overview
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- See example configurations in `.env.example`

---

**Status:** ✅ Setup guide complete!

**Yellow Cross Platform** - Built for Legal Excellence 🏆
