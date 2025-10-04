# Commands Reference - Yellow Cross Platform

Complete reference of all npm commands available in Yellow Cross Platform.

## 📋 Table of Contents

1. [Setup Commands](#setup-commands)
2. [Development Commands](#development-commands)
3. [Prisma Commands](#prisma-commands)
4. [Docker Commands](#docker-commands)
5. [Testing Commands](#testing-commands)
6. [Build Commands](#build-commands)
7. [Quick Reference](#quick-reference)

---

## Setup Commands

### `npm run setup`
**Complete automated setup - runs all setup steps**

```bash
npm run setup
```

**What it does:**
1. Installs all dependencies (`setup:install`)
2. Creates .env configuration (`setup:env`)
3. Generates Prisma client and prepares database (`setup:db`)
4. Verifies setup is complete (`setup:verify`)

**When to use:**
- First time setup
- After cloning the repository
- When starting fresh

**Time:** 1-3 minutes

---

### `npm run setup:install`
**Install all project dependencies**

```bash
npm run setup:install
```

**What it does:**
- Runs `npm install`
- Installs 50+ production and development dependencies
- Creates `node_modules/` directory

**When to use:**
- When `node_modules/` is missing
- After pulling new dependencies from git
- When dependencies are outdated

**Time:** 30-60 seconds

---

### `npm run setup:env`
**Create .env configuration file (non-interactive)**

```bash
npm run setup:env
```

**What it does:**
- Copies `.env.example` to `.env` automatically
- Uses default configuration values
- Skips if `.env` already exists

**When to use:**
- First time setup
- After deleting `.env` file
- For automated/CI environments

**Output:**
- Creates `.env` file in project root
- Uses defaults from `.env.example`

---

### `npm run setup:env:interactive`
**Create .env configuration file (with prompts)**

```bash
npm run setup:env:interactive
```

**What it does:**
- Prompts for custom configuration values
- Server port, database credentials, JWT secret, etc.
- Creates customized `.env` file

**When to use:**
- When you need custom configuration
- When setting up for production
- When defaults don't match your environment

**Prompts for:**
- Server port (default: 3000)
- Environment (development/production)
- Database credentials
- Security settings
- And more...

---

### `npm run setup:db`
**Setup database (generate Prisma client and prepare migrations)**

```bash
npm run setup:db
```

**What it does:**
1. Generates Prisma Client (`prisma:generate`)
2. Runs database migrations safely (`prisma:migrate:safe`)

**When to use:**
- After creating `.env` file
- When Prisma schema changes
- When Prisma client is missing

**Requirements:**
- `.env` file must exist
- `DATABASE_URL` must be configured

**Note:** Gracefully handles missing database connection

---

### `npm run setup:verify`
**Verify setup is complete**

```bash
npm run setup:verify
```

**What it does:**
- Runs 29 automated checks
- Verifies project structure
- Checks configuration files
- Confirms dependencies installed
- Validates Prisma setup

**When to use:**
- After running setup
- To diagnose setup issues
- Before starting development

**Output:**
- ✅ 29/29 checks passed: Setup complete
- ❌ X/29 checks failed: Shows what's missing

---

## Development Commands

### `npm start`
**Start production server**

```bash
npm start
```

**What it does:**
- Starts backend server
- Serves frontend static files
- Runs on port from `.env` (default: 3000)

**When to use:**
- After setup is complete
- For production mode
- For testing the application

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Health: http://localhost:3000/health

**Stop:** Press Ctrl+C

---

### `npm run dev`
**Start development server with auto-reload**

```bash
npm run dev
```

**What it does:**
- Starts backend server with nodemon
- Automatically restarts on file changes
- Hot reload for development

**When to use:**
- During development
- When making code changes
- For rapid iteration

**Features:**
- Auto-restart on file save
- Watches backend files
- Shows detailed logs

---

### `npm run dev:react`
**Start React development server with Vite**

```bash
npm run dev:react
```

**What it does:**
- Starts Vite dev server
- Hot module replacement (HMR)
- Fast refresh for React components

**When to use:**
- Developing frontend features
- Testing React components
- Frontend development

**Access:** http://localhost:5173 (Vite default)

---

## Prisma Commands

### `npm run prisma:generate`
**Generate Prisma Client**

```bash
npm run prisma:generate
```

**What it does:**
- Reads `backend/prisma/schema.prisma`
- Generates type-safe Prisma Client
- Creates files in `backend/src/generated/prisma/`

**When to use:**
- After modifying Prisma schema
- When Prisma client is missing
- After initial setup

**Time:** 10-20 seconds

---

### `npm run prisma:migrate`
**Create and apply database migration (development)**

```bash
npm run prisma:migrate
```

**What it does:**
- Creates migration from schema changes
- Applies migration to database
- Updates migration history
- Regenerates Prisma Client

**When to use:**
- After changing database schema
- During development
- To sync schema with database

**Creates:**
- Migration files in `backend/prisma/migrations/`
- SQL file with schema changes

**Requirements:**
- PostgreSQL must be running
- DATABASE_URL must be correct

---

### `npm run prisma:migrate:safe`
**Apply migrations with error handling**

```bash
npm run prisma:migrate:safe
```

**What it does:**
- Tries to apply migrations
- Shows friendly error if database unavailable
- Doesn't crash setup process

**When to use:**
- During automated setup
- In CI/CD pipelines
- When database might not be ready

---

### `npm run prisma:migrate:deploy`
**Deploy migrations (production)**

```bash
npm run prisma:migrate:deploy
```

**What it does:**
- Applies existing migrations only
- Doesn't create new migrations
- Safe for production

**When to use:**
- In production deployment
- In Docker containers
- In CI/CD pipelines

**Note:** Use this instead of `prisma:migrate` in production

---

### `npm run prisma:studio`
**Open Prisma Studio (visual database editor)**

```bash
npm run prisma:studio
```

**What it does:**
- Starts Prisma Studio GUI
- Opens in browser at http://localhost:5555
- Provides visual database interface

**When to use:**
- To browse database data
- To edit records visually
- To verify migrations
- For debugging data issues

**Features:**
- View all models
- Edit records
- Filter and search
- See relationships

**Stop:** Press Ctrl+C

---

### `npm run prisma:seed`
**Seed database with sample data**

```bash
npm run prisma:seed
```

**What it does:**
- Runs seed script
- Populates database with test data
- Creates sample records

**When to use:**
- For development/testing
- For demos
- After database reset

**Note:** Requires seed script in `backend/prisma/seed.js`

---

### `npm run prisma:reset`
**Reset database (⚠️ DELETES ALL DATA)**

```bash
npm run prisma:reset
```

**What it does:**
- Drops all database tables
- Runs all migrations from scratch
- Seeds database (if seed script exists)

**When to use:**
- When database is corrupted
- To start fresh with schema
- During development (⚠️ NOT in production)

**⚠️ WARNING:** This deletes ALL data permanently!

---

## Docker Commands

### `npm run docker:setup`
**Complete Docker setup (one command)**

```bash
npm run docker:setup
```

**What it does:**
1. Builds Docker images
2. Starts PostgreSQL and backend containers
3. Waits for database to be ready
4. Runs database migrations

**When to use:**
- First time Docker setup
- After changing Dockerfile
- For clean Docker environment

**Time:** 2-5 minutes

**Containers started:**
- `yellow-cross-db` - PostgreSQL 15
- `yellow-cross-backend` - Backend application

---

### `npm run docker:build`
**Build Docker images**

```bash
npm run docker:build
```

**What it does:**
- Builds images from Dockerfile
- Creates `yellow-cross-backend` image
- Pulls `postgres:15-alpine` image

**When to use:**
- After changing Dockerfile
- After updating dependencies
- Before starting containers

**Time:** 1-3 minutes

---

### `npm run docker:up`
**Start Docker containers**

```bash
npm run docker:up
```

**What it does:**
- Starts PostgreSQL container
- Starts backend container
- Runs in detached mode (-d)

**When to use:**
- After building images
- To start stopped containers
- For daily development

**Check status:** `docker-compose ps`

---

### `npm run docker:down`
**Stop Docker containers**

```bash
npm run docker:down
```

**What it does:**
- Stops all containers
- Removes containers
- Preserves volumes (data)

**When to use:**
- When done with development
- To free up resources
- Before rebuilding images

**Note:** Database data is preserved

---

### `npm run docker:logs`
**View Docker container logs**

```bash
npm run docker:logs
```

**What it does:**
- Shows logs from all containers
- Follows log output (real-time)

**When to use:**
- To debug container issues
- To monitor application
- To see PostgreSQL logs

**Stop:** Press Ctrl+C

---

### `npm run docker:restart`
**Restart Docker containers**

```bash
npm run docker:restart
```

**What it does:**
- Restarts all running containers
- Preserves data and configuration

**When to use:**
- After configuration changes
- To apply .env changes
- When containers are stuck

---

## Testing Commands

### `npm test`
**Run all tests**

```bash
npm test
```

**What it does:**
- Runs Jest test suite
- Tests backend functionality
- Shows test results

**When to use:**
- Before committing code
- To verify functionality
- For continuous integration

**Expected:** Most tests should pass (some Joi validation issues exist)

---

### `npm test -- [file]`
**Run specific test file**

```bash
npm test -- backend/tests/setup.test.js
```

**What it does:**
- Runs only specified test file
- Faster than running all tests

**When to use:**
- Testing specific feature
- Debugging test failures
- During development

**Example:**
```bash
npm test -- backend/tests/setup.test.js
npm test -- backend/tests/case-management.test.js
```

---

## Build Commands

### `npm run build`
**Build frontend for production**

```bash
npm run build
```

**What it does:**
- Runs `npm run build:react`
- Builds React frontend with Vite
- Creates optimized production bundle

**When to use:**
- Before production deployment
- To create production build
- For performance testing

**Output:** `frontend/dist/` directory

---

### `npm run build:react`
**Build React application**

```bash
npm run build:react
```

**What it does:**
- Compiles TypeScript
- Bundles React application
- Optimizes for production
- Creates static files

**Output:**
- Production build in `frontend/dist/`
- Minified and optimized

---

### `npm run preview:react`
**Preview production build**

```bash
npm run preview:react
```

**What it does:**
- Serves production build locally
- Tests production build
- Previews optimizations

**When to use:**
- After building
- To test production build locally
- Before deployment

---

### `npm run lint`
**Lint backend code**

```bash
npm run lint
```

**What it does:**
- Runs ESLint on backend code
- Checks for code quality issues
- Reports errors and warnings

**When to use:**
- Before committing code
- To maintain code quality
- During code review

---

### `npm run lint:frontend`
**Type-check frontend code**

```bash
npm run lint:frontend
```

**What it does:**
- Runs TypeScript compiler in check mode
- Validates types without building
- Reports type errors

**When to use:**
- Before committing frontend changes
- To catch type errors
- During development

---

## Quick Reference

### First Time Setup
```bash
git clone https://github.com/harborgrid-justin/yellow-cross.git
cd yellow-cross
npm run setup
npm run docker:setup
```

### Daily Development
```bash
# Backend development
npm run dev

# Frontend development
npm run dev:react

# View database
npm run prisma:studio
```

### After Schema Changes
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Docker Workflow
```bash
npm run docker:build  # Build images
npm run docker:up     # Start containers
npm run docker:logs   # View logs
npm run docker:down   # Stop containers
```

### Testing
```bash
npm test                                    # All tests
npm test -- backend/tests/setup.test.js    # Specific test
```

### Production Build
```bash
npm run build
NODE_ENV=production npm start
```

### Troubleshooting
```bash
npm run setup:verify  # Check setup status
npm run prisma:reset  # Reset database (⚠️ deletes data)
```

---

## Command Summary Table

| Command | Description | Time | When to Use |
|---------|-------------|------|-------------|
| `npm run setup` | Complete automated setup | 1-3 min | First time setup |
| `npm start` | Start production server | Instant | Run application |
| `npm run dev` | Start dev server | Instant | Development |
| `npm run prisma:studio` | Open database GUI | Instant | View/edit data |
| `npm run docker:setup` | Complete Docker setup | 2-5 min | Docker environment |
| `npm test` | Run all tests | 10-30 sec | Before commit |
| `npm run setup:verify` | Verify setup | Instant | Check setup status |

---

## Environment Variables

Commands respect these `.env` variables:

- `NODE_ENV` - development or production
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT token secret
- `LOG_LEVEL` - Logging level

---

## Getting Help

### Documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup instructions
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problem solving
- [PRISMA_GUIDE.md](./PRISMA_GUIDE.md) - Prisma documentation
- [README.md](./README.md) - Main documentation

### Verification
```bash
npm run setup:verify
```

### Support
Check documentation files or contact the development team.

---

**Status:** ✅ Commands reference complete!

**Yellow Cross Platform** - Complete Command Reference 🏆
