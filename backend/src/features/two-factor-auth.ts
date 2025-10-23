/**
 * Two-Factor Authentication Feature - TOTP-based 2FA endpoints
 * Provides 2FA setup, verification, and management
 */

import { Router, Request, Response } from 'express';
import TwoFactorAuthService from '../services/TwoFactorAuthService';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route GET /api/2fa/status
 * @desc Get 2FA status for current user
 */
router.get('/status', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const status = await TwoFactorAuthService.getTwoFactorStatus(userId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get 2FA status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/2fa/setup
 * @desc Initiate 2FA setup
 */
router.post('/setup', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const result = await TwoFactorAuthService.enableTwoFactor(userId);

    res.json({
      success: true,
      message: 'Scan the QR code with your authenticator app and verify with a code',
      data: {
        qrCodeData: result.qrCodeData,
        secret: result.secret,
        backupCodes: result.backupCodes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to setup 2FA',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/2fa/verify-setup
 * @desc Verify 2FA setup with token
 */
router.post('/verify-setup', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const success = await TwoFactorAuthService.verifyAndEnableTwoFactor(userId, token);

    res.json({
      success,
      message: success ? '2FA enabled successfully' : 'Failed to enable 2FA'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA setup',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/2fa/verify
 * @desc Verify 2FA token during login
 */
router.post('/verify', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const isValid = await TwoFactorAuthService.verifyTwoFactorLogin(userId, token);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    res.json({
      success: true,
      message: '2FA verification successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify 2FA token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/2fa/disable
 * @desc Disable 2FA for current user
 */
router.post('/disable', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required to disable 2FA'
      });
    }

    const success = await TwoFactorAuthService.disableTwoFactor(userId, token);

    res.json({
      success,
      message: success ? '2FA disabled successfully' : 'Failed to disable 2FA'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route POST /api/2fa/regenerate-backup-codes
 * @desc Regenerate backup codes
 */
router.post('/regenerate-backup-codes', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required to regenerate backup codes'
      });
    }

    const backupCodes = await TwoFactorAuthService.regenerateBackupCodes(userId, token);

    res.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      data: {
        backupCodes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
