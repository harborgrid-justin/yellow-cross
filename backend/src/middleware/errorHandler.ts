/**
 * Centralized Error Handling Middleware
 * Enterprise-grade error handling with proper logging and response formatting
 */

import logger from '../config/logger';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ApplicationError } from '../errors/CustomErrors';
import { errorResponse } from '../utils/apiResponse';

/**
 * Custom error class for API errors
 * @deprecated Use ApplicationError and its subclasses from ../errors/CustomErrors instead
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
 * Centralizes error handling and logging with standardized responses
 */
const errorHandler = (err: any, req: Request & { correlationId?: string }, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.name || 'INTERNAL_SERVER_ERROR';
  
  // Log the error
  logger.logError(err, req, {
    statusCode,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  
  // Handle ApplicationError and its subclasses
  if (err instanceof ApplicationError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.name;
  }
  
  // Handle Joi validation errors
  if (err.name === 'ValidationError' && err.details) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  }
  
  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorCode = 'DATABASE_VALIDATION_ERROR';
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    message = 'A record with this value already exists';
  }
  
  // Create standardized error response
  const response = errorResponse(
    message,
    errorCode,
    process.env.NODE_ENV === 'development' ? (err.details || err.stack) : undefined,
    req.correlationId
  );
  
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
