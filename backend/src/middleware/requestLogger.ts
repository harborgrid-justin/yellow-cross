/**
 * Request Logging Middleware
 * Logs HTTP requests with timing and response details
 */

import logger from '../config/logger';

/**
 * Log incoming HTTP requests and responses
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    correlationId: req.correlationId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  
  // Capture the original res.json and res.send to log response
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  
  // Override res.json
  res.json = function(body) {
    const duration = Date.now() - startTime;
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      correlationId: req.correlationId,
    });
    return originalJson(body);
  };
  
  // Override res.send
  res.send = function(body) {
    const duration = Date.now() - startTime;
    logger.info('Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      correlationId: req.correlationId,
    });
    return originalSend(body);
  };
  
  next();
};

export default requestLogger;
