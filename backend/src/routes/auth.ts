/**
 * Authentication Routes
 * Convenience wrapper for security authentication endpoints
 */

import express from 'express';
import security from '../features/security';

const router = express.Router();

// Forward all /api/auth/* requests to the security feature's /auth/* routes
// This creates a convenience alias so /api/auth/login works instead of /api/security/auth/login
router.use('/', security);

export default router;
