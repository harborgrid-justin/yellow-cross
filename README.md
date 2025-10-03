# Yellow Cross - Enterprise Law Firm Practice Management Platform

A comprehensive, full-featured enterprise-grade platform designed for law firms to manage their practices effectively. Built with PostgreSQL, Prisma ORM, and modern best practices for security, scalability, and performance.

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
├── backend/                 # Backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── features/       # 15 feature modules
│   │   ├── models/         # Legacy Mongoose models (for reference)
│   │   ├── validators/     # Input validators
│   │   ├── generated/      # Prisma generated client
│   │   └── index.js        # Application entry point
│   ├── tests/              # Test files
│   └── prisma/             # Prisma schema and migrations
│       └── schema.prisma   # Database schema
├── frontend/               # Frontend application
│   ├── ts/                # TypeScript source files
│   ├── js/                # Compiled JavaScript files
│   ├── css/               # Stylesheets
│   └── *.html             # HTML pages
├── scripts/               # Setup and utility scripts
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile            # Docker image definition
├── .env.example          # Environment variables template
└── package.json          # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher) **OR** Docker & Docker Compose
- npm or yarn

### Option 1: Quick Setup with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harborgrid-justin/yellow-cross.git
   cd yellow-cross
   ```

2. **Run the complete setup:**
   ```bash
   npm run setup
   ```
   This will:
   - Install all dependencies
   - Create your `.env` file interactively
   - Generate Prisma client
   - Set up the database

3. **Start with Docker:**
   ```bash
   npm run docker:setup
   ```
   This will:
   - Build Docker images
   - Start PostgreSQL and the backend
   - Run database migrations
   - Start the application

4. **Access the application:**
   - Backend API: `http://localhost:3000`
   - Frontend: `http://localhost:3000` (static files served)
   - Prisma Studio: `npm run prisma:studio` (database GUI)

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
npm run prisma:seed        # Seed database with sample data
npm run prisma:reset       # Reset database (⚠️ deletes all data)
```

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

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL
```
Error: P1001: Can't reach database server
```

**Solution**:
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `.env`
3. Check PostgreSQL logs
4. For Docker: `docker-compose logs postgres`

### Prisma Client Issues

**Problem**: `@prisma/client` not found

**Solution**:
```bash
npm run prisma:generate
```

### Migration Issues

**Problem**: Migration failed or out of sync

**Solution**:
```bash
# Reset database (⚠️ deletes all data)
npm run prisma:reset

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

## 📖 Additional Documentation

- [FEATURES.md](./FEATURES.md) - Detailed feature documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API reference
- [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md) - Feature matrix

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or open an issue in the repository.

## 🎯 Roadmap

- [x] PostgreSQL migration with Prisma ORM
- [x] Docker containerization
- [x] Easy setup commands
- [x] Separate frontend/backend structure
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced AI/ML features for case prediction
- [ ] Blockchain integration for document verification
- [ ] Enhanced voice recognition for time tracking
- [ ] Advanced business intelligence features
- [ ] White-label solutions

---

**Yellow Cross - Built for Legal Excellence** 🏆
