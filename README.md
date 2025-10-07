# Yellow Cross - Enterprise Law Firm Practice Management Platform

A comprehensive, full-featured **Google-scale enterprise-grade** platform designed for law firms to manage their practices effectively. Built with PostgreSQL, Prisma ORM, and modern best practices for security, scalability, and performance.

## 🌟 Enterprise Capabilities

Yellow Cross implements **production-grade engineering practices** similar to Google:

- ✅ **Structured Logging**: Winston-based logging with correlation IDs for distributed tracing
- ✅ **Error Handling**: Centralized error handling with proper logging and response formatting
- ✅ **Health Monitoring**: Kubernetes-compatible health checks (liveness, readiness, comprehensive)
- ✅ **Request Tracing**: Unique correlation IDs for tracking requests across services
- ✅ **Graceful Shutdown**: Zero-downtime deployments with proper cleanup
- ✅ **Environment Validation**: Startup validation with fail-fast configuration checks
- ✅ **Database Management**: Connection pooling, health checks, and graceful degradation

📚 **[View Complete Enterprise Capabilities Documentation →](./docs/ENTERPRISE_CAPABILITIES.md)**  
🚀 **[Quick Start Guide for Developers →](./docs/ENTERPRISE_QUICK_START.md)**

## 🎯 Overview

Yellow Cross is an all-in-one practice management solution that provides law firms with 15 primary enterprise-grade features, each containing 5-8 specialized sub-features for complete practice management coverage.

## 🛠️ Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Frontend**: TypeScript (ES2020), HTML5, CSS3
- **Type Safety**: Full TypeScript implementation with strict mode
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Security**: Helmet.js, CORS, express-rate-limit
- **Containerization**: Docker & Docker Compose
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **File Handling**: Multer
- **PDF Generation**: PDFKit
- **Date/Time**: Moment.js
- **Validation**: Joi

### TypeScript Frontend
The frontend is fully implemented in TypeScript with:
- ✅ Complete type safety with strict mode
- ✅ Source maps for debugging
- ✅ Type declaration files
- ✅ Build scripts for compilation
- 📄 See [TYPESCRIPT_IMPLEMENTATION.md](./TYPESCRIPT_IMPLEMENTATION.md) for details

## 📦 Project Structure

```
yellow-cross/
├── backend/                     # Backend application
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── features/           # 15 feature modules
│   │   ├── models/             # Legacy Mongoose models (for reference)
│   │   ├── validators/         # Input validators
│   │   ├── generated/          # Prisma generated client
│   │   └── index.js            # Application entry point
│   ├── tests/                  # Test files
│   └── prisma/                 # Prisma schema and migrations
│       └── schema.prisma       # Database schema
├── frontend/                    # Frontend application (React + TypeScript)
│   ├── src/
│   │   ├── app/                # Application core & routing
│   │   ├── features/           # 15+ feature modules (feature-based organization)
│   │   ├── shared/             # Shared components, types, utils, API client
│   │   ├── assets/             # Styles and static assets
│   │   └── config/             # Frontend configuration
│   ├── public/                 # Public static files
│   ├── dist/                   # Build output (gitignored)
│   ├── index.html              # Entry HTML
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript configuration
├── scripts/                     # Setup and utility scripts
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Docker image definition
├── .env.example                # Environment variables template
├── vite.config.ts              # Root Vite configuration
├── tsconfig.json               # Root TypeScript configuration
└── package.json                # Project dependencies and scripts
```

**See [ENTERPRISE_ARCHITECTURE.md](./docs/architecture/ENTERPRISE_ARCHITECTURE.md) for detailed architecture documentation.**

## 🚀 Getting Started

### Quick Start (One Command!)

```bash
git clone https://github.com/harborgrid-justin/yellow-cross.git
cd yellow-cross
npm run setup
```

**That's it!** The setup is now 100% automated. This single command will:
- ✅ Install all dependencies
- ✅ Create `.env` configuration file (from .env.example)
- ✅ Generate Prisma client
- ✅ Prepare database migrations
- ✅ Verify setup is complete

Then start the application:

```bash
npm run docker:setup   # With Docker (recommended)
# OR
npm start              # Without Docker (requires PostgreSQL running)
```

**Access:**
- Frontend & API: http://localhost:3000
- Health Check: http://localhost:3000/health
- Database GUI: `npm run prisma:studio`

📖 **For detailed instructions, see [SETUP_GUIDE.md](./docs/deployment/SETUP_GUIDE.md)**

---

### Prerequisites

**Required:**
- Node.js v18 or higher
- npm v8 or higher
- Git

**Choose one database option:**
- **Option A (Recommended):** Docker & Docker Compose
- **Option B:** PostgreSQL 15+

### Detailed Setup Options

#### Option 1: Automated Setup (Recommended)

**Complete setup in one command:**
```bash
npm run setup
```

This runs:
1. `npm run setup:install` - Installs dependencies
2. `npm run setup:env` - Creates .env from .env.example
3. `npm run setup:db` - Generates Prisma client & prepares migrations
4. `npm run setup:verify` - Verifies setup (29 automated checks)

**Then start with Docker:**
```bash
npm run docker:setup
```

#### Option 2: Interactive Configuration

If you need custom configuration:
```bash
npm install
npm run setup:env:interactive  # Prompts for custom values
npm run prisma:generate
npm run prisma:migrate
npm start
```

### Option 2: Manual Setup with Local PostgreSQL

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harborgrid-justin/yellow-cross.git
   cd yellow-cross
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL:**
   - Install PostgreSQL 15+
   - Create a database:
     ```sql
     CREATE DATABASE yellowcross;
     CREATE USER yellowcross WITH PASSWORD 'your_password';
     GRANT ALL PRIVILEGES ON DATABASE yellowcross TO yellowcross;
     ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```
   Or use the interactive setup:
   ```bash
   npm run setup:env
   ```

5. **Generate Prisma client and run migrations:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Start the application:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🔧 Available Commands

### Setup Commands
```bash
npm run setup              # Complete setup (install, env, database)
npm run setup:install      # Install dependencies only
npm run setup:env          # Interactive environment setup
npm run setup:db           # Database setup (generate + migrate)
```

### Development Commands
```bash
npm start                  # Start production server
npm run dev               # Start development server with auto-reload
npm test                  # Run tests
npm run lint              # Run linter
```

### Prisma Commands
```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations (dev)
npm run prisma:migrate:deploy  # Deploy migrations (production)
npm run prisma:studio      # Open Prisma Studio (database GUI)
npm run prisma:seed        # Seed database with default admin user
npm run prisma:reset       # Reset database (⚠️ deletes all data)
```

## 🔐 Default Login Credentials

After setting up the database, seed it with the default admin user:

```bash
npm run prisma:seed
```

**Default Admin Credentials:**
- **Username:** `admin`
- **Email:** `admin@yellowcross.com`
- **Password:** `Admin@123`

⚠️ **IMPORTANT SECURITY NOTE:**
- Change the default password immediately after first login
- The seed script will skip creation if admin user already exists
- Default password expires in 90 days
- Password follows enterprise security requirements

**First-time Setup:**
1. Run migrations: `npm run prisma:migrate`
2. Seed the database: `npm run prisma:seed`
3. Start the application: `npm start`
4. Login with default credentials
5. Change password immediately in user settings

### Docker Commands
```bash
npm run docker:build       # Build Docker images
npm run docker:up          # Start containers
npm run docker:down        # Stop containers
npm run docker:logs        # View logs
npm run docker:restart     # Restart containers
npm run docker:setup       # Complete Docker setup
```

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production with Docker

```bash
# Build production image
docker-compose build

# Start in production mode
NODE_ENV=production docker-compose up -d

# Run migrations
npm run prisma:migrate:deploy
```

### Docker Environment Variables

You can override environment variables in `docker-compose.yml` or create a `.env` file:

```env
POSTGRES_USER=yellowcross
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=yellowcross
PORT=3000
NODE_ENV=production
```

## ✨ Core Features

### 1. Case Management System
- Case Creation & Intake with full lifecycle management
- Case Tracking & Status with real-time updates
- Case Assignment & Distribution with team collaboration
- Case Timeline Management
- Case Categorization & Tagging
- Case Notes & Updates
- Case Closing & Archive with retention policies
- Case Analytics Dashboard

### 2. Client Relationship Management (CRM)
- Comprehensive client database
- Communication history tracking
- Client portal access
- Intake & onboarding workflows
- Billing information management
- Conflict checking system
- Retention & feedback tools
- Relationship analytics

### 3. Document Management System
- Secure document storage with version control
- Advanced search and indexing
- Template library with 50+ legal templates
- Full version control history
- Collaboration tools
- Role-based permissions
- Document automation
- Integration with e-signature services

### 4-15. [Additional Features]
Complete documentation available in [FEATURES.md](./FEATURES.md)

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **Case Management**: Cases, CaseNotes, CaseTimelineEvents
- **Document Management**: Documents, DocumentVersions, DocumentReviews
- **Task Management**: Tasks, TaskComments, TaskTemplates, Workflows
- **eDiscovery**: Evidence, PrivilegeLogs, Productions, LegalHolds

View the complete schema: `backend/prisma/schema.prisma`

Browse database with Prisma Studio:
```bash
npm run prisma:studio
```

## 🔒 Security Features

- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- JWT token-based authentication
- Password encryption with bcrypt
- Rate limiting
- CORS protection
- Security headers with Helmet.js
- SQL injection protection via Prisma
- Input validation with Joi
- Audit logging
- Data encryption at rest
- Session management

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Main Endpoints

#### System
- `GET /` - Platform overview
- `GET /health` - Health check

#### Case Management
- `GET /api/cases` - List all cases
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/cases/analytics` - Case analytics

#### Document Management
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get document
- `POST /api/documents/:id/versions` - Create version
- `GET /api/documents/templates` - List templates

#### Tasks & Workflows
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `GET /api/workflows` - List workflows

Full API documentation: [API_REFERENCE.md](./API_REFERENCE.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/case-management.test.js
```

## 🔍 Troubleshooting

**Quick diagnosis:**
```bash
npm run setup:verify
```

This runs 29 automated checks to identify issues.

### Common Issues

**Setup incomplete:**
```bash
npm run setup  # Run complete setup
```

**Database connection fails:**
```bash
# For Docker
docker-compose up -d postgres
docker-compose logs postgres

# For local PostgreSQL
pg_isready
```

**Prisma Client not found:**
```bash
npm run prisma:generate
```

**Migration fails:**
```bash
npm run prisma:reset  # ⚠️ Deletes all data

# Or force push schema
cd backend && npx prisma db push --force-reset
```

### Port Already in Use

**Problem**: Port 3000 or 5432 already in use

**Solution**:
1. Change PORT in `.env` file
2. Or kill the process using the port:
   ```bash
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

## 📖 Documentation

**All documentation has been organized into a centralized `docs/` directory. See [docs/README.md](./docs/README.md) for complete navigation.**

### 🚀 Quick Start
- **[SETUP_GUIDE.md](./docs/deployment/SETUP_GUIDE.md)** - Complete setup guide (recommended starting point)
- **[QUICK_START.txt](./docs/deployment/QUICK_START.txt)** - Quick reference for common commands
- **[COMMANDS_REFERENCE.md](./docs/api/COMMANDS_REFERENCE.md)** - All npm commands explained

### 🔧 Setup & Installation
- **[SETUP_GUIDE.md](./docs/deployment/SETUP_GUIDE.md)** - Detailed setup instructions
- **[TROUBLESHOOTING.md](./docs/deployment/TROUBLESHOOTING.md)** - Comprehensive troubleshooting guide
- **[SETUP_VERIFICATION.md](./docs/deployment/SETUP_VERIFICATION.md)** - Verification checklist
- **[ENTERPRISE_SETUP_COMPLETE.md](./docs/deployment/ENTERPRISE_SETUP_COMPLETE.md)** - Setup completion summary

### 🗄️ Database & Prisma
- **[PRISMA_GUIDE.md](./docs/guides/PRISMA_GUIDE.md)** - Complete Prisma ORM guide
- **[MIGRATION_NOTES.md](./docs/architecture/MIGRATION_NOTES.md)** - Database migration guide
- **Prisma Schema:** `backend/prisma/schema.prisma` - Complete database schema (15+ models)

### 🏗️ Features & Architecture
- **[FEATURES.md](./docs/features/FEATURES.md)** - Detailed feature documentation
- **[ENTERPRISE_ARCHITECTURE.md](./docs/architecture/ENTERPRISE_ARCHITECTURE.md)** - System architecture
- **[API_REFERENCE.md](./docs/api/API_REFERENCE.md)** - Complete API reference
- **[FEATURE_SUMMARY.md](./docs/features/FEATURE_SUMMARY.md)** - Feature matrix

### 💻 Development
- **[TYPESCRIPT_IMPLEMENTATION.md](./docs/guides/TYPESCRIPT_IMPLEMENTATION.md)** - TypeScript setup and usage
- **[FRONTEND_ACCESS.md](./docs/guides/FRONTEND_ACCESS.md)** - Frontend pages access guide

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🆘 Support

For support, please contact the development team or open an issue in the repository.

## 🎯 Roadmap

- [x] PostgreSQL migration with Prisma ORM
- [x] Docker containerization
- [x] Easy setup commands
- [x] Separate frontend/backend structure
- [x] Enterprise deployment preparation
- [x] Comprehensive documentation organization
- [x] Security hardening (0 vulnerabilities)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced AI/ML features for case prediction
- [ ] Blockchain integration for document verification
- [ ] Enhanced voice recognition for time tracking
- [ ] Advanced business intelligence features
- [ ] White-label solutions

## 🏆 Enterprise Deployment Status

✅ **PRODUCTION READY** - See [ENTERPRISE_DEPLOYMENT_READY.md](./ENTERPRISE_DEPLOYMENT_READY.md) for complete readiness report.

**Quick Deployment:**
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment verification
- [Security Guidelines](./docs/security/SECURITY.md) - Enterprise security standards
- [Deployment Guide](./docs/deployment/DEPLOYMENT.md) - Complete deployment instructions

---

**Yellow Cross - Built for Legal Excellence** 🏆
