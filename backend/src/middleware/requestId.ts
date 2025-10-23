/**
 * Request ID Middleware
 * Adds X-Request-ID header for request tracking
 * Works alongside correlation ID for comprehensive tracing
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Middleware to add request ID to each request
 * Similar to correlation ID but specifically for single request tracking
 */
export function requestIdMiddleware(
  req: Request & { id?: string },
  res: Response,
  next: NextFunction
): void {
  // Generate or extract request ID
  const requestId = req.header('X-Request-ID') || crypto.randomUUID();
  
  // Attach to request object
  req.id = requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
}

export default requestIdMiddleware;
