# NestJS Migration Guide

This document provides a comprehensive guide to the NestJS migration of the Yellow Cross backend.

## Overview

The backend has been **100% migrated from Express.js to NestJS**, maintaining all 60 enterprise-grade features while adopting NestJS best practices and architecture patterns.

## Architecture

### Project Structure

```
backend-nestjs/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   │   └── logger.config.ts
│   ├── decorators/          # Custom decorators
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/              # Authentication & authorization guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── models/              # Sequelize models
│   │   └── sequelize/       # All 85+ Sequelize model definitions
│   ├── modules/             # Feature modules (60 total)
│   │   ├── auth/           # Authentication module
│   │   ├── case/           # Case management
│   │   ├── client/         # Client CRM
│   │   ├── common/         # Shared services (BaseService)
│   │   └── ...             # 56 additional feature modules
│   ├── errors/             # Custom error classes
│   ├── validators/         # Input validation schemas
│   ├── utils/              # Utility functions
│   ├── app.module.ts       # Root application module
│   ├── app.controller.ts   # Root controller
│   └── main.ts             # Application bootstrap
├── test/                   # E2E tests
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### Key Features

#### 1. **Dependency Injection**
NestJS provides a robust dependency injection system that automatically manages service instantiation and lifecycle.

```typescript
@Injectable()
export class CaseService extends BaseService<Case> {
  constructor(
    @InjectModel(Case)
    caseModel: typeof Case,
  ) {
    super(caseModel);
  }
}
```

#### 2. **Modular Architecture**
Each feature is organized as a self-contained module with its own:
- **Controller**: Handles HTTP requests
- **Service**: Contains business logic
- **Module**: Declares dependencies and exports

Example:
```typescript
@Module({
  imports: [SequelizeModule.forFeature([Case])],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}
```

#### 3. **Authentication & Authorization**

**JWT Strategy:**
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

**Guards:**
- `JwtAuthGuard`: Validates JWT tokens
- `RolesGuard`: Enforces role-based access control

**Usage:**
```typescript
@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CaseController {
  @Get()
  async findAll() {
    // Only authenticated users can access
  }
  
  @Post()
  @Roles('admin', 'lawyer')
  @UseGuards(RolesGuard)
  async create() {
    // Only admin or lawyer roles can create
  }
}
```

#### 4. **Configuration Management**

Configuration is centralized using `@nestjs/config`:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
  ],
})
```

Access configuration in services:
```typescript
constructor(private configService: ConfigService) {
  const port = this.configService.get<number>('app.port');
}
```

#### 5. **Database Integration**

Sequelize is integrated using `@nestjs/sequelize`:

```typescript
SequelizeModule.forRoot(databaseConfig())
```

Models are registered per-module:
```typescript
SequelizeModule.forFeature([Case, CaseNote, CaseTimelineEvent])
```

#### 6. **BaseService Pattern**

All services extend a common `BaseService` class that provides standard CRUD operations:

```typescript
export class BaseService<T extends Model> {
  async create(data: Partial<T>): Promise<T>
  async findById(id: string): Promise<T | null>
  async findAll(options?: FindOptions): Promise<T[]>
  async update(id: string, data: Partial<T>): Promise<T | null>
  async delete(id: string): Promise<boolean>
  async count(options?: FindOptions): Promise<number>
}
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Core Endpoints

- `GET /api` - Platform information and feature list
- `GET /api/health` - Health check endpoint

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile (authenticated)

### Feature Modules (60 total)

Each module provides standard CRUD endpoints:

| Module | Base Path | Description |
|--------|-----------|-------------|
| Case Management | `/api/cases` | Case management operations |
| Client CRM | `/api/clients` | Client relationship management |
| Document Management | `/api/documents` | Document handling |
| Time & Billing | `/api/billing` | Time tracking and billing |
| Calendar | `/api/calendar` | Scheduling and events |
| Task Management | `/api/tasks` | Task and workflow management |
| ... | ... | 54 additional modules |

Standard CRUD operations for each module:
- `GET /api/{module}` - List all
- `GET /api/{module}/:id` - Get by ID
- `POST /api/{module}` - Create new
- `PUT /api/{module}/:id` - Update existing
- `DELETE /api/{module}/:id` - Delete

## Running the Application

### Development

```bash
# Start in development mode (with hot reload)
npm run start:dev

# Start in watch mode
npm run start:debug
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Security
BCRYPT_ROUNDS=10
SESSION_TIMEOUT=1800000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Migration from Express

### Key Differences

1. **Routing**: Express route handlers → NestJS Controllers
2. **Middleware**: Express middleware → NestJS Guards/Interceptors
3. **Dependency Management**: Manual imports → Dependency Injection
4. **Configuration**: dotenv + manual loading → @nestjs/config
5. **Error Handling**: Express error middleware → Exception Filters

### Code Comparison

**Express:**
```typescript
app.get('/api/cases', authenticate, async (req, res) => {
  const cases = await Case.findAll();
  res.json(cases);
});
```

**NestJS:**
```typescript
@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CaseController {
  @Get()
  async findAll() {
    return this.caseService.findAll();
  }
}
```

## Best Practices

1. **Use Dependency Injection**: Let NestJS manage service instances
2. **Keep Controllers Thin**: Business logic belongs in services
3. **Use DTOs**: Validate and transform input data
4. **Leverage Guards**: Implement authentication/authorization at the route level
5. **Use Interceptors**: For cross-cutting concerns (logging, transformation)
6. **Write Tests**: NestJS has excellent testing support
7. **Follow Module Boundaries**: Keep related functionality together

## Compliance with NestJS Standards

This implementation follows all NestJS best practices as documented at:
https://api-references-nestjs.netlify.app/api

✅ Module-based architecture  
✅ Dependency injection  
✅ Decorators for routing and metadata  
✅ Guards for authentication/authorization  
✅ Pipes for validation  
✅ Exception filters for error handling  
✅ Interceptors for request/response transformation  
✅ Configuration management  
✅ Database integration (Sequelize)  
✅ Testing infrastructure  

## Support

For issues or questions about the NestJS implementation, please refer to:
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS API Reference](https://api-references-nestjs.netlify.app/api)
