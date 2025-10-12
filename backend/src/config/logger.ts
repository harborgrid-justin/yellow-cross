/**
 * Structured Logging Configuration
 * Enterprise-grade logging with Winston
 * Following Google's Cloud Logging best practices
 */

import winston from 'winston';
import path from 'path';
import { Request, Response } from 'express';

// Define log levels following RFC 5424 (syslog)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Determine log level from environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : process.env.LOG_LEVEL || 'info';
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Define transports
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? format : consoleFormat,
  })
);

// File transports for production
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE) {
  const logDir = process.env.LOG_FILE ? path.dirname(process.env.LOG_FILE) : './logs';
  const logFileName = process.env.LOG_FILE ? path.basename(process.env.LOG_FILE) : 'app.log';
  
  // All logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, logFileName),
      format,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
  
  // Error logs separately
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
}

// Define custom logger type without extending winston.Logger to avoid conflicts
type ExtendedLogger = winston.Logger & {
  stream: {
    write: (message: string) => void;
  };
  logRequest: (req: Request & { correlationId?: string }, metadata?: Record<string, any>) => void;
  logResponse: (req: Request & { correlationId?: string }, res: Response, metadata?: Record<string, any>) => void;
  logError: (error: Error, req?: Request & { correlationId?: string } | null, metadata?: Record<string, any>) => void;
  logDatabase: (operation: string, metadata?: Record<string, any>) => void;
  logSecurity: (event: string, metadata?: Record<string, any>) => void;
};

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
}) as any as ExtendedLogger;

// Create a stream object for Morgan HTTP logger (use type assertion to avoid conflict with winston.Logger's stream method)
(logger as any).stream = {
  write: (message: string) => logger.http(message.trim()),
};

// Helper methods for structured logging
logger.logRequest = (req: Request & { correlationId?: string }, metadata: Record<string, any> = {}) => {
  logger.info('HTTP Request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    correlationId: req.correlationId,
    ...metadata,
  });
};

logger.logResponse = (req: Request & { correlationId?: string }, res: Response, metadata: Record<string, any> = {}) => {
  logger.info('HTTP Response', {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    correlationId: req.correlationId,
    ...metadata,
  });
};

logger.logError = (error: Error, req: (Request & { correlationId?: string }) | null = null, metadata: Record<string, any> = {}) => {
  const errorLog: Record<string, any> = {
    message: error.message,
    stack: error.stack,
    ...metadata,
  };
  
  if (req) {
    errorLog.method = req.method;
    errorLog.path = req.path;
    errorLog.correlationId = req.correlationId;
  }
  
  logger.error('Application Error', errorLog);
};

logger.logDatabase = (operation: string, metadata: Record<string, any> = {}) => {
  logger.debug('Database Operation', {
    operation,
    ...metadata,
  });
};

logger.logSecurity = (event: string, metadata: Record<string, any> = {}) => {
  logger.warn('Security Event', {
    event,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

// Suppress logs in test environment unless explicitly enabled
if (process.env.NODE_ENV === 'test' && !process.env.ENABLE_TEST_LOGS) {
  logger.transports.forEach((t) => (t.silent = true));
}

export default logger;
