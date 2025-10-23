# Environment Variables Documentation

Complete reference for all environment variables used in Yellow Cross application.

## Server Configuration

### NODE_ENV
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `staging`, `production`
- **Description**: Application environment mode
- **Required**: No
- **Example**: `NODE_ENV=production`

### PORT
- **Type**: Number
- **Default**: `3000`
- **Description**: Port number for the application server
- **Required**: No
- **Example**: `PORT=8080`

---

## Database Configuration

### DATABASE_URL
- **Type**: String (Connection URI)
- **Description**: PostgreSQL database connection string
- **Required**: Yes
- **Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=[mode]`
- **Example**: `postgresql://user:pass@localhost:5432/yellowcross`
- **Note**: For production, use Neon DB or similar cloud PostgreSQL

### POSTGRES_USER
- **Type**: String
- **Default**: `yellowcross`
- **Description**: PostgreSQL username (for Docker setup)
- **Required**: Yes (for Docker)
- **Example**: `POSTGRES_USER=yellowcross`

### POSTGRES_PASSWORD
- **Type**: String
- **Default**: `yellowcross_dev`
- **Description**: PostgreSQL password (for Docker setup)
- **Required**: Yes (for Docker)
- **Security**: Use strong password in production
- **Example**: `POSTGRES_PASSWORD=SecureP@ssw0rd123!`

### POSTGRES_DB
- **Type**: String
- **Default**: `yellowcross`
- **Description**: PostgreSQL database name
- **Required**: Yes (for Docker)
- **Example**: `POSTGRES_DB=yellowcross_prod`

### POSTGRES_PORT
- **Type**: Number
- **Default**: `5432`
- **Description**: PostgreSQL port number
- **Required**: No
- **Example**: `POSTGRES_PORT=5432`

---

## Security Configuration

### JWT_SECRET
- **Type**: String
- **Description**: Secret key for signing JWT access tokens
- **Required**: Yes
- **Security**: CRITICAL - Must be strong (32+ characters) and kept secret
- **Example**: `JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Note**: Change default value before production deployment

### JWT_REFRESH_SECRET
- **Type**: String
- **Description**: Secret key for signing JWT refresh tokens
- **Required**: Yes
- **Security**: CRITICAL - Must be different from JWT_SECRET
- **Example**: `JWT_REFRESH_SECRET=p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1`
- **Note**: Used for token rotation mechanism

### JWT_EXPIRY
- **Type**: String (Time Duration)
- **Default**: `1h`
- **Description**: Expiration time for JWT access tokens
- **Required**: No
- **Format**: Use time strings like '15m', '1h', '2d'
- **Example**: `JWT_EXPIRY=15m`
- **Security**: Shorter expiry increases security

### JWT_REFRESH_EXPIRY
- **Type**: String (Time Duration)
- **Default**: `7d`
- **Description**: Expiration time for JWT refresh tokens
- **Required**: No
- **Format**: Use time strings like '7d', '30d'
- **Example**: `JWT_REFRESH_EXPIRY=14d`

### BCRYPT_ROUNDS
- **Type**: Number
- **Default**: `10`
- **Description**: Number of bcrypt hashing rounds for passwords
- **Required**: No
- **Range**: 10-14 recommended
- **Example**: `BCRYPT_ROUNDS=12`
- **Note**: Higher values increase security but slow hashing

---

## Rate Limiting

### RATE_LIMIT_WINDOW_MS
- **Type**: Number (milliseconds)
- **Default**: `900000` (15 minutes)
- **Description**: Time window for rate limiting
- **Required**: No
- **Example**: `RATE_LIMIT_WINDOW_MS=600000`

### RATE_LIMIT_MAX_REQUESTS
- **Type**: Number
- **Default**: `100`
- **Description**: Maximum requests allowed per window
- **Required**: No
- **Example**: `RATE_LIMIT_MAX_REQUESTS=50`

---

## Email Configuration

### SMTP_HOST
- **Type**: String
- **Description**: SMTP server hostname
- **Required**: Yes (if email features enabled)
- **Example**: `SMTP_HOST=smtp.gmail.com`

### SMTP_PORT
- **Type**: Number
- **Default**: `587`
- **Description**: SMTP server port
- **Required**: Yes (if email features enabled)
- **Common Ports**: 25, 465 (SSL), 587 (TLS)
- **Example**: `SMTP_PORT=587`

### SMTP_USER
- **Type**: String
- **Description**: SMTP authentication username
- **Required**: Yes (if email features enabled)
- **Example**: `SMTP_USER=notifications@yellowcross.com`

### SMTP_PASSWORD
- **Type**: String
- **Description**: SMTP authentication password
- **Required**: Yes (if email features enabled)
- **Security**: Keep confidential
- **Example**: `SMTP_PASSWORD=your-smtp-password`

### FROM_EMAIL
- **Type**: String (Email Address)
- **Description**: Default sender email address
- **Required**: Yes (if email features enabled)
- **Example**: `FROM_EMAIL=noreply@yellowcross.com`

---

## File Upload Configuration

### MAX_FILE_SIZE
- **Type**: Number (bytes)
- **Default**: `52428800` (50 MB)
- **Description**: Maximum file upload size
- **Required**: No
- **Example**: `MAX_FILE_SIZE=104857600` (100 MB)

### UPLOAD_PATH
- **Type**: String (File Path)
- **Default**: `./uploads`
- **Description**: Directory path for uploaded files
- **Required**: No
- **Example**: `UPLOAD_PATH=/var/www/uploads`
- **Note**: Ensure directory has write permissions

---

## Integration API Keys

### WESTLAW_API_KEY
- **Type**: String
- **Description**: API key for Westlaw legal research integration
- **Required**: No (optional integration)
- **Example**: `WESTLAW_API_KEY=wl_1234567890abcdef`

### LEXISNEXIS_API_KEY
- **Type**: String
- **Description**: API key for LexisNexis legal research integration
- **Required**: No (optional integration)
- **Example**: `LEXISNEXIS_API_KEY=ln_abcdef1234567890`

### DOCUSIGN_API_KEY
- **Type**: String
- **Description**: API key for DocuSign e-signature integration
- **Required**: No (optional integration)
- **Example**: `DOCUSIGN_API_KEY=ds_fedcba0987654321`

### QUICKBOOKS_CLIENT_ID
- **Type**: String
- **Description**: Client ID for QuickBooks accounting integration
- **Required**: No (optional integration)
- **Example**: `QUICKBOOKS_CLIENT_ID=qb_client_123456`

### QUICKBOOKS_CLIENT_SECRET
- **Type**: String
- **Description**: Client secret for QuickBooks accounting integration
- **Required**: No (optional integration)
- **Security**: Keep confidential
- **Example**: `QUICKBOOKS_CLIENT_SECRET=qb_secret_abcdef`

---

## Security Settings

### SESSION_TIMEOUT
- **Type**: Number (milliseconds)
- **Default**: `1800000` (30 minutes)
- **Description**: Session timeout duration
- **Required**: No
- **Example**: `SESSION_TIMEOUT=3600000` (1 hour)

### ENABLE_MFA
- **Type**: Boolean
- **Default**: `true`
- **Description**: Enable/disable multi-factor authentication
- **Required**: No
- **Example**: `ENABLE_MFA=true`
- **Security**: Recommended for production

### ENABLE_IP_WHITELIST
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable/disable IP whitelisting
- **Required**: No
- **Example**: `ENABLE_IP_WHITELIST=true`
- **Note**: Configure allowed IPs separately if enabled

---

## Backup Configuration

### BACKUP_ENABLED
- **Type**: Boolean
- **Default**: `true`
- **Description**: Enable/disable automatic database backups
- **Required**: No
- **Example**: `BACKUP_ENABLED=true`

### BACKUP_SCHEDULE
- **Type**: String (Cron Expression)
- **Default**: `0 2 * * *` (2 AM daily)
- **Description**: Backup schedule in cron format
- **Required**: No (if BACKUP_ENABLED=true)
- **Example**: `BACKUP_SCHEDULE=0 3 * * 0` (3 AM Sunday)

### BACKUP_RETENTION_DAYS
- **Type**: Number
- **Default**: `30`
- **Description**: Number of days to retain backups
- **Required**: No
- **Example**: `BACKUP_RETENTION_DAYS=90`

---

## Logging Configuration

### LOG_LEVEL
- **Type**: String
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `debug`
- **Description**: Logging level for application logs
- **Required**: No
- **Example**: `LOG_LEVEL=debug`
- **Note**: Use 'error' or 'warn' in production

### LOG_FILE
- **Type**: String (File Path)
- **Default**: `./logs/app.log`
- **Description**: Path to log file
- **Required**: No
- **Example**: `LOG_FILE=/var/log/yellowcross/app.log`
- **Note**: Ensure directory exists and has write permissions

---

## CORS Configuration

### FRONTEND_URL
- **Type**: String (URL)
- **Description**: Frontend application URL for CORS
- **Required**: Yes (production)
- **Example**: `FRONTEND_URL=https://yellowcross.com`
- **Security**: Limits CORS to specific domain

### ADMIN_URL
- **Type**: String (URL)
- **Description**: Admin panel URL for CORS
- **Required**: No
- **Example**: `ADMIN_URL=https://admin.yellowcross.com`

---

## Production Deployment Checklist

### Critical Variables to Change
1. ✅ `JWT_SECRET` - Use strong random string (32+ characters)
2. ✅ `JWT_REFRESH_SECRET` - Different from JWT_SECRET
3. ✅ `POSTGRES_PASSWORD` - Use strong password
4. ✅ `SMTP_PASSWORD` - Your SMTP credentials
5. ✅ `DATABASE_URL` - Production database connection

### Security Best Practices
- Never commit `.env` file to version control
- Use environment-specific `.env.production`, `.env.staging`
- Rotate secrets regularly
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)
- Enable MFA in production (`ENABLE_MFA=true`)
- Use shorter JWT expiry in production (`JWT_EXPIRY=15m`)
- Set `LOG_LEVEL=warn` or `error` in production

### Validation
Run the setup verification to check configuration:
```bash
npm run setup:verify
```

---

**Last Updated**: 2025-10-23  
**Version**: 2.0.0
