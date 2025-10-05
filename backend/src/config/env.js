/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 * Following 12-factor app principles
 */

const logger = require('./logger');

/**
 * Define required environment variables
 */
const requiredVars = [
  'NODE_ENV',
];

/**
 * Define optional environment variables with defaults
 */
const optionalVars = {
  PORT: '3000',
  JWT_EXPIRATION: '24h',
  BCRYPT_ROUNDS: '10',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100',
  MAX_FILE_SIZE: '52428800',
  SESSION_TIMEOUT: '1800000',
  ENABLE_MFA: 'false',
  ENABLE_IP_WHITELIST: 'false',
  BACKUP_ENABLED: 'false',
  LOG_LEVEL: 'info',
};

/**
 * Validate environment variables
 */
const validateEnv = () => {
  const errors = [];
  const warnings = [];
  
  // Check required variables
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Check for production-specific requirements
  if (process.env.NODE_ENV === 'production') {
    const productionVars = ['JWT_SECRET', 'DATABASE_URL'];
    
    productionVars.forEach((varName) => {
      if (!process.env[varName]) {
        errors.push(`Missing production environment variable: ${varName}`);
      }
    });
    
    // Warn if using default/weak secrets
    if (process.env.JWT_SECRET && 
        (process.env.JWT_SECRET.includes('change-this') || 
         process.env.JWT_SECRET.includes('secret-key'))) {
      warnings.push('JWT_SECRET appears to be a default value. Please use a strong secret in production.');
    }
  }
  
  // Set defaults for optional variables
  Object.entries(optionalVars).forEach(([key, defaultValue]) => {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      if (process.env.NODE_ENV !== 'test') {
        logger.debug(`Using default value for ${key}: ${defaultValue}`);
      }
    }
  });
  
  // Report errors and warnings
  if (errors.length > 0) {
    errors.forEach((error) => logger.error(error));
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
  
  if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    warnings.forEach((warning) => logger.warn(warning));
  }
  
  if (process.env.NODE_ENV !== 'test') {
    logger.info('Environment validation passed');
  }
  
  return true;
};

/**
 * Get validated environment configuration
 */
const getConfig = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10),
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiration: process.env.JWT_EXPIRATION,
    },
    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10),
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT, 10),
      enableMfa: process.env.ENABLE_MFA === 'true',
      enableIpWhitelist: process.env.ENABLE_IP_WHITELIST === 'true',
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10),
      uploadPath: process.env.UPLOAD_PATH || './uploads',
    },
    logging: {
      level: process.env.LOG_LEVEL,
      file: process.env.LOG_FILE,
    },
    backup: {
      enabled: process.env.BACKUP_ENABLED === 'true',
      schedule: process.env.BACKUP_SCHEDULE,
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
    },
  };
};

module.exports = {
  validateEnv,
  getConfig,
};
