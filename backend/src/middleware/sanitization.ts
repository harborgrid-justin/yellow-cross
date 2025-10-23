/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */

import { Request, Response, NextFunction } from 'express';

/**
 * HTML entities that should be escaped
 */
const htmlEntities: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return String(text).replace(/[&<>"'\/]/g, (char) => htmlEntities[char]);
}

/**
 * Sanitize a value recursively
 */
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Trim whitespace and escape HTML
    return escapeHtml(value.trim());
  } else if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (value !== null && typeof value === 'object') {
    const sanitized: any = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }
  return value;
}

/**
 * Middleware to sanitize request body, query, and params
 */
export function sanitizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  
  next();
}

export default sanitizationMiddleware;
