/**
 * Authentication Routes
 * JWT-based authentication and authorization endpoints
 */

import express from 'express';
import authFeature from '../features/auth';

const router = express.Router();

// Use the new authentication feature
router.use('/', authFeature);

export default router;
