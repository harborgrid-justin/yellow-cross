/**
 * Centralized Error Handling Middleware
 * Enterprise-grade error handling with proper logging and response formatting
 */

const logger = require('../config/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
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
const errorHandler = (err, req, res, _next) => {
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
  const response = {
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
const notFoundHandler = (req, res, next) => {
  // Serve index.html for non-API routes (SPA fallback)
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/health')) {
    const path = require('path');
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
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
