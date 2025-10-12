/**
 * Centralized Error Handling Middleware
 * Enterprise-grade error handling with proper logging and response formatting
 */

import logger from '../config/logger';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * Centralizes error handling and logging
 */
const errorHandler = (err: any, req: Request & { correlationId?: string }, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  
  // Default to 500 if no status code
  if (!statusCode) {
    statusCode = 500;
    message = message || 'Internal Server Error';
  }
  
  // Log the error
  logger.logError(err, req, {
    statusCode,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  
  // Prepare error response
  const response: any = {
    success: false,
    error: {
      code: statusCode,
      message: message,
      correlationId: req.correlationId,
    },
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }
  
  // Add validation errors if present
  if (err.details) {
    response.error.details = err.details;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Handle 404 - Not Found
 * Serves index.html for non-API routes (SPA fallback)
 */
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // Serve index.html for non-API routes (SPA fallback)
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/health')) {
    return res.sendFile(path.join(__dirname, '../../../dist/index.html'));
  }
  
  // For API routes, return 404 error
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export {

  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler,

};
