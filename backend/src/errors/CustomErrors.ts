/**
 * Custom Error Types for SOA-Aligned Error Handling
 * Provides specific error types for better error handling and debugging
 */

/**
 * Base Application Error
 */
export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly cause?: Error;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Database Operation Error
 */
export class DatabaseError extends ApplicationError {
  constructor(message: string, cause?: Error) {
    super(message, 500, true, cause);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApplicationError {
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message, 400, true);
    this.details = details;
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApplicationError {
  public readonly resource: string;

  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(message, 404, true);
    this.resource = resource;
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true);
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true);
  }
}

/**
 * Conflict Error (e.g., duplicate entry)
 */
export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 409, true);
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends ApplicationError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, true);
    this.retryAfter = retryAfter;
  }
}

/**
 * Service Unavailable Error
 */
export class ServiceUnavailableError extends ApplicationError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, true);
  }
}

/**
 * External Service Error
 */
export class ExternalServiceError extends ApplicationError {
  public readonly service: string;

  constructor(service: string, message: string, cause?: Error) {
    super(`External service error (${service}): ${message}`, 502, true, cause);
    this.service = service;
  }
}
