# Security Documentation - Yellow Cross

## 🔒 Security Overview

Yellow Cross implements enterprise-grade security measures to protect sensitive legal data and ensure compliance with industry standards.

## 🛡️ Security Features Implemented

### 1. Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **bcrypt password hashing** with configurable rounds (default: 10)
- **Role-Based Access Control (RBAC)** for granular permissions
- **Multi-Factor Authentication (MFA)** support (configurable via `ENABLE_MFA`)
- **Session timeout** controls (default: 30 minutes)

### 2. API Security
- **Helmet.js** for security headers (XSS, clickjacking, etc.)
- **CORS** configuration for cross-origin resource sharing
- **Rate limiting** to prevent abuse and DDoS attacks
  - Default: 100 requests per 15 minutes
  - Configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`
- **Input validation** using Joi schemas for all endpoints
- **SQL injection prevention** through Prisma ORM parameterized queries

### 3. Data Protection
- **PostgreSQL encryption** at rest (database-level)
- **HTTPS/TLS enforcement** in production
- **Secure password storage** with bcrypt
- **Environment variable management** for secrets
- **File upload validation** with size limits and type checking
- **Audit trails** for all data modifications

### 4. Network Security
- **IP whitelisting** support (configurable via `ENABLE_IP_WHITELIST`)
- **Firewall-ready** Docker configuration
- **Database connection encryption** via SSL/TLS
- **Port isolation** in Docker containers

## 🔐 Environment Variables Security

### Critical Security Variables

Never commit these to version control. Always use `.env` file (gitignored):

```bash
# Authentication
JWT_SECRET=<strong-random-secret>      # Use: openssl rand -base64 32
JWT_EXPIRATION=24h

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
POSTGRES_PASSWORD=<strong-password>

# Email
SMTP_PASSWORD=<your-smtp-password>

# API Keys
WESTLAW_API_KEY=<your-key>
LEXISNEXIS_API_KEY=<your-key>
DOCUSIGN_API_KEY=<your-key>
QUICKBOOKS_CLIENT_SECRET=<your-secret>
```

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate secure password
openssl rand -base64 24
```

## 🔍 Security Best Practices

### 1. Production Deployment
- [ ] Change all default passwords in `.env`
- [ ] Generate new JWT_SECRET
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable MFA (`ENABLE_MFA=true`)
- [ ] Set `NODE_ENV=production`
- [ ] Review and restrict CORS origins
- [ ] Configure backup encryption

### 2. Database Security
- [ ] Use strong PostgreSQL passwords
- [ ] Enable SSL for database connections
- [ ] Restrict database access to application IP only
- [ ] Regular database backups
- [ ] Implement backup encryption
- [ ] Review and limit user privileges

### 3. API Security
- [ ] Review rate limiting settings
- [ ] Implement API key rotation policy
- [ ] Monitor API usage and anomalies
- [ ] Log all authentication failures
- [ ] Implement request size limits

### 4. Code Security
- [ ] Regular dependency audits (`npm audit`)
- [ ] Keep dependencies up-to-date
- [ ] Code review for security vulnerabilities
- [ ] Static code analysis
- [ ] Penetration testing before production

## 🚨 Security Headers Implemented

Via Helmet.js, the following headers are automatically set:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Download-Options: noopen
X-DNS-Prefetch-Control: off
```

## 🔒 Data Retention & Privacy

### GDPR Compliance
- **Right to access**: Users can request their data
- **Right to erasure**: Data deletion capabilities
- **Data portability**: Export user data in standard formats
- **Consent management**: Explicit consent for data processing

### Data Retention Policies
- **Active cases**: Retained indefinitely
- **Closed cases**: 7 years minimum (configurable)
- **Audit logs**: 1 year minimum
- **Backups**: 30 days (configurable via `BACKUP_RETENTION_DAYS`)

### Data Classification
1. **Public**: Non-sensitive, public information
2. **Internal**: Business information, not public
3. **Confidential**: Sensitive business data, attorney-client privilege
4. **Restricted**: Highly sensitive, regulated data

## 🛠️ Security Configuration

### Rate Limiting Configuration

Edit in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # Max requests per window
```

### Session Configuration

```env
SESSION_TIMEOUT=1800000          # 30 minutes in milliseconds
JWT_EXPIRATION=24h               # JWT token expiration
```

### File Upload Security

```env
MAX_FILE_SIZE=52428800           # 50MB in bytes
UPLOAD_PATH=./uploads            # Upload directory
```

Allowed file types are validated in the application code.

## 🚨 Incident Response

### Security Incident Procedure

1. **Detect**: Monitor logs and alerts
2. **Assess**: Determine severity and scope
3. **Contain**: Isolate affected systems
4. **Eradicate**: Remove threat
5. **Recover**: Restore systems
6. **Review**: Post-incident analysis

### Contact Points
- **Security Team**: security@yellowcross.com
- **DevOps Team**: devops@yellowcross.com
- **Emergency**: 24/7 on-call rotation

### Reporting Security Issues

If you discover a security vulnerability:
1. **DO NOT** open a public GitHub issue
2. Email security@yellowcross.com with details
3. Include steps to reproduce
4. Allow time for patching before disclosure

## 🔄 Security Updates

### Dependency Management
- Run `npm audit` regularly
- Update dependencies promptly
- Test updates in staging before production
- Subscribe to security advisories for used packages

### Security Patches
- Critical: Deploy within 24 hours
- High: Deploy within 7 days
- Medium: Deploy within 30 days
- Low: Deploy with next regular update

## 📊 Security Monitoring

### Logging
All security events are logged using Winston:
- Authentication attempts (success/failure)
- Authorization failures
- API rate limit violations
- Data access/modifications
- Configuration changes

### Audit Trail
Every data modification includes:
- User ID
- Timestamp
- Action performed
- Before/after values (for updates)
- IP address
- User agent

### Alerts
Configure alerts for:
- Multiple failed login attempts
- Unusual API usage patterns
- Database connection failures
- Backup failures
- Certificate expiration warnings

## 📋 Compliance

### Industry Standards
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **SOC 2**: Service Organization Control 2
- **HIPAA**: Health Insurance Portability and Accountability Act (if handling medical records)
- **Bar Association Rules**: Professional responsibility and ethics

### Regular Audits
- **Quarterly**: Internal security review
- **Annually**: External security audit
- **Continuous**: Automated vulnerability scanning

## 🔧 Security Maintenance

### Weekly Tasks
- [ ] Review authentication logs
- [ ] Check for failed login patterns
- [ ] Monitor API usage
- [ ] Review backup status

### Monthly Tasks
- [ ] Run `npm audit` and update dependencies
- [ ] Review user access permissions
- [ ] Check SSL certificate expiration
- [ ] Review and rotate API keys

### Quarterly Tasks
- [ ] Security training for development team
- [ ] Penetration testing
- [ ] Disaster recovery drill
- [ ] Access control audit

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated**: 2024
**Version**: 1.0
**Maintained By**: Yellow Cross Security Team
