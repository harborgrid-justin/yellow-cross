/**
 * CORS Configuration
 * Secure Cross-Origin Resource Sharing configuration
 */

import { CorsOptions } from 'cors';

/**
 * Allowed origins based on environment
 */
const getAllowedOrigins = (): string[] => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (nodeEnv === 'production') {
    // Production: Only allow specific domains
    return [
      process.env.FRONTEND_URL || 'https://yellowcross.com',
      process.env.ADMIN_URL || 'https://admin.yellowcross.com'
    ].filter(Boolean);
  } else if (nodeEnv === 'staging') {
    // Staging: Allow staging domains
    return [
      'https://staging.yellowcross.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
  } else {
    // Development: Allow local development
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
  }
};

/**
 * CORS configuration options
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Correlation-ID',
    'X-Request-ID'
  ],
  exposedHeaders: [
    'X-Correlation-ID',
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining'
  ],
  maxAge: 86400 // 24 hours
};

export default corsOptions;
