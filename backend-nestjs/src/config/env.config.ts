/**
 * Environment Configuration Module for NestJS
 * Validates and provides typed environment variables
 */

import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-to-a-secure-secret-key',
    expiration: process.env.JWT_EXPIRATION || '24h',
  },
  
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '1800000', 10),
    enableMfa: process.env.ENABLE_MFA === 'true',
    enableIpWhitelist: process.env.ENABLE_IP_WHITELIST === 'true',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE,
  },
  
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE,
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  },
}));
