/**
 * User Model - Sequelize Model for Security & Access Control
 * Comprehensive data model for user management and authentication
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  BeforeCreate,
  BeforeUpdate,
  Default,
  IsEmail,
  Unique,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  userId!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  username!: string;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Column(DataType.STRING)
  email!: string;

  // Authentication
  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.JSONB)
  passwordHistory?: object;

  @Column(DataType.DATE)
  passwordExpiresAt?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  mustChangePassword!: boolean;

  // Multi-Factor Authentication
  @Default(false)
  @Column(DataType.BOOLEAN)
  mfaEnabled!: boolean;

  @Column(DataType.STRING)
  mfaSecret?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  mfaBackupCodes?: string[];

  // Profile Information
  @Column(DataType.STRING)
  firstName?: string;

  @Column(DataType.STRING)
  lastName?: string;

  @Column(DataType.STRING)
  fullName?: string;

  @Column(DataType.STRING)
  jobTitle?: string;

  @Column(DataType.STRING)
  department?: string;

  @Column(DataType.STRING)
  phoneNumber?: string;

  @Column(DataType.STRING)
  profilePicture?: string;

  // Roles & Permissions
  @Column(DataType.ARRAY(DataType.STRING))
  roles?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  permissions?: string[];

  // Access Control
  @Default('Pending')
  @Index
  @Column(DataType.STRING)
  status!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified!: boolean;

  @Column(DataType.STRING)
  verificationToken?: string;

  @Column(DataType.DATE)
  verificationExpires?: Date;

  // Session Management
  @Column(DataType.JSONB)
  sessions?: object;

  @Column(DataType.STRING)
  currentSession?: string;

  // Security Settings
  @Column(DataType.ARRAY(DataType.STRING))
  allowedIPs?: string[];

  @Column(DataType.ARRAY(DataType.STRING))
  blockedIPs?: string[];

  @Default(0)
  @Column(DataType.INTEGER)
  loginAttempts!: number;

  @Column(DataType.DATE)
  lastLoginAttempt?: Date;

  @Column(DataType.DATE)
  lockedUntil?: Date;

  // Login History
  @Index
  @Column(DataType.DATE)
  lastLogin?: Date;

  @Column(DataType.STRING)
  lastLoginIP?: string;

  @Column(DataType.STRING)
  lastLoginUserAgent?: string;

  @Column(DataType.JSONB)
  loginHistory?: object;

  // Password Reset
  @Column(DataType.STRING)
  resetPasswordToken?: string;

  @Column(DataType.DATE)
  resetPasswordExpires?: Date;

  // Preferences
  @Column(DataType.JSONB)
  preferences?: object;

  // Metadata
  @Column(DataType.STRING)
  createdBy?: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Hook to hash password before save
  @BeforeCreate
  @BeforeUpdate
  static async hashPasswordHook(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
      
      // Set password expiry (90 days)
      instance.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
  }

  // Instance methods
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  async recordLoginAttempt(
    success: boolean,
    ipAddress: string,
    userAgent: string,
    failureReason: string | null = null
  ): Promise<User> {
    const loginHistory = (this.loginHistory as any[]) || [];
    loginHistory.push({
      timestamp: new Date(),
      ipAddress,
      userAgent,
      success,
      failureReason
    });
    this.loginHistory = loginHistory;

    if (success) {
      this.loginAttempts = 0;
      this.lastLogin = new Date();
      this.lastLoginIP = ipAddress;
      this.lastLoginUserAgent = userAgent;
    } else {
      this.loginAttempts += 1;
      this.lastLoginAttempt = new Date();

      // Lock account after 5 failed attempts
      if (this.loginAttempts >= 5) {
        this.status = 'Locked';
        this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
    }

    return await this.save();
  }

  createSession(ipAddress: string, userAgent: string): string {
    const sessionId = `SES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const sessions = (this.sessions as any[]) || [];
    sessions.push({
      sessionId,
      ipAddress,
      userAgent,
      loginAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isActive: true
    });
    
    this.sessions = sessions;
    this.currentSession = sessionId;
    return sessionId;
  }

  async endSession(sessionId: string): Promise<User> {
    const sessions = (this.sessions as any[]) || [];
    const session = sessions.find((s: any) => s.sessionId === sessionId);
    if (session) {
      session.isActive = false;
    }
    this.sessions = sessions;
    return await this.save();
  }

  hasPermission(permission: string): boolean {
    return (this.permissions || []).includes(permission) || (this.roles || []).includes('Admin');
  }

  hasRole(role: string): boolean {
    return (this.roles || []).includes(role);
  }

  // Virtual for display name
  get displayName(): string {
    if (this.fullName) return this.fullName;
    if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`.trim();
    return this.username;
  }

  // Static methods
  static async findByUsername(username: string): Promise<User | null> {
    return await User.findOne({ where: { username: username.toLowerCase() } });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email: email.toLowerCase() } });
  }

  static async findActive(): Promise<User[]> {
    return await User.findAll({ where: { status: 'Active' } });
  }
}

export default User;
