/**
 * Structured Logging Configuration for NestJS
 * Enterprise-grade logging with Winston
 */

import * as winston from 'winston';
import * as path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors
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

// Console transport
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? format : consoleFormat,
  })
);

// File transports for production
if (process.env.NODE_ENV === 'production' || process.env.LOG_FILE) {
  const logDir = process.env.LOG_FILE ? path.dirname(process.env.LOG_FILE) : './logs';
  const logFileName = process.env.LOG_FILE ? path.basename(process.env.LOG_FILE) : 'app.log';
  
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, logFileName),
      format,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
  
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

// Create and export the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Suppress logs in test environment
if (process.env.NODE_ENV === 'test' && !process.env.ENABLE_TEST_LOGS) {
  logger.transports.forEach((t) => (t.silent = true));
}
