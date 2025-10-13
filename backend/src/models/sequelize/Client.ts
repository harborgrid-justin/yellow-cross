/**
 * Client Model - Sequelize Model for Client Relationship Management
 * Comprehensive data model for client management in law firms
 */

import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  Default,
  Unique,
  AllowNull,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BeforeSave
} from 'sequelize-typescript';

@Table({
  tableName: 'clients',
  timestamps: true
})
export class Client extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  clientNumber!: string;

  // Basic Information
  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName!: string;

  @Column(DataType.STRING)
  middleName?: string;

  @Column(DataType.STRING)
  displayName?: string;

  @AllowNull(false)
  @Default('Individual')
  @Column(DataType.ENUM('Individual', 'Business', 'Non-Profit', 'Government', 'Other'))
  type!: string;

  @Column(DataType.STRING)
  companyName?: string;

  // Contact Information
  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.STRING)
  mobile?: string;

  @Column(DataType.STRING)
  fax?: string;

  // Address
  @Column(DataType.JSONB)
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  // Client Status
  @AllowNull(false)
  @Default('Prospect')
  @Index
  @Column(DataType.ENUM('Active', 'Inactive', 'Prospect', 'Former', 'Blacklisted'))
  status!: string;

  @Column(DataType.JSONB)
  statusHistory?: object;

  // Client Classification
  @Column(DataType.STRING)
  category?: string;

  @Column(DataType.STRING)
  industry?: string;

  @Column(DataType.STRING)
  segment?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  // Relationship Management
  @Column(DataType.STRING)
  relationshipManager?: string;

  @Column(DataType.STRING)
  assignedAttorney?: string;

  @Column(DataType.DATE)
  clientSince?: Date;

  @Default(0)
  @Column(DataType.FLOAT)
  lifetimeValue!: number;

  // Billing & Financial
  @Default('Hourly')
  @Column(DataType.ENUM('Hourly', 'Flat Fee', 'Contingency', 'Retainer', 'Mixed'))
  billingMethod!: string;

  @Column(DataType.FLOAT)
  hourlyRate?: number;

  @Column(DataType.STRING)
  paymentTerms?: string;

  @Column(DataType.STRING)
  creditStatus?: string;

  @Default(0)
  @Column(DataType.FLOAT)
  creditLimit!: number;

  // Preferences & Settings
  @Column(DataType.STRING)
  preferredCommunication?: string;

  @Column(DataType.STRING)
  language?: string;

  @Column(DataType.STRING)
  timezone?: string;

  @Column(DataType.JSONB)
  preferences?: object;

  // Risk & Compliance
  @Default('Low')
  @Column(DataType.ENUM('Low', 'Medium', 'High', 'Critical'))
  riskLevel!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  conflictCheckRequired!: boolean;

  @Column(DataType.DATE)
  lastConflictCheck?: Date;

  @Column(DataType.JSONB)
  conflictCheckHistory?: object;

  // Notes & Documentation
  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.TEXT)
  internalNotes?: string;

  // Metadata
  @AllowNull(false)
  @Column(DataType.STRING)
  createdBy!: string;

  @Column(DataType.STRING)
  lastModifiedBy?: string;

  @Column(DataType.JSONB)
  customFields?: object;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  // Hook to update status history
  @BeforeSave
  static async updateStatusHistory(instance: Client) {
    if (instance.changed('status') && !instance.isNewRecord) {
      const statusHistory = (instance.statusHistory as any[]) || [];
      statusHistory.push({
        status: instance.status,
        changedAt: new Date(),
        changedBy: instance.lastModifiedBy
      });
      instance.statusHistory = statusHistory;
    }
  }

  // Virtual for full name
  get fullName(): string {
    if (this.displayName) return this.displayName;
    if (this.type === 'Business' && this.companyName) return this.companyName;
    return `${this.firstName} ${this.lastName}`.trim();
  }

  // Instance methods
  updateStatus(newStatus: string, changedBy: string, reason?: string): void {
    const statusHistory = (this.statusHistory as any[]) || [];
    statusHistory.push({
      fromStatus: this.status,
      toStatus: newStatus,
      changedBy,
      changedAt: new Date(),
      reason
    });
    this.statusHistory = statusHistory;
    this.status = newStatus;
    this.lastModifiedBy = changedBy;
  }

  recordConflictCheck(performedBy: string, result: string, notes?: string): void {
    const conflictCheckHistory = (this.conflictCheckHistory as any[]) || [];
    conflictCheckHistory.push({
      performedBy,
      performedAt: new Date(),
      result,
      notes
    });
    this.conflictCheckHistory = conflictCheckHistory;
    this.lastConflictCheck = new Date();
  }

  // Static methods
  static async findByStatus(status: string): Promise<Client[]> {
    return await Client.findAll({
      where: { status },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });
  }

  static async findByManager(relationshipManager: string): Promise<Client[]> {
    return await Client.findAll({
      where: { relationshipManager, status: 'Active' },
      order: [['lastName', 'ASC']]
    });
  }

  static async search(query: string): Promise<Client[]> {
    // Note: This would benefit from full-text search in production
    return await Client.findAll({
      where: {
        $or: [
          { firstName: { $iLike: `%${query}%` } },
          { lastName: { $iLike: `%${query}%` } },
          { companyName: { $iLike: `%${query}%` } },
          { email: { $iLike: `%${query}%` } }
        ] as any
      },
      order: [['lastName', 'ASC']]
    });
  }
}

export default Client;
