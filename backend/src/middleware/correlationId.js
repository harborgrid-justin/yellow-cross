/**
 * Correlation ID Middleware
 * Adds unique request IDs for distributed tracing
 * Following Google Cloud Trace best practices
 */

const crypto = require('crypto');

/**
 * Generate a unique correlation ID for request tracking
 */
const generateCorrelationId = () => {
  return crypto.randomUUID();
};

/**
 * Middleware to add correlation ID to each request
 * Checks for existing X-Correlation-ID header or generates new one
 */
const correlationIdMiddleware = (req, res, next) => {
  // Check if correlation ID already exists in headers
  const correlationId = req.headers['x-correlation-id'] || 
                        req.headers['x-request-id'] ||
                        generateCorrelationId();
  
  // Attach to request object
  req.correlationId = correlationId;
  
  // Add to response headers
  res.setHeader('X-Correlation-ID', correlationId);
  
  next();
};

module.exports = correlationIdMiddleware;
