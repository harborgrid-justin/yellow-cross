/**
 * TwoFactorAuthService - TOTP-based two-factor authentication
 * Adapted from Twenty CRM 2FA system for Yellow Cross
 * 
 * @module TwoFactorAuthService
 * @see {@link https://github.com/twentyhq/twenty}
 */

import winston from 'winston';
import crypto from 'crypto';
import { User } from '../models/sequelize';
import ActivityService from './ActivityService';

/**
 * TwoFactorAuthService provides TOTP-based 2FA functionality
 * 
 * Features:
 * - TOTP token generation and verification (using built-in crypto)
 * - QR code data generation for authenticator apps
 * - Backup codes generation and validation
 * - 2FA enable/disable
 */
export class TwoFactorAuthService {
  private logger: winston.Logger;
  private appName: string;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
    this.appName = process.env.APP_NAME || 'Yellow Cross';
  }

  /**
   * Generate a secret for TOTP
   */
  generateSecret(): string {
    // Generate a 32-character base32 secret
    const buffer = crypto.randomBytes(20);
    return this.base32Encode(buffer);
  }

  /**
   * Generate TOTP token for given secret and time
   */
  private generateTOTP(secret: string, time?: number): string {
    const counter = Math.floor((time || Date.now()) / 30000);
    const secretBytes = this.base32Decode(secret);
    
    // Create counter buffer (8 bytes, big-endian)
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));
    
    // HMAC-SHA1
    const hmac = crypto.createHmac('sha1', secretBytes);
    hmac.update(counterBuffer);
    const hash = hmac.digest();
    
    // Dynamic truncation
    const offset = hash[hash.length - 1] & 0x0f;
    const truncatedHash = hash.readUInt32BE(offset) & 0x7fffffff;
    
    // Generate 6-digit code
    const code = (truncatedHash % 1000000).toString().padStart(6, '0');
    return code;
  }

  /**
   * Verify TOTP token
   */
  verifyToken(secret: string, token: string, window: number = 1): boolean {
    try {
      const now = Date.now();
      
      // Check current time and windows before/after (to account for time drift)
      for (let i = -window; i <= window; i++) {
        const time = now + (i * 30000);
        const expectedToken = this.generateTOTP(secret, time);
        
        if (expectedToken === token) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      this.logger.error('Failed to verify TOTP token', { error });
      return false;
    }
  }

  /**
   * Generate backup codes
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.substring(0, 4)}-${code.substring(4, 8)}`);
    }
    
    return codes;
  }

  /**
   * Hash backup codes for storage
   */
  private hashBackupCodes(codes: string[]): string[] {
    return codes.map(code => {
      return crypto.createHash('sha256').update(code).digest('hex');
    });
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(hashedCodes: string[], code: string): boolean {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    return hashedCodes.includes(hashedCode);
  }

  /**
   * Remove used backup code
   */
  removeBackupCode(hashedCodes: string[], code: string): string[] {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    return hashedCodes.filter(hc => hc !== hashedCode);
  }

  /**
   * Generate QR code data URL for authenticator apps
   */
  generateQRCodeData(userId: string, email: string, secret: string): string {
    // Format: otpauth://totp/{AppName}:{Email}?secret={Secret}&issuer={AppName}
    const label = encodeURIComponent(`${this.appName}:${email}`);
    const issuer = encodeURIComponent(this.appName);
    return `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  }

  /**
   * Enable 2FA for a user
   */
  async enableTwoFactor(userId: string): Promise<{
    secret: string;
    backupCodes: string[];
    qrCodeData: string;
  }> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.mfaEnabled) {
        throw new Error('2FA is already enabled for this user');
      }

      // Generate secret and backup codes
      const secret = this.generateSecret();
      const backupCodes = this.generateBackupCodes();
      const hashedBackupCodes = this.hashBackupCodes(backupCodes);

      // Update user
      await user.update({
        mfaSecret: secret,
        mfaBackupCodes: hashedBackupCodes,
        mfaEnabled: false // Will be enabled after verification
      });

      // Generate QR code data
      const qrCodeData = this.generateQRCodeData(userId, user.email, secret);

      // Log activity
      await ActivityService.logUserActivity(
        userId,
        '2fa_setup_initiated',
        '2FA setup initiated',
        userId
      );

      this.logger.info('2FA setup initiated', { userId });

      return {
        secret,
        backupCodes,
        qrCodeData
      };
    } catch (error) {
      this.logger.error('Failed to enable 2FA', { error, userId });
      throw error;
    }
  }

  /**
   * Verify and complete 2FA setup
   */
  async verifyAndEnableTwoFactor(userId: string, token: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.mfaEnabled) {
        throw new Error('2FA is already enabled');
      }

      if (!user.mfaSecret) {
        throw new Error('2FA setup not initiated. Please start setup first.');
      }

      // Verify token
      const isValid = this.verifyToken(user.mfaSecret, token);

      if (!isValid) {
        throw new Error('Invalid verification code');
      }

      // Enable 2FA
      await user.update({ mfaEnabled: true });

      // Log activity
      await ActivityService.logUserActivity(
        userId,
        '2fa_enabled',
        '2FA successfully enabled',
        userId
      );

      this.logger.info('2FA enabled', { userId });

      return true;
    } catch (error) {
      this.logger.error('Failed to verify and enable 2FA', { error, userId });
      throw error;
    }
  }

  /**
   * Verify 2FA token during login
   */
  async verifyTwoFactorLogin(userId: string, token: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.mfaEnabled || !user.mfaSecret) {
        throw new Error('2FA is not enabled for this user');
      }

      // Try TOTP token first
      const isValidToken = this.verifyToken(user.mfaSecret, token);
      
      if (isValidToken) {
        return true;
      }

      // Try backup code
      const isValidBackupCode = user.mfaBackupCodes && 
        this.verifyBackupCode(user.mfaBackupCodes, token);

      if (isValidBackupCode && user.mfaBackupCodes) {
        // Remove used backup code
        const updatedBackupCodes = this.removeBackupCode(user.mfaBackupCodes, token);
        await user.update({ mfaBackupCodes: updatedBackupCodes });

        // Log activity
        await ActivityService.logUserActivity(
          userId,
          '2fa_backup_code_used',
          'Backup code used for 2FA login',
          userId
        );

        this.logger.info('2FA login with backup code', { userId });
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Failed to verify 2FA login', { error, userId });
      return false;
    }
  }

  /**
   * Disable 2FA for a user
   */
  async disableTwoFactor(userId: string, token: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.mfaEnabled) {
        throw new Error('2FA is not enabled for this user');
      }

      // Verify token before disabling
      const isValid = await this.verifyTwoFactorLogin(userId, token);

      if (!isValid) {
        throw new Error('Invalid verification code');
      }

      // Disable 2FA
      await user.update({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null
      });

      // Log activity
      await ActivityService.logUserActivity(
        userId,
        '2fa_disabled',
        '2FA disabled',
        userId
      );

      this.logger.info('2FA disabled', { userId });

      return true;
    } catch (error) {
      this.logger.error('Failed to disable 2FA', { error, userId });
      throw error;
    }
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string, token: string): Promise<string[]> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.mfaEnabled) {
        throw new Error('2FA is not enabled for this user');
      }

      // Verify token
      const isValid = this.verifyToken(user.mfaSecret!, token);

      if (!isValid) {
        throw new Error('Invalid verification code');
      }

      // Generate new backup codes
      const backupCodes = this.generateBackupCodes();
      const hashedBackupCodes = this.hashBackupCodes(backupCodes);

      // Update user
      await user.update({ mfaBackupCodes: hashedBackupCodes });

      // Log activity
      await ActivityService.logUserActivity(
        userId,
        '2fa_backup_codes_regenerated',
        'Backup codes regenerated',
        userId
      );

      this.logger.info('Backup codes regenerated', { userId });

      return backupCodes;
    } catch (error) {
      this.logger.error('Failed to regenerate backup codes', { error, userId });
      throw error;
    }
  }

  /**
   * Get 2FA status for a user
   */
  async getTwoFactorStatus(userId: string): Promise<{
    enabled: boolean;
    backupCodesRemaining?: number;
  }> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        enabled: user.mfaEnabled,
        backupCodesRemaining: user.mfaBackupCodes?.length || 0
      };
    } catch (error) {
      this.logger.error('Failed to get 2FA status', { error, userId });
      throw error;
    }
  }

  /**
   * Base32 encoding
   */
  private base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }

    return output;
  }

  /**
   * Base32 decoding
   */
  private base32Decode(str: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = Buffer.alloc(Math.ceil(str.length * 5 / 8));

    for (let i = 0; i < str.length; i++) {
      const idx = alphabet.indexOf(str[i].toUpperCase());
      if (idx === -1) continue;

      value = (value << 5) | idx;
      bits += 5;

      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 255;
        bits -= 8;
      }
    }

    return output.slice(0, index);
  }
}

export default new TwoFactorAuthService();
